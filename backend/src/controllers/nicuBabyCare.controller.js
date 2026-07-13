import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as nicuBabyCareService from '../services/nicuBabyCare.service.js';

const resolveLang = (req) => {
  if (req.query.lang === 'bn') return 'bn';
  const accept = req.headers['accept-language'] || '';
  if (accept.includes('bn')) return 'bn';
  return 'en';
};

export const getPublicNicuBabyCare = catchAsync(async (req, res) => {
  const lang = resolveLang(req);
  const data = await nicuBabyCareService.getPublicNicuBabyCare(lang);
  sendSuccess(res, StatusCodes.OK, data, 'NICU & Baby Care page fetched successfully');
});

export const getAdminNicuBabyCare = catchAsync(async (req, res) => {
  const data = await nicuBabyCareService.getAdminNicuBabyCare();
  sendSuccess(res, StatusCodes.OK, data, 'NICU & Baby Care page fetched successfully');
});

export const updateNicuBabyCare = catchAsync(async (req, res) => {
  const data = await nicuBabyCareService.updateNicuBabyCare(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, data, 'NICU & Baby Care page updated successfully');
});
