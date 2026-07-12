import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../utils/ApiResponse.js';
import * as SpecService from '../services/specialization.service.js';

// ── PUBLIC ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/specializations
 * Public: all visible specializations (optionally filtered by ?department=slug)
 */
export const getPublicSpecializations = catchAsync(async (req, res) => {
  const specs = await SpecService.getPublicSpecializations(req.query.department);
  sendSuccess(res, StatusCodes.OK, specs, 'Specializations fetched successfully');
});

// ── ADMIN CMS ─────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/specializations
 * Admin: list all with filters + pagination
 */
export const getAdminSpecializations = catchAsync(async (req, res) => {
  const { specializations, total, page, limit } = await SpecService.getAdminSpecializations(req.query);
  sendPaginated(res, specializations, total, page, limit, 'Specializations fetched successfully');
});

/**
 * GET /api/v1/admin/specializations/:id
 */
export const getAdminSpecializationById = catchAsync(async (req, res) => {
  const spec = await SpecService.getAdminSpecializationById(req.params.id);
  sendSuccess(res, StatusCodes.OK, spec, 'Specialization fetched successfully');
});

/**
 * POST /api/v1/admin/specializations
 */
export const createSpecialization = catchAsync(async (req, res) => {
  const spec = await SpecService.createSpecialization(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.CREATED, spec, 'Specialization created successfully');
});

/**
 * PUT /api/v1/admin/specializations/:id
 */
export const updateSpecialization = catchAsync(async (req, res) => {
  const spec = await SpecService.updateSpecialization(req.params.id, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, spec, 'Specialization updated successfully');
});

/**
 * PATCH /api/v1/admin/specializations/:id
 */
export const patchSpecialization = catchAsync(async (req, res) => {
  const spec = await SpecService.updateSpecialization(req.params.id, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, spec, 'Specialization updated successfully');
});

/**
 * DELETE /api/v1/admin/specializations/:id
 */
export const deleteSpecialization = catchAsync(async (req, res) => {
  await SpecService.deleteSpecialization(req.params.id);
  sendSuccess(res, StatusCodes.OK, null, 'Specialization deleted successfully');
});

/**
 * PATCH /api/v1/admin/specializations/reorder
 */
export const reorderSpecializations = catchAsync(async (req, res) => {
  await SpecService.reorderSpecializations(req.body);
  sendSuccess(res, StatusCodes.OK, null, 'Specializations reordered successfully');
});
