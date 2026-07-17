import express from 'express';
import {
  getAdminEmergencyInfo,
  updateEmergencyInfo
} from '../../controllers/emergencyInfo.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { putEmergencyInfoSchema } from '../../validators/emergencyInfo.validation.js';

const router = express.Router();

router.route('/')
  .get(getAdminEmergencyInfo)
  .put(validate(putEmergencyInfoSchema), updateEmergencyInfo);

export default router;
