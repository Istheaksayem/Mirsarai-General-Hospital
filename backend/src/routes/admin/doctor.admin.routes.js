import express from 'express';
import * as DoctorController from '../../controllers/doctor.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createDoctorSchema,
  updateDoctorSchema,
  doctorQuerySchema,
  assignAdminInfoSchema,
} from '../../validators/doctor.validator.js';

const router = express.Router();

// ── DOCTOR REGISTRATION APPROVAL ROUTES ────────────────────────────────────────
// IMPORTANT: These fixed routes MUST be defined BEFORE /:id parameterized routes
// to avoid "registrations" being caught as an ID value.

/**
 * @route  GET    /api/v1/admin/doctors/registrations/pending
 * @desc   List all pending doctor registrations
 * @access Admin (super-admin)
 */
router.get('/registrations/pending', DoctorController.getPendingRegistrations);

/**
 * @route  PATCH  /api/v1/admin/doctors/registrations/:userId/approve
 * @desc   Approve a doctor registration
 * @access Admin (super-admin)
 */
router.patch('/registrations/:userId/approve', DoctorController.approveRegistration);

/**
 * @route  PATCH  /api/v1/admin/doctors/registrations/:userId/reject
 * @desc   Reject a doctor registration
 * @access Admin (super-admin)
 */
router.patch('/registrations/:userId/reject', DoctorController.rejectRegistration);

/**
 * @route  PATCH  /api/v1/admin/doctors/registrations/:userId/assign-admin-info
 * @desc   Assign department, designation, branch, employmentType to a doctor profile
 * @access Admin (super-admin)
 */
router.patch(
  '/registrations/:userId/assign-admin-info',
  validate(assignAdminInfoSchema),
  DoctorController.assignAdminInfo
);

/**
 * @route  PATCH /api/v1/admin/doctors/registrations/:userId/suspend
 * @desc   Suspend an approved doctor
 * @access Admin (super-admin)
 */
router.patch('/registrations/:userId/suspend', DoctorController.suspendDoctor);

/** TEMPORARY: POST /api/v1/admin/doctors/sync-profiles — backfill DoctorProfiles into Doctor collection */
router.post('/sync-profiles', DoctorController.syncDoctorProfiles);

// ── ADMIN CMS ROUTES ───────────────────────────────────────────────────────────
// All require authentication (applied at parent router level)

/**
 * @route  GET  /api/v1/admin/doctors
 * @desc   List all doctors with filters, search, pagination
 * @access Admin
 */
router.get('/', validate(doctorQuerySchema), DoctorController.getAdminDoctors);

/**
 * @route  POST /api/v1/admin/doctors
 * @desc   Create new doctor
 * @access Admin
 */
router.post('/', validate(createDoctorSchema), DoctorController.createDoctor);

/**
 * @route  PATCH /api/v1/admin/doctors/reorder
 * @desc   Bulk reorder doctors
 * @access Admin
 */
router.patch('/reorder', DoctorController.reorderDoctors);

/**
 * @route  GET  /api/v1/admin/doctors/:id
 * @desc   Get single doctor by MongoDB ID
 * @access Admin
 */
router.get('/:id', DoctorController.getAdminDoctorById);

/**
 * @route  PUT   /api/v1/admin/doctors/:id
 * @desc   Full update
 * @access Admin
 */
router.put('/:id', validate(updateDoctorSchema), DoctorController.updateDoctor);

/**
 * @route  PATCH /api/v1/admin/doctors/:id
 * @desc   Partial update
 * @access Admin
 */
router.patch('/:id', DoctorController.patchDoctor);

/**
 * @route  DELETE /api/v1/admin/doctors/:id
 * @desc   Delete doctor
 * @access Admin
 */
router.delete('/:id', DoctorController.deleteDoctor);

/**
 * @route  PATCH /api/v1/admin/doctors/:id/toggle-visibility
 * @desc   Toggle visible/hidden
 * @access Admin
 */
router.patch('/:id/toggle-visibility', DoctorController.toggleVisibility);

/**
 * @route  PATCH /api/v1/admin/doctors/:id/toggle-featured
 * @desc   Toggle featured on/off
 * @access Admin
 */
router.patch('/:id/toggle-featured', DoctorController.toggleFeatured);

export default router;
