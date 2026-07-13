import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as faqService from '../services/faq.service.js';

export const getPublicFAQ = catchAsync(async (req, res) => {
  const data = await faqService.getPublicFAQ();
  sendSuccess(res, StatusCodes.OK, data, 'FAQ content fetched successfully');
});

export const getAdminFAQ = catchAsync(async (req, res) => {
  const data = await faqService.getAdminFAQ();
  sendSuccess(res, StatusCodes.OK, data, 'FAQ content fetched successfully');
});

export const updateFAQ = catchAsync(async (req, res) => {
  const data = await faqService.updateFAQ(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, data, 'FAQ content updated successfully');
});
