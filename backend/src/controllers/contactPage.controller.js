import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as contactPageService from '../services/contactPage.service.js';

export const getPublicContactPage = catchAsync(async (req, res) => {
  const page = await contactPageService.getPublicContactPage();
  sendSuccess(res, StatusCodes.OK, page, 'Contact page content fetched successfully');
});

export const getAdminContactPage = catchAsync(async (req, res) => {
  const page = await contactPageService.getAdminContactPage();
  sendSuccess(res, StatusCodes.OK, page, 'Contact page content fetched successfully');
});

export const updateContactPage = catchAsync(async (req, res) => {
  const page = await contactPageService.updateContactPage(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, page, 'Contact page content updated successfully');
});
