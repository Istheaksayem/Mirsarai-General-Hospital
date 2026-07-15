import mongoose from 'mongoose';

const bilingualSchema = new mongoose.Schema(
  { en: { type: String, default: '' }, bn: { type: String, default: '' } },
  { _id: false }
);

const serviceItemSchema = new mongoose.Schema(
  { en: { type: String, default: '' }, bn: { type: String, default: '' } },
  { _id: false }
);

const timeSlotSchema = new mongoose.Schema(
  {
    day:       { type: String },
    startTime: { type: String },
    endTime:   { type: String },
  },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  { platform: String, url: String },
  { _id: false }
);

const awardSchema = new mongoose.Schema(
  { title: bilingualSchema, year: String, organization: bilingualSchema },
  { _id: false }
);

const doctorProfileSchema = new mongoose.Schema(
  {
    // ── Existing fields (kept for backward compatibility) ─────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    doctorCode: {
      type: String,
      unique: true,
      required: true,
    },
    department:     { type: String, default: '' },
    designation:    { type: String, default: '' },
    branch:         { type: String, default: '' },
    employmentType: { type: String, enum: ['permanent', 'visiting', 'contract', 'resident', ''], default: '' },
    specialization: { type: String, default: '' },
    qualification:  { type: String, default: '' },
    experience:     { type: Number, default: 0 },
    bmdcNumber:     { type: String, default: '' },
    consultationFee: { type: Number, default: 0 },
    availableDays:  { type: [String], default: [] },
    availableTimeSlots: { type: [timeSlotSchema], default: [] },
    profilePhoto: { type: String, default: '' },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other',
    },
    dateOfBirth: { type: Date },
    address:     { type: String, default: '' },
    biography:   { type: String, default: '' },
    isDeleted:   { type: Boolean, default: false },
    deletedAt:   { type: Date, default: null },

    // ── New bilingual identity fields ─────────────────────────────────────────
    slug: { type: String, unique: true, sparse: true },
    name: { type: bilingualSchema },
    designationBn: { type: String, default: '' },
    specializationBn: { type: String, default: '' },
    departmentBn: { type: String, default: '' },
    about: { type: bilingualSchema },
    qualificationBn: { type: String, default: '' },
    experienceLabel: { type: bilingualSchema },

    // ── Contact (cached from User for public display) ─────────────────────────
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    chamberTime: { type: bilingualSchema },
    chamberAddress: { type: bilingualSchema },

    // ── Services & Languages ──────────────────────────────────────────────────
    services:  { type: [serviceItemSchema], default: [] },
    languages: { type: [String], default: ['Bangla', 'English'] },

    // ── Consultation options ──────────────────────────────────────────────────
    onlineConsultation:  { type: Boolean, default: false },
    offlineConsultation: { type: Boolean, default: true },
    appointmentAvailable: { type: Boolean, default: true },

    // ── Display & Visibility ──────────────────────────────────────────────────
    profileVisibility: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    featured:     { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'on-leave', 'inactive'],
      default: 'active',
    },
    available: { type: Boolean, default: true },

    // ── Social & Awards ───────────────────────────────────────────────────────
    socialLinks: { type: [socialLinkSchema], default: [] },
    awards:      { type: [awardSchema], default: [] },
    memberships: { type: [String], default: [] },

    // ── Image alias ───────────────────────────────────────────────────────────
    image: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
doctorProfileSchema.index({ slug: 1 });
doctorProfileSchema.index({ profileVisibility: 1, status: 1 });
doctorProfileSchema.index({ email: 1 });

export default mongoose.model('DoctorProfile', doctorProfileSchema);
