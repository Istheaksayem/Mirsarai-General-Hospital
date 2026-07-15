import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required',
    })
    .min(3, 'Full name must be at least 3 characters'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please provide a valid email address'),
  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .regex(/^\+?[0-9\s-]{7,15}$/, 'Invalid phone number format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please provide a valid email address'),
  password: z
    .string({
      required_error: 'Password is required',
    }),
});

export const staffRegisterSchema = z.object({
  fullName: z
    .string({
      required_error: 'Full name is required',
    })
    .min(3, 'Full name must be at least 3 characters'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please provide a valid email address'),
  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .regex(/^\+?[0-9\s-]{7,15}$/, 'Invalid phone number format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string({
      required_error: 'Please confirm your password',
    }),
  role: z.enum(['doctor', 'reception', 'lab'], {
    required_error: 'Staff role is required',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
