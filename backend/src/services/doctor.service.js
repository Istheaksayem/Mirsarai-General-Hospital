import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import DoctorProfile from '../models/doctorProfile.model.js';
import ReceptionistProfile from '../models/receptionistProfile.model.js';
import LabAdminProfile from '../models/labAdminProfile.model.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';
import { PAGINATION } from '../constants/index.js';

/**
 * Auto-generate slug from English name
 */
const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// ── PUBLIC QUERIES ────────────────────────────────────────────────────────────

/**
 * Get all doctors for public frontend
 * Returns only visible and relevant fields
 */
export const getPublicDoctors = async () => {
  return Doctor.find({ isVisible: true, status: { $ne: 'inactive' } })
    .select('-__v -createdBy -updatedBy -seo -galleryImages -bannerImage -appointmentsToday')
    .sort({ featured: -1, displayOrder: 1, 'name.en': 1 })
    .lean();
};

/**
 * Get single doctor by slug for public frontend
 */
export const getPublicDoctorBySlug = async (slug) => {
  const doctor = await Doctor.findOne({ slug, isVisible: true })
    .select('-__v -createdBy -updatedBy')
    .lean();
  if (!doctor) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  return doctor;
};

/**
 * Get featured doctors (for homepage section)
 */
export const getFeaturedDoctors = async (limit = 4) => {
  return Doctor.find({ isVisible: true, featured: true, status: 'active' })
    .select('name slug specialization department designation image consultationFee experience available')
    .sort({ displayOrder: 1 })
    .limit(limit)
    .lean();
};

// ── ADMIN CMS QUERIES ─────────────────────────────────────────────────────────

/**
 * Get all doctors for admin CMS with filters + pagination
 */
export const getAdminDoctors = async ({
  page = 1,
  limit = 10,
  status,
  department,
  featured,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
} = {}) => {
  const filter = {};
  if (status)     filter.status = status;
  if (department) filter['department.en'] = { $regex: department, $options: 'i' };
  if (featured !== undefined) filter.featured = featured === 'true';
  if (search) {
    filter.$or = [
      { 'name.en':           { $regex: search, $options: 'i' } },
      { 'specialization.en': { $regex: search, $options: 'i' } },
      { 'department.en':     { $regex: search, $options: 'i' } },
      { email:               { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum    = parseInt(page, 10);
  const limitNum   = Math.min(parseInt(limit, 10), PAGINATION.MAX_LIMIT);
  const skip       = (pageNum - 1) * limitNum;
  const sortDir    = sortOrder === 'asc' ? 1 : -1;

  const [doctors, total] = await Promise.all([
    Doctor.find(filter).select('-__v').sort({ [sortBy]: sortDir }).skip(skip).limit(limitNum).lean(),
    Doctor.countDocuments(filter),
  ]);

  return { doctors, total, page: pageNum, limit: limitNum };
};

/**
 * Get single doctor by ID for admin
 */
export const getAdminDoctorById = async (id) => {
  const doctor = await Doctor.findById(id).select('-__v').lean();
  if (!doctor) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  return doctor;
};

// ── MUTATIONS ─────────────────────────────────────────────────────────────────

/**
 * Create doctor
 */
export const createDoctor = async (data, userId) => {
  // Auto-generate slug if not provided
  if (!data.slug) {
    const base = generateSlug(data.name.en);
    let slug = base;
    let count = 0;
    while (await Doctor.findOne({ slug })) {
      count++;
      slug = `${base}-${count}`;
    }
    data.slug = slug;
  } else {
    // Check slug uniqueness
    const existing = await Doctor.findOne({ slug: data.slug });
    if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Slug already exists');
  }

  // Auto-generate experience label from years if not provided
  if (data.experience?.years && !data.experience?.label?.en) {
    const yrs = data.experience.years;
    data.experience.label = { en: `${yrs}+ Years`, bn: `${yrs}+ বছর` };
  }

  const doctor = await Doctor.create({ ...data, createdBy: userId, updatedBy: userId });
  return doctor;
};

/**
 * Update doctor (full or partial)
 */
export const updateDoctor = async (id, data, userId) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');

  // If slug is changing, check uniqueness
  if (data.slug && data.slug !== doctor.slug) {
    const existing = await Doctor.findOne({ slug: data.slug, _id: { $ne: id } });
    if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Slug already in use');
  }

  // Regenerate experience label if years changed
  if (data.experience?.years && !data.experience?.label?.en) {
    const yrs = data.experience.years;
    data.experience.label = { en: `${yrs}+ Years`, bn: `${yrs}+ বছর` };
  }

  const updated = await Doctor.findByIdAndUpdate(
    id,
    { $set: { ...data, updatedBy: userId } },
    { new: true, runValidators: true }
  ).select('-__v');

  return updated;
};

/**
 * Toggle doctor visibility
 */
export const toggleDoctorVisibility = async (id, userId) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  doctor.isVisible = !doctor.isVisible;
  doctor.updatedBy = userId;
  await doctor.save();
  return doctor;
};

/**
 * Toggle doctor featured status
 */
export const toggleDoctorFeatured = async (id, userId) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  doctor.featured = !doctor.featured;
  doctor.updatedBy = userId;
  await doctor.save();
  return doctor;
};

/**
 * Delete doctor
 */
export const deleteDoctor = async (id) => {
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');
  return doctor;
};

/**
 * Reorder doctors (update displayOrder for multiple)
 */
export const reorderDoctors = async (orderUpdates) => {
  const ops = orderUpdates.map(({ id, displayOrder }) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { displayOrder } },
    },
  }));
  await Doctor.bulkWrite(ops);
};

