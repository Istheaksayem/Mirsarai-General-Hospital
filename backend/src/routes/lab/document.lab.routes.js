import express from 'express';
import * as DocumentLabController from '../../controllers/lab/document.lab.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { z } from 'zod';
import { uploadReportMiddleware } from '../../middlewares/upload.middleware.js';

const uploadSchema = z.object({
  body: z.object({
    patientId: z.string().min(1, 'Patient ID is required'),
    documentType: z.enum(['prescription', 'diagnostic_report', 'admission_form', 'discharge_summary', 'certificate', 'bill_receipt', 'other']),
    title: z.string().min(1, 'Title is required'),
    department: z.string().optional(),
    notes: z.string().optional(),
    testName: z.string().optional(),
    reportType: z.enum(['blood', 'imaging', 'pathology', 'microbiology']).optional(),
    requestingDoctor: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    documentType: z.enum(['prescription', 'diagnostic_report', 'admission_form', 'discharge_summary', 'certificate', 'bill_receipt', 'other']).optional(),
    department: z.string().optional(),
    notes: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

const router = express.Router();

router.post('/', uploadReportMiddleware.single('file'), validate(uploadSchema), DocumentLabController.uploadDocument);
router.get('/', DocumentLabController.getDocuments);
router.put('/:id', validate(updateSchema), DocumentLabController.updateDocument);
router.delete('/:id', DocumentLabController.deleteDocument);

export default router;
