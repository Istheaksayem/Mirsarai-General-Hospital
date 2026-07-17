import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    actorRole: {
      type: String,
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'upload', 'login', 'activate', 'deactivate', 'register', 'verify_otp'],
      required: [true, 'Action type is required'],
    },
    targetEntity: {
      type: String,
      required: [true, 'Target entity is required'],
    },
    targetId: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ targetEntity: 1, targetId: 1 });
auditLogSchema.index({ actorId: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
