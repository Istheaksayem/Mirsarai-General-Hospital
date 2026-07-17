import express from 'express';
import * as StaffController from '../../controllers/admin/staff.admin.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  staffQuerySchema,
  updateStaffSchema,
} from '../../validators/staff.validator.js';

const router = express.Router();

router.get('/', validate(staffQuerySchema), StaffController.getAllStaff);
router.get('/:id', StaffController.getStaffById);
router.put('/:id', validate(updateStaffSchema), StaffController.updateStaff);
router.patch('/:id', validate(updateStaffSchema), StaffController.updateStaff);
router.delete('/:id', StaffController.deleteStaff);
router.patch('/:id/activate', StaffController.activateStaff);
router.patch('/:id/deactivate', StaffController.deactivateStaff);

export default router;
