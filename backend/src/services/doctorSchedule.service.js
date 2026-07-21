import { StatusCodes } from 'http-status-codes';
import DoctorSchedule from '../models/doctorSchedule.model.js';
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function timeToMinutes(time) {
  const [_, hours, minutes, modifier] = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i) || [];
  if (!_) throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid time format: ${time}`);
  let h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);
  if (modifier.toUpperCase() === 'PM' && h !== 12) h += 12;
  if (modifier.toUpperCase() === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function isTimeInRange(time, start, end) {
  const t = timeToMinutes(time);
  return t >= timeToMinutes(start) && t < timeToMinutes(end);
}

function isOverlapping(aStart, aEnd, bStart, bEnd) {
  return timeToMinutes(aStart) < timeToMinutes(bEnd) && timeToMinutes(bStart) < timeToMinutes(aEnd);
}

function parseTimeToDate(timeStr, baseDate) {
  const t = timeToMinutes(timeStr);
  const d = new Date(baseDate);
  d.setHours(Math.floor(t / 60), t % 60, 0, 0);
  return d;
}

export const getSchedule = async (doctorId) => {
  let schedule = await DoctorSchedule.findOne({ doctorId }).lean();
  if (!schedule) {
    schedule = { doctorId, weeklySlots: [], exceptions: [], defaultSlotDuration: 15 };
  }
  return schedule;
};

export const upsertSchedule = async (doctorId, data) => {
  if (data.weeklySlots) {
    validateWeeklySlots(data.weeklySlots);
  }

  const schedule = await DoctorSchedule.findOneAndUpdate(
    { doctorId },
    { $set: { ...data, doctorId } },
    { upsert: true, new: true, runValidators: true }
  ).lean();

  await syncDoctorModel(doctorId, schedule.weeklySlots);

  return schedule;
};

export const addWeeklySlot = async (doctorId, slotData) => {
  validateSlot(slotData);

  const schedule = await DoctorSchedule.findOne({ doctorId });
  if (!schedule) {
    const newSchedule = await DoctorSchedule.create({
      doctorId,
      weeklySlots: [slotData],
      exceptions: [],
    });
    await syncDoctorModel(doctorId, newSchedule.weeklySlots);
    return newSchedule.weeklySlots[newSchedule.weeklySlots.length - 1];
  }

  const existing = schedule.weeklySlots.find(
    (s) => s.dayOfWeek === slotData.dayOfWeek && isOverlapping(s.startTime, s.endTime, slotData.startTime, slotData.endTime)
  );
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, `Overlaps with existing slot: ${existing.startTime} - ${existing.endTime}`);
  }

  schedule.weeklySlots.push(slotData);
  await schedule.save();
  await syncDoctorModel(doctorId, schedule.weeklySlots);

  return schedule.weeklySlots[schedule.weeklySlots.length - 1];
};

export const updateWeeklySlot = async (doctorId, slotId, slotData) => {
  validateSlot(slotData);

  const schedule = await DoctorSchedule.findOne({ doctorId });
  if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found');

  const idx = schedule.weeklySlots.findIndex((s) => s._id.toString() === slotId);
  if (idx === -1) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found');

  const others = schedule.weeklySlots.filter((_, i) => i !== idx);
  const conflict = others.find(
    (s) => s.dayOfWeek === slotData.dayOfWeek && isOverlapping(s.startTime, s.endTime, slotData.startTime, slotData.endTime)
  );
  if (conflict) {
    throw new ApiError(StatusCodes.CONFLICT, `Overlaps with existing slot: ${conflict.startTime} - ${conflict.endTime}`);
  }

  Object.assign(schedule.weeklySlots[idx], slotData);
  await schedule.save();
  await syncDoctorModel(doctorId, schedule.weeklySlots);

  return schedule.weeklySlots[idx];
};

export const deleteWeeklySlot = async (doctorId, slotId) => {
  const schedule = await DoctorSchedule.findOne({ doctorId });
  if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found');

  const idx = schedule.weeklySlots.findIndex((s) => s._id.toString() === slotId);
  if (idx === -1) throw new ApiError(StatusCodes.NOT_FOUND, 'Slot not found');

  schedule.weeklySlots.splice(idx, 1);
  await schedule.save();
  await syncDoctorModel(doctorId, schedule.weeklySlots);

  return { message: 'Slot removed' };
};

export const addException = async (doctorId, exceptionData) => {
  if (!exceptionData.date) throw new ApiError(StatusCodes.BAD_REQUEST, 'Date is required');

  const schedule = await DoctorSchedule.findOne({ doctorId });
  if (!schedule) {
    const newSchedule = await DoctorSchedule.create({
      doctorId,
      weeklySlots: [],
      exceptions: [exceptionData],
    });
    return newSchedule.exceptions[newSchedule.exceptions.length - 1];
  }

  schedule.exceptions.push(exceptionData);
  await schedule.save();
  return schedule.exceptions[schedule.exceptions.length - 1];
};

export const deleteException = async (doctorId, exceptionId) => {
  const schedule = await DoctorSchedule.findOne({ doctorId });
  if (!schedule) throw new ApiError(StatusCodes.NOT_FOUND, 'Schedule not found');

  const idx = schedule.exceptions.findIndex((e) => e._id.toString() === exceptionId);
  if (idx === -1) throw new ApiError(StatusCodes.NOT_FOUND, 'Exception not found');

  schedule.exceptions.splice(idx, 1);
  await schedule.save();

  return { message: 'Exception removed' };
};

export const getAvailableSlots = async (doctorId, dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid date');

  const dayOfWeek = date.getDay();
  const schedule = await DoctorSchedule.findOne({ doctorId }).lean();
  if (!schedule) return { date: dateStr, slots: [] };

  const matchingSlots = schedule.weeklySlots.filter((s) => s.dayOfWeek === dayOfWeek && s.isActive);
  if (matchingSlots.length === 0) return { date: dateStr, slots: [] };

  const dayExceptions = schedule.exceptions.filter((e) => {
    const eDate = new Date(e.date);
    return eDate.toDateString() === date.toDateString();
  });

  const fullDayException = dayExceptions.find((e) => e.isFullDay);
  if (fullDayException) return { date: dateStr, slots: [] };

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const user = await User.findById(doctorId).select('doctorRef').lean();
  const doctorRef = user?.doctorRef || doctorId;

  const bookedAppointments = await Appointment.find({
    doctor: doctorRef,
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $nin: ['cancelled', 'rejected', 'no-show'] },
  }).select('time').lean();

  const bookedTimes = new Set(bookedAppointments.map((a) => a.time));

  const allSlots = [];

  for (const slot of matchingSlots) {
    const startMin = timeToMinutes(slot.startTime);
    const endMin = timeToMinutes(slot.endTime);
    const breakStartMin = slot.breakStart ? timeToMinutes(slot.breakStart) : null;
    const breakEndMin = slot.breakEnd ? timeToMinutes(slot.breakEnd) : null;
    const duration = slot.slotDuration || 15;

    for (let m = startMin; m + duration <= endMin; m += duration) {
      const slotTime = minutesToTime(m);

      if (breakStartMin !== null && breakEndMin !== null && m >= breakStartMin && m < breakEndMin) {
        continue;
      }

      const partialBlocked = dayExceptions.some((exc) =>
        !exc.isFullDay &&
        exc.slots?.some((block) => isTimeInRange(slotTime, block.startTime, block.endTime))
      );
      if (partialBlocked) continue;

      allSlots.push({
        time: slotTime,
        available: !bookedTimes.has(slotTime),
      });
    }
  }

  return { date: dateStr, slots: allSlots };
};

export const validateBookingSlot = async (doctorId, date, time) => {
  const available = await getAvailableSlots(doctorId, date);
  const match = available.slots.find((s) => s.time === time);
  if (!match) throw new ApiError(StatusCodes.BAD_REQUEST, 'Selected time slot is not within the doctor\'s schedule');
  if (!match.available) throw new ApiError(StatusCodes.CONFLICT, 'This time slot is already booked');
};

async function syncDoctorModel(doctorId, weeklySlots) {
  try {
    const user = await User.findById(doctorId).select('doctorRef').lean();
    if (!user?.doctorRef) return;
    const doctor = await Doctor.findById(user.doctorRef);
    if (!doctor) return;

    const activeSlots = weeklySlots.filter((s) => s.isActive);
    doctor.timeSlots = activeSlots.map((s) => ({
      day: DAY_NAMES[s.dayOfWeek],
      startTime: s.startTime,
      endTime: s.endTime,
      type: s.type,
    }));
    doctor.availableDays = [...new Set(activeSlots.map((s) => DAY_NAMES[s.dayOfWeek]))];
    await doctor.save();
  } catch (err) {
    console.log('Doctor model sync failed:', err.message);
  }
}

function validateWeeklySlots(slots) {
  for (const slot of slots) {
    validateSlot(slot);
  }
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (
        slots[i].dayOfWeek === slots[j].dayOfWeek &&
        isOverlapping(slots[i].startTime, slots[i].endTime, slots[j].startTime, slots[j].endTime)
      ) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          `Slot ${i + 1} overlaps with slot ${j + 1}`
        );
      }
    }
  }
}

function validateSlot(slot) {
  if (slot.dayOfWeek === undefined || slot.dayOfWeek === null) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'dayOfWeek is required');
  }
  if (!slot.startTime || !slot.endTime) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'startTime and endTime are required');
  }
  if (timeToMinutes(slot.startTime) >= timeToMinutes(slot.endTime)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'startTime must be before endTime');
  }
  if (slot.breakStart && slot.breakEnd) {
    if (timeToMinutes(slot.breakStart) >= timeToMinutes(slot.breakEnd)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'breakStart must be before breakEnd');
    }
    if (
      timeToMinutes(slot.breakStart) < timeToMinutes(slot.startTime) ||
      timeToMinutes(slot.breakEnd) > timeToMinutes(slot.endTime)
    ) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Break must be within working hours');
    }
  }
}
