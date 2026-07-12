import express from 'express';
import * as DeptController from '../controllers/department.controller.js';
import * as PageController from '../controllers/departmentsPage.controller.js';

const router = express.Router();

/**
 * @route  GET /api/v1/departments
 * @desc   Get all visible departments (bilingual projected)
 * @access Public
 * @query  ?lang=en|bn
 */
router.get('/', DeptController.getPublicDepartments);

/**
 * @route  GET /api/v1/departments/page-config
 * @desc   Get departments page configuration (testimonials, stats, features, cta, seo)
 * @access Public
 * @query  ?lang=en|bn
 */
router.get('/page-config', PageController.getPublicPageConfig);

/**
 * @route  GET /api/v1/departments/:slug
 * @desc   Get single department by slug
 * @access Public
 */
router.get('/:slug', DeptController.getPublicDepartmentBySlug);

export default router;
