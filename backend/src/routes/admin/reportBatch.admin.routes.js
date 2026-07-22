import express from 'express';
import * as ReportBatchAdminController from '../../controllers/admin/reportBatch.admin.controller.js';
import { uploadReportFiles } from '../../middlewares/reportUpload.middleware.js';
import { z } from 'zod';
import validate from '../../middlewares/validate.middleware.js';

const createSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, 'Patient ID is required'),
    patientName: z.string().min(1, 'Patient name is required'),
    mobileNumber: z.string().min(1, 'Mobile number is required'),
    testDate: z.string().min(1, 'Test date is required'),
    reportDate: z.string().min(1, 'Report date is required'),
    remarks: z.string().optional(),
    isCombined: z.string().optional(),
    branchCode: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    patientId: z.string().optional(),
    patientName: z.string().min(1).optional(),
    mobileNumber: z.string().min(1).optional(),
    testDate: z.string().min(1).optional(),
    reportDate: z.string().min(1).optional(),
    remarks: z.string().optional(),
    branchCode: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Batch ID is required'),
  }),
});

const paramsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Batch ID is required'),
  }),
});

const fileDeleteSchema = z.object({
  params: z.object({
    fileId: z.string().min(1, 'File ID is required'),
  }),
});

const router = express.Router();

router.get('/', ReportBatchAdminController.list);
router.post('/', uploadReportFiles, validate(createSchema), ReportBatchAdminController.create);
router.get('/:id', validate(paramsSchema), ReportBatchAdminController.getById);
router.put('/:id', validate(updateSchema), ReportBatchAdminController.update);
router.delete('/:id', validate(paramsSchema), ReportBatchAdminController.remove);
router.post('/:id/files', uploadReportFiles, ReportBatchAdminController.addFiles);
router.delete('/file/:fileId', validate(fileDeleteSchema), ReportBatchAdminController.deleteFile);

export default router;
