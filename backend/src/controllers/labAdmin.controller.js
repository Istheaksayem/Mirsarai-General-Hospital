import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import * as LabAdminProfileService from '../services/labAdminProfile.service.js';

export const getMyProfile = catchAsync(async (req, res) => {
  const profile = await LabAdminProfileService.getMyProfile(req.user.id);
  sendSuccess(res, StatusCodes.OK, profile, 'Profile fetched successfully');
});

export const createOrUpdateMyProfile = catchAsync(async (req, res) => {
  const profile = await LabAdminProfileService.createOrUpdateMyProfile(req.user.id, req.body);
  sendSuccess(res, StatusCodes.OK, profile, 'Profile saved successfully');
});
