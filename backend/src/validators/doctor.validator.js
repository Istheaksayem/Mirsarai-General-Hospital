import { z } from 'zod';

const bilingualZ = z.object({ en: z.string().min(1), bn: z.string().default('') });
const bilingualOptZ = z.object({ en: z.string().default(''), bn: z.string().default('') }).optional();

const serviceZ = z.object({ en: z.string().min(1), bn: z.string().default('') });

const timeSlotZ = z.object({
  day:       z.string().min(1),
  startTime: z.string().min(1),
  endTime:   z.string().min(1),
  type:      z.enum(['online', 'offline', 'both']).default('offline'),
});

// ── Create Doctor Schema ──────────────────────────────────────────────────────
export const createDoctorSchema = z.object({
  body: z.object({
    name:           bilingualZ,
    slug:           z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
    designation:    bilingualZ,
    specialization: bilingualZ,
    department:     bilingualZ,
    qualification:  z.string().min(1),
    experience: z.object({
      years: z.number().min(0).default(0),
      label: bilingualOptZ,
    }).optional(),
    registrationNumber: z.string().optional(),
    languages: z.array(z.string()).default(['Bangla', 'English']),
    about:      bilingualOptZ,
    services:   z.array(serviceZ).default([]),
    consultationFee: z.number().min(0).default(0),
    chamberTime: bilingualOptZ,
    timeSlots:   z.array(timeSlotZ).default([]),
    availableDays: z.array(z.string()).default([]),
    onlineConsultation:   z.boolean().default(false),
    offlineConsultation:  z.boolean().default(true),
    appointmentAvailable: z.boolean().default(true),
    phone:   z.string().optional(),
    email:   z.string().email().optional(),
    address: bilingualOptZ,
    chamberAddress: bilingualOptZ,
    image:         z.string().optional(),
    bannerImage:   z.string().optional(),
    galleryImages: z.array(z.string()).default([]),
    status:       z.enum(['active', 'on-leave', 'inactive']).default('active'),
    available:    z.boolean().default(true),
    featured:     z.boolean().default(false),
    displayOrder: z.number().default(0),
    isVisible:    z.boolean().default(true),
    seo: z.object({
      metaTitle:       bilingualOptZ,
      metaDescription: bilingualOptZ,
      keywords:        z.array(z.string()).default([]),
    }).optional(),
  }),
});

// ── Update Doctor Schema (all fields optional, no defaults) ────────────────────
// Each field is explicitly .optional() WITHOUT .default() to prevent silently
// overwriting existing data in MongoDB during partial updates.
export const updateDoctorSchema = z.object({
  body: z.object({
    name:              bilingualZ.optional(),
    slug:              z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
    designation:       bilingualZ.optional(),
    specialization:    bilingualZ.optional(),
    department:        bilingualZ.optional(),
    qualification:     z.string().min(1).optional(),
    experience: z.object({
      years: z.number().min(0),
      label: bilingualOptZ,
    }).optional(),
    registrationNumber:   z.string().optional(),
    languages:            z.array(z.string()).optional(),
    about:                bilingualOptZ,
    services:             z.array(serviceZ).optional(),
    consultationFee:      z.number().min(0).optional(),
    chamberTime:          bilingualOptZ,
    timeSlots:            z.array(timeSlotZ).optional(),
    availableDays:        z.array(z.string()).optional(),
    onlineConsultation:   z.boolean().optional(),
    offlineConsultation:  z.boolean().optional(),
    appointmentAvailable: z.boolean().optional(),
    phone:                z.string().optional(),
    email:                z.string().email().optional(),
    address:              bilingualOptZ,
    chamberAddress:       bilingualOptZ,
    image:                z.string().optional(),
    bannerImage:          z.string().optional(),
    galleryImages:        z.array(z.string()).optional(),
    status:               z.enum(['active', 'on-leave', 'inactive']).optional(),
    available:            z.boolean().optional(),
    featured:             z.boolean().optional(),
    displayOrder:         z.number().optional(),
    isVisible:            z.boolean().optional(),
    seo: z.object({
      metaTitle:       bilingualOptZ,
      metaDescription: bilingualOptZ,
      keywords:        z.array(z.string()).optional(),
    }).optional(),
  }),
  params: z.object({ id: z.string().min(1) }),
});

// ── Query Schema ──────────────────────────────────────────────────────────────
export const doctorQuerySchema = z.object({
  query: z.object({
    page:       z.string().optional(),
    limit:      z.string().optional(),
    status:     z.enum(['active', 'on-leave', 'inactive']).optional(),
    department: z.string().optional(),
    featured:   z.string().optional(),
    search:     z.string().optional(),
    sortBy:     z.string().optional(),
    sortOrder:  z.enum(['asc', 'desc']).optional(),
  }),
});

// ── Admin Assign Info Schema ───────────────────────────────────────────────────
export const assignAdminInfoSchema = z.object({
  body: z.object({
    department: z.string().min(1, 'Department is required'),
    designation: z.string().min(1, 'Designation is required'),
    branch: z.string().optional().default(''),
    employmentType: z.enum(['permanent', 'visiting', 'contract', 'resident', '']).optional().default(''),
  }),
});

// ── Doctor Profile Schema (self-registered doctor profile completion) ─────────
// All fields are mandatory — no defaults, all must be explicitly provided
export const doctorProfileSchema = z.object({
  body: z.object({
    department: z.string().optional().default(''),
    specialization: z.string().min(1, 'Specialization is required'),
    qualification: z.string().min(1, 'Qualification is required'),
    experience: z.number().min(1, 'Experience must be at least 1 year'),
    bmdcNumber: z.string().min(1, 'BMDC registration number is required'),
    consultationFee: z.number().min(0, 'Consultation fee is required'),
    availableDays: z.array(z.string()).min(1, 'At least one available day is required'),
    availableTimeSlots: z.array(
      z.object({
        day: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    ).default([]),
    profilePhoto: z.string().min(1, 'Profile photo is required'),
    gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    address: z.string().min(1, 'Address is required'),
    biography: z.string().min(1, 'Biography is required'),

    // ── Bilingual fields (all mandatory) ────────────────────────────────
    name: z.object({
      en: z.string().optional().default(''),
      bn: z.string().min(1, 'Name (Bengali) is required'),
    }),
    about: z.object({
      en: z.string().min(1, 'About (English) is required'),
      bn: z.string().min(1, 'About (Bengali) is required'),
    }),
    chamberTime: z.object({
      en: z.string().min(1, 'Chamber time (English) is required'),
      bn: z.string().min(1, 'Chamber time (Bengali) is required'),
    }),
    chamberAddress: z.object({
      en: z.string().optional().default(''),
      bn: z.string().optional().default(''),
    }).optional(),
    services: z.array(
      z.object({ en: z.string().default(''), bn: z.string().default('') })
    ).default([]),
    languages: z.array(z.string()).min(1, 'At least one language is required'),
    onlineConsultation: z.boolean({ required_error: 'Online consultation preference is required' }),
    offlineConsultation: z.boolean({ required_error: 'Offline consultation preference is required' }),
    appointmentAvailable: z.boolean({ required_error: 'Appointment availability is required' }),
    available: z.boolean({ required_error: 'Availability status is required' }),
  }),
});
