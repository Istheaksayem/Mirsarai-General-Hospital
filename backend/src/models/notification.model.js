import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
    },
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
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ patientId: 1, createdAt: -1 });
notificationSchema.index({ patientId: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
