import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import AboutUs from '../models/aboutUs.model.js';
import MissionVision from '../models/missionVision.model.js';
import Gallery from '../models/gallery.model.js';
import Career from '../models/career.model.js';

// ============================================
// ABOUT US CMS
// ============================================
export const getAboutUs = catchAsync(async (req, res) => {
  let data = await AboutUs.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'About Us content not found.');
  }
  return sendSuccess(res, StatusCodes.OK, data, 'About Us data fetched successfully');
});

export const updateAboutUs = catchAsync(async (req, res) => {
  let data = await AboutUs.findOne();
  if (!data) {
    data = new AboutUs(req.body);
    if (req.user) data.createdBy = req.user.email || req.user.id;
  } else {
    data.set(req.body);
  }
  if (req.user) data.updatedBy = req.user.email || req.user.id;
  await data.save();
  return sendSuccess(res, StatusCodes.OK, data, 'About Us data updated successfully');
});

// ============================================
// MISSION & VISION CMS
// ============================================
export const getMissionVision = catchAsync(async (req, res) => {
  let data = await MissionVision.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Mission & Vision content not found.');
  }
  return sendSuccess(res, StatusCodes.OK, data, 'Mission & Vision data fetched successfully');
});

export const updateMissionVision = catchAsync(async (req, res) => {
  let data = await MissionVision.findOne();
  if (!data) {
    data = new MissionVision(req.body);
    if (req.user) data.createdBy = req.user.email || req.user.id;
  } else {
    data.set(req.body);
  }
  if (req.user) data.updatedBy = req.user.email || req.user.id;
  await data.save();
  return sendSuccess(res, StatusCodes.OK, data, 'Mission & Vision data updated successfully');
});

// ============================================
// GALLERY CMS
// ============================================
export const getGallery = catchAsync(async (req, res) => {
  let data = await Gallery.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Gallery content not found.');
  }
  return sendSuccess(res, StatusCodes.OK, data, 'Gallery data fetched successfully');
});

export const updateGallery = catchAsync(async (req, res) => {
  let data = await Gallery.findOne();
  if (!data) {
    data = new Gallery(req.body);
    if (req.user) data.createdBy = req.user.email || req.user.id;
  } else {
    data.set(req.body);
  }
  if (req.user) data.updatedBy = req.user.email || req.user.id;
  await data.save();
  return sendSuccess(res, StatusCodes.OK, data, 'Gallery data updated successfully');
});

// Add dynamic gallery image
export const addGalleryImage = catchAsync(async (req, res) => {
  let data = await Gallery.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Gallery content not found.');
  }
  
  // Find highest current ID to generate a new sequential one
  const highestId = data.images.reduce((max, img) => (img.id > max ? img.id : max), 0);
  const newImage = {
    id: highestId + 1,
    ...req.body
  };

  data.images.push(newImage);
  if (req.user) data.updatedBy = req.user.email || req.user.id;
  await data.save();
  return sendSuccess(res, StatusCodes.CREATED, newImage, 'Gallery image added successfully');
});

// Delete dynamic gallery image
export const deleteGalleryImage = catchAsync(async (req, res) => {
  let data = await Gallery.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Gallery content not found.');
  }
  
  const imageId = parseInt(req.params.id, 10);
  const initialLength = data.images.length;
  data.images = data.images.filter(img => img.id !== imageId);

  if (data.images.length === initialLength) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Image not found.');
  }

  if (req.user) data.updatedBy = req.user.email || req.user.id;
  await data.save();
  return sendSuccess(res, StatusCodes.OK, null, 'Gallery image deleted successfully');
});

// ============================================
// CAREER CMS
// ============================================
export const getCareer = catchAsync(async (req, res) => {
  let data = await Career.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Career content not found.');
  }
  return sendSuccess(res, StatusCodes.OK, data, 'Career data fetched successfully');
});

export const updateCareer = catchAsync(async (req, res) => {
  let data = await Career.findOne();
  if (!data) {
    data = new Career(req.body);
    if (req.user) data.createdBy = req.user.email || req.user.id;
  } else {
    data.set(req.body);
  }
  if (req.user) data.updatedBy = req.user.email || req.user.id;
  await data.save();
  return sendSuccess(res, StatusCodes.OK, data, 'Career data updated successfully');
});

// Add dynamic job listing
export const addCareerPosition = catchAsync(async (req, res) => {
  let data = await Career.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Career content not found.');
  }
  
  const highestId = data.openPositions.reduce((max, pos) => (pos.id > max ? pos.id : max), 0);
  const newPosition = {
    id: highestId + 1,
    ...req.body
  };

  data.openPositions.push(newPosition);
  if (req.user) data.updatedBy = req.user.email || req.user.id;
  await data.save();
  return sendSuccess(res, StatusCodes.CREATED, newPosition, 'Career position added successfully');
});

// Delete dynamic job listing
export const deleteCareerPosition = catchAsync(async (req, res) => {
  let data = await Career.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Career content not found.');
  }
  
  const positionId = parseInt(req.params.id, 10);
  const initialLength = data.openPositions.length;
  data.openPositions = data.openPositions.filter(pos => pos.id !== positionId);

  if (data.openPositions.length === initialLength) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Position not found.');
  }

  if (req.user) data.updatedBy = req.user.email || req.user.id;
  await data.save();
  return sendSuccess(res, StatusCodes.OK, null, 'Career position deleted successfully');
});

// ============================================
// IMAGE UPLOAD CMS
// ============================================
export const uploadCMSImage = catchAsync(async (req, res) => {
  const { base64Data } = req.body;
  if (!base64Data) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing image data');
  }

  // Parse mime type and base64 string
  const mimeTypeMatch = base64Data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
  if (!mimeTypeMatch) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid base64 image encoding');
  }
  
  const mimeType = mimeTypeMatch[1];
  const extension = mimeType.split('/')[1] || 'png';
  const base64ImageString = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");

  // Generate unique file name
  const filename = `${crypto.randomBytes(16).toString('hex')}.${extension}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  // Create folder if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, base64ImageString, 'base64');

  // Build the relative or absolute public URL
  const fileUrl = `/uploads/${filename}`;

  return sendSuccess(res, StatusCodes.OK, { url: fileUrl }, 'Image uploaded successfully');
});
