import { StatusCodes } from 'http-status-codes';
import path from 'path';
import fs from 'fs';
import catchAsync from '../../utils/catchAsync.js';
import { sendSuccess } from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import Document from '../../models/document.model.js';

export const getMyDocuments = catchAsync(async (req, res) => {
  const documents = await Document.find({ patientId: req.patient.id, isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();
  sendSuccess(res, StatusCodes.OK, documents, 'Documents fetched successfully');
});

export const downloadDocument = catchAsync(async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    patientId: req.patient.id,
    isDeleted: false,
  });
  if (!document) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Document not found');
  }

  const filePath = path.join(process.cwd(), 'public', document.fileUrl);
  if (!fs.existsSync(filePath)) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'File not found');
  }

  const ext = path.extname(document.fileUrl).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  const safeName = document.title.replace(/[^a-zA-Z0-9_-]/g, '_') + ext;
  res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
  res.setHeader('Content-Type', contentType);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});
