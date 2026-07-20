import Notification from '../models/notification.model.js';
import Patient from '../models/patient.model.js';
import { getIO } from '../socket/index.js';

function emitNotification(notification) {
  const io = getIO();
  if (!io) return;
  const room = notification.recipientType === 'user'
    ? `user:${notification.userId}`
    : `patient:${notification.patientId}`;
  io.to(room).emit('notification', notification);
}

async function emitUnreadCount(recipientType, recipientId) {
  const io = getIO();
  if (!io) return;
  const filter = { recipientType, isRead: false };
  if (recipientType === 'user') filter.userId = recipientId;
  else filter.patientId = recipientId;
  const count = await Notification.countDocuments(filter);
  const room = recipientType === 'user' ? `user:${recipientId}` : `patient:${recipientId}`;
  io.to(room).emit('unread-count', count);
}

// ── Create (general) ─────────────────────────────────────────────

export const createNotification = async ({ patientId, type, title, message, priority = 'medium', link }) => {
  const notification = await Notification.create({
    recipientType: 'patient', patientId, type, title, message, priority, link,
  });
  const doc = notification.toObject();
  emitNotification(doc);
  emitUnreadCount('patient', patientId);
  return doc;
};

// ── Create for staff ─────────────────────────────────────────────

export const createStaffNotification = async ({ userId, type, title, message, priority = 'medium', link }) => {
  const notification = await Notification.create({
    recipientType: 'user', userId, type, title, message, priority, link,
  });
  const doc = notification.toObject();
  emitNotification(doc);
  emitUnreadCount('user', userId);
  return doc;
};

// ── Create broadcast announcement ────────────────────────────────

export const createAnnouncement = async ({ title, message, priority = 'medium', link, createdBy }) => {
  const allPatients = await Patient.find({}).select('_id').lean();
  const patientIds = allPatients.map(p => p._id);

  const notifications = patientIds.map((patientId) => ({
    recipientType: 'patient',
    patientId,
    type: 'announcement',
    title,
    message,
    priority,
    link,
    isRead: false,
    createdBy,
  }));

  if (notifications.length > 0) {
    const BATCH_SIZE = 1000;
    for (let i = 0; i < notifications.length; i += BATCH_SIZE) {
      await Notification.insertMany(notifications.slice(i, i + BATCH_SIZE));
    }
  }

  const io = getIO();
  if (io) {
    patientIds.forEach((pid) => {
      io.to(`patient:${pid}`).emit('notification', { recipientType: 'patient', patientId: pid, type: 'announcement', title, message, priority, link });
    });
  }

  // Create a confirmation notification for the sender
  const confirmNote = await Notification.create({
    recipientType: 'user',
    userId: createdBy,
    type: 'announcement',
    title: 'Announcement Sent',
    message: `"${title}" — sent to ${patientIds.length} patients`,
    priority: 'low',
    createdBy,
  });
  emitNotification(confirmNote.toObject());
  emitUnreadCount('user', createdBy);

  return { sentTo: patientIds.length };
};

// ── List (patients) ──────────────────────────────────────────────

export const getPatientNotifications = async (patientId, { limit = 50, unreadOnly = false } = {}) => {
  const filter = { recipientType: 'patient', patientId };
  if (unreadOnly) filter.isRead = false;
  return Notification.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
};

// ── List (staff) ─────────────────────────────────────────────────

export const getStaffNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const filter = { recipientType: 'user', userId };
  if (unreadOnly) filter.isRead = false;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const [data, total] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Notification.countDocuments(filter),
  ]);

  return { data, total, page: parseInt(page, 10), limit: limitNum };
};

// ── Unread count ─────────────────────────────────────────────────

export const getUnreadCount = async (recipientType, recipientId) => {
  const filter = { recipientType, isRead: false };
  if (recipientType === 'user') filter.userId = recipientId;
  else filter.patientId = recipientId;
  return Notification.countDocuments(filter);
};

// ── Mark one as read ─────────────────────────────────────────────

export const markAsRead = async (notificationId, recipientType, recipientId) => {
  const filter = { _id: notificationId, recipientType };
  if (recipientType === 'user') filter.userId = recipientId;
  else filter.patientId = recipientId;

  const updated = await Notification.findOneAndUpdate(
    filter,
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (updated) {
    emitUnreadCount(recipientType, recipientId);
  }
  return updated;
};

// ── Mark all as read ─────────────────────────────────────────────

export const markAllAsRead = async (recipientType, recipientId) => {
  const filter = { recipientType, isRead: false };
  if (recipientType === 'user') filter.userId = recipientId;
  else filter.patientId = recipientId;

  const result = await Notification.updateMany(
    filter,
    { isRead: true, readAt: new Date() }
  );

  if (result.modifiedCount > 0) {
    emitUnreadCount(recipientType, recipientId);
  }
  return result;
};

// ── Delete one notification ──────────────────────────────────────

export const deleteNotification = async (notificationId, recipientType, recipientId) => {
  const filter = { _id: notificationId, recipientType };
  if (recipientType === 'user') filter.userId = recipientId;
  else filter.patientId = recipientId;

  const deleted = await Notification.findOneAndDelete(filter);
  if (deleted) {
    emitUnreadCount(recipientType, recipientId);
  }
  return deleted;
};
