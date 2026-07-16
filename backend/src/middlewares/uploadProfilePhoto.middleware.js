import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const uploadDir = path.join(process.cwd(), 'public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueName = `${crypto.randomBytes(16).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCodes.BAD_REQUEST, 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'), false);
  }
};

export const uploadProfilePhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
