import express from 'express';
import * as DocumentPatientController from '../../controllers/patient/document.patient.controller.js';

const router = express.Router();

router.get('/', DocumentPatientController.getMyDocuments);
router.get('/:id/file', DocumentPatientController.downloadDocument);

export default router;
