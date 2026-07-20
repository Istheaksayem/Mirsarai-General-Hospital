import express from 'express';
import * as NotificationController from '../../controllers/admin/notification.admin.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, NotificationController.getMyNotifications);
router.get('/unread-count', authenticate, NotificationController.getUnreadCount);
router.patch('/:id/read', authenticate, NotificationController.markAsRead);
router.patch('/read-all', authenticate, NotificationController.markAllAsRead);
router.delete('/:id', authenticate, NotificationController.deleteNotification);
router.post('/announcement', authenticate, authorize('super-admin'), NotificationController.createAnnouncement);

export default router;
