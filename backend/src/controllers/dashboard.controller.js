import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import * as DashboardService from '../services/dashboard.service.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await DashboardService.getDashboardStats();
  sendSuccess(res, StatusCodes.OK, stats, 'Dashboard stats fetched successfully');
});

export const getRecentActivities = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const activities = await DashboardService.getRecentActivities(limit);
  sendSuccess(res, StatusCodes.OK, activities, 'Recent activities fetched successfully');
});
