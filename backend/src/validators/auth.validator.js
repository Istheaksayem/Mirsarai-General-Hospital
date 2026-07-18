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

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please provide a valid email address'),
});

export const resetPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Please provide a valid email address'),
  otp: z
    .string({
      required_error: 'OTP is required',
    })
    .length(6, 'OTP must be exactly 6 digits'),
  newPassword: z
    .string({
      required_error: 'New password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
  confirmNewPassword: z
    .string({
      required_error: 'Please confirm your new password',
    }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});
