import { z } from 'zod';

export const labAdminProfileSchema = z.object({
  body: z.object({
    profilePhoto: z.string().optional().default(''),
    gender: z.enum(['male', 'female', 'other']).default('other'),
    dateOfBirth: z.string().optional(),
    address: z.string().optional().default(''),
    qualification: z.string().min(1, 'Qualification is required'),
    experience: z.number().min(0, 'Experience must be a non-negative number').default(0),
  }),
});
