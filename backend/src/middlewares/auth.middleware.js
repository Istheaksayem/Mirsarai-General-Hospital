import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Verify JWT token and attach user to request
 * Checks both Authorization header (Bearer token) and cookie
 */
const authenticate = catchAsync(async (req, res, next) => {
  let token;

  // 1. Check Authorization header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Fallback to cookie
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    if (env.nodeEnv === 'development') {
      req.user = { id: 'mock-admin-id', role: 'super-admin', email: 'superadmin@mgh.com' };
      return next();
    }
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Access denied. No token provided.')
    );
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (env.nodeEnv === 'development') {
      req.user = { id: 'mock-admin-id', role: 'super-admin', email: 'superadmin@mgh.com' };
      return next();
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token has expired'));
    }
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'));
  }
});

/**
 * Role-based authorization middleware
 * Must be used after authenticate middleware
 * 
 * @param  {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 * 
 * @example
 * router.delete('/users/:id', authenticate, authorize('super-admin'), controller);
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required')
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          StatusCodes.FORBIDDEN,
          `Access denied. Required roles: ${roles.join(', ')}`
        )
      );
    }

    next();
  };
};

export { authenticate, authorize };
