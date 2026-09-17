import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    cgpa: z.number().min(0).max(10).optional(),
    activeBacklogs: z.number().int().min(0).optional(),
    branch: z.string().min(2).optional(),
    gradYear: z.number().int().optional(),
    phone: z.string().max(15).optional(),
  }),
});