import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import doctorRoutes from './doctor.routes.js';
import departmentRoutes from './department.routes.js';
import specializationRoutes from './specialization.routes.js';
import adminDoctorRoutes from './admin/doctor.admin.routes.js';
import adminDepartmentRoutes from './admin/department.admin.routes.js';
import adminSpecializationRoutes from './admin/specialization.admin.routes.js';
import aboutCMSRoutes from './aboutCMS.routes.js';
import homepageRoutes from './homepage.routes.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

const router = express.Router();

// ── Health & Test ──────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    },
  });
});

router.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: 'Test endpoint working' });
});

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Mirsarai General Hospital API',
    data: {
      version: '1.0.0',
      endpoints: {
        health:                '/api/v1/health',
        doctors:               '/api/v1/doctors',
        departments:           '/api/v1/departments',
        adminDoctors:          '/api/v1/admin/doctors',
        adminDepartments:      '/api/v1/admin/departments',
        adminSpecializations:  '/api/v1/admin/specializations',
      },
    },
  });
});

// ── Public Routes ──────────────────────────────────────────────────────────────
router.use('/doctors', doctorRoutes);
router.use('/departments', departmentRoutes);
router.use('/specializations', specializationRoutes);

// ── CMS & Content Routes ───────────────────────────────────────────────────────
router.use('/about', aboutCMSRoutes);
router.use('/homepage', homepageRoutes);

// ── Admin CMS Routes (authenticated) ──────────────────────────────────────────
router.use('/admin/doctors', authenticate, authorize('super-admin'), adminDoctorRoutes);
router.use('/admin/departments', authenticate, authorize('super-admin'), adminDepartmentRoutes);
router.use('/admin/specializations', authenticate, authorize('super-admin'), adminSpecializationRoutes);

/**
 * @route  POST /api/v1/admin/upload
 * @desc   Upload an image (base64) and return the public URL
 * @access Admin
 */
router.post('/admin/upload', authenticate, authorize('super-admin'), catchAsync(async (req, res) => {
  const { image } = req.body;
  if (!image) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing image data');
  }

  const mimeTypeMatch = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  if (!mimeTypeMatch) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid base64 image encoding');
  }

  const extension = mimeTypeMatch[1].split('/')[1] || 'png';
  const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
  const filename = `${crypto.randomBytes(16).toString('hex')}.${extension}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(path.join(uploadDir, filename), base64Data, 'base64');
  sendSuccess(res, StatusCodes.OK, { url: `/uploads/${filename}` }, 'Image uploaded successfully');
}));

export default router;
