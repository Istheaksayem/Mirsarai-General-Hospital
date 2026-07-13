import express from 'express';
import {
  getAdminFAQ,
  updateFAQ
} from '../../controllers/faq.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { putFAQSchema } from '../../validators/faq.validation.js';

const router = express.Router();

router.route('/')
  .get(getAdminFAQ)
  .put(validate(putFAQSchema), updateFAQ);

export default router;
