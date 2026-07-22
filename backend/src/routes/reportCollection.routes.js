import express from 'express';
import rateLimit from 'express-rate-limit';
import * as ReportCollectionController from '../controllers/reportCollection.controller.js';
import { z } from 'zod';
import validate from '../middlewares/validate.middleware.js';

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many search attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const searchSchema = z.object({
  body: z.object({
    mobileNumber: z.string().min(1, 'Mobile number is required'),
    patientId: z.string().min(1, 'Patient ID is required'),
  }),
});

const router = express.Router();

router.post('/search', searchLimiter, validate(searchSchema), ReportCollectionController.search);
router.get('/file/:fileId', ReportCollectionController.streamFile);

export default router;
