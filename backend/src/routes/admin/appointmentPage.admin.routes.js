import express from 'express';
import {
  getAdminAppointmentPage,
  updateAppointmentPage
} from '../../controllers/appointmentPage.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { putAppointmentPageSchema } from '../../validators/appointmentPage.validation.js';

const router = express.Router();

router.get('/', getAdminAppointmentPage);
router.put('/', validate(putAppointmentPageSchema), updateAppointmentPage);

export default router;
