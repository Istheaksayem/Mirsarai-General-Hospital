import { z } from 'zod';
import { GENDER, BLOOD_GROUPS } from '../constants/index.js';

export const createPatientSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    mobile: z.string().regex(/^01[3-9]\d{8}$/, 'Enter a valid BD mobile number'),
    email: z.string().email('Valid email is required').optional(),
    dateOfBirth: z.string().optional(),
    age: z.number().int().min(0).max(150).optional(),
    gender: z.enum(Object.values(GENDER)).optional(),
    bloodGroup: z.enum(BLOOD_GROUPS).optional(),
    address: z.string().optional(),
    status: z.enum(['active', 'inactive', 'admitted']).optional(),
    diagnosis: z.string().optional(),
    department: z.string().optional(),
    emergencyContact: z.string().optional(),
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    mobile: z.string().regex(/^01[3-9]\d{8}$/, 'Enter a valid BD mobile number').optional(),
    email: z.string().email('Valid email is required').optional(),
    dateOfBirth: z.string().optional(),
    age: z.number().int().min(0).max(150).optional(),
    gender: z.enum(Object.values(GENDER)).optional(),
    bloodGroup: z.enum(BLOOD_GROUPS).optional(),
    address: z.string().optional(),
    status: z.enum(['active', 'inactive', 'admitted']).optional(),
    diagnosis: z.string().optional(),
    department: z.string().optional(),
    emergencyContact: z.string().optional(),
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({ id: z.string().min(1) }),
});

export const patientQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(['active', 'inactive', 'admitted']).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
