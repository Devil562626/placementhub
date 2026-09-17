import { z } from 'zod';

export const createRoundSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Round name required'),
    scheduledAt: z.coerce.date().optional(),
    venue: z.string().optional(),
  }),
});

export const roundResultSchema = z.object({
  body: z.object({
    applicationId: z.number().int().positive(),
    result: z.enum(['PASS', 'FAIL']),
    feedback: z.string().max(500).optional(),
  }),
});