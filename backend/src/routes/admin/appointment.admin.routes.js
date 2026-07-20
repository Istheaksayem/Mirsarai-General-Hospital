import express from 'express';
import {
  getAdminAppointments,
  getAdminAppointmentById,
  createAdminAppointment,
  updateAdminAppointment,
  deleteAdminAppointment,
  updateAdminAppointmentStatus,
} from '../../controllers/appointment.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { updateAdminStatusSchema } from '../../validators/appointment.validator.js';

const router = express.Router();

router.get('/', getAdminAppointments);
router.post('/', createAdminAppointment);
router.get('/:id', getAdminAppointmentById);
router.put('/:id', updateAdminAppointment);
router.delete('/:id', deleteAdminAppointment);
router.patch('/:id/status', validate(updateAdminStatusSchema), updateAdminAppointmentStatus);

export default router;
