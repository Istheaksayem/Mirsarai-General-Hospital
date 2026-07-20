import express from 'express';
import * as AuthPatientController from '../../controllers/patient/auth.patient.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { z } from 'zod';

const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
  }),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

const setPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Valid email is required'),
    mobile: z.string().regex(/^01[3-9]\d{8}$/, 'Enter a valid BD mobile number'),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
    address: z.string().optional(),
  }),
});

const router = express.Router();

router.get('/check', AuthPatientController.checkStatus);
router.post('/send-otp', validate(sendOtpSchema), AuthPatientController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), AuthPatientController.verifyOtp);
router.post('/set-password', validate(setPasswordSchema), AuthPatientController.setPassword);
router.post('/login', validate(loginSchema), AuthPatientController.loginWithPassword);
router.post('/register', validate(registerSchema), AuthPatientController.registerPatient);

export default router;
