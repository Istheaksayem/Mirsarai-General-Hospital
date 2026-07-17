import { StatusCodes } from 'http-status-codes';
import Appointment from '../../models/appointment.model.js';
import Patient from '../../models/patient.model.js';
import ApiError from '../../utils/ApiError.js';
import { createNotification } from '../notification.service.js';

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

  const appointment = await Appointment.create({
    patientId,
    patientName: patient.fullName,
    patientPhone: patient.mobile,
    patientEmail: patient.email,
    patientAge: patient.age,
    patientGender: patient.gender,
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

  return populated;
};
