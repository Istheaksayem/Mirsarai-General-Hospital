import DoctorProfile from '../models/doctorProfile.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Auto-generate the next doctor code
 * Format: DOC-00001, DOC-00002, etc.
 */
const generateDoctorCode = async () => {
  const lastProfile = await DoctorProfile.findOne(
    { doctorCode: { $exists: true, $ne: null } },
    { doctorCode: 1 }
  ).sort({ doctorCode: -1 }).lean();

  let nextNum = 1;
  if (lastProfile?.doctorCode) {
    const match = lastProfile.doctorCode.match(/DOC-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  return `DOC-${String(nextNum).padStart(5, '0')}`;
};

/**
 * Get the authenticated doctor's own profile
 */
export const getMyProfile = async (userId) => {
  const profile = await DoctorProfile.findOne({ userId, isDeleted: { $ne: true } }).lean();
  if (!profile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor profile not found. Please complete your profile.');
  }
  return profile;
};

/**
 * Create or update the authenticated doctor's profile
 * On first creation: generates doctorCode, sets profileCompleted=true on User
 */
export const createOrUpdateMyProfile = async (userId, data) => {
  // Strip admin-only fields so doctor cannot overwrite them
  const adminFields = ['department', 'designation', 'branch', 'employmentType'];
  const doctorData = { ...data };
  adminFields.forEach(f => delete doctorData[f]);

  let profile = await DoctorProfile.findOne({ userId });

  if (!profile) {
    // First-time profile creation
    const doctorCode = await generateDoctorCode();
    profile = await DoctorProfile.create({
      userId,
      doctorCode,
      ...doctorData,
    });

    // Mark profile as completed on the User
    await User.findByIdAndUpdate(userId, { profileCompleted: true });
  } else {
    // Update existing profile
    profile = await DoctorProfile.findOneAndUpdate(
      { userId },
      { $set: doctorData },
      { new: true, runValidators: true }
    );

    // Ensure profile is marked completed (in case it wasn't)
    await User.findByIdAndUpdate(userId, { profileCompleted: true });
  }

  return profile;
};
