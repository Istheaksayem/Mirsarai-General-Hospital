import express from 'express';
import * as DoctorController from '../controllers/doctor.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import {
  createDoctorSchema,
  updateDoctorSchema,
  doctorQuerySchema,
  doctorProfileSchema,
} from '../validators/doctor.validator.js';

const router = express.Router();

// ── PROTECTED ROUTES (authenticated doctor only) ───────────────────────────────
// IMPORTANT: These must be defined BEFORE the public /:slug route
// to avoid "me" being caught as a slug value.

/**
 * @route  GET /api/v1/doctors/me
 * @desc   Get the logged-in doctor's own profile
 * @access Private (doctor)
 */
router.get('/me', authenticate, authorize('doctor'), DoctorController.getMyProfile);

/**
 * @route  PUT /api/v1/doctors/me
 * @desc   Create or update the logged-in doctor's profile
 * @access Private (doctor)
 */
router.put('/me', authenticate, authorize('doctor'), validate(doctorProfileSchema), DoctorController.createOrUpdateMyProfile);

// ── PUBLIC ROUTES ──────────────────────────────────────────────────────────────
// These are open — no auth required

/**
 * @route  GET /api/v1/doctors
 * @desc   Get all visible doctors (public frontend)
 * @access Public
 */
router.get('/', DoctorController.getPublicDoctors);

/**
 * @route  GET /api/v1/doctors/featured
 * @desc   Get featured doctors for homepage
 * @access Public
 */
router.get('/featured', DoctorController.getFeaturedDoctors);

/**
 * @route  GET /api/v1/doctors/departments
 * @desc   Get unique department list
 * @access Public
 */
router.get('/departments', DoctorController.getDepartments);

/**
 * @route  GET /api/v1/doctors/:slug
 * @desc   Get single doctor by slug (public profile page)
 * @access Public
 */
router.get('/:slug', DoctorController.getPublicDoctorBySlug);

export default router;
