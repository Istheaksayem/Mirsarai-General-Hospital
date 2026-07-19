import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../utils/ApiResponse.js';
import * as ReportService from '../services/report.service.js';

export const listReports = catchAsync(async (req, res) => {
  const result = await ReportService.getReports(req.query, req.user.role, req.user.id);
  sendPaginated(res, result.reports, result.total, result.page, result.limit, 'Reports fetched successfully');
});

export const getReport = catchAsync(async (req, res) => {
  const report = await ReportService.getReportById(req.params.id, req.user.role, req.user.id);
  sendSuccess(res, StatusCodes.OK, report, 'Report fetched successfully');
});

export const createReport = catchAsync(async (req, res) => {
  const report = await ReportService.createReport(req.body, req.file, req.user);
  sendSuccess(res, StatusCodes.CREATED, report, 'Report uploaded successfully');
});

export const updateStatus = catchAsync(async (req, res) => {
  const report = await ReportService.updateReportStatus(req.params.id, req.body.status, req.user);
  sendSuccess(res, StatusCodes.OK, report, 'Report status updated');
});

export const removeReport = catchAsync(async (req, res) => {
  const result = await ReportService.deleteReport(req.params.id, req.user?.id);
  sendSuccess(res, StatusCodes.OK, null, result.message);
});

export const reportStats = catchAsync(async (req, res) => {
  const stats = await ReportService.getReportStats(req.user.role, req.user.id);
  sendSuccess(res, StatusCodes.OK, stats, 'Stats fetched successfully');
});
