import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as emergencyInfoService from '../services/emergencyInfo.service.js';

export const getPublicEmergencyInfo = catchAsync(async (req, res) => {
  const data = await emergencyInfoService.getPublicEmergencyInfo();
  sendSuccess(res, StatusCodes.OK, data, 'Emergency Information fetched successfully');
});

export const getAdminEmergencyInfo = catchAsync(async (req, res) => {
  const data = await emergencyInfoService.getAdminEmergencyInfo();
  sendSuccess(res, StatusCodes.OK, data, 'Emergency Information fetched successfully');
});

export const updateEmergencyInfo = catchAsync(async (req, res) => {
  const data = await emergencyInfoService.updateEmergencyInfo(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, data, 'Emergency Information updated successfully');
});
