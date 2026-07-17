import express from 'express';
import {
  getAdminHealthBlog,
  updateHealthBlog
} from '../../controllers/healthBlog.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { putHealthBlogSchema } from '../../validators/healthBlog.validation.js';

const router = express.Router();

router.route('/')
  .get(getAdminHealthBlog)
  .put(validate(putHealthBlogSchema), updateHealthBlog);

export default router;
