import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';
import DoctorProfile from '../models/doctorProfile.model.js';
import ReceptionistProfile from '../models/receptionistProfile.model.js';
import LabAdminProfile from '../models/labAdminProfile.model.js';
import Counter from '../models/counter.model.js';
import DoctorSchedule from '../models/doctorSchedule.model.js';
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

// ── TRANSFORM: DoctorProfile → Doctor shape ─────────────────────────────────────

/**
 * Transform a DoctorProfile document into the Doctor response shape
 * expected by the public frontend
 */
const transformProfileToDoctor = (profile, user) => ({
  _id: profile._id,
  slug: profile.slug || '',
  name: {
    en: profile.name?.en || user?.fullName || '',
    bn: profile.name?.bn || profile.name?.en || user?.fullName || '',
  },
  designation: {
    en: profile.designation?.en || profile.designation || '',
    bn: profile.designation?.bn || profile.designationBn || '',
  },
  specialization: {
    en: profile.specialization?.en || profile.specialization || '',
    bn: profile.specialization?.bn || profile.specializationBn || '',
  },
  department: {
    en: profile.department?.en || profile.department || '',
    bn: profile.department?.bn || profile.departmentBn || '',
  },
  qualification: profile.qualification?.en || profile.qualification || '',
  experience: {
    en: profile.experienceLabel?.en || `${profile.experience || 0}+ Years`,
    bn: profile.experienceLabel?.bn || `${profile.experience || 0}+ বছর`,
  },
  languages: profile.languages || ['Bangla', 'English'],
  about: {
    en: profile.about?.en || profile.biography || '',
    bn: profile.about?.bn || '',
  },
  services: profile.services || [],
  consultationFee: profile.consultationFee || 0,
  chamberTime: {
    en: profile.chamberTime?.en || '',
    bn: profile.chamberTime?.bn || '',
  },
  chamberAddress: {
    en: profile.chamberAddress?.en || '',
    bn: profile.chamberAddress?.bn || '',
  },
  address: {
    en: profile.address?.en || profile.address || '',
    bn: profile.address?.bn || '',
  },
  availableDays: profile.availableDays || [],
  phone: profile.phone || user?.phone || '',
  email: profile.email || user?.email || '',
  image: profile.image || profile.profilePhoto || '',
  featured: profile.featured || false,
  displayOrder: profile.displayOrder || 0,
  isVisible: profile.profileVisibility === 'published',
  status: profile.status || 'active',
  available: profile.available !== false,
  socialLinks: profile.socialLinks || [],
  awards: profile.awards || [],
  memberships: profile.memberships || [],
  onlineConsultation: profile.onlineConsultation || false,
  offlineConsultation: profile.offlineConsultation !== false,
  appointmentAvailable: profile.appointmentAvailable !== false,
  patientsCount: 0,
  rating: 5,
  joinDate: profile.createdAt?.toISOString?.() || profile.createdAt || '',
  createdAt: profile.createdAt,
  updatedAt: profile.updatedAt,
});

// ── SELF-REGISTERED DOCTORS ────────────────────────────────────────────────────

/**
 * Get all published self-registered doctors whose associated User
 * is approved, active, and has completed their profile
 */
export const getSelfRegisteredDoctors = async () => {
  const profiles = await DoctorProfile.find({
    profileVisibility: 'published',
    status: { $ne: 'inactive' },
    isDeleted: { $ne: true },
  }).lean();

  if (!profiles.length) return [];

  const userIds = profiles.map(p => p.userId);
  const users = await User.find({
    _id: { $in: userIds },
    approvalStatus: 'approved',
    accountStatus: 'active',
    profileCompleted: true,
  }).select('fullName email phone').lean();

  const userMap = new Map(users.map(u => [u._id.toString(), u]));

  return profiles
    .filter(p => userMap.has(p.userId.toString()))
    .map(p => transformProfileToDoctor(p, userMap.get(p.userId.toString())));
};

// ── DEDUPLICATION ───────────────────────────────────────────────────────────────

/**
 * Build a set of unique identifiers from CMS doctors to use for
 * deduplication of self-registered doctors
 */
const buildCmsIdentitySet = (cmsDoctors) => {
  const emails = new Set();
  const slugs = new Set();
  const regNos = new Set();

  for (const d of cmsDoctors) {
    if (d.email) emails.add(d.email.toLowerCase());
    if (d.slug) slugs.add(d.slug);
    if (d.registrationNumber) regNos.add(d.registrationNumber.toLowerCase());
  }

  return { emails, slugs, regNos };
};

