import express from 'express';
import * as PatientController from '../../controllers/admin/patient.admin.controller.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  createPatientSchema,
  updatePatientSchema,
  patientQuerySchema,
} from '../../validators/patient.validator.js';

const router = express.Router();

router.get('/', validate(patientQuerySchema), PatientController.getPatients);
router.get('/:id', PatientController.getPatientById);
router.post('/', validate(createPatientSchema), PatientController.createPatient);
router.put('/:id', validate(updatePatientSchema), PatientController.updatePatient);
router.patch('/:id', validate(updatePatientSchema), PatientController.updatePatient);
router.delete('/:id', PatientController.deletePatient);

export default router;
