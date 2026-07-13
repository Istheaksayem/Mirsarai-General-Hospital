import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../utils/ApiResponse.js';
import catchAsync from '../utils/catchAsync.js';
import * as healthBlogService from '../services/healthBlog.service.js';

export const getPublicHealthBlog = catchAsync(async (req, res) => {
  const data = await healthBlogService.getPublicHealthBlog();
  sendSuccess(res, StatusCodes.OK, data, 'Health Blog content fetched successfully');
});

export const getAdminHealthBlog = catchAsync(async (req, res) => {
  const data = await healthBlogService.getAdminHealthBlog();
  sendSuccess(res, StatusCodes.OK, data, 'Health Blog content fetched successfully');
});

export const updateHealthBlog = catchAsync(async (req, res) => {
  const data = await healthBlogService.updateHealthBlog(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, data, 'Health Blog content updated successfully');
});
