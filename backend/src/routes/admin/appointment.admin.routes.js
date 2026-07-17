import express from 'express';
import {
  getAdminAppointments,
  getAdminAppointmentById,
  createAdminAppointment,
  updateAdminAppointment,
  deleteAdminAppointment,
  updateAdminAppointmentStatus,
} from '../../controllers/appointment.controller.js';

const router = express.Router();

router.get('/', getAdminAppointments);
router.post('/', createAdminAppointment);
router.get('/:id', getAdminAppointmentById);
router.put('/:id', updateAdminAppointment);
router.delete('/:id', deleteAdminAppointment);
router.patch('/:id/status', updateAdminAppointmentStatus);

export default router;
