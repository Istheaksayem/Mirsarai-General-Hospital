import express from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import * as ScheduleController from '../../controllers/doctor/doctorSchedule.controller.js';

const router = express.Router();

router.use(authenticate, authorize('doctor'));

router.get('/', ScheduleController.getSchedule);
router.put('/', ScheduleController.upsertSchedule);
router.post('/slots', ScheduleController.addWeeklySlot);
router.put('/slots/:slotId', ScheduleController.updateWeeklySlot);
router.delete('/slots/:slotId', ScheduleController.deleteWeeklySlot);
router.post('/exceptions', ScheduleController.addException);
router.delete('/exceptions/:exceptionId', ScheduleController.deleteException);
router.get('/available-slots', ScheduleController.getAvailableSlots);

export default router;
