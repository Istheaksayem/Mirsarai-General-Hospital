import express from 'express';
import {
  getAdminNicuBabyCare,
  updateNicuBabyCare
} from '../../controllers/nicuBabyCare.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { putNicuBabyCareSchema } from '../../validators/nicuBabyCare.validation.js';

const router = express.Router();

router.route('/nicu')
  .get(authenticate, authorize('super-admin'), getAdminNicuBabyCare)
  .put(authenticate, authorize('super-admin'), validate(putNicuBabyCareSchema), updateNicuBabyCare);

export default router;
