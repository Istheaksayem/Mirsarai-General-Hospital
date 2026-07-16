import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
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
