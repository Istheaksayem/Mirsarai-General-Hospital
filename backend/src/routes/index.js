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
import diagnosticServiceRoutes from './diagnosticService.routes.js';
import nicuBabyCareRoutes from './nicuBabyCare.routes.js';
import adminDiagnosticServiceRoutes from './admin/diagnosticService.admin.routes.js';
import adminNicuBabyCareRoutes from './admin/nicuBabyCare.admin.routes.js';
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
// import authRoutes from './auth.routes.js';
// import userRoutes from './user.routes.js';
// import doctorRoutes from './doctor.routes.js';
// import patientRoutes from './patient.routes.js';
// import appointmentRoutes from './appointment.routes.js';

// ── Auth Routes ───────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);

// ── CMS & Content Routes ───────────────────────────────────────────────────────
router.use('/about', aboutCMSRoutes);
router.use('/homepage', homepageRoutes);

// ── Services Routes ─────────────────────────────────────────────────────────────
router.use('/services', serviceRoutes);

// ── Diagnostic Service Routes ────────────────────────────────────────────────────
router.use('/service-page', diagnosticServiceRoutes);

// ── NICU & Baby Care Routes ───────────────────────────────────────────────────────
router.use('/service-page', nicuBabyCareRoutes);

// ── Doctor Routes ────────────────────────────────────────────────────────────────
router.use('/doctors', doctorRoutes);

// ── Department Routes ────────────────────────────────────────────────────────────
router.use('/departments', departmentRoutes);

// ── Specialization Routes ─────────────────────────────────────────────────────────
router.use('/specializations', specializationRoutes);

// ── Appointment Routes ────────────────────────────────────────────────────────────
router.use('/appointments', appointmentRoutes);

// ── Admin Routes ────────────────────────────────────────────────────────────────
router.use('/admin/services', authenticate, authorize('super-admin'), adminServiceRoutes);
router.use('/admin/service-page', authenticate, authorize('super-admin'), adminDiagnosticServiceRoutes);
router.use('/admin/service-page', authenticate, authorize('super-admin'), adminNicuBabyCareRoutes);
router.use('/admin/doctors', authenticate, authorize('super-admin'), adminDoctorRoutes);
router.use('/admin/departments', authenticate, authorize('super-admin'), adminDepartmentRoutes);
router.use('/admin/specializations', authenticate, authorize('super-admin'), adminSpecializationRoutes);
router.use('/admin/appointments', authenticate, authorize('super-admin'), adminAppointmentRoutes);

export default router;
