import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import { login, register, getMe } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', authenticate, authorize('super-admin'), validate(registerSchema), register);
router.get('/me', authenticate, getMe);

export default router;
