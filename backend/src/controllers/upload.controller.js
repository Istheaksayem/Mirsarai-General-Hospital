import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const uploadProfilePhoto = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded');
  }
  const filePath = `/uploads/${req.file.filename}`;
  sendSuccess(res, StatusCodes.OK, { url: filePath }, 'Photo uploaded successfully');
});
