import Department from '../models/department.model.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const generateSlug = (name) =>
  name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();

// ── PUBLIC ────────────────────────────────────────────────────────────────────

/**
 * Get all visible departments for public frontend
 * Supports ?lang=bn or Accept-Language header for bilingual projection
 */
export const getPublicDepartments = async (lang = 'en') => {
  const departments = await Department.find({ isVisible: true })
    .sort({ displayOrder: 1, 'name.en': 1 })
    .lean();

  // Project bilingual fields to flat strings for frontend compatibility
  return departments.map(d => projectBilingual(d, lang));
};

/**
 * Get single department by slug (public)
 */
export const getPublicDepartmentBySlug = async (slug, lang = 'en') => {
  const dept = await Department.findOne({ slug, isVisible: true }).lean();
  if (!dept) throw new ApiError(StatusCodes.NOT_FOUND, 'Department not found');
  return projectBilingual(dept, lang);
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

/**
 * Get all departments for admin CMS (raw bilingual objects, paginated)
 */
export const getAdminDepartments = async ({
  page = 1, limit = 20, search, isVisible, sortBy = 'displayOrder', sortOrder = 'asc'
} = {}) => {
  const filter = {};
  if (isVisible !== undefined) filter.isVisible = isVisible === 'true';
  if (search) {
    filter.$or = [
      { 'name.en': { $regex: search, $options: 'i' } },
      { 'name.bn': { $regex: search, $options: 'i' } },
      { slug:       { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum  = parseInt(page, 10);
  const limitNum = Math.min(parseInt(limit, 10), 100);
  const skip     = (pageNum - 1) * limitNum;
  const sortDir  = sortOrder === 'asc' ? 1 : -1;

  const [departments, total] = await Promise.all([
    Department.find(filter).select('-__v').sort({ [sortBy]: sortDir }).skip(skip).limit(limitNum).lean(),
    Department.countDocuments(filter),
  ]);
  return { departments, total, page: pageNum, limit: limitNum };
};

/**
 * Get single department by ID for admin
 */
export const getAdminDepartmentById = async (id) => {
  const dept = await Department.findById(id).select('-__v').lean();
  if (!dept) throw new ApiError(StatusCodes.NOT_FOUND, 'Department not found');
  return dept;
};

/**
 * Create department
 */
export const createDepartment = async (data, userId) => {
  if (!data.slug) {
    const base = generateSlug(data.name?.en || '');
    let slug = base; let count = 0;
    while (await Department.findOne({ slug })) { count++; slug = `${base}-${count}`; }
    data.slug = slug;
  } else {
    const existing = await Department.findOne({ slug: data.slug });
    if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Slug already exists');
  }
  return Department.create({ ...data, createdBy: userId, updatedBy: userId });
};

/**
 * Update department (full or partial via $set)
 */
export const updateDepartment = async (id, data, userId) => {
  const dept = await Department.findById(id);
  if (!dept) throw new ApiError(StatusCodes.NOT_FOUND, 'Department not found');
  if (data.slug && data.slug !== dept.slug) {
    const existing = await Department.findOne({ slug: data.slug, _id: { $ne: id } });
    if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Slug already in use');
  }
  return Department.findByIdAndUpdate(
    id,
    { $set: { ...data, updatedBy: userId } },
    { new: true, runValidators: true }
  ).select('-__v');
};

/**
 * Delete department
 */
export const deleteDepartment = async (id) => {
  const dept = await Department.findByIdAndDelete(id);
  if (!dept) throw new ApiError(StatusCodes.NOT_FOUND, 'Department not found');
  return dept;
};

/**
 * Toggle department visibility
 */
export const toggleDepartmentVisibility = async (id, userId) => {
  const dept = await Department.findById(id);
  if (!dept) throw new ApiError(StatusCodes.NOT_FOUND, 'Department not found');
  dept.isVisible = !dept.isVisible;
  dept.updatedBy = userId;
  await dept.save();
  return dept;
};

/**
 * Bulk reorder departments
 * body: [{ id, displayOrder }]
 */
export const reorderDepartments = async (orderUpdates) => {
  const ops = orderUpdates.map(({ id, displayOrder }) => ({
    updateOne: { filter: { _id: id }, update: { $set: { displayOrder } } },
  }));
  await Department.bulkWrite(ops);
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Project bilingual fields to flat strings for a given language
 * Converts { name: {en, bn}, ... } to { name: "...", ... }
 */
function projectBilingual(dept, lang = 'en') {
  const L = (field) => (field ? (field[lang] || field.en || '') : '');
  return {
    id:               dept._id,
    slug:             dept.slug,
    name:             L(dept.name),
    icon:             dept.icon,
    image:            dept.image,
    shortDescription: L(dept.shortDescription),
    description:      L(dept.description),
    services:         (dept.services || []).map(s => L(s)),
    headDoctor:       L(dept.headDoctor),
    availableDoctors: dept.availableDoctors,
    available:        dept.available,
    isVisible:        dept.isVisible,
    displayOrder:     dept.displayOrder,
  };
}
