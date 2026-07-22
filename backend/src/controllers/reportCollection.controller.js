import path from 'path';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import catchAsync from '../utils/catchAsync.js';
import * as ReportCollectionService from '../services/reportCollection.service.js';
import { createAuditLog } from '../services/auditLog.service.js';

export const search = catchAsync(async (req, res) => {
  const { mobileNumber, patientId } = req.body;

  const result = await ReportCollectionService.searchReport(mobileNumber, patientId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: result.batches ? 'Multiple reports found' : 'Report found successfully',
    data: result.batches ? {
      batches: result.batches,
      files: result.files,
      token: result.token,
      expiresAt: result.expiresAt,
    } : {
      batch: result.batch,
      files: result.files,
      token: result.token,
      expiresAt: result.expiresAt,
    },
  });
});

const getSafeFilename = (file) => {
  const baseName = file.originalFileName || file.fileName || 'report';
  const ext = path.extname(baseName);
  if (ext) return baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storedExt = path.extname(file.storedPath);
  return baseName.replace(/[^a-zA-Z0-9._-]/g, '_') + storedExt;
};

const getContentType = (file) => {
  if (file.mimeType && file.mimeType !== 'application/octet-stream') return file.mimeType;
  const ext = path.extname(file.storedPath).toLowerCase();
  const mimeMap = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return mimeMap[ext] || 'application/octet-stream';
};

export const streamFile = catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Access token is required. Please search for your report first.',
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = ReportCollectionService.verifyAccessToken(token);

  let file;
  if (decoded.type === 'report_access') {
    file = await ReportCollectionService.ensureFileBelongsToBatch(
      req.params.fileId,
      decoded.batchId
    );
  } else {
    file = await ReportCollectionService.getFileById(req.params.fileId);
  }

  const fullPath = path.resolve(process.cwd(), file.storedPath);

  if (!fs.existsSync(fullPath)) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'File not found on server',
    });
  }

  const isDownload = req.query.download === 'true';
  const safeFilename = getSafeFilename(file);
  const contentType = getContentType(file);

  if (isDownload) {
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  } else {
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', fs.statSync(fullPath).size);

  const action = isDownload ? 'download' : 'view';
  createAuditLog({
    action,
    targetEntity: 'ReportFile',
    targetId: file._id.toString(),
    details: { fileName: file.fileName, reportBatch: file.reportBatch?._id || file.reportBatch?.toString() },
  }).catch(() => {});

  const fileStream = fs.createReadStream(fullPath);
  fileStream.pipe(res);
});
