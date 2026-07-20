import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../../utils/ApiResponse.js';
import * as NotificationService from '../../services/notification.service.js';

export const getMyNotifications = catchAsync(async (req, res) => {
  const { page, limit, unreadOnly } = req.query;
  const result = await NotificationService.getStaffNotifications(req.user.id, {
    page: page || 1,
    limit: limit || 20,
    unreadOnly: unreadOnly === 'true',
  });
  sendPaginated(res, result.data, result.total, result.page, result.limit, 'Notifications fetched successfully');
});

export const getUnreadCount = catchAsync(async (req, res) => {
  const count = await NotificationService.getUnreadCount('user', req.user.id);
  sendSuccess(res, StatusCodes.OK, { count }, 'Unread count fetched');
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await NotificationService.markAsRead(req.params.id, 'user', req.user.id);
  if (!notification) {
    return sendSuccess(res, StatusCodes.NOT_FOUND, null, 'Notification not found');
  }
  sendSuccess(res, StatusCodes.OK, notification, 'Notification marked as read');
});

export const markAllAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markAllAsRead('user', req.user.id);
  sendSuccess(res, StatusCodes.OK, result, 'All notifications marked as read');
});

export const deleteNotification = catchAsync(async (req, res) => {
  const deleted = await NotificationService.deleteNotification(req.params.id, 'user', req.user.id);
  if (!deleted) {
    return sendSuccess(res, StatusCodes.NOT_FOUND, null, 'Notification not found');
  }
  sendSuccess(res, StatusCodes.OK, null, 'Notification deleted');
});

export const createAnnouncement = catchAsync(async (req, res) => {
  const { title, message, priority } = req.body;
  const result = await NotificationService.createAnnouncement({
    title,
    message,
    priority: priority || 'medium',
    createdBy: req.user.id,
  });
  sendSuccess(res, StatusCodes.CREATED, result, 'Announcement sent to all patients');
});
