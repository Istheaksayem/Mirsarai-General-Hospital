import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import * as PageService from '../services/departmentsPage.service.js';

const getLang = (req) => {
  if (req.query.lang === 'bn') return 'bn';
  const accept = req.headers['accept-language'] || '';
  if (accept.includes('bn')) return 'bn';
  return 'en';
};

// ── Public ────────────────────────────────────────────────────────────────────
export const getPublicPageConfig = catchAsync(async (req, res) => {
  const lang = getLang(req);
  const data = await PageService.getPublicDepartmentsPageConfig(lang);
  sendSuccess(res, StatusCodes.OK, data, 'Departments page config fetched successfully');
});

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAdminPageConfig = catchAsync(async (req, res) => {
  const data = await PageService.getAdminDepartmentsPageConfig();
  sendSuccess(res, StatusCodes.OK, data, 'Departments page config fetched successfully');
});

export const updatePageConfig = catchAsync(async (req, res) => {
  const data = await PageService.updateDepartmentsPageConfig(req.body, req.user?.id || 'mock-admin');
  sendSuccess(res, StatusCodes.OK, data, 'Departments page config updated successfully');
});
