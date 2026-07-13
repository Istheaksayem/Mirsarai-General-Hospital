import express from 'express';
import { getPublicDiagnosticService } from '../controllers/diagnosticService.controller.js';

const router = express.Router();

router.get('/diagnostic-services', getPublicDiagnosticService);

export default router;
