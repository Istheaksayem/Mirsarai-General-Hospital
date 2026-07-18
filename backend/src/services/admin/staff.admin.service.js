import User from '../../models/user.model.js';
import DoctorProfile from '../../models/doctorProfile.model.js';
import ReceptionistProfile from '../../models/receptionistProfile.model.js';
import LabAdminProfile from '../../models/labAdminProfile.model.js';
import ApiError from '../../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const STAFF_ROLES = ['admin', 'doctor', 'reception', 'lab'];

const PROFILE_ROLES = {
  doctor: DoctorProfile,
  reception: ReceptionistProfile,
  lab: LabAdminProfile,
};

/**
 * Get all staff members, optionally filtered by role
 */
export const getAllStaff = async ({ role } = {}) => {
  const filter = { role: { $in: STAFF_ROLES } };
  if (role) filter.role = role;

  const users = await User.find(filter)
    .select('-password -otp -otpExpires -updatedBy')
    .sort({ createdAt: -1 })
    .lean();

  const staff = await Promise.all(
    users.map(async (user) => {
      const profileModel = PROFILE_ROLES[user.role];
      let profile = null;
      if (profileModel) {
        profile = await profileModel.findOne({ userId: user._id }).lean();
      }
      return { ...user, profile };
    })
  );

  return staff;
};

/**
 * Get single staff member by ID
 */
export const getStaffById = async (id) => {
  const user = await User.findById(id)
    .select('-password -otp -otpExpires -updatedBy')
    .lean();
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Staff member not found');
  if (!STAFF_ROLES.includes(user.role))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  const profileModel = PROFILE_ROLES[user.role];
  let profile = null;
  if (profileModel) {
    profile = await profileModel.findOne({ userId: user._id }).lean();
  }

  return { ...user, profile };
};

/**
 * Update staff member basic info (fullName, email, phone)
 * Protected fields (role, isActive, accountStatus, password, etc.) are stripped.
 */
export const updateStaff = async (id, data, adminId) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Staff member not found');
  if (!STAFF_ROLES.includes(user.role))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  const protectedFields = [
    'role', 'approvalStatus', 'isActive', 'accountStatus',
    'password', 'isVerified', 'profileCompleted',
  ];
  for (const field of protectedFields) {
    if (data[field] !== undefined) delete data[field];
  }

  const allowedFields = ['fullName', 'email', 'phone'];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  if (Object.keys(updateData).length === 0)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No valid fields to update');

  const updated = await User.findByIdAndUpdate(
    id,
    { $set: { ...updateData, updatedBy: adminId } },
    { new: true, runValidators: true }
  ).select('-password -otp -otpExpires -updatedBy');

  return updated;
};

/**
 * Soft-delete a staff account — immediately loses all access
 */
export const deleteStaff = async (id, adminId) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Staff member not found');
  if (!STAFF_ROLES.includes(user.role))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  user.isActive = false;
  user.accountStatus = 'inactive';
  user.updatedBy = adminId;
  await user.save();

  return { message: 'Staff account deactivated and removed' };
};

/**
 * Activate a staff account — restores dashboard access
 */
export const activateStaff = async (id, adminId) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Staff member not found');
  if (!STAFF_ROLES.includes(user.role))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  user.isActive = true;
  user.accountStatus = 'active';
  user.updatedBy = adminId;
  await user.save();

  return user.toJSON();
};

/**
 * Deactivate a staff account — immediately loses all access
 */
export const deactivateStaff = async (id, adminId) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Staff member not found');
  if (!STAFF_ROLES.includes(user.role))
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  user.isActive = false;
  user.accountStatus = 'inactive';
  user.updatedBy = adminId;
  await user.save();

  return user.toJSON();
};
