import express from 'express';
import * as ReportController from '../controllers/report.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { z } from 'zod';
import { uploadReportMiddleware } from '../middlewares/upload.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const createSchema = z.object({
  body: z.object({
    patientId: z.string().min(1),
    testName: z.string().min(1, 'Test name is required'),
    reportType: z.enum(['blood', 'imaging', 'pathology', 'microbiology']),
    requestingDoctor: z.string().optional(),
    requestingDoctorId: z.string().optional(),
    department: z.string().optional(),
    notes: z.string().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional(),
  }),
});

const statusSchema = z.object({
  body: z.object({ status: z.enum(['pending', 'in-progress', 'completed']) }),
  params: z.object({ id: z.string().min(1) }),
});

const router = express.Router();

router.use(authenticate, authorize('lab', 'super-admin', 'doctor'));

router.get('/stats', ReportController.reportStats);
router.get('/', ReportController.listReports);
router.get('/:id', ReportController.getReport);

router.post('/', authorize('lab', 'super-admin'), uploadReportMiddleware.single('file'), validate(createSchema), ReportController.createReport);
router.patch('/:id/status', authorize('lab', 'super-admin'), validate(statusSchema), ReportController.updateStatus);
router.delete('/:id', authorize('lab', 'super-admin'), ReportController.removeReport);

export default router;
