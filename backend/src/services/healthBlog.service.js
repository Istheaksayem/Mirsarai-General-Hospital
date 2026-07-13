import { StatusCodes } from 'http-status-codes';
import HealthBlog from '../models/healthBlog.model.js';
import ApiError from '../utils/ApiError.js';

export const getPublicHealthBlog = async () => {
  const page = await HealthBlog.findOne().lean();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Health Blog content not found');
  }
  return page;
};

export const getAdminHealthBlog = async () => {
  const page = await HealthBlog.findOne();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Health Blog content not found');
  }
  return page;
};

export const updateHealthBlog = async (data, userId) => {
  let page = await HealthBlog.findOne();
  if (!page) {
    page = new HealthBlog(data);
    if (userId) page.createdBy = userId;
  } else {
    page.set(data);
  }
  if (userId) page.updatedBy = userId;
  await page.save();
  return page;
};
