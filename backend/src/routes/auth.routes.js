import express from 'express';
import { registerUser, verifyOTP, loginUser, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.get('/me', authenticate, getMe);

export default router;
