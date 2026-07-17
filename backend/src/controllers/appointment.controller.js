import { StatusCodes } from 'http-status-codes';
import { sendSuccess, sendPaginated } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as appointmentService from '../services/appointment.service.js';

export const bookAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);
  sendSuccess(res, StatusCodes.CREATED, appointment, 'Appointment booked successfully');
});

export const getAdminAppointments = catchAsync(async (req, res) => {
  const result = await appointmentService.getAppointments(req.query);
  sendPaginated(
    res,
    result.appointments,
    result.total,
    result.page,
    result.limit,
    'Appointments fetched successfully'
  );
});

export const getAdminAppointmentById = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id);
  sendSuccess(res, StatusCodes.OK, appointment, 'Appointment fetched successfully');
});

export const createAdminAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);
  sendSuccess(res, StatusCodes.CREATED, appointment, 'Appointment created successfully');
});

export const updateAdminAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
  sendSuccess(res, StatusCodes.OK, appointment, 'Appointment updated successfully');
});

export const deleteAdminAppointment = catchAsync(async (req, res) => {
  await appointmentService.deleteAppointment(req.params.id);
  sendSuccess(res, StatusCodes.OK, null, 'Appointment deleted successfully');
});

export const updateAdminAppointmentStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status);
  sendSuccess(res, StatusCodes.OK, appointment, 'Appointment status updated successfully');
});
