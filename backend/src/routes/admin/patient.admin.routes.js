import express from 'express';
import * as PatientController from '../../controllers/admin/patient.admin.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import {
  createPatientSchema,
  updatePatientSchema,
  patientQuerySchema,
} from '../../validators/patient.validator.js';

const router = express.Router();

router.get('/', authenticate, authorize('super-admin', 'reception', 'lab', 'doctor'), validate(patientQuerySchema), PatientController.getPatients);
router.get('/:id', authenticate, authorize('super-admin', 'reception', 'lab', 'doctor'), PatientController.getPatientById);
router.post('/', authenticate, authorize('super-admin'), validate(createPatientSchema), PatientController.createPatient);
router.put('/:id', authenticate, authorize('super-admin'), validate(updatePatientSchema), PatientController.updatePatient);
router.patch('/:id', authenticate, authorize('super-admin'), validate(updatePatientSchema), PatientController.updatePatient);
router.delete('/:id', authenticate, authorize('super-admin'), PatientController.deletePatient);

export default router;
