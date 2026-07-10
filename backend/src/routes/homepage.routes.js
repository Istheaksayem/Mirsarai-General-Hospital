import express from 'express';
import {
  getHomepage,
  updateHomepage,
  patchHomepage
} from '../controllers/homepage.controller.js';
import {
  getHero,
  updateHero,
  patchHero
} from '../controllers/hero.controller.js';
import validate from '../middlewares/validate.middleware.js';
import {
  putHomepageSchema,
  patchHomepageSchema
} from '../validators/homepage.validation.js';
import {
  putHeroSchema,
  patchHeroSchema
} from '../validators/hero.validation.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Homepage routes
router.route('/')
  .get(getHomepage)
  .put(authenticate, authorize('super-admin'), validate(putHomepageSchema), updateHomepage)
  .patch(authenticate, authorize('super-admin'), validate(patchHomepageSchema), patchHomepage);

// Hero routes
router.route('/hero')
  .get(getHero)
  .put(authenticate, authorize('super-admin'), validate(putHeroSchema), updateHero)
  .patch(authenticate, authorize('super-admin'), validate(patchHeroSchema), patchHero);

export default router;
