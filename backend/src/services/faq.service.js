import { StatusCodes } from 'http-status-codes';
import FAQ from '../models/faq.model.js';
import ApiError from '../utils/ApiError.js';

export const getPublicFAQ = async () => {
  const page = await FAQ.findOne().lean();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'FAQ content not found');
  }
  return page;
};

export const getAdminFAQ = async () => {
  const page = await FAQ.findOne();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'FAQ content not found');
  }
  return page;
};

export const updateFAQ = async (data, userId) => {
  let page = await FAQ.findOne();
  if (!page) {
    page = new FAQ(data);
    if (userId) page.createdBy = userId;
  } else {
    page.set(data);
  }
  if (userId) page.updatedBy = userId;
  await page.save();
  return page;
};
