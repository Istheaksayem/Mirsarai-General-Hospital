import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import env from '../config/env.js';
import Patient from '../models/patient.model.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

const authenticatePatient = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access denied. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, env.jwt.secret);

    if (decoded.type !== 'patient') {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Invalid patient token'));
    }

    const patient = await Patient.findById(decoded.id).select('fullName mobile email isActive status').lean();
    if (!patient) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Patient not found'));
    }
    if (!patient.isActive) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Your account has been deactivated. Please contact support.'));
    }

    req.patient = { id: decoded.id, patientId: decoded.patientId, role: 'patient', ...patient };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token has expired'));
    }
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'));
  }
});

export { authenticatePatient };
