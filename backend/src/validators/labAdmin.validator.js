import { z } from 'zod';

export const labAdminProfileSchema = z.object({
  body: z.object({
    profilePhoto: z.string().min(1, 'Profile photo is required'),
    gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    address: z.string().min(1, 'Address is required'),
    qualification: z.string().min(1, 'Qualification is required'),
    experience: z.number().min(1, 'Experience must be at least 1 year'),
  }),
});
