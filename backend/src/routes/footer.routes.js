import express from 'express';
import { getPublicFooter } from '../controllers/footer.controller.js';

const router = express.Router();

router.get('/', getPublicFooter);

export default router;
