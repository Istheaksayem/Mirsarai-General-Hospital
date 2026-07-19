import express from 'express';
import { getPublicAppointmentPage } from '../controllers/appointmentPage.controller.js';

const router = express.Router();

router.get('/', getPublicAppointmentPage);

export default router;
