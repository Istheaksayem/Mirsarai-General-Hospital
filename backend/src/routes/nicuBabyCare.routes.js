import express from 'express';
import { getPublicNicuBabyCare } from '../controllers/nicuBabyCare.controller.js';

const router = express.Router();

router.get('/nicu', getPublicNicuBabyCare);

export default router;
