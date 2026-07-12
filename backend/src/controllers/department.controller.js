import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../utils/ApiResponse.js';
import * as DeptService from '../services/department.service.js';

// ── Resolve lang from query or Accept-Language header ─────────────────────────
const getLang = (req) => {
  if (req.query.lang === 'bn') return 'bn';
  const accept = req.headers['accept-language'] || '';
  if (accept.includes('bn')) return 'bn';
  return 'en';
};

// ── PUBLIC ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/departments
 * Public: all visible departments (bilingual-projected flat strings)
 */
export const getPublicDepartments = catchAsync(async (req, res) => {
  const lang = getLang(req);
  const departments = await DeptService.getPublicDepartments(lang);
  sendSuccess(res, StatusCodes.OK, departments, 'Departments fetched successfully');
});

/**
 * GET /api/v1/departments/:slug
 * Public: single department by slug
 */
export const getPublicDepartmentBySlug = catchAsync(async (req, res) => {
  const lang = getLang(req);
  const dept = await DeptService.getPublicDepartmentBySlug(req.params.slug, lang);
  sendSuccess(res, StatusCodes.OK, dept, 'Department fetched successfully');
});

// ── ADMIN CMS ─────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/admin/departments
 * Admin: all departments (raw bilingual) with filters + pagination
 */
export const getAdminDepartments = catchAsync(async (req, res) => {
  const { departments, total, page, limit } = await DeptService.getAdminDepartments(req.query);
  sendPaginated(res, departments, total, page, limit, 'Departments fetched successfully');
});

/**
 * GET /api/v1/admin/departments/:id
 * Admin: single department by ID
 */
export const getAdminDepartmentById = catchAsync(async (req, res) => {
  const dept = await DeptService.getAdminDepartmentById(req.params.id);
  sendSuccess(res, StatusCodes.OK, dept, 'Department fetched successfully');
});

/**
 * POST /api/v1/admin/departments
 * Admin: create department
 */
export const createDepartment = catchAsync(async (req, res) => {
  const dept = await DeptService.createDepartment(req.body, req.user?.id);
  sendSuccess(res, StatusCodes.CREATED, dept, 'Department created successfully');
});

/**
 * PUT /api/v1/admin/departments/:id
 * Admin: full update
 */
export const updateDepartment = catchAsync(async (req, res) => {
  const dept = await DeptService.updateDepartment(req.params.id, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, dept, 'Department updated successfully');
});

/**
 * PATCH /api/v1/admin/departments/:id
 * Admin: partial update
 */
export const patchDepartment = catchAsync(async (req, res) => {
  const dept = await DeptService.updateDepartment(req.params.id, req.body, req.user?.id);
  sendSuccess(res, StatusCodes.OK, dept, 'Department updated successfully');
});

/**
 * DELETE /api/v1/admin/departments/:id
 * Admin: delete department
 */
export const deleteDepartment = catchAsync(async (req, res) => {
  await DeptService.deleteDepartment(req.params.id);
  sendSuccess(res, StatusCodes.OK, null, 'Department deleted successfully');
});

/**
 * PATCH /api/v1/admin/departments/:id/toggle-visibility
 * Admin: toggle visible/hidden
 */
export const toggleVisibility = catchAsync(async (req, res) => {
  const dept = await DeptService.toggleDepartmentVisibility(req.params.id, req.user?.id);
  sendSuccess(res, StatusCodes.OK, dept, 'Visibility updated');
});

/**
 * PATCH /api/v1/admin/departments/reorder
 * Admin: bulk reorder
 * body: [{ id, displayOrder }]
 */
export const reorderDepartments = catchAsync(async (req, res) => {
  await DeptService.reorderDepartments(req.body);
  sendSuccess(res, StatusCodes.OK, null, 'Departments reordered successfully');
});
