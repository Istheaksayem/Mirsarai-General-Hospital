import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { uploadPrescriptionMiddleware } from '../../middlewares/uploadPrescription.middleware.js';
import * as PrescriptionDoctorController from '../../controllers/doctor/prescription.doctor.controller.js';

const router = Router();

router.use(authenticate, authorize('doctor'));

router.post('/lookup', PrescriptionDoctorController.lookupPatient);

router.post(
  '/',
  uploadPrescriptionMiddleware.single('file'),
  PrescriptionDoctorController.createPrescription
);

router.get('/', PrescriptionDoctorController.getMyPrescriptions);
router.get('/:id', PrescriptionDoctorController.getPrescriptionById);
router.delete('/:id', PrescriptionDoctorController.deletePrescription);

export default router;
