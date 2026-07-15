import express from 'express';
import * as LabAdminController from '../controllers/labAdmin.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { labAdminProfileSchema } from '../validators/labAdmin.validator.js';

const router = express.Router();

router.get('/me', authenticate, authorize('lab'), LabAdminController.getMyProfile);

router.put('/me', authenticate, authorize('lab'), validate(labAdminProfileSchema), LabAdminController.createOrUpdateMyProfile);

export default router;
