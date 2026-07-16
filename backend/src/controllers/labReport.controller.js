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

// Get all lab reports with optional filtering
export const getAllReports = catchAsync(async (req, res) => {
  const { status, reportType, patientId, search } = req.query;
  
  const filter = {};
  
  if (status) filter.status = status;
  if (reportType) filter.reportType = reportType;
  if (patientId) filter.patientId = patientId;
  if (search) {
    filter.$or = [
      { patientId: { $regex: search, $options: 'i' } },
      { testName: { $regex: search, $options: 'i' } },
      { requestingDoctor: { $regex: search, $options: 'i' } },
    ];
  }

  const reports = await LabReport.find(filter)
    .sort({ createdAt: -1 })
    .populate('uploadedBy', 'name email');

  return sendSuccess(res, StatusCodes.OK, reports, 'Reports retrieved successfully');
});

// Get single report by ID
export const getReportById = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const report = await LabReport.findById(id).populate('uploadedBy', 'name email');
  
  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found');
  }

  return sendSuccess(res, StatusCodes.OK, report, 'Report retrieved successfully');
});

// Update report status
export const updateReportStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'completed'].includes(status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status');
  }

  const report = await LabReport.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate('uploadedBy', 'name email');

  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found');
  }

  return sendSuccess(res, StatusCodes.OK, report, 'Report status updated successfully');
});

// Delete report
export const deleteReport = catchAsync(async (req, res) => {
  const { id } = req.params;

  const report = await LabReport.findByIdAndDelete(id);

  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found');
  }

  return sendSuccess(res, StatusCodes.OK, null, 'Report deleted successfully');
});

// Download report
export const downloadReport = catchAsync(async (req, res) => {
  const { id } = req.params;

  const report = await LabReport.findById(id);

  if (!report) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found');
  }

  // Return the file URL for download
  return sendSuccess(res, StatusCodes.OK, { fileUrl: report.fileUrl, testName: report.testName }, 'Report file retrieved successfully');
});
