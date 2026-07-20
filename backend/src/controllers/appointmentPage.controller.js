import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as appointmentPageService from '../services/appointmentPage.service.js';

export const getPublicAppointmentPage = catchAsync(async (req, res) => {
  const page = await appointmentPageService.getPublicAppointmentPage();
  sendSuccess(res, StatusCodes.OK, page, 'Appointment page content fetched successfully');
});

export const getAdminAppointmentPage = catchAsync(async (req, res) => {
  const page = await appointmentPageService.getAdminAppointmentPage();
  sendSuccess(res, StatusCodes.OK, page, 'Appointment page content fetched successfully');
});

export const updateAppointmentPage = catchAsync(async (req, res) => {
  const page = await appointmentPageService.updateAppointmentPage(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, page, 'Appointment page content updated successfully');
});
