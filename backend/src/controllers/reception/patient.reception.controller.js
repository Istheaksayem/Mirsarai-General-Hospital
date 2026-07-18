import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../../utils/ApiResponse.js';
import * as ReceptionPatientService from '../../services/reception/patient.reception.service.js';

export const registerPatient = catchAsync(async (req, res) => {
  const patient = await ReceptionPatientService.registerPatient(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.CREATED, patient, 'Patient registered successfully');
});

export const searchPatients = catchAsync(async (req, res) => {
  const patients = await ReceptionPatientService.searchPatients(req.query.q);
  sendSuccess(res, StatusCodes.OK, patients, 'Patients fetched successfully');
});

export const getAppointments = catchAsync(async (req, res) => {
  const result = await ReceptionPatientService.getReceptionAppointments(req.query);
  sendPaginated(res, result.appointments, result.total, result.page, result.limit, 'Appointments fetched successfully');
});

export const updateAppointmentStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const appointment = await ReceptionPatientService.updateAppointmentStatus(req.params.id, status, req.user?.id);
  sendSuccess(res, StatusCodes.OK, appointment, 'Appointment status updated successfully');
});