/**
 * Filter out self-registered doctors that already exist in CMS
 * (matched by email, slug, or registration number)
 */
const filterDuplicates = (selfRegistered, cmsDoctors) => {
  const cmsIds = buildCmsIdentitySet(cmsDoctors);

  return selfRegistered.filter(d =>
    !cmsIds.emails.has(d.email?.toLowerCase()) &&
    !cmsIds.slugs.has(d.slug) &&
    !cmsIds.regNos.has(d.slug)
  );
};

// ── PUBLIC QUERIES ────────────────────────────────────────────────────────────

/**
 * Get all doctors for public frontend
 * Returns visible CMS doctors + published self-registered doctors
 * Deduplicates by email / slug / registration number
 */
export const getPublicDoctors = async () => {
  const cmsDoctors = await Doctor.find({ isVisible: true, status: { $ne: 'inactive' } })
    .select('-__v -createdBy -updatedBy -seo -galleryImages -bannerImage -appointmentsToday')
    .sort({ featured: -1, displayOrder: 1, 'name.en': 1 })
    .lean();

  const selfRegistered = await getSelfRegisteredDoctors();
  const uniqueSelfRegistered = filterDuplicates(selfRegistered, cmsDoctors);

  const merged = [...cmsDoctors, ...uniqueSelfRegistered];
  merged.sort((a, b) => {
    if (a.featured !== b.featured) return b.featured ? 1 : -1;
    if ((a.displayOrder || 0) !== (b.displayOrder || 0)) return (a.displayOrder || 0) - (b.displayOrder || 0);
    return (a.name?.en || '').localeCompare(b.name?.en || '');
  });

  return merged;
};

/**
 * Get single doctor by slug for public frontend
 * Tries CMS doctor first, falls back to self-registered
 */
export const getPublicDoctorBySlug = async (slug) => {
  const cmsDoctor = await Doctor.findOne({ slug, isVisible: true })
    .select('-__v -createdBy -updatedBy')
    .lean();

  if (cmsDoctor) return cmsDoctor;

  const profile = await DoctorProfile.findOne({
    slug,
    profileVisibility: 'published',
    isDeleted: { $ne: true },
  }).lean();

  if (!profile) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');

  const user = await User.findOne({
    _id: profile.userId,
    approvalStatus: 'approved',
    accountStatus: 'active',
    profileCompleted: true,
  }).lean();

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');

  return transformProfileToDoctor(profile, user);
};

/**
 * Get featured doctors (for homepage section)
 * Returns featured CMS doctors + featured self-registered doctors
 */
export const getFeaturedDoctors = async (limit = 4) => {
  const cmsDoctors = await Doctor.find({ isVisible: true, featured: true, status: 'active' })
    .select('name slug specialization department designation image consultationFee experience available')
    .sort({ displayOrder: 1 })
    .limit(limit)
    .lean();

  if (cmsDoctors.length >= limit) return cmsDoctors.slice(0, limit);

  const selfRegistered = await getSelfRegisteredDoctors();
  const featuredSelf = selfRegistered
    .filter(d => d.featured && !cmsDoctors.some(c => c.slug === d.slug))
    .slice(0, limit - cmsDoctors.length);

  return [...cmsDoctors, ...featuredSelf].slice(0, limit);
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

// ── SCHEDULE SYNC ──────────────────────────────────────────────────────────────

const DAY_NAME_TO_NUM = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6,
};

