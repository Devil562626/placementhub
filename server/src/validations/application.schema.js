import { z } from 'zod';

export const updateAppStatusSchema = z.object({
  body: z.object({
    status: z.enum(['SHORTLISTED', 'IN_PROCESS', 'SELECTED', 'REJECTED', 'WITHDRAWN']),
  }),
});
