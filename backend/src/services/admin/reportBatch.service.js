import ReportBatch from '../../models/ReportBatch.model.js';
import ReportFile from '../../models/ReportFile.model.js';
import ApiError from '../../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { PAGINATION } from '../../constants/index.js';
import { createAuditLog } from '../auditLog.service.js';

export const createReportBatch = async (data, files, userId) => {
  const batch = await ReportBatch.create({
    patientId: data.patientId.trim(),
    patientName: data.patientName.trim(),
    mobileNumber: data.mobileNumber.trim(),
    branchCode: data.branchCode || '',
    testDate: new Date(data.testDate),
    reportDate: new Date(data.reportDate),
    remarks: data.remarks || '',
    createdBy: userId,
  });

  const reportFiles = [];

  if (files && files.length > 0) {
    const isCombined = data.isCombined === 'true' || data.isCombined === true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const displayName = (data.fileNames && data.fileNames[i]) || file.originalname;

      const relativePath = file.path.startsWith(process.cwd())
        ? file.path.slice(process.cwd().length + 1).replace(/\\/g, '/')
        : file.path;

      const reportFile = await ReportFile.create({
        reportBatch: batch._id,
        fileName: displayName,
        originalFileName: file.originalname,
        storedPath: relativePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        isCombined,
      });

      reportFiles.push(reportFile);
    }
  }

  await createAuditLog({
    actorId: userId,
    actorRole: 'super-admin',
    action: 'create',
    targetEntity: 'ReportBatch',
    targetId: batch._id.toString(),
    details: {
      patientName: data.patientName,
      filesCount: reportFiles.length,
    },
  });

  return { batch, files: reportFiles };
};

export const getReportBatches = async (query) => {
  const page = parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };

  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    filter.$or = [
      { patientName: searchRegex },
      { mobileNumber: searchRegex },
    ];
  }

  if (query.mobileNumber) {
    filter.mobileNumber = query.mobileNumber;
  }

  const [batches, total] = await Promise.all([
    ReportBatch.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ReportBatch.countDocuments(filter),
  ]);

  const batchIds = batches.map((b) => b._id);
  const fileCounts = await ReportFile.aggregate([
    { $match: { reportBatch: { $in: batchIds }, isDeleted: false } },
    { $group: { _id: '$reportBatch', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  fileCounts.forEach((item) => { countMap[item._id.toString()] = item.count; });

  const result = batches.map((b) => ({
    ...b,
    fileCount: countMap[b._id.toString()] || 0,
  }));

  return { batches: result, total, page, limit };
};

export const getReportBatchById = async (id) => {
  const batch = await ReportBatch.findOne({ _id: id, isDeleted: false })
    .populate('createdBy', 'fullName email')
    .lean();

  if (!batch) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report batch not found');
  }

  const files = await ReportFile.find({ reportBatch: id, isDeleted: false })
    .sort({ isCombined: -1, fileName: 1 })
    .lean();

  return { ...batch, files };
};

export const updateReportBatch = async (id, data, userId) => {
  const batch = await ReportBatch.findOne({ _id: id, isDeleted: false });

  if (!batch) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report batch not found');
  }

  if (data.patientId !== undefined) batch.patientId = data.patientId.trim();
  if (data.patientName) batch.patientName = data.patientName.trim();
  if (data.mobileNumber) batch.mobileNumber = data.mobileNumber.trim();
  if (data.branchCode !== undefined) batch.branchCode = data.branchCode;
  if (data.testDate) batch.testDate = new Date(data.testDate);
  if (data.reportDate) batch.reportDate = new Date(data.reportDate);
  if (data.remarks !== undefined) batch.remarks = data.remarks;

  await batch.save();

  await createAuditLog({
    actorId: userId,
    actorRole: 'super-admin',
    action: 'update',
    targetEntity: 'ReportBatch',
    targetId: batch._id.toString(),
    details: { updatedFields: Object.keys(data) },
  });

  return batch.toObject();
};

export const softDeleteReportBatch = async (id, userId) => {
  const batch = await ReportBatch.findOne({ _id: id, isDeleted: false });

  if (!batch) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report batch not found');
  }

  batch.isDeleted = true;
  batch.deletedAt = new Date();
  await batch.save();

  await ReportFile.updateMany(
    { reportBatch: id, isDeleted: false },
    { isDeleted: true }
  );

  await createAuditLog({
    actorId: userId,
    actorRole: 'super-admin',
    action: 'delete',
    targetEntity: 'ReportBatch',
    targetId: batch._id.toString(),
    details: { patientName: batch.patientName },
  });

  return { message: 'Report batch deleted successfully' };
};

export const addFilesToBatch = async (batchId, files, data, userId) => {
  const batch = await ReportBatch.findOne({ _id: batchId, isDeleted: false });

  if (!batch) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report batch not found');
  }

  const reportFiles = [];
  const isCombined = data.isCombined === 'true' || data.isCombined === true;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const displayName = (data.fileNames && data.fileNames[i]) || file.originalname;

    const relativePath = file.path.startsWith(process.cwd())
      ? file.path.slice(process.cwd().length + 1).replace(/\\/g, '/')
      : file.path;

    const reportFile = await ReportFile.create({
      reportBatch: batch._id,
      fileName: displayName,
      originalFileName: file.originalname,
      storedPath: relativePath,
      fileSize: file.size,
      mimeType: file.mimetype,
      isCombined,
    });

    reportFiles.push(reportFile);
  }

  await createAuditLog({
    actorId: userId,
    actorRole: 'super-admin',
    action: 'create',
    targetEntity: 'ReportFile',
    targetId: batch._id.toString(),
    details: { addedFiles: reportFiles.length, fileNames: reportFiles.map((f) => f.fileName) },
  });

  return reportFiles;
};

export const softDeleteReportFile = async (fileId, userId) => {
  const file = await ReportFile.findOne({ _id: fileId, isDeleted: false });

  if (!file) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Report file not found');
  }

  file.isDeleted = true;
  await file.save();

  await createAuditLog({
    actorId: userId,
    actorRole: 'super-admin',
    action: 'delete',
    targetEntity: 'ReportFile',
    targetId: file._id.toString(),
    details: { fileName: file.fileName, reportBatch: file.reportBatch.toString() },
  });

  return { message: 'File deleted successfully' };
};
