import LabAdminProfile from '../models/labAdminProfile.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const generateLabAdminCode = async () => {
  const lastProfile = await LabAdminProfile.findOne(
    { labAdminCode: { $exists: true, $ne: null } },
    { labAdminCode: 1 }
  ).sort({ labAdminCode: -1 }).lean();

  let nextNum = 1;
  if (lastProfile?.labAdminCode) {
    const match = lastProfile.labAdminCode.match(/LAB-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  return `LAB-${String(nextNum).padStart(5, '0')}`;
};

export const getMyProfile = async (userId) => {
  const profile = await LabAdminProfile.findOne({ userId, isDeleted: { $ne: true } }).lean();
  if (!profile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Lab admin profile not found. Please complete your profile.');
  }
  return profile;
};

export const createOrUpdateMyProfile = async (userId, data) => {
  const adminFields = ['department', 'designation', 'branch', 'employmentType'];
  const labAdminData = { ...data };
  adminFields.forEach(f => delete labAdminData[f]);

  let profile = await LabAdminProfile.findOne({ userId });

  if (!profile) {
    const labAdminCode = await generateLabAdminCode();
    profile = await LabAdminProfile.create({
      userId,
      labAdminCode,
      ...labAdminData,
    });

    await User.findByIdAndUpdate(userId, { profileCompleted: true });
  } else {
    profile = await LabAdminProfile.findOneAndUpdate(
      { userId },
      { $set: labAdminData },
      { new: true, runValidators: true }
    );

    await User.findByIdAndUpdate(userId, { profileCompleted: true });
  }

  return profile;
};
