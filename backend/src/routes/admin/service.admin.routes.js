import express from 'express';
import {
  getAdminServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  reorderServices,
} from '../../controllers/service.controller.js';

const router = express.Router();

router.get('/', getAdminServices);
router.post('/', createService);
router.patch('/reorder', reorderServices);
router.get('/:id', getServiceById);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;
