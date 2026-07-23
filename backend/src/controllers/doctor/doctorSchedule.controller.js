import { StatusCodes } from 'http-status-codes';
import User from '../../models/user.model.js';
import Doctor from '../../models/doctor.model.js';
import DoctorProfile from '../../models/doctorProfile.model.js';
import DoctorSchedule from '../../models/doctorSchedule.model.js';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as ScheduleService from '../../services/doctorSchedule.service.js';

export const getSchedule = catchAsync(async (req, res) => {
  const data = await ScheduleService.getSchedule(req.user.id);
  sendSuccess(res, StatusCodes.OK, data);
});

export const upsertSchedule = catchAsync(async (req, res) => {
  const data = await ScheduleService.upsertSchedule(req.user.id, req.body);
  sendSuccess(res, StatusCodes.OK, data, 'Schedule updated');
});

export const addWeeklySlot = catchAsync(async (req, res) => {
  const data = await ScheduleService.addWeeklySlot(req.user.id, req.body);
  sendSuccess(res, StatusCodes.CREATED, data, 'Slot added');
});

export const updateWeeklySlot = catchAsync(async (req, res) => {
  const data = await ScheduleService.updateWeeklySlot(req.user.id, req.params.slotId, req.body);
  sendSuccess(res, StatusCodes.OK, data, 'Slot updated');
});

export const deleteWeeklySlot = catchAsync(async (req, res) => {
  const data = await ScheduleService.deleteWeeklySlot(req.user.id, req.params.slotId);
  sendSuccess(res, StatusCodes.OK, data, 'Slot removed');
});

export const addException = catchAsync(async (req, res) => {
  const data = await ScheduleService.addException(req.user.id, req.body);
  sendSuccess(res, StatusCodes.CREATED, data, 'Exception added');
});

export const deleteException = catchAsync(async (req, res) => {
  const data = await ScheduleService.deleteException(req.user.id, req.params.exceptionId);
  sendSuccess(res, StatusCodes.OK, data, 'Exception removed');
});

export const getAvailableSlots = catchAsync(async (req, res) => {
  const data = await ScheduleService.getAvailableSlots(req.user.id, req.query.date);
  sendSuccess(res, StatusCodes.OK, data);
});

export const getPublicAvailableSlots = catchAsync(async (req, res) => {
  const doctorId = req.query.doctorId;
  const user = await User.findOne({ doctorRef: doctorId }).select('_id').lean();
  let userId = user?._id;
  if (!userId) {
    const doctor = await Doctor.findById(doctorId).select('slug').lean();
    if (doctor?.slug) {
      const profile = await DoctorProfile.findOne({ slug: doctor.slug }).select('userId').lean();
      userId = profile?.userId;
    }
  }
  if (!userId) {
    const schedule = await DoctorSchedule.findOne({ doctorId }).select('_id').lean();
    if (schedule) {
      const data = await ScheduleService.getAvailableSlots(doctorId, req.query.date);
      return sendSuccess(res, StatusCodes.OK, data);
    }
    return sendSuccess(res, StatusCodes.OK, { date: req.query.date, slots: [] });
  }
  const data = await ScheduleService.getAvailableSlots(userId, req.query.date);
  sendSuccess(res, StatusCodes.OK, data);
});
