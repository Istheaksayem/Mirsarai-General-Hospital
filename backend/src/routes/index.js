import express from 'express';

const router = express.Router();

/**
 * Health check endpoint
 * Returns API status and version
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    },
  });
});

/**
 * Test endpoint
 * Simple test route to verify API connectivity
 */
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    data: {
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * @route   GET /api/v1
 * @desc    API Root - Welcome message
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Mirsarai General Hospital API',
    data: {
      version: '1.0.0',
      documentation: '/api/v1/docs',
      endpoints: {
        health: '/api/v1/health',
        test: '/api/v1/test',
      },
    },
  });
});

// ============================================
// MODULE ROUTES (will be added later)
// ============================================
// import authRoutes from './auth.routes.js';
// import userRoutes from './user.routes.js';
// import doctorRoutes from './doctor.routes.js';
// import patientRoutes from './patient.routes.js';
// import appointmentRoutes from './appointment.routes.js';

// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/doctors', doctorRoutes);
// router.use('/patients', patientRoutes);
// router.use('/appointments', appointmentRoutes);

export default router;
