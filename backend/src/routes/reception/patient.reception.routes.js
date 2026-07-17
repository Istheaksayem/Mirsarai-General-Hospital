import express from 'express';
import * as ReceptionPatientController from '../../controllers/reception/patient.reception.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { z } from 'zod';

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2),
    mobile: z.string().regex(/^01[3-9]\d{8}$/),
    email: z.string().email('Valid email is required').optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    address: z.string().optional(),
    department: z.string().optional(),
  }),
});

const router = express.Router();

router.post('/register', validate(registerSchema), ReceptionPatientController.registerPatient);
router.get('/search', ReceptionPatientController.searchPatients);

export default router;
