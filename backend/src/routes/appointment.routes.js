import express from 'express';
import { bookAppointment } from '../controllers/appointment.controller.js';

const router = express.Router();

router.post('/', bookAppointment);

export default router;
