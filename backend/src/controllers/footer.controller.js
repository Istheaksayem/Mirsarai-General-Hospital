import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as footerService from '../services/footer.service.js';

export const getPublicFooter = catchAsync(async (req, res) => {
  const data = await footerService.getPublicFooter();
  sendSuccess(res, StatusCodes.OK, data, 'Footer content fetched successfully');
});

export const getAdminFooter = catchAsync(async (req, res) => {
  const data = await footerService.getAdminFooter();
  sendSuccess(res, StatusCodes.OK, data, 'Footer content fetched successfully');
});

export const updateFooter = catchAsync(async (req, res) => {
  const data = await footerService.updateFooter(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, data, 'Footer content updated successfully');
});
