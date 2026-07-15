import express from 'express';
import * as labReportController from '../controllers/labReport.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { uploadReportMiddleware } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(authenticate, authorize('lab', 'super-admin'));

router.post(
  '/upload',
  uploadReportMiddleware.single('reportFile'),
  labReportController.uploadReport
);

router.get('/recent', labReportController.getRecentReports);

export default router;
