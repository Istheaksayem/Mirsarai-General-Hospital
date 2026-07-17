import express from 'express';
import { uploadProfilePhoto } from '../controllers/upload.controller.js';
import { uploadProfilePhoto as uploadMiddleware } from '../middlewares/uploadProfilePhoto.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
  '/profile-photo',
  authenticate,
  authorize('doctor', 'reception', 'lab', 'super-admin'),
  uploadMiddleware.single('photo'),
  uploadProfilePhoto
);

export default router;
