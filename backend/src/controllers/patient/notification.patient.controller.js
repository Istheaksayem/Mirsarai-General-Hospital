import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import * as NotificationService from '../../services/notification.service.js';

export const getMyNotifications = catchAsync(async (req, res) => {
  const notifications = await NotificationService.getPatientNotifications(req.patient.id, req.query);
  sendSuccess(res, StatusCodes.OK, notifications, 'Notifications fetched successfully');
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await NotificationService.markAsRead(req.params.id, req.patient.id);
  sendSuccess(res, StatusCodes.OK, notification, 'Notification marked as read');
});

export const markAllAsRead = catchAsync(async (req, res) => {
  await NotificationService.markAllAsRead(req.patient.id);
  sendSuccess(res, StatusCodes.OK, null, 'All notifications marked as read');
});
