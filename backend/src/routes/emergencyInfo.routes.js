import express from 'express';
import { getPublicEmergencyInfo } from '../controllers/emergencyInfo.controller.js';

const router = express.Router();

router.route('/')
  .get(getPublicEmergencyInfo);

export default router;
