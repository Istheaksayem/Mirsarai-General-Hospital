import { StatusCodes } from 'http-status-codes';
import AppointmentPage from '../models/appointmentPage.model.js';
import ApiError from '../utils/ApiError.js';

export const getPublicAppointmentPage = async () => {
  const page = await AppointmentPage.findOne().lean();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment page content not found');
  }
  return page;
};

export const getAdminAppointmentPage = async () => {
  const page = await AppointmentPage.findOne();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment page content not found');
  }
  return page;
};

export const updateAppointmentPage = async (data, userId) => {
  let page = await AppointmentPage.findOne();
  if (!page) {
    page = new AppointmentPage();
    page.createdBy = userId;
  }
  page.set(data);
  page.updatedBy = userId;
  await page.save();
  return page;
};
