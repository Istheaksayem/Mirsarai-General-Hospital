import { StatusCodes } from 'http-status-codes';
import { LabReport } from '../models/labReport.model.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

export const uploadReport = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Please upload a report file');
  }

  const { patientId, testName, reportType, requestingDoctor } = req.body;

  if (!patientId || !testName || !reportType || !requestingDoctor) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields');
  }

  // Convert buffer to base64 Data URI
  const base64String = req.file.buffer.toString('base64');
  const fileUrl = `data:${req.file.mimetype};base64,${base64String}`;

  const report = await LabReport.create({
    patientId,
    testName,
    reportType,
    requestingDoctor,
    fileUrl,
    uploadedBy: req.user.id,
  });

  return sendSuccess(res, StatusCodes.CREATED, report, 'Report uploaded successfully');
});

export const getRecentReports = catchAsync(async (req, res) => {
  const reports = await LabReport.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('uploadedBy', 'name');

  return sendSuccess(res, StatusCodes.OK, reports, 'Recent reports retrieved successfully');
});
