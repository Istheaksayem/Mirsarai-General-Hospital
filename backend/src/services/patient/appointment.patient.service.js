import { StatusCodes } from 'http-status-codes';
import Appointment from '../../models/appointment.model.js';
import Patient from '../../models/patient.model.js';
import User from '../../models/user.model.js';
import ApiError from '../../utils/ApiError.js';
import generateAppointmentId from '../../utils/generateAppointmentId.js';
import { APPOINTMENT_SOURCE } from '../../constants/index.js';
import { createNotification } from '../notification.service.js';
import { notifyNewAppointment } from '../appointment-notification.service.js';
import { validateBookingSlot } from '../doctorSchedule.service.js';

export const getMyAppointments = async (patientId) => {
  const patient = await Patient.findById(patientId).lean();
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');

  const appointments = await Appointment.find({ patientId })
    .populate('doctor', 'name designation image department')
    .sort({ date: -1 })
    .lean();

  return appointments;
};

export const createMyAppointment = async (patientId, data) => {
  const patient = await Patient.findById(patientId).lean();
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');

  if (data.date && data.time && data.doctor) {
    try {
      const userDoc = await User.findOne({ doctorRef: data.doctor }).select('_id').lean();
      if (userDoc) {
        const dateStr = typeof data.date === 'string' ? data.date : new Date(data.date).toISOString().split('T')[0];
        await validateBookingSlot(userDoc._id, dateStr, data.time);
      }
    } catch (err) {
      if (err.statusCode) throw err;
      console.log('Slot validation skipped:', err.message);
    }
  }

  const appointmentId = await generateAppointmentId();

  const appointment = await Appointment.create({
    appointmentId,
    patientId,
    patientName: patient.fullName,
    patientPhone: patient.mobile,
    patientEmail: patient.email,
    patientAge: patient.age,
    patientGender: patient.gender,
    appointmentSource: APPOINTMENT_SOURCE.PATIENT_PORTAL,
    ...data,
    createdBy: 'patient-portal',
  });

  await createNotification({
    patientId,
    type: 'appointment_reminder',
    title: 'Appointment Request Submitted',
    message: `Your appointment request has been submitted and is pending confirmation.`,
  });

  const populated = await Appointment.findById(appointment._id)
    .populate('doctor', 'name designation image department')
    .lean();

  try {
    await notifyNewAppointment(populated);
  } catch (err) {
    console.log('Staff notification failed:', err.message);
  }

  return {
    appointment: populated,
    patient: {
      _id: patient._id,
      patientId: patient.patientId,
      fullName: patient.fullName,
      mobile: patient.mobile,
      email: patient.email,
    },
  };
};
