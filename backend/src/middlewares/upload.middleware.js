import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const uploadDir = path.join(process.cwd(), 'public/uploads/documents');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${crypto.randomBytes(16).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid file type. Only PDF, JPG, and PNG are allowed.'), false);
  }
};

export const uploadReportMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});
