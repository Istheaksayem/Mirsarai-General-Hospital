import { StatusCodes } from 'http-status-codes';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/**
 * Convert any error to ApiError instance
 */
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join(', ');
      error = new ApiError(StatusCodes.BAD_REQUEST, `Validation Error: ${messages}`);
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const friendlyMessages = {
        mobile: 'A patient with this phone number already exists.',
        patientId: 'A patient with this ID already exists.',
        email: 'A patient with this email address already exists.',
      };
      const message = friendlyMessages[field] || `${field} already exists`;
      error = new ApiError(StatusCodes.CONFLICT, message);
    } else if (error.name === 'CastError') {
      error = new ApiError(StatusCodes.BAD_REQUEST, `Invalid ${error.path}: ${error.value}`);
    } else {
      const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      const message = error.message || 'Internal Server Error';
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }

  next(error);
};

/**
 * Global error handler
 * Sends structured error responses
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Set default values if not present
  statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  message = message || 'Internal Server Error';

  const response = {
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  };

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    response.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    response.message = 'Token expired';
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = StatusCodes.BAD_REQUEST;
    response.message = 'Validation Error';
    response.errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Log error in development
  if (env.nodeEnv === 'development') {
    console.error('❌ Error:', err);
  }

  res.status(statusCode).json(response);
};

/**
 * Handle 404 errors - must be placed after all routes
 */
const notFound = (req, res, next) => {
  const error = new ApiError(
    StatusCodes.NOT_FOUND,
    `Route ${req.originalUrl} not found`
  );
  next(error);
};

export { errorConverter, errorHandler, notFound };
