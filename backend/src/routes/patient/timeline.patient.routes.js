import express from 'express';
import * as TimelinePatientController from '../../controllers/patient/timeline.patient.controller.js';

const router = express.Router();

router.get('/', TimelinePatientController.getTimeline);

export default router;
