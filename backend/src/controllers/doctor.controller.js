import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../utils/ApiResponse.js';
import * as DoctorService from '../services/doctor.service.js';
import * as DoctorProfileService from '../services/doctorProfile.service.js';

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/doctors
 * Public: all visible doctors
 */
export const getPublicDoctors = catchAsync(async (req, res) => {
  const doctors = await DoctorService.getPublicDoctors();
  sendSuccess(res, StatusCodes.OK, doctors, 'Doctors fetched successfully');
});

/**
 * GET /api/v1/doctors/featured
 * Public: featured doctors for homepage
 */
export const getFeaturedDoctors = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const doctors = await DoctorService.getFeaturedDoctors(limit);
  sendSuccess(res, StatusCodes.OK, doctors, 'Featured doctors fetched successfully');
});

/**
 * GET /api/v1/doctors/departments
 * Public: list of departments
 */
export const getDepartments = catchAsync(async (req, res) => {
  const departments = await DoctorService.getDepartments();
  sendSuccess(res, StatusCodes.OK, departments, 'Departments fetched successfully');
});

/**
 * GET /api/v1/doctors/:slug
 * Public: single doctor by slug
 */
export const getPublicDoctorBySlug = catchAsync(async (req, res) => {
  const doctor = await DoctorService.getPublicDoctorBySlug(req.params.slug);
  sendSuccess(res, StatusCodes.OK, doctor, 'Doctor fetched successfully');
});

// ── ADMIN CMS ──────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/doctors
 * Admin: all doctors with filters + pagination
 */
export const getAdminDoctors = catchAsync(async (req, res) => {
  const { doctors, total, page, limit } = await DoctorService.getAdminDoctors(req.query);
  sendPaginated(res, doctors, total, page, limit, 'Doctors fetched successfully');
});

/**
 * GET /api/v1/admin/doctors/:id
 * Admin: single doctor by ID
 */
export const getAdminDoctorById = catchAsync(async (req, res) => {
  const doctor = await DoctorService.getAdminDoctorById(req.params.id);
  sendSuccess(res, StatusCodes.OK, doctor, 'Doctor fetched successfully');
});

/**
 * POST /api/v1/admin/doctors
 * Admin: create doctor
 */
export const createDoctor = catchAsync(async (req, res) => {
  const doctor = await DoctorService.createDoctor(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.CREATED, doctor, 'Doctor created successfully');
});

/**
 * PUT /api/v1/admin/doctors/:id
 * Admin: full update
 */
export const updateDoctor = catchAsync(async (req, res) => {
  const doctor = await DoctorService.updateDoctor(req.params.id, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, doctor, 'Doctor updated successfully');
});

/**
 * PATCH /api/v1/admin/doctors/:id
 * Admin: partial update
 */
export const patchDoctor = catchAsync(async (req, res) => {
  const doctor = await DoctorService.updateDoctor(req.params.id, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, doctor, 'Doctor updated successfully');
});

/**
 * DELETE /api/v1/admin/doctors/:id
 * Admin: delete doctor
 */
export const deleteDoctor = catchAsync(async (req, res) => {
  await DoctorService.deleteDoctor(req.params.id);
  sendSuccess(res, StatusCodes.OK, null, 'Doctor deleted successfully');
});

/**
 * PATCH /api/v1/admin/doctors/:id/toggle-visibility
 * Admin: toggle visible/hidden
 */
export const toggleVisibility = catchAsync(async (req, res) => {
  const doctor = await DoctorService.toggleDoctorVisibility(req.params.id, req.user?.id);
  sendSuccess(res, StatusCodes.OK, doctor, 'Visibility updated');
});

/**
 * PATCH /api/v1/admin/doctors/:id/toggle-featured
 * Admin: toggle featured
 */
export const toggleFeatured = catchAsync(async (req, res) => {
  const doctor = await DoctorService.toggleDoctorFeatured(req.params.id, req.user?.id);
  sendSuccess(res, StatusCodes.OK, doctor, 'Featured status updated');
});

/**
 * PATCH /api/v1/admin/doctors/reorder
 * Admin: bulk reorder
 * body: [{ id, displayOrder }]
 */
export const reorderDoctors = catchAsync(async (req, res) => {
  await DoctorService.reorderDoctors(req.body);
  sendSuccess(res, StatusCodes.OK, null, 'Doctors reordered successfully');
});

// ── DOCTOR SELF-PROFILE ────────────────────────────────────────────────────────

/**
 * GET /api/v1/doctors/me
 * Auth: authenticated doctor
 * Desc: get the logged-in doctor's own profile
 */
export const getMyProfile = catchAsync(async (req, res) => {
  const profile = await DoctorProfileService.getMyProfile(req.user.id);
  sendSuccess(res, StatusCodes.OK, profile, 'Profile fetched successfully');
});

/**
 * PUT /api/v1/doctors/me
 * Auth: authenticated doctor
 * Desc: create or update the logged-in doctor's profile
 */
export const createOrUpdateMyProfile = catchAsync(async (req, res) => {
  const { profile, token } = await DoctorProfileService.createOrUpdateMyProfile(req.user.id, req.body);
  sendSuccess(res, StatusCodes.OK, { profile, token }, 'Profile saved successfully');
});

// ── SUPER ADMIN — ASSIGN ADMIN INFO ────────────────────────────────────────────

/**
 * PATCH /api/v1/admin/doctors/registrations/:userId/assign-admin-info
 * Admin: assign department, designation, branch, employmentType to a doctor profile
 */
export const assignAdminInfo = catchAsync(async (req, res) => {
  const profile = await DoctorService.assignAdminInfo(req.params.userId, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, profile, 'Admin info assigned successfully');
});

// ── SUPER ADMIN — REGISTRATION APPROVAL ────────────────────────────────────────

/**
 * GET /api/v1/admin/doctors/registrations/pending
 * Admin: list all pending staff registrations (doctor, receptionist, lab admin)
 */
export const getPendingRegistrations = catchAsync(async (req, res) => {
  const registrations = await DoctorService.getPendingRegistrations();
  sendSuccess(res, StatusCodes.OK, registrations, 'Pending registrations fetched successfully');
});

/**
 * PATCH /api/v1/admin/doctors/registrations/:userId/approve
 * Admin: approve a staff registration
 */
export const approveRegistration = catchAsync(async (req, res) => {
  const user = await DoctorService.approveRegistration(req.params.userId, req.user?.id);
  sendSuccess(res, StatusCodes.OK, user, 'Staff approved successfully');
});

/**
 * PATCH /api/v1/admin/doctors/registrations/:userId/reject
 * Admin: reject a staff registration
 */
export const rejectRegistration = catchAsync(async (req, res) => {
  const user = await DoctorService.rejectRegistration(req.params.userId, req.user?.id);
  sendSuccess(res, StatusCodes.OK, user, 'Staff rejected successfully');
});

/**
 * PATCH /api/v1/admin/doctors/registrations/:userId/suspend
 * Admin: suspend an approved staff member
 */
export const suspendDoctor = catchAsync(async (req, res) => {
  const user = await DoctorService.suspendDoctor(req.params.userId, req.user?.id);
  sendSuccess(res, StatusCodes.OK, user, 'Staff suspended successfully');
});


