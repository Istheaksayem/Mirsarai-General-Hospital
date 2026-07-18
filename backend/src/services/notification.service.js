import Notification from '../models/notification.model.js';

export const createNotification = async ({ patientId, type, title, message }) => {
  return Notification.create({ patientId, type, title, message });
};

export const getPatientNotifications = async (patientId, { limit = 50, unreadOnly = false } = {}) => {
  const filter = { patientId };
  if (unreadOnly) filter.isRead = false;
  return Notification.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
};

export const markAsRead = async (notificationId, patientId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, patientId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

export const markAllAsRead = async (patientId) => {
  return Notification.updateMany(
    { patientId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};
