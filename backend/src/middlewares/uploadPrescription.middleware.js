import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const uploadDir = path.join(process.cwd(), 'public/uploads/prescriptions');

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

const allowedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const fileFilter = (_req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        'Invalid file type. Only PDF, JPG, PNG, and Word documents (DOC/DOCX) are allowed.'
      ),
      false
    );
  }
};

export const uploadPrescriptionMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});
