import express from 'express';
import { getPublicServices } from '../controllers/service.controller.js';

const router = express.Router();

router.get('/', getPublicServices);

export default router;
