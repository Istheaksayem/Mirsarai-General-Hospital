import { StatusCodes } from 'http-status-codes';
import Document from '../../models/document.model.js';
import Patient from '../../models/patient.model.js';
import ApiError from '../../utils/ApiError.js';
import { createAuditLog } from '../auditLog.service.js';
import { createNotification } from '../notification.service.js';

export const uploadDocument = async (data, file, user) => {
  const patient = await Patient.findById(data.patientId);
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');

  const fileUrl = file ? `/uploads/documents/${file.filename}` : '';

  const document = await Document.create({
    patientId: data.patientId,
    documentType: data.documentType,
    title: data.title,
    department: data.department,
    fileUrl,
    uploadedBy: { id: user.id, role: user.role },
    notes: data.notes,
  });

  await createNotification({
    patientId: data.patientId,
    type: 'report_ready',
    title: 'New Document Available',
    message: `A new ${data.documentType.replace(/_/g, ' ')} — "${data.title}" has been uploaded to your document vault.`,
  });

  await createAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: 'upload',
    targetEntity: 'Document',
    targetId: document._id.toString(),
    details: { patientId: patient.patientId, documentType: data.documentType },
  });

  return document.toObject();
};

export const getDocuments = async (query = {}) => {
  const { page = 1, limit = 20, patientId, documentType } = query;
  const filter = { isDeleted: false };
  if (patientId) filter.patientId = patientId;
  if (documentType) filter.documentType = documentType;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .populate('patientId', 'fullName patientId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Document.countDocuments(filter),
  ]);

  return { documents, total, page: parseInt(page, 10), limit: limitNum };
};

export const updateDocument = async (id, data) => {
  const allowed = {};
  const updatableFields = ['title', 'documentType', 'department', 'notes'];
  for (const field of updatableFields) {
    if (data[field] !== undefined) allowed[field] = data[field];
  }
  if (Object.keys(allowed).length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No updatable fields provided');
  }

  const document = await Document.findByIdAndUpdate(id, { $set: allowed }, { new: true, runValidators: true }).lean();
  if (!document) throw new ApiError(StatusCodes.NOT_FOUND, 'Document not found');
  return document;
};

export const deleteDocument = async (id, userId) => {
  const document = await Document.findById(id);
  if (!document) throw new ApiError(StatusCodes.NOT_FOUND, 'Document not found');

  document.isDeleted = true;
  await document.save();

  await createAuditLog({
    actorId: userId,
    actorRole: 'lab',
    action: 'delete',
    targetEntity: 'Document',
    targetId: id,
  });

  return { message: 'Document deleted successfully' };
};

export const lookupPatient = async (query) => {
  if (!query || query.length < 2) return [];
  const filter = {
    $or: [
      { patientId: { $regex: query, $options: 'i' } },
      { mobile: { $regex: query, $options: 'i' } },
    ],
  };
  return Patient.find(filter).select('patientId fullName mobile gender age').limit(10).lean();
};
