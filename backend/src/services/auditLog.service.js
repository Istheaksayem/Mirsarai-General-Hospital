import AuditLog from '../models/auditLog.model.js';

export const createAuditLog = async ({ actorId, actorRole, action, targetEntity, targetId, details }) => {
  return AuditLog.create({ actorId, actorRole, action, targetEntity, targetId, details });
};

export const getAuditLogs = async ({ targetEntity, targetId, limit = 50 } = {}) => {
  const filter = {};
  if (targetEntity) filter.targetEntity = targetEntity;
  if (targetId) filter.targetId = targetId;
  return AuditLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
};
