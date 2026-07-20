import { StatusCodes } from 'http-status-codes';
import Document from '../models/document.model.js';
import Patient from '../models/patient.model.js';
import DoctorProfile from '../models/doctorProfile.model.js';
import ApiError from '../utils/ApiError.js';
import { createNotification, createStaffNotification } from './notification.service.js';
import { createAuditLog } from './auditLog.service.js';

const LAB_FILTER = { documentType: 'diagnostic_report', isDeleted: false };

function buildScopeFilter(role, userId) {
  const base = { ...LAB_FILTER };
  if (role === 'doctor') {
    // Future: base.requestingDoctorId = userId;
  }
  return base;
}

const POPULATE = [
  { path: 'patientId', select: 'fullName patientId mobile' },
  { path: 'uploadedBy.id', select: 'fullName email' },
];

export const getReports = async (query = {}, role, userId) => {
  const { page = 1, limit = 20, status, reportType, search } = query;
  const filter = buildScopeFilter(role, userId);

  if (status) filter.status = status;
  if (reportType) filter.reportType = reportType;
  if (search) {
    const patientIds = await Patient.find({
      $or: [
        { patientId: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ],
    }).select('_id').lean().then(docs => docs.map(d => d._id));

    filter.$or = [
      { testName: { $regex: search, $options: 'i' } },
      { patientId: { $in: patientIds } },
    ];
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .populate(POPULATE)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Document.countDocuments(filter),
  ]);

  const reports = documents.map(normalizeReport);
  return { reports, total, page: parseInt(page, 10), limit: limitNum };
};

export const getReportById = async (id, role, userId) => {
  const filter = buildScopeFilter(role, userId);
  filter._id = id;
  const doc = await Document.findOne(filter).populate(POPULATE).lean();
  if (!doc) throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found');
  return normalizeReport(doc);
};

export const createReport = async (data, file, user) => {
  const patient = await Patient.findById(data.patientId);
  if (!patient) throw new ApiError(StatusCodes.NOT_FOUND, 'Patient not found');

  const fileUrl = file ? `/uploads/documents/${file.filename}` : '';

  const doc = await Document.create({
    patientId: data.patientId,
    documentType: 'diagnostic_report',
    title: data.testName || data.title,
    department: data.department,
    fileUrl,
    uploadedBy: { id: user.id, role: user.role },
    notes: data.notes,
    testName: data.testName,
    reportType: data.reportType,
    requestingDoctor: data.requestingDoctor,
    requestingDoctorId: data.requestingDoctorId || undefined,
    status: data.status || 'pending',
  });

  await createNotification({
    patientId: data.patientId,
    type: 'report_ready',
    title: 'New Lab Report Available',
    message: `Your ${data.reportType || 'lab'} report — "${data.testName || doc.title}" is ready.`,
    priority: 'high',
    link: '/documents',
  });

  // Notify the requesting doctor if available
  if (data.requestingDoctorId) {
    try {
      const doctorProfile = await DoctorProfile.findById(data.requestingDoctorId).select('userId').lean();
      if (doctorProfile?.userId) {
        await createStaffNotification({
          userId: doctorProfile.userId,
          type: 'report_ready',
          title: 'Lab Report Ready',
          message: `Report for patient is ready — "${data.testName || doc.title}".`,
          priority: 'medium',
          link: '/reports',
        });
      }
    } catch (err) {
      console.log('Doctor notification failed:', err.message);
    }
  }

  await createAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: 'upload',
    targetEntity: 'Report',
    targetId: doc._id.toString(),
    details: { patientId: patient.patientId, testName: data.testName },
  });

  return normalizeReport(doc.toObject());
};

export const updateReportStatus = async (id, status, user) => {
  const allowed = ['pending', 'in-progress', 'completed'];
  if (!allowed.includes(status))
    throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid status. Allowed: ${allowed.join(', ')}`);

  const doc = await Document.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true },
  ).populate(POPULATE).lean();

  if (!doc) throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found');

  await createAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: 'update_status',
    targetEntity: 'Report',
    targetId: id,
    details: { newStatus: status },
  });

  return normalizeReport(doc);
};

export const deleteReport = async (id, userId) => {
  const doc = await Document.findById(id);
  if (!doc) throw new ApiError(StatusCodes.NOT_FOUND, 'Report not found');
  doc.isDeleted = true;
  await doc.save();

  await createAuditLog({
    actorId: userId,
    actorRole: 'lab',
    action: 'delete',
    targetEntity: 'Report',
    targetId: id,
  });

  return { message: 'Report deleted successfully' };
};

export const getReportStats = async (role, userId) => {
  const filter = buildScopeFilter(role, userId);
  const [pending, inProgress, completed] = await Promise.all([
    Document.countDocuments({ ...filter, status: 'pending' }),
    Document.countDocuments({ ...filter, status: 'in-progress' }),
    Document.countDocuments({ ...filter, status: 'completed' }),
  ]);
  const total = pending + inProgress + completed;
  return { total, pending, inProgress, completed, completionRate: total ? Math.round((completed / total) * 100) : 0 };
};

function normalizeReport(doc) {
  const patient = doc.patientId || {};
  return {
    _id: doc._id,
    id: doc._id,
    patientId: patient.patientId || doc.patientId,
    patientName: patient.fullName || '',
    testName: doc.testName || doc.title,
    reportType: doc.reportType || '',
    requestingDoctor: doc.requestingDoctor || '',
    department: doc.department || '',
    fileUrl: doc.fileUrl,
    status: doc.status || 'pending',
    notes: doc.notes || '',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    completedDate: doc.status === 'completed' ? doc.updatedAt : null,
  };
}
