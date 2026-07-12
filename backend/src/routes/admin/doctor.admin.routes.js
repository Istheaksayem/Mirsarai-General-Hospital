import express from 'express';
import * as DoctorController from '../../controllers/doctor.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createDoctorSchema,
  updateDoctorSchema,
  doctorQuerySchema,
} from '../../validators/doctor.validator.js';

const router = express.Router();

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
