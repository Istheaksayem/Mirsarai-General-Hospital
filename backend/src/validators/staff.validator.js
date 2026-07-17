import { z } from 'zod';

export const staffQuerySchema = z.object({
  query: z.object({
    role: z.enum(['admin', 'doctor', 'reception', 'lab']).optional(),
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
