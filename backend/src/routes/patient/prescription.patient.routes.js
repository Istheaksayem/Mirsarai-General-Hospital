import { Router } from 'express';
import { authenticatePatient } from '../../middlewares/auth.patient.middleware.js';
import * as PrescriptionPatientController from '../../controllers/patient/prescription.patient.controller.js';

const router = Router();

router.use(authenticatePatient);

router.get('/', PrescriptionPatientController.getMyPrescriptions);
router.get('/:id', PrescriptionPatientController.getPrescriptionById);
router.get('/:id/file', PrescriptionPatientController.downloadPrescriptionFile);

export default router;
