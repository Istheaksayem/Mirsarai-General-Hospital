import express from 'express';
import { getPublicFAQ } from '../controllers/faq.controller.js';

const router = express.Router();

router.route('/')
  .get(getPublicFAQ);

export default router;
