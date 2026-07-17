import express from 'express';
import {
  getAboutUs,
  updateAboutUs,
  getMissionVision,
  updateMissionVision,
  getGallery,
  updateGallery,
  addGalleryImage,
  deleteGalleryImage,
  getCareer,
  updateCareer,
  addCareerPosition,
  deleteCareerPosition,
  getOurTeam,
  updateOurTeam,
  uploadCMSImage
} from '../controllers/aboutCMS.controller.js';
import validate from '../middlewares/validate.middleware.js';
import {
  putAboutUsSchema,
  putMissionVisionSchema,
  putGallerySchema,
  putCareerSchema,
  putOurTeamSchema
} from '../validators/aboutCMS.validation.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ── About Us Routes ──
router.route('/us')
  .get(getAboutUs)
  .put(authenticate, authorize('super-admin'), validate(putAboutUsSchema), updateAboutUs);

// ── Mission & Vision Routes ──
router.route('/mission-vision')
  .get(getMissionVision)
  .put(authenticate, authorize('super-admin'), validate(putMissionVisionSchema), updateMissionVision);

// ── Gallery Routes ──
router.route('/gallery')
  .get(getGallery)
  .put(authenticate, authorize('super-admin'), validate(putGallerySchema), updateGallery);

router.route('/gallery/images')
  .post(authenticate, authorize('super-admin'), addGalleryImage);

router.route('/gallery/images/:id')
  .delete(authenticate, authorize('super-admin'), deleteGalleryImage);

// ── Career Routes ──
router.route('/career')
  .get(getCareer)
  .put(authenticate, authorize('super-admin'), validate(putCareerSchema), updateCareer);

router.route('/career/positions')
  .post(authenticate, authorize('super-admin'), addCareerPosition);

router.route('/career/positions/:id')
  .delete(authenticate, authorize('super-admin'), deleteCareerPosition);

// ── Media Upload Route ──
router.route('/upload')
  .post(authenticate, authorize('super-admin'), uploadCMSImage);

// ── Our Team Routes ──
router.route('/our-team')
  .get(getOurTeam)
  .put(authenticate, authorize('super-admin'), validate(putOurTeamSchema), updateOurTeam);

export default router;
