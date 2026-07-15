import { z } from 'zod';

export const receptionistProfileSchema = z.object({
  body: z.object({
    profilePhoto: z.string().optional().default(''),
    gender: z.enum(['male', 'female', 'other']).default('other'),
    dateOfBirth: z.string().optional(),
    address: z.string().optional().default(''),
    emergencyContact: z.string().min(1, 'Emergency contact is required'),
  }),
});
