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
 * Generate a URL-safe slug from a name string
 */
const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

/**
 * Generate a unique slug, appending a number suffix if needed
 */
const generateUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let count = 0;
  // Check both DoctorProfile and Doctor collections to avoid URL conflicts
  while (true) {
    const existingProfile = await DoctorProfile.findOne({ slug }).lean();
    if (!existingProfile) break;
    count++;
    slug = `${baseSlug}-${count}`;
  }
  return slug;
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
 * Auto-generates slug, experienceLabel; caches phone/email from User
 */
export const createOrUpdateMyProfile = async (userId, data) => {
  // Strip admin-only fields so doctor cannot overwrite them
  const adminFields = ['department', 'designation', 'branch', 'employmentType'];
  const doctorData = { ...data };
  adminFields.forEach(f => delete doctorData[f]);

  // Fetch the user for fullName, phone, email
  const user = await User.findById(userId).lean();
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  let profile = await DoctorProfile.findOne({ userId });

  if (!profile) {
    // ── First-time profile creation ──────────────────────────────────────
    const doctorCode = await generateDoctorCode();

    // Auto-generate slug from provided name.en or user's fullName
    const nameEn = doctorData.name?.en || user.fullName || '';
    const baseSlug = generateSlug(nameEn);
    const slug = await generateUniqueSlug(baseSlug || `doctor-${doctorCode.toLowerCase()}`);

    // Auto-generate experience label from experience years
    if (doctorData.experience !== undefined && doctorData.experience !== null) {
      const yrs = doctorData.experience;
      doctorData.experienceLabel = { en: `${yrs}+ Years`, bn: `${yrs}+ বছর` };
    }

    // Cache phone/email from User
    doctorData.phone = doctorData.phone || user.phone || '';
    doctorData.email = doctorData.email || user.email || '';

    // Set name.en from user fullName if not provided
    if (!doctorData.name?.en) {
      doctorData.name = { en: user.fullName || '', bn: doctorData.name?.bn || '' };
    }

    // Copy profilePhoto to image
    if (doctorData.profilePhoto) {
      doctorData.image = doctorData.profilePhoto;
    }

    // Set visibility to published on successful completion
    doctorData.profileVisibility = 'published';

    profile = await DoctorProfile.create({
      userId,
      doctorCode,
      slug,
      ...doctorData,
    });

    // Mark profile as completed on the User
    await User.findByIdAndUpdate(userId, { profileCompleted: true });
  } else {
    // ── Update existing profile ──────────────────────────────────────────

    // Regenerate experience label if years changed
    if (doctorData.experience !== undefined && doctorData.experience !== null) {
      const yrs = doctorData.experience;
      doctorData.experienceLabel = { en: `${yrs}+ Years`, bn: `${yrs}+ বছর` };
    }

    // Cache phone/email from User if not explicitly provided
    if (!doctorData.phone) doctorData.phone = user.phone || profile.phone || '';
    if (!doctorData.email) doctorData.email = user.email || profile.email || '';

    // Copy profilePhoto to image if provided
    if (doctorData.profilePhoto) {
      doctorData.image = doctorData.profilePhoto;
    } else if (!doctorData.image && profile.profilePhoto) {
      doctorData.image = profile.profilePhoto;
    }

    // Set visibility to published (if transitioning from draft)
    doctorData.profileVisibility = 'published';

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
