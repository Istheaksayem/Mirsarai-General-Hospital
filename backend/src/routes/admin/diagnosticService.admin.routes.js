import express from 'express';
import {
  getAdminDiagnosticService,
  updateDiagnosticService
} from '../../controllers/diagnosticService.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { putDiagnosticServiceSchema } from '../../validators/diagnosticService.validation.js';

const router = express.Router();

router.route('/diagnostic')
  .get(authenticate, authorize('super-admin'), getAdminDiagnosticService)
  .put(authenticate, authorize('super-admin'), validate(putDiagnosticServiceSchema), updateDiagnosticService);

export default router;
