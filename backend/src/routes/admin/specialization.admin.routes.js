import express from 'express';
import * as SpecController from '../../controllers/specialization.controller.js';

const router = express.Router();

// ── ADMIN SPECIALIZATION ROUTES ───────────────────────────────────────────────

/**
 * @route  GET  /api/v1/admin/specializations
 * @access Admin
 */
router.get('/', SpecController.getAdminSpecializations);

/**
 * @route  POST /api/v1/admin/specializations
 * @access Admin
 */
router.post('/', SpecController.createSpecialization);

/**
 * @route  PATCH /api/v1/admin/specializations/reorder
 * @access Admin
 */
router.patch('/reorder', SpecController.reorderSpecializations);

/**
 * @route  GET  /api/v1/admin/specializations/:id
 * @access Admin
 */
router.get('/:id', SpecController.getAdminSpecializationById);

/**
 * @route  PUT  /api/v1/admin/specializations/:id
 * @access Admin
 */
router.put('/:id', SpecController.updateSpecialization);

/**
 * @route  PATCH /api/v1/admin/specializations/:id
 * @access Admin
 */
router.patch('/:id', SpecController.patchSpecialization);

/**
 * @route  DELETE /api/v1/admin/specializations/:id
 * @access Admin
 */
router.delete('/:id', SpecController.deleteSpecialization);

export default router;
