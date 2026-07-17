import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as AppointmentPatientService from '../../services/patient/appointment.patient.service.js';

export const getMyAppointments = catchAsync(async (req, res) => {
  const appointments = await AppointmentPatientService.getMyAppointments(req.patient.id);
  sendSuccess(res, StatusCodes.OK, appointments, 'Appointments fetched successfully');
});

export const createMyAppointment = catchAsync(async (req, res) => {
  const appointment = await AppointmentPatientService.createMyAppointment(req.patient.id, req.body);
  sendSuccess(res, StatusCodes.CREATED, appointment, 'Appointment booked successfully');
});