function parseChamberTimeForSchedule(chamberTimeEn) {
  if (!chamberTimeEn) return null;
  const m = chamberTimeEn.match(
    /\|\s*(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[-–—]\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i
  );
  if (m) return { startTime: m[1].trim(), endTime: m[2].trim() };
  return null;
}

async function syncDoctorSchedule(doctorId, availableDays, chamberTime, slotDuration, breakStart, breakEnd) {
  if (!availableDays || availableDays.length === 0) return;

  const parsed = chamberTime?.en ? parseChamberTimeForSchedule(chamberTime.en) : null;
  if (!parsed) return;

  const weeklySlots = availableDays.map((day) => ({
    dayOfWeek: DAY_NAME_TO_NUM[day.toLowerCase()],
    startTime: parsed.startTime,
    endTime: parsed.endTime,
    breakStart: breakStart || null,
    breakEnd: breakEnd || null,
    slotDuration: slotDuration || 15,
    maxPatients: 1,
    type: 'offline',
    isActive: true,
  }));

  await DoctorSchedule.findOneAndUpdate(
    { doctorId },
    { $set: { doctorId, weeklySlots } },
    { upsert: true, new: true }
  );
}

// ── MUTATIONS ─────────────────────────────────────────────────────────────────

/**
 * Create doctor
 */
export const createDoctor = async (data, userId) => {
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
    const existing = await Doctor.findOne({ slug: data.slug });
    if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Slug already exists');
  }

  if (data.experience?.years && !data.experience?.label?.en) {
    const yrs = data.experience.years;
    data.experience.label = { en: `${yrs}+ Years`, bn: `${yrs}+ বছর` };
  }

  const doctor = await Doctor.create({ ...data, createdBy: userId, updatedBy: userId });

  await syncDoctorSchedule(doctor._id, data.availableDays, data.chamberTime, data.slotDuration, data.breakStart, data.breakEnd);

  return doctor;
};

/**
 * Update doctor (full or partial)
 */
export const updateDoctor = async (id, data, userId) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(StatusCodes.NOT_FOUND, 'Doctor not found');

  if (data.slug && data.slug !== doctor.slug) {
    const existing = await Doctor.findOne({ slug: data.slug, _id: { $ne: id } });
    if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Slug already in use');
  }

  if (data.experience?.years && !data.experience?.label?.en) {
    const yrs = data.experience.years;
    data.experience.label = { en: `${yrs}+ Years`, bn: `${yrs}+ বছর` };
  }

  const updated = await Doctor.findByIdAndUpdate(
    id,
    { $set: { ...data, updatedBy: userId } },
    { new: true, runValidators: true }
  ).select('-__v');

  const days = data.availableDays !== undefined ? data.availableDays : doctor.availableDays;
  const ct = data.chamberTime !== undefined ? data.chamberTime : doctor.chamberTime;
  const slotDur = data.slotDuration !== undefined ? data.slotDuration : (doctor.slotDuration ?? 15);
  const brkStart = data.breakStart !== undefined ? data.breakStart : (doctor.breakStart || '');
  const brkEnd = data.breakEnd !== undefined ? data.breakEnd : (doctor.breakEnd || '');
  await syncDoctorSchedule(id, days, ct, slotDur, brkStart, brkEnd);

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
 * Get department list (unique, from both CMS and self-registered doctors)
 */
