import express from 'express';
import {
  getAdminContactPage,
  updateContactPage
} from '../../controllers/contactPage.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { putContactPageSchema } from '../../validators/contactPage.validation.js';

const router = express.Router();

router.get('/', getAdminContactPage);
router.put('/', validate(putContactPageSchema), updateContactPage);

export default router;
