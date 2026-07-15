import express from 'express';
import * as ReceptionistController from '../controllers/receptionist.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { receptionistProfileSchema } from '../validators/receptionist.validator.js';

const router = express.Router();

router.get('/me', authenticate, authorize('reception'), ReceptionistController.getMyProfile);

router.put('/me', authenticate, authorize('reception'), validate(receptionistProfileSchema), ReceptionistController.createOrUpdateMyProfile);

export default router;
