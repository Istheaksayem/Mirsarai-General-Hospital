import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // ── Polymorphic recipient ──────────────────────────────────
    recipientType: {
      type: String,
      enum: ['patient', 'user'],
      default: 'patient',
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // ── Notification content ───────────────────────────────────
    type: {
      type: String,
      enum: ['appointment_reminder', 'report_ready', 'announcement', 'status_update', 'general'],
      default: 'general',
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    link: {
      type: String,
      trim: true,
    },

    // ── Read tracking ──────────────────────────────────────────
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },

    // ── Who created this (for announcements) ───────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientType: 1, patientId: 1, createdAt: -1 });
notificationSchema.index({ recipientType: 1, userId: 1, createdAt: -1 });
notificationSchema.index({ recipientType: 1, patientId: 1, isRead: 1 });
notificationSchema.index({ recipientType: 1, userId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
