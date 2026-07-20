import express from 'express';
import {
  getDashboardStats,
  getRecentActivities,
} from '../../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/activities', getRecentActivities);

export default router;
