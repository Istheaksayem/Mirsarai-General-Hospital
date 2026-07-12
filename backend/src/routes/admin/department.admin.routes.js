import express from 'express';
import * as DeptController from '../../controllers/department.controller.js';
import * as PageController from '../../controllers/departmentsPage.controller.js';

const router = express.Router();

// ── ADMIN DEPARTMENT ROUTES ───────────────────────────────────────────────────

/**
 * @route  GET  /api/v1/admin/departments/page-config
 * @desc   Get departments page settings (testimonials, stats, features, cta, seo)
 * @access Admin
 */
router.get('/page-config', PageController.getAdminPageConfig);

/**
 * @route  PUT  /api/v1/admin/departments/page-config
 * @desc   Update departments page settings
 * @access Admin
 */
router.put('/page-config', PageController.updatePageConfig);

/**
 * @route  GET  /api/v1/admin/departments
 * @desc   List all departments (raw bilingual) with filters + pagination
 * @access Admin
 */
router.get('/', DeptController.getAdminDepartments);

/**
 * @route  POST /api/v1/admin/departments
 * @desc   Create new department
 * @access Admin
 */
router.post('/', DeptController.createDepartment);

/**
 * @route  PATCH /api/v1/admin/departments/reorder
 * @desc   Bulk reorder departments
 * @access Admin
 */
router.patch('/reorder', DeptController.reorderDepartments);

/**
 * @route  GET  /api/v1/admin/departments/:id
 * @desc   Get single department by MongoDB ID
 * @access Admin
 */
router.get('/:id', DeptController.getAdminDepartmentById);

/**
 * @route  PUT  /api/v1/admin/departments/:id
 * @desc   Full update
 * @access Admin
 */
router.put('/:id', DeptController.updateDepartment);

/**
 * @route  PATCH /api/v1/admin/departments/:id
 * @desc   Partial update
 * @access Admin
 */
router.patch('/:id', DeptController.patchDepartment);

/**
 * @route  DELETE /api/v1/admin/departments/:id
 * @desc   Delete department
 * @access Admin
 */
router.delete('/:id', DeptController.deleteDepartment);

/**
 * @route  PATCH /api/v1/admin/departments/:id/toggle-visibility
 * @desc   Toggle visible/hidden
 * @access Admin
 */
router.patch('/:id/toggle-visibility', DeptController.toggleVisibility);

export default router;
