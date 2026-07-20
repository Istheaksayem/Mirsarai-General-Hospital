import { z } from 'zod';

export const updateAdminStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'rejected'], {
      errorMap: () => ({ message: 'Status must be one of: pending, confirmed, rejected' }),
    }),
  }),
  params: z.object({ id: z.string().min(1) }),
});

export const updateDoctorStatusSchema = z.object({
  body: z.object({
    status: z.enum(['confirmed', 'completed'], {
      errorMap: () => ({ message: 'Status must be one of: confirmed, completed' }),
    }),
  }),
  params: z.object({ id: z.string().min(1) }),
});
