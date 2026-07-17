import express from 'express';
import { getPublicHealthBlog } from '../controllers/healthBlog.controller.js';

const router = express.Router();

router.route('/')
  .get(getPublicHealthBlog);

export default router;
