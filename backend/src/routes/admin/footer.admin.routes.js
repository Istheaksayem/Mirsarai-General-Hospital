import express from 'express';
import {
  getAdminFooter,
  updateFooter
} from '../../controllers/footer.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { putFooterSchema } from '../../validators/footer.validation.js';

const router = express.Router();

router.get('/', getAdminFooter);
router.put('/', validate(putFooterSchema), updateFooter);

export default router;
