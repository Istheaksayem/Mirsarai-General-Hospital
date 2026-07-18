import express from 'express';
import * as AuthPatientController from '../../controllers/patient/auth.patient.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { z } from 'zod';

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    mobile: z.string().regex(/^01[3-9]\d{8}$/).optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
  }),
});

const router = express.Router();

router.get('/', AuthPatientController.getProfile);
router.put('/', validate(updateProfileSchema), AuthPatientController.updateProfile);

export default router;
