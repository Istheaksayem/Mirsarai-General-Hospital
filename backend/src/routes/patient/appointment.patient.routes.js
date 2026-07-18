import express from 'express';
import * as AppointmentPatientController from '../../controllers/patient/appointment.patient.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    doctor: z.string().min(1, 'Doctor ID is required'),
    department: z.string().optional(),
    service: z.string().optional(),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    type: z.enum(['new', 'follow-up', 'consultation']).optional(),
    reason: z.string().optional(),
  }),
});

const router = express.Router();

router.get('/', AppointmentPatientController.getMyAppointments);
router.post('/', validate(createSchema), AppointmentPatientController.createMyAppointment);

export default router;
