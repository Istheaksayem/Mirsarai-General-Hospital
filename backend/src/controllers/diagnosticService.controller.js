import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as diagnosticService from '../services/diagnosticService.service.js';

const resolveLang = (req) => {
  if (req.query.lang === 'bn') return 'bn';
  const accept = req.headers['accept-language'] || '';
  if (accept.includes('bn')) return 'bn';
  return 'en';
};

export const getPublicDiagnosticService = catchAsync(async (req, res) => {
  const lang = resolveLang(req);
  const data = await diagnosticService.getPublicDiagnosticService(lang);
  sendSuccess(res, StatusCodes.OK, data, 'Diagnostic service page fetched successfully');
});

export const getAdminDiagnosticService = catchAsync(async (req, res) => {
  const data = await diagnosticService.getAdminDiagnosticService();
  sendSuccess(res, StatusCodes.OK, data, 'Diagnostic service page fetched successfully');
});

export const updateDiagnosticService = catchAsync(async (req, res) => {
  const data = await diagnosticService.updateDiagnosticService(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, data, 'Diagnostic service page updated successfully');
});
