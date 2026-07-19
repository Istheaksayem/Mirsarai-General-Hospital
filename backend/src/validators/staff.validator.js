import { z } from 'zod';

export const staffQuerySchema = z.object({
  query: z.object({
    role: z.enum(['admin', 'doctor', 'reception', 'lab']).optional(),
  }),
});

export const createStaffSchema = z.object({
  body: z.object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['doctor', 'reception', 'lab'], 'Role must be doctor, reception, or lab'),
  }),
});

export const updateStaffSchema = z.object({
  body: z.object({
    fullName: z.string().min(3).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
  params: z.object({ id: z.string().min(1) }),
});
