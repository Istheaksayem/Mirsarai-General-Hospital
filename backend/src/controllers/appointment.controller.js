import { StatusCodes } from 'http-status-codes';
import { sendSuccess, sendPaginated } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as appointmentService from '../services/appointment.service.js';
import { APPOINTMENT_SOURCE } from '../constants/index.js';

/**
 * POST /api/v1/appointments
 * Public: book an appointment (frontend/public users)
 * Backend handles patient lookup/create, generates all IDs.
 */
export const bookAppointment = catchAsync(async (req, res) => {
  const result = await appointmentService.createAppointment(req.body, APPOINTMENT_SOURCE.ONLINE);
  sendSuccess(res, StatusCodes.CREATED, result, 'Appointment booked successfully');
});

/**
 * GET /api/v1/admin/appointments
 * Admin/Reception: list all appointments with filters
 */
export const getAdminAppointments = catchAsync(async (req, res) => {
  const result = await appointmentService.getAppointments(req.query);
  sendPaginated(
    res,
    result.data,
    result.total,
    result.page,
    result.limit,
    'Appointments fetched successfully'
  );
});

/**
 * GET /api/v1/admin/appointments/:id
 * Admin: get single appointment by MongoDB _id
 */
export const getAdminAppointmentById = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id);
  sendSuccess(res, StatusCodes.OK, appointment, 'Appointment fetched successfully');
});

/**
 * POST /api/v1/admin/appointments
 * Admin: create appointment (source = super-admin)
 */
export const createAdminAppointment = catchAsync(async (req, res) => {
  const result = await appointmentService.createAppointment(req.body, APPOINTMENT_SOURCE.SUPER_ADMIN);
  sendSuccess(res, StatusCodes.CREATED, result, 'Appointment created successfully');
});

/**
 * PUT /api/v1/admin/appointments/:id
 * Admin: update appointment
 */
export const updateAdminAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
  sendSuccess(res, StatusCodes.OK, appointment, 'Appointment updated successfully');
});

/**
 * DELETE /api/v1/admin/appointments/:id
 * Admin: delete appointment
 */
export const deleteAdminAppointment = catchAsync(async (req, res) => {
  await appointmentService.deleteAppointment(req.params.id);
  sendSuccess(res, StatusCodes.OK, null, 'Appointment deleted successfully');
});

/**
 * PATCH /api/v1/admin/appointments/:id/status
 * Admin: update appointment status
 */
export const updateAdminAppointmentStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const appointment = await appointmentService.updateAppointmentStatus(req.params.id, status);
  sendSuccess(res, StatusCodes.OK, appointment, 'Appointment status updated successfully');
});

/**
 * GET /api/v1/doctors/appointments
 * Doctor: get all appointments for the logged-in doctor
 */
export const getMyAppointments = catchAsync(async (req, res) => {
  const result = await appointmentService.getDoctorAppointments(req.user.doctorRef, req.user.id, req.query);
  sendPaginated(
    res,
    result.data,
    result.total,
    result.page,
    result.limit,
    'Appointments fetched successfully'
  );
});

/**
 * GET /api/v1/doctors/appointments/today
 * Doctor: get today's appointments for the logged-in doctor
 */
export const getMyTodaysAppointments = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getDoctorTodaysAppointments(req.user.doctorRef, req.user.id);
  sendSuccess(res, StatusCodes.OK, appointments, "Today's appointments fetched successfully");
});