export const getDepartments = async () => {
  const cmsDepts = await Doctor.distinct('department.en', { isVisible: true });
  const selfDepts = await DoctorProfile.distinct('department', {
    profileVisibility: 'published',
    isDeleted: { $ne: true },
  });
  return [...new Set([...cmsDepts, ...selfDepts])].sort();
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
 * Uses atomic Counter collection to guarantee uniqueness across concurrent requests.
 */
const generateNextDoctorCode = async () => {
  const lastProfile = await DoctorProfile.findOne({})
    .sort({ doctorCode: -1 })
    .select('doctorCode')
    .lean();
  let dbMax = 0;
  if (lastProfile?.doctorCode) {
    const match = lastProfile.doctorCode.match(/DOC-(\d+)/);
    if (match) dbMax = parseInt(match[1], 10);
  }

  const counter = await Counter.findOneAndUpdate(
    { name: 'doctorCode' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (counter.seq === 1 && dbMax > 0) {
    const bumped = await Counter.findOneAndUpdate(
      { name: 'doctorCode', seq: { $lte: dbMax } },
      { $set: { seq: dbMax + 1 } },
      { new: true }
    );
    if (bumped) {
      return `DOC-${String(bumped.seq).padStart(5, '0')}`;
    }
  }

  return `DOC-${String(counter.seq).padStart(5, '0')}`;
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

      const baseSlug = generateSlug(user.fullName);
      let slug = baseSlug;
      let count = 0;
      while (true) {
        const docExists = await Doctor.findOne({ slug }).lean();
        const profExists = await DoctorProfile.findOne({ slug }).lean();
        if (!docExists && !profExists) break;
        count++;
        slug = `${baseSlug}-${count}`;
      }

      profile = await DoctorProfile.create({
        userId,
        doctorCode,
        slug,
        ...adminFields,
      });

      const doctorDoc = await Doctor.create({
        slug,
        name: { en: user.fullName || 'Doctor', bn: '' },
        designation: { en: adminData.designation || 'Staff', bn: '' },
        specialization: { en: 'TBD', bn: '' },
        department: { en: adminData.department || 'General', bn: '' },
        qualification: 'TBD',
        experience: { years: 0, label: { en: '0+ Years', bn: '০+ বছর' } },
        isVisible: false,
        createdBy: adminId,
        updatedBy: adminId,
      });

      await User.findByIdAndUpdate(userId, { doctorRef: doctorDoc._id });
    } else {
      profile = await DoctorProfile.findOneAndUpdate(
        { userId },
        { $set: adminFields },
        { new: true, runValidators: true }
      );

      // Generate slug if missing
      if (!profile.slug && user.fullName) {
        const baseSlug = generateSlug(user.fullName);
        let slug = baseSlug;
        let count = 0;
        while (true) {
          const docExists = await Doctor.findOne({ slug }).lean();
          const profExists = await DoctorProfile.findOne({ slug, _id: { $ne: profile._id } }).lean();
          if (!docExists && !profExists) break;
          count++;
          slug = `${baseSlug}-${count}`;
        }
        await DoctorProfile.findOneAndUpdate(
          { userId },
          { $set: { slug, ...adminFields } },
          { new: true }
        );
        profile = await DoctorProfile.findOne({ userId });
      }

      const profileSlug = profile.slug;
      if (profileSlug) {
        const existingDoctor = await Doctor.findOne({ slug: profileSlug }).lean();
        const doctorPayload = {
          slug: profileSlug,
          name: { en: user.fullName || 'Doctor', bn: '' },
          'designation.en': adminData.designation || 'Staff',
          'specialization.en': 'TBD',
          'department.en': adminData.department || 'General',
          qualification: 'TBD',
          'experience.years': 0,
          'experience.label.en': '0+ Years',
          'experience.label.bn': '০+ Years',
          isVisible: false,
          updatedBy: adminId,
        };
        let doctorDoc;
        if (existingDoctor) {
          doctorDoc = await Doctor.findOneAndUpdate(
            { slug: profileSlug },
            { $set: doctorPayload },
            { new: true }
          );
        } else {
          doctorDoc = await Doctor.create({
            ...doctorPayload,
            createdBy: adminId,
          });
        }
        if (doctorDoc) {
          await User.findByIdAndUpdate(userId, { doctorRef: doctorDoc._id });
        }
      }
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

const generateNextReceptionistCode = async () => {
  const lastProfile = await ReceptionistProfile.findOne({})
    .sort({ receptionistCode: -1 })
    .select('receptionistCode')
    .lean();
  let dbMax = 0;
  if (lastProfile?.receptionistCode) {
    const match = lastProfile.receptionistCode.match(/REC-(\d+)/);
    if (match) dbMax = parseInt(match[1], 10);
  }

  const counter = await Counter.findOneAndUpdate(
    { name: 'receptionistCode' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (counter.seq === 1 && dbMax > 0) {
    const bumped = await Counter.findOneAndUpdate(
      { name: 'receptionistCode', seq: { $lte: dbMax } },
      { $set: { seq: dbMax + 1 } },
      { new: true }
    );
    if (bumped) {
      return `REC-${String(bumped.seq).padStart(5, '0')}`;
    }
  }

  return `REC-${String(counter.seq).padStart(5, '0')}`;
};

const generateNextLabAdminCode = async () => {
  const lastProfile = await LabAdminProfile.findOne({})
    .sort({ labAdminCode: -1 })
    .select('labAdminCode')
    .lean();
  let dbMax = 0;
  if (lastProfile?.labAdminCode) {
    const match = lastProfile.labAdminCode.match(/LAB-(\d+)/);
    if (match) dbMax = parseInt(match[1], 10);
  }

  const counter = await Counter.findOneAndUpdate(
    { name: 'labAdminCode' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (counter.seq === 1 && dbMax > 0) {
    const bumped = await Counter.findOneAndUpdate(
      { name: 'labAdminCode', seq: { $lte: dbMax } },
      { $set: { seq: dbMax + 1 } },
      { new: true }
    );
    if (bumped) {
      return `LAB-${String(bumped.seq).padStart(5, '0')}`;
    }
  }

  return `LAB-${String(counter.seq).padStart(5, '0')}`;
};

export const suspendDoctor = async (userId, adminId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  if (!STAFF_ROLES.includes(user.role)) throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a staff member');

  user.accountStatus = 'suspended';
  user.updatedBy = adminId;
  await user.save();

  return user.toJSON();
};
