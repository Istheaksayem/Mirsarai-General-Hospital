import express from 'express';
import { registerUser, verifyOTP, loginUser, getMe, registerStaff } from '../controllers/auth.controller.js';
import { googleAuth } from '../controllers/googleAuth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register-staff', registerStaff);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/me', authenticate, getMe);

export default router;
