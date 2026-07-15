import ReceptionistProfile from '../models/receptionistProfile.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const generateReceptionistCode = async () => {
  const lastProfile = await ReceptionistProfile.findOne(
    { receptionistCode: { $exists: true, $ne: null } },
    { receptionistCode: 1 }
  ).sort({ receptionistCode: -1 }).lean();

  let nextNum = 1;
  if (lastProfile?.receptionistCode) {
    const match = lastProfile.receptionistCode.match(/REC-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  return `REC-${String(nextNum).padStart(5, '0')}`;
};

export const getMyProfile = async (userId) => {
  const profile = await ReceptionistProfile.findOne({ userId, isDeleted: { $ne: true } }).lean();
  if (!profile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Receptionist profile not found. Please complete your profile.');
  }
  return profile;
};

export const createOrUpdateMyProfile = async (userId, data) => {
  const adminFields = ['department', 'designation', 'branch', 'employmentType'];
  const receptionistData = { ...data };
  adminFields.forEach(f => delete receptionistData[f]);

  let profile = await ReceptionistProfile.findOne({ userId });

  if (!profile) {
    const receptionistCode = await generateReceptionistCode();
    profile = await ReceptionistProfile.create({
      userId,
      receptionistCode,
      ...receptionistData,
    });

    await User.findByIdAndUpdate(userId, { profileCompleted: true });
  } else {
    profile = await ReceptionistProfile.findOneAndUpdate(
      { userId },
      { $set: receptionistData },
      { new: true, runValidators: true }
    );

    await User.findByIdAndUpdate(userId, { profileCompleted: true });
  }

  return profile;
};
