import { StatusCodes } from 'http-status-codes';
import EmergencyInfo from '../models/emergencyInfo.model.js';
import ApiError from '../utils/ApiError.js';

export const getPublicEmergencyInfo = async () => {
  const page = await EmergencyInfo.findOne().lean();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Emergency Information content not found');
  }
  return page;
};

export const getAdminEmergencyInfo = async () => {
  const page = await EmergencyInfo.findOne();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Emergency Information content not found');
  }
  return page;
};

export const updateEmergencyInfo = async (data, userId) => {
  let page = await EmergencyInfo.findOne();
  if (!page) {
    page = new EmergencyInfo(data);
    if (userId) page.createdBy = userId;
  } else {
    page.set(data);
  }
  if (userId) page.updatedBy = userId;
  await page.save();
  return page;
};
