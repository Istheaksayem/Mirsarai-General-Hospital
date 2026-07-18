import express from 'express';
import * as DocumentLabController from '../../controllers/lab/document.lab.controller.js';

const router = express.Router();

router.get('/', DocumentLabController.lookupPatient);

export default router;