/**
 * Get department list (unique)
 */
export const getDepartments = async () => {
  return Doctor.distinct('department.en', { isVisible: true });
};

// ── STAFF REGISTRATION APPROVAL ────────────────────────────────────────────────

const STAFF_ROLES = ['doctor', 'reception', 'lab'];

/**
 * Get all pending staff registrations
 */
export const getPendingRegistrations = async () => {
  return User.find({ role: { $in: STAFF_ROLES }, approvalStatus: 'pending' })
    .select('_id fullName email phone role createdAt')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Approve a staff registration
 */
export const approveRegistration = async (userId, adminId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  if (!STAFF_ROLES.includes(user.role)) throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  user.approvalStatus = 'approved';
  user.accountStatus = 'active';
  user.isActive = true;
  user.updatedBy = adminId;
  await user.save();

  return user.toJSON();
};

/**
 * Reject a staff registration
 */
export const rejectRegistration = async (userId, adminId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  if (!STAFF_ROLES.includes(user.role)) throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  user.approvalStatus = 'rejected';
  user.updatedBy = adminId;
  await user.save();

  return user.toJSON();
};

/**
 * Generate the next sequential doctor code (DOC-00001, DOC-00002, …)
 */
const generateNextDoctorCode = async () => {
  const lastProfile = await DoctorProfile.findOne({})
    .sort({ doctorCode: -1 })
    .select('doctorCode')
    .lean();
  if (!lastProfile) return 'DOC-00001';
  const lastNum = parseInt(lastProfile.doctorCode.replace('DOC-'), 10);
  return `DOC-${String(lastNum + 1).padStart(5, '0')}`;
};

/**
 * Assign admin-only info to a staff profile (department, designation, branch, employmentType)
 * Works for doctor, reception, and lab roles
 */
export const assignAdminInfo = async (userId, adminData, adminId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  if (!STAFF_ROLES.includes(user.role)) throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  const adminFields = {
    department: adminData.department,
    designation: adminData.designation,
    branch: adminData.branch || '',
    employmentType: adminData.employmentType || '',
  };

  if (user.role === 'doctor') {
    let profile = await DoctorProfile.findOne({ userId });

    if (!profile) {
      const doctorCode = await generateNextDoctorCode();
      profile = await DoctorProfile.create({
        userId,
        doctorCode,
        ...adminFields,
      });
    } else {
      profile = await DoctorProfile.findOneAndUpdate(
        { userId },
        { $set: adminFields },
        { new: true, runValidators: true }
      );
    }

    return profile;
  }

  if (user.role === 'reception') {
    let profile = await ReceptionistProfile.findOne({ userId });

    if (!profile) {
      const receptionistCode = await generateNextReceptionistCode();
      profile = await ReceptionistProfile.create({
        userId,
        receptionistCode,
        ...adminFields,
      });
    } else {
      profile = await ReceptionistProfile.findOneAndUpdate(
        { userId },
        { $set: adminFields },
        { new: true, runValidators: true }
      );
    }

    return profile;
  }

  if (user.role === 'lab') {
    let profile = await LabAdminProfile.findOne({ userId });

    if (!profile) {
      const labAdminCode = await generateNextLabAdminCode();
      profile = await LabAdminProfile.create({
        userId,
        labAdminCode,
        ...adminFields,
      });
    } else {
      profile = await LabAdminProfile.findOneAndUpdate(
        { userId },
        { $set: adminFields },
        { new: true, runValidators: true }
      );
    }

    return profile;
  }
};

/**
 * Generate the next sequential receptionist code (REC-00001, REC-00002, …)
 */
const generateNextReceptionistCode = async () => {
  const lastProfile = await ReceptionistProfile.findOne({})
    .sort({ receptionistCode: -1 })
    .select('receptionistCode')
    .lean();
  if (!lastProfile) return 'REC-00001';
  const lastNum = parseInt(lastProfile.receptionistCode.replace('REC-'), 10);
  return `REC-${String(lastNum + 1).padStart(5, '0')}`;
};

/**
 * Generate the next sequential lab admin code (LAB-00001, LAB-00002, …)
 */
const generateNextLabAdminCode = async () => {
  const lastProfile = await LabAdminProfile.findOne({})
    .sort({ labAdminCode: -1 })
    .select('labAdminCode')
    .lean();
  if (!lastProfile) return 'LAB-00001';
  const lastNum = parseInt(lastProfile.labAdminCode.replace('LAB-'), 10);
  return `LAB-${String(lastNum + 1).padStart(5, '0')}`;
};

/**
 * Suspend an already-approved staff member
 */
export const suspendDoctor = async (userId, adminId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  if (!STAFF_ROLES.includes(user.role)) throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  user.accountStatus = 'suspended';
  user.updatedBy = adminId;
  await user.save();

  return user.toJSON();
};
