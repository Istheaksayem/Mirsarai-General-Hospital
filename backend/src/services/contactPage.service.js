import { StatusCodes } from 'http-status-codes';
import ContactPage from '../models/contactPage.model.js';
import ApiError from '../utils/ApiError.js';

export const getPublicContactPage = async () => {
  const page = await ContactPage.findOne().lean();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Contact page content not found');
  }
  return page;
};

export const getAdminContactPage = async () => {
  const page = await ContactPage.findOne();
  if (!page) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Contact page content not found');
  }
  return page;
};

export const updateContactPage = async (data, userId) => {
  let page = await ContactPage.findOne();
  if (!page) {
    page = new ContactPage();
    page.createdBy = userId;
  }
  page.set(data);
  page.updatedBy = userId;
  await page.save();
  return page;
};
