import express from 'express';
import * as ReceptionPatientController from '../../controllers/reception/patient.reception.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { z } from 'zod';

const statusSchema = z.object({
  body: z.object({
    status: z.enum(['confirmed', 'cancelled', 'completed', 'no-show']),
  }),
  params: z.object({ id: z.string().min(1) }),
});

const router = express.Router();

router.get('/', ReceptionPatientController.getAppointments);
router.patch('/:id/status', validate(statusSchema), ReceptionPatientController.updateAppointmentStatus);

export default router;
