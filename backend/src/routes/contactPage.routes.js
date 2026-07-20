import express from 'express';
import { getPublicContactPage } from '../controllers/contactPage.controller.js';

const router = express.Router();

router.get('/', getPublicContactPage);

export default router;
