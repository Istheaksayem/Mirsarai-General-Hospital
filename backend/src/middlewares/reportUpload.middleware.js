import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const STORAGE_SUB = 'storage/reports';
const uploadDir = path.join(process.cwd(), STORAGE_SUB);

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

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(StatusCodes.BAD_REQUEST, `Invalid file type "${file.mimetype}". Allowed: PDF, JPG, JPEG, PNG, DOC, DOCX`), false);
  }

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new ApiError(StatusCodes.BAD_REQUEST, `Invalid file extension "${ext}". Allowed: .pdf, .jpg, .jpeg, .png, .doc, .docx`), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter,
});

export const uploadReportFiles = upload.array('files', 10);

export const uploadSingleReport = upload.single('file');
