import { StatusCodes } from 'http-status-codes';
import Footer from '../models/footer.model.js';
import ApiError from '../utils/ApiError.js';

export const getPublicFooter = async () => {
  const data = await Footer.findOne().lean();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Footer content not found');
  }
  return data;
};

export const getAdminFooter = async () => {
  const data = await Footer.findOne();
  if (!data) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Footer content not found');
  }
  return data;
};

export const updateFooter = async (data, userId) => {
  let footer = await Footer.findOne();
  if (!footer) {
    footer = new Footer();
    footer.createdBy = userId;
  }
  footer.set(data);
  footer.updatedBy = userId;
  await footer.save();
  return footer;
};
