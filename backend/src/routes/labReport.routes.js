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
router.get('/', labReportController.getAllReports);
router.get('/:id', labReportController.getReportById);
router.patch('/:id/status', labReportController.updateReportStatus);
router.delete('/:id', labReportController.deleteReport);
router.get('/:id/download', labReportController.downloadReport);

export default router;
