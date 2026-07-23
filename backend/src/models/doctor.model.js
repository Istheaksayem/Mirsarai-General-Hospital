import mongoose from 'mongoose';

/**
 * Bilingual text sub-schema
 * Used for all fields that need English + Bangla support
 */
const bilingualSchema = new mongoose.Schema(
  { en: { type: String, required: true }, bn: { type: String, default: '' } },
  { _id: false }
);

/**
 * Service item sub-schema
 */
const serviceSchema = new mongoose.Schema(
  { en: { type: String, required: true }, bn: { type: String, default: '' } },
  { _id: false }
);

/**
 * Time slot sub-schema
 */
const timeSlotSchema = new mongoose.Schema(
  {
    day:       { type: String, required: true },
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
    type:      { type: String, enum: ['online', 'offline', 'both'], default: 'offline' },
  },
  { _id: false }
);

/**
 * Social link sub-schema
 */
const socialLinkSchema = new mongoose.Schema(
  { platform: String, url: String },
  { _id: false }
);

/**
 * Award sub-schema
 */
const awardSchema = new mongoose.Schema(
  { title: bilingualSchema, year: String, organization: bilingualSchema },
  { _id: false }
);

/**
 * Doctor Schema — Full bilingual CMS-driven schema
 * Supports all frontend fields and admin CMS requirements
 */
const doctorSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────────────────────────────────
    slug:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    name:        { type: bilingualSchema, required: true },
    designation: { type: bilingualSchema, required: true },

    // ── Professional ────────────────────────────────────────────────────────
    specialization: { type: bilingualSchema, required: true },
    department:     { type: bilingualSchema, required: true },
    qualification:  { type: String, required: true },
    experience: {
      years:  { type: Number, default: 0 },
      label:  { type: bilingualSchema },        // "12+ Years" / "১২+ বছর"
    },
    registrationNumber: { type: String, default: '' },
    languages:  { type: [String], default: ['Bangla', 'English'] },
    awards:     { type: [awardSchema], default: [] },
    memberships: { type: [String], default: [] },

    // ── Biography ───────────────────────────────────────────────────────────
    about:    { type: bilingualSchema },
    services: { type: [serviceSchema], default: [] },

    // ── Consultation ────────────────────────────────────────────────────────
    consultationFee: { type: Number, default: 0 },
    chamberTime:     { type: bilingualSchema },
    timeSlots:       { type: [timeSlotSchema], default: [] },
    slotDuration:    { type: Number, default: 15 },
    breakStart:      { type: String, default: '' },
    breakEnd:        { type: String, default: '' },
    availableDays:   { type: [String], default: [] },
    onlineConsultation:  { type: Boolean, default: false },
    offlineConsultation: { type: Boolean, default: true },
    appointmentAvailable: { type: Boolean, default: true },

    // ── Contact ─────────────────────────────────────────────────────────────
    phone:    { type: String, default: '' },
    email:    { type: String, default: '' },
    address:  { type: bilingualSchema },
    chamberAddress: { type: bilingualSchema },
    socialLinks: { type: [socialLinkSchema], default: [] },

    // ── Media ───────────────────────────────────────────────────────────────
    image:         { type: String, default: '' },
    bannerImage:   { type: String, default: '' },
    galleryImages: { type: [String], default: [] },

    // ── Stats (for admin dashboard) ──────────────────────────────────────────
    patientsCount:      { type: Number, default: 0 },
    appointmentsToday:  { type: Number, default: 0 },
    rating:             { type: Number, default: 5, min: 0, max: 5 },
    joinDate:           { type: String, default: '' },

    // ── Display & Visibility ────────────────────────────────────────────────
    status:       { type: String, enum: ['active', 'on-leave', 'inactive'], default: 'active' },
    available:    { type: Boolean, default: true },
    featured:     { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    isVisible:    { type: Boolean, default: true },

    // ── SEO ─────────────────────────────────────────────────────────────────
    seo: {
      metaTitle:       { type: bilingualSchema },
      metaDescription: { type: bilingualSchema },
      keywords:        { type: [String], default: [] },
    },

    // ── Audit ───────────────────────────────────────────────────────────────
    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
doctorSchema.index({ slug: 1 });
doctorSchema.index({ status: 1, isVisible: 1 });
doctorSchema.index({ featured: 1, displayOrder: 1 });
doctorSchema.index({ 'name.en': 'text', 'specialization.en': 'text', 'department.en': 'text' });

export default mongoose.model('Doctor', doctorSchema);
