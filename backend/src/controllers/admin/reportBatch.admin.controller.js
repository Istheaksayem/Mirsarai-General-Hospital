import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../../utils/ApiResponse.js';
import * as ReportBatchService from '../../services/admin/reportBatch.service.js';

export const list = catchAsync(async (req, res) => {
  const result = await ReportBatchService.getReportBatches(req.query);
  sendPaginated(
    res,
    result.batches,
    result.total,
    result.page,
    result.limit,
    'Report batches fetched successfully'
  );
});

export const getById = catchAsync(async (req, res) => {
  const batch = await ReportBatchService.getReportBatchById(req.params.id);
  sendSuccess(res, StatusCodes.OK, batch, 'Report batch fetched successfully');
});

export const create = catchAsync(async (req, res) => {
  const files = req.files || [];
  const result = await ReportBatchService.createReportBatch(req.body, files, req.user.id);
  sendSuccess(res, StatusCodes.CREATED, result, 'Report batch created successfully');
});

export const update = catchAsync(async (req, res) => {
  const batch = await ReportBatchService.updateReportBatch(req.params.id, req.body, req.user.id);
  sendSuccess(res, StatusCodes.OK, batch, 'Report batch updated successfully');
});

export const remove = catchAsync(async (req, res) => {
  const result = await ReportBatchService.softDeleteReportBatch(req.params.id, req.user.id);
  sendSuccess(res, StatusCodes.OK, null, result.message);
});

export const addFiles = catchAsync(async (req, res) => {
  const files = req.files || [];
  const reportFiles = await ReportBatchService.addFilesToBatch(
    req.params.id,
    files,
    req.body,
    req.user.id
  );
  sendSuccess(res, StatusCodes.CREATED, reportFiles, 'Files added successfully');
});

export const deleteFile = catchAsync(async (req, res) => {
  const result = await ReportBatchService.softDeleteReportFile(req.params.fileId, req.user.id);
  sendSuccess(res, StatusCodes.OK, null, result.message);
});
