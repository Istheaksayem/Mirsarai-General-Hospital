import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Homepage from '../models/homepage.model.js';

/**
 * Get homepage content
 * GET /api/homepage or /api/v1/homepage
 */
export const getHomepage = catchAsync(async (req, res) => {
  const homepage = await Homepage.findOne();
  if (!homepage) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Homepage content not found. Please insert initial data.');
  }
  return sendSuccess(res, StatusCodes.OK, homepage, 'Homepage data fetched successfully');
});

/**
 * Replace homepage content (Full update)
 * PUT /api/homepage or /api/v1/homepage
 */
export const updateHomepage = catchAsync(async (req, res) => {
  let homepage = await Homepage.findOne();
  
  if (!homepage) {
    homepage = new Homepage(req.body);
    if (req.user) {
      homepage.createdBy = req.user.email || req.user.id;
    }
  } else {
    homepage.set(req.body);
  }

  if (req.user) {
    homepage.updatedBy = req.user.email || req.user.id;
  }

  await homepage.save();
  return sendSuccess(res, StatusCodes.OK, homepage, 'Homepage data updated successfully');
});

/**
 * Partially update homepage content
 * PATCH /api/homepage or /api/v1/homepage
 */
export const patchHomepage = catchAsync(async (req, res) => {
  let homepage = await Homepage.findOne();

  if (!homepage) {
    homepage = new Homepage(req.body);
    if (req.user) {
      homepage.createdBy = req.user.email || req.user.id;
    }
  } else {
    const { emergency, appointmentCTA, statistics } = req.body;
    
    if (emergency) {
      homepage.emergency = {
        ...homepage.emergency?.toObject(),
        ...emergency
      };
    }
    
    if (appointmentCTA) {
      homepage.appointmentCTA = {
        ...homepage.appointmentCTA?.toObject(),
        ...appointmentCTA
      };
    }
    
    if (statistics) {
      homepage.statistics = {
        ...homepage.statistics?.toObject(),
        ...statistics
      };
    }
  }

  if (req.user) {
    homepage.updatedBy = req.user.email || req.user.id;
  }

  await homepage.save();
  return sendSuccess(res, StatusCodes.OK, homepage, 'Homepage data updated successfully');
});
