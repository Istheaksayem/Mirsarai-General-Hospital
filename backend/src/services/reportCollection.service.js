import jwt from 'jsonwebtoken';
import ReportBatch from '../models/ReportBatch.model.js';
import ReportFile from '../models/ReportFile.model.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import env from '../config/env.js';
import { createAuditLog } from './auditLog.service.js';

const normalizeMobile = (mobile) => {
  return mobile.replace(/[\s\-\+\(\)]/g, '').replace(/^(88|0088)/, '');
};

export const generateAccessToken = (batchId) => {
  return jwt.sign(
    { batchId, type: 'report_access' },
    env.jwt.secret,
    { expiresIn: '30m' }
  );
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    if (decoded.type === 'report_access') return decoded;
    if (decoded.role) return decoded;
    throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid access token type');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Access token has expired. Please search again.');
    }
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid access token');
  }
};

export const searchReport = async (mobileNumber, patientId) => {
  const mobile = normalizeMobile(mobileNumber);

  const query = {
    patientId: patientId.trim(),
    mobileNumber: mobile,
    isDeleted: false,
  };

  const batches = await ReportBatch.find(query).sort({ reportDate: -1 }).lean();

  if (!batches || batches.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'No report found with the provided information.');
  }

  const batchIds = batches.map((b) => b._id);
  const files = await ReportFile.find({
    reportBatch: { $in: batchIds },
    isDeleted: false,
  }).sort({ isCombined: -1, fileName: 1 }).lean();

  const filesByBatch = {};
  for (const f of files) {
    const bid = f.reportBatch.toString();
    if (!filesByBatch[bid]) filesByBatch[bid] = [];
    filesByBatch[bid].push(f);
  }

  if (batches.length === 1) {
    const batch = batches[0];
    const batchFiles = filesByBatch[batch._id.toString()] || [];
    const token = generateAccessToken(batch._id.toString());
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    return { batch, files: batchFiles, token, expiresAt };
  }

  const token = generateAccessToken(batches[0]._id.toString());
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const resultBatches = batches.map((b) => ({
    ...b,
    files: filesByBatch[b._id.toString()] || [],
  }));

  return { batches: resultBatches, files, token, expiresAt };
};

export const ensureFileBelongsToBatch = async (fileId, batchId) => {
  const file = await ReportFile.findOne({
    _id: fileId,
    reportBatch: batchId,
    isDeleted: false,
  }).lean();

  if (!file) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'File not found');
  }

  return file;
};

export const getFileById = async (fileId) => {
  const file = await ReportFile.findOne({
    _id: fileId,
    isDeleted: false,
  }).populate('reportBatch').lean();

  if (!file) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'File not found');
  }

  return file;
};
