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
import receptionistRoutes from './receptionist.routes.js';
import labAdminRoutes from './labAdmin.routes.js';
import labReportRoutes from './labReport.routes.js';
import uploadRoutes from './upload.routes.js';
import appointmentRoutes from './appointment.routes.js';
import adminAppointmentRoutes from './admin/appointment.admin.routes.js';
import serviceRoutes from './service.routes.js';
import adminServiceRoutes from './admin/service.admin.routes.js';
import diagnosticServiceRoutes from './diagnosticService.routes.js';
import nicuBabyCareRoutes from './nicuBabyCare.routes.js';
import adminDiagnosticServiceRoutes from './admin/diagnosticService.admin.routes.js';
import adminNicuBabyCareRoutes from './admin/nicuBabyCare.admin.routes.js';
import healthBlogRoutes from './healthBlog.routes.js';
import emergencyInfoRoutes from './emergencyInfo.routes.js';
import faqRoutes from './faq.routes.js';
import appointmentPageRoutes from './appointmentPage.routes.js';
import contactPageRoutes from './contactPage.routes.js';
import footerRoutes from './footer.routes.js';
import adminHealthBlogRoutes from './admin/healthBlog.admin.routes.js';
import adminEmergencyInfoRoutes from './admin/emergencyInfo.admin.routes.js';
import adminFaqRoutes from './admin/faq.admin.routes.js';
import adminAppointmentPageRoutes from './admin/appointmentPage.admin.routes.js';
import adminContactPageRoutes from './admin/contactPage.admin.routes.js';
import adminFooterRoutes from './admin/footer.admin.routes.js';
import adminStaffRoutes from './admin/staff.admin.routes.js';
import adminPatientRoutes from './admin/patient.admin.routes.js';
import adminDashboardRoutes from './admin/dashboard.admin.routes.js';
import adminNotificationRoutes from './admin/notification.admin.routes.js';
import { uploadCMSImage } from '../controllers/aboutCMS.controller.js';
import receptionPatientRoutes from './reception/patient.reception.routes.js';
import receptionAppointmentRoutes from './reception/appointment.reception.routes.js';
import labDocumentRoutes from './lab/document.lab.routes.js';
import reportRoutes from './report.routes.js';
import patientLookupRoutes from './patient/lookup.routes.js';
import patientAuthRoutes from './patient/auth.patient.routes.js';
import patientProfileRoutes from './patient/profile.patient.routes.js';
import patientAppointmentRoutes from './patient/appointment.patient.routes.js';
import patientDocumentRoutes from './patient/document.patient.routes.js';
import patientNotificationRoutes from './patient/notification.patient.routes.js';
import patientTimelineRoutes from './patient/timeline.patient.routes.js';
import doctorPrescriptionRoutes from './doctor/prescription.doctor.routes.js';
import doctorScheduleRoutes from './doctor/doctorSchedule.routes.js';
import patientPrescriptionRoutes from './patient/prescription.patient.routes.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { authenticatePatient } from '../middlewares/auth.patient.middleware.js';
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

// ── Resource Page Routes ──────────────────────────────────────────────────────────
router.use('/health-blog', healthBlogRoutes);
router.use('/emergency-information', emergencyInfoRoutes);
router.use('/faq', faqRoutes);
router.use('/appointment-page', appointmentPageRoutes);
router.use('/contact-page', contactPageRoutes);
router.use('/footer', footerRoutes);

// ── Doctor Routes ────────────────────────────────────────────────────────────────
router.use('/doctors/prescriptions', doctorPrescriptionRoutes);
router.use('/doctors/schedule', doctorScheduleRoutes);
router.use('/doctors', doctorRoutes);

// ── Department Routes ────────────────────────────────────────────────────────────
router.use('/departments', departmentRoutes);

// ── Specialization Routes ─────────────────────────────────────────────────────────
router.use('/specializations', specializationRoutes);

// ── Appointment Routes ────────────────────────────────────────────────────────────
router.use('/appointments', appointmentRoutes);

// ── Staff Self-Profile Routes ─────────────────────────────────────────────────────
router.use('/receptionists', receptionistRoutes);
router.use('/lab', labAdminRoutes);
router.use('/lab-reports', labReportRoutes);
router.use('/upload', uploadRoutes);

// ── Admin Routes ────────────────────────────────────────────────────────────────
router.route('/admin/upload')
  .post(authenticate, authorize('super-admin'), uploadCMSImage);
router.use('/admin/services', authenticate, authorize('super-admin'), adminServiceRoutes);
router.use('/admin/service-page', authenticate, authorize('super-admin'), adminDiagnosticServiceRoutes);
router.use('/admin/service-page', authenticate, authorize('super-admin'), adminNicuBabyCareRoutes);
router.use('/admin/doctors', authenticate, authorize('super-admin'), adminDoctorRoutes);
router.use('/admin/departments', authenticate, authorize('super-admin'), adminDepartmentRoutes);
router.use('/admin/specializations', authenticate, authorize('super-admin'), adminSpecializationRoutes);
router.use('/admin/health-blog', authenticate, authorize('super-admin'), adminHealthBlogRoutes);
router.use('/admin/emergency-information', authenticate, authorize('super-admin'), adminEmergencyInfoRoutes);
router.use('/admin/faq', authenticate, authorize('super-admin'), adminFaqRoutes);
router.use('/admin/appointment-page', authenticate, authorize('super-admin'), adminAppointmentPageRoutes);
router.use('/admin/contact-page', authenticate, authorize('super-admin'), adminContactPageRoutes);
router.use('/admin/footer', authenticate, authorize('super-admin'), adminFooterRoutes);
router.use('/admin/staff', authenticate, authorize('super-admin'), adminStaffRoutes);
router.use('/admin/appointments', authenticate, authorize('super-admin'), adminAppointmentRoutes);
router.use('/admin/patients', authenticate, adminPatientRoutes);
router.use('/admin/dashboard', authenticate, authorize('super-admin'), adminDashboardRoutes);
router.use('/admin/notifications', authenticate, adminNotificationRoutes);

// ── Reception Routes ─────────────────────────────────────────────────────────
router.use('/reception/patients', authenticate, authorize('reception'), receptionPatientRoutes);
router.use('/reception/appointments', authenticate, authorize('reception'), receptionAppointmentRoutes);

// ── Lab Routes ───────────────────────────────────────────────────────────────
router.use('/lab/documents', authenticate, authorize('lab', 'super-admin', 'doctor'), labDocumentRoutes);
router.use('/patients/lookup', authenticate, authorize('reception', 'lab', 'super-admin', 'doctor'), patientLookupRoutes);

// ── Unified Reports (replaces legacy /lab-reports) ──────────
router.use('/reports', authenticate, authorize('lab', 'super-admin', 'doctor'), reportRoutes);

// ── Patient Portal Routes ────────────────────────────────────────────────────
router.use('/patient/auth', patientAuthRoutes);
router.use('/patient/profile', authenticatePatient, patientProfileRoutes);
router.use('/patient/appointments', authenticatePatient, patientAppointmentRoutes);
router.use('/patient/documents', authenticatePatient, patientDocumentRoutes);
router.use('/patient/notifications', authenticatePatient, patientNotificationRoutes);
router.use('/patient/timeline', authenticatePatient, patientTimelineRoutes);
router.use('/patient/prescriptions', patientPrescriptionRoutes);

export default router;
