import { z } from 'zod';

export const createOfferSchema = z.object({
  body: z.object({
    ctc: z.number().positive('CTC must be positive'),
    jobRole: z.string().optional(),
    joiningDate: z.coerce.date().optional(),
  }),
});

export const respondOfferSchema = z.object({
  body: z.object({
    action: z.enum(['ACCEPTED', 'DECLINED']),
  }),
});
