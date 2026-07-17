import { z } from 'zod';

export const receptionistProfileSchema = z.object({
  body: z.object({
    profilePhoto: z.string().min(1, 'Profile photo is required'),
    gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    address: z.string().min(1, 'Address is required'),
    emergencyContact: z.string().min(1, 'Emergency contact is required'),
  }),
});
