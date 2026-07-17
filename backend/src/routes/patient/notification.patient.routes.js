import express from 'express';
import * as NotificationPatientController from '../../controllers/patient/notification.patient.controller.js';

const router = express.Router();

router.get('/', NotificationPatientController.getMyNotifications);
router.patch('/read-all', NotificationPatientController.markAllAsRead);
router.patch('/:id/read', NotificationPatientController.markAsRead);

export default router;
