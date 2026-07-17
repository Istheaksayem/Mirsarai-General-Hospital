import Specialization from '../models/specialization.model.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const generateSlug = (name) =>
  name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();

// ── PUBLIC ─────────────────────────────────────────────────────────────────────

export const getPublicSpecializations = async (departmentSlug) => {
  const filter = { isVisible: true };
  if (departmentSlug) filter.departmentSlug = departmentSlug;
  return Specialization.find(filter).sort({ displayOrder: 1 }).lean();
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

export const getAdminSpecializations = async ({ page = 1, limit = 50, search, departmentSlug } = {}) => {
  const filter = {};
  if (departmentSlug) filter.departmentSlug = departmentSlug;
  if (search) {
    filter.$or = [
      { 'name.en': { $regex: search, $options: 'i' } },
      { 'name.bn': { $regex: search, $options: 'i' } },
    ];
  }
  const pageNum = parseInt(page, 10);
  const limitNum = Math.min(parseInt(limit, 10), 200);
  const skip = (pageNum - 1) * limitNum;
  const [specializations, total] = await Promise.all([
    Specialization.find(filter).sort({ displayOrder: 1 }).skip(skip).limit(limitNum).lean(),
    Specialization.countDocuments(filter),
  ]);
  return { specializations, total, page: pageNum, limit: limitNum };
};

export const getAdminSpecializationById = async (id) => {
  const spec = await Specialization.findById(id).lean();
  if (!spec) throw new ApiError(StatusCodes.NOT_FOUND, 'Specialization not found');
  return spec;
};

export const createSpecialization = async (data, userId) => {
  if (!data.slug) {
    const base = generateSlug(data.name?.en || '');
    let slug = base; let count = 0;
    while (await Specialization.findOne({ slug })) { count++; slug = `${base}-${count}`; }
    data.slug = slug;
  }
  return Specialization.create({ ...data, createdBy: userId, updatedBy: userId });
};

export const updateSpecialization = async (id, data, userId) => {
  const spec = await Specialization.findById(id);
  if (!spec) throw new ApiError(StatusCodes.NOT_FOUND, 'Specialization not found');
  return Specialization.findByIdAndUpdate(
    id,
    { $set: { ...data, updatedBy: userId } },
    { new: true, runValidators: true }
  );
};

export const deleteSpecialization = async (id) => {
  const spec = await Specialization.findByIdAndDelete(id);
  if (!spec) throw new ApiError(StatusCodes.NOT_FOUND, 'Specialization not found');
  return spec;
};

export const reorderSpecializations = async (orderUpdates) => {
  const ops = orderUpdates.map(({ id, displayOrder }) => ({
    updateOne: { filter: { _id: id }, update: { $set: { displayOrder } } },
  }));
  await Specialization.bulkWrite(ops);
};
