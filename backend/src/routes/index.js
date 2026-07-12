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
import authRoutes from './auth.routes.js';
import appointmentRoutes from './appointment.routes.js';
import adminAppointmentRoutes from './admin/appointment.admin.routes.js';
import serviceRoutes from './service.routes.js';
import adminServiceRoutes from './admin/service.admin.routes.js';
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

// ============================================
// MODULE ROUTES
// ============================================
import homepageRoutes from './homepage.routes.js';
import aboutCMSRoutes from './aboutCMS.routes.js';
import authRoutes from './auth.routes.js';
// import userRoutes from './user.routes.js';
// import doctorRoutes from './doctor.routes.js';
// import patientRoutes from './patient.routes.js';
// import appointmentRoutes from './appointment.routes.js';

// ── Auth Routes ───────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ── CMS & Content Routes ───────────────────────────────────────────────────────
router.use('/about', aboutCMSRoutes);
router.use('/homepage', homepageRoutes);

router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/doctors', doctorRoutes);
// router.use('/patients', patientRoutes);
// router.use('/appointments', appointmentRoutes);

export default router;
