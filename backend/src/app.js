import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import env from './config/env.js';
import routes from './routes/index.js';
import { errorConverter, errorHandler, notFound } from './middlewares/error.middleware.js';

const app = express();

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Set security HTTP headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs, // 15 minutes
  max: env.rateLimit.maxRequests, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ============================================
// CORS CONFIGURATION
// ============================================
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      env.clientUrl,
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || env.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// ============================================
// BODY PARSERS
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ============================================
// COMPRESSION
// ============================================
app.use(compression());

// ============================================
// LOGGING
// ============================================
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// ROUTES
// ============================================

// API Version 1 and general API routes
app.use('/api/v1', routes);
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mirsarai General Hospital API',
    version: '1.0.0',
    endpoints: {
      api: '/api/v1',
      health: '/api/v1/health',
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - Must be after all routes
app.use(notFound);

// Convert errors to ApiError
app.use(errorConverter);

// Global error handler - Must be last
app.use(errorHandler);

export default app;
