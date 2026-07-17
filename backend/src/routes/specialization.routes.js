import express from 'express';
import * as SpecController from '../controllers/specialization.controller.js';

const router = express.Router();

/**
 * @route  GET /api/v1/specializations
 * @desc   Get all visible specializations (optionally filtered by ?department=slug)
 * @access Public
 */
router.get('/', SpecController.getPublicSpecializations);

export default router;
