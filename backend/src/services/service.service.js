import { StatusCodes } from 'http-status-codes';
import Service from '../models/service.model.js';
import ApiError from '../utils/ApiError.js';

export const getPublicServices = async () => {
  return Service.find({ isVisible: true })
    .populate('doctors', 'name designation image department')
    .sort({ displayOrder: 1 });
};

export const getAdminServices = async (filters = {}) => {
  const {
    page = 1,
    limit = 50,
    search,
  } = filters;

  const query = {};
  if (search) {
    query['name.en'] = { $regex: search, $options: 'i' };
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const limitNum = parseInt(limit, 10);

  const [services, total] = await Promise.all([
    Service.find(query)
      .populate('doctors', 'name designation image department')
      .sort({ displayOrder: 1 })
      .skip(skip)
      .limit(limitNum),
    Service.countDocuments(query),
  ]);

  return { services, total, page: parseInt(page, 10), limit: limitNum };
};

export const getServiceById = async (id) => {
  const service = await Service.findById(id).populate(
    'doctors',
    'name designation image department'
  );
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found');
  }
  return service;
};

export const createService = async (data, userId) => {
  const slug = data.slug || data.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const existing = await Service.findOne({ slug });
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Service with this slug already exists');
  }

  return Service.create({
    ...data,
    slug,
    createdBy: userId,
  });
};

export const updateService = async (id, data, userId) => {
  const service = await Service.findByIdAndUpdate(
    id,
    { ...data, updatedBy: userId },
    { new: true, runValidators: true }
  ).populate('doctors', 'name designation image department');

  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found');
  }
  return service;
};

export const deleteService = async (id) => {
  const service = await Service.findByIdAndDelete(id);
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Service not found');
  }
  return service;
};

export const reorderServices = async (orderUpdates) => {
  const ops = orderUpdates.map(({ id, displayOrder }) => ({
    updateOne: {
      filter: { _id: id },
      update: { displayOrder },
    },
  }));
  await Service.bulkWrite(ops);
};
