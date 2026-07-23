import { z } from 'zod';

// Bilingual: en required, bn optional (defaults to '')
const bilingualZ = z.object({ en: z.string().min(1, 'English text is required'), bn: z.string().default('') });
// Bilingual: both en and bn required
const bilingualReqZ = z.object({
  en: z.string().min(1, 'English text is required'),
  bn: z.string().min(1, 'Bangla text is required'),
});
// Bilingual: optional, but when provided both en and bn are required
const bilingualOptZ = z.object({ en: z.string().default(''), bn: z.string().default('') }).optional();
// Bilingual: optional, but when provided both en and bn must be non-empty
const bilingualReqOptZ = bilingualReqZ.optional();

const serviceZ = z.object({ en: z.string().min(1, 'Service English text is required'), bn: z.string().default('') });

const timeSlotZ = z.object({
  day:       z.string().min(1),
  startTime: z.string().min(1),
  endTime:   z.string().min(1),
  type:      z.enum(['online', 'offline', 'both']).default('offline'),
});

// ── Create Doctor Schema ──────────────────────────────────────────────────────
export const createDoctorSchema = z.object({
  body: z.object({
    name:           bilingualReqZ,
    slug:           z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
    designation:    bilingualReqZ,
    specialization: bilingualReqZ,
    department:     bilingualReqZ,
    qualification:  z.string().min(1, 'Qualification is required'),
    experience: z.object({
      years: z.number().min(0, 'Experience years must be 0 or more'),
      label: bilingualReqZ,
    }),
    registrationNumber: z.string().optional(),
    languages: z.array(z.string()).default(['Bangla', 'English']),
    about:      bilingualReqZ,
    services:   z.array(serviceZ).default([]),
    consultationFee: z.number().min(0).default(0),
    chamberTime: bilingualReqZ,
    timeSlots:   z.array(timeSlotZ).default([]),
    availableDays: z.array(z.string()).default([]),
    slotDuration: z.number().min(5).max(120).default(15),
    breakStart: z.string().optional(),
    breakEnd: z.string().optional(),
    onlineConsultation:   z.boolean().default(false),
    offlineConsultation:  z.boolean().default(true),
    appointmentAvailable: z.boolean().default(true),
    phone:   z.string().min(1, 'Phone number is required'),
    email:   z.string().email('Valid email is required'),
    address: bilingualReqZ,
    chamberAddress: bilingualReqZ,
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

// ── Update Doctor Schema (all fields optional, but when provided enforce bilingual) ──
export const updateDoctorSchema = z.object({
  body: z.object({
    name:              bilingualReqZ.optional(),
    slug:              z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
    designation:       bilingualReqZ.optional(),
    specialization:    bilingualReqZ.optional(),
    department:        bilingualReqZ.optional(),
    qualification:     z.string().min(1).optional(),
    experience: z.object({
      years: z.number().min(0),
      label: bilingualReqZ,
    }).optional(),
    registrationNumber:   z.string().optional(),
    languages:            z.array(z.string()).optional(),
    about:                bilingualReqOptZ,
    services:             z.array(serviceZ).optional(),
    consultationFee:      z.number().min(0).optional(),
    chamberTime:          bilingualReqOptZ,
    timeSlots:            z.array(timeSlotZ).optional(),
    availableDays:        z.array(z.string()).optional(),
    slotDuration:         z.number().min(5).max(120).optional(),
    breakStart:           z.string().optional(),
    breakEnd:             z.string().optional(),
    onlineConsultation:   z.boolean().optional(),
    offlineConsultation:  z.boolean().optional(),
    appointmentAvailable: z.boolean().optional(),
    phone:                z.string().min(1).optional(),
    email:                z.string().email().optional(),
    address:              bilingualReqOptZ,
    chamberAddress:       bilingualReqOptZ,
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
      en: z.string().min(1, 'Name (English) is required'),
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
      en: z.string().min(1, 'Chamber address (English) is required'),
      bn: z.string().min(1, 'Chamber address (Bengali) is required'),
    }),
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
