import { z } from 'zod';

export const createDriveSchema = z.object({
  body: z.object({
    companyId: z.number().int().positive(),
    jobTitle: z.string().min(2),
    description: z.string().min(10),
    jobRole: z.string().min(2),
    ctcMin: z.number().min(0).optional(),
    ctcMax: z.number().min(0).optional(),
    location: z.string().optional(),
    mode: z.enum(['ONSITE', 'VIRTUAL', 'HYBRID']).optional(),
    lastDateToApply: z.coerce.date(),
    driveDate: z.coerce.date().optional(),
    eligibility: z
      .object({
        minCgpa: z.number().min(0).max(10).optional(),
        allowedBranches: z.array(z.string()).optional(),
        maxBacklogs: z.number().int().min(0).optional(),
        allowedGradYears: z.array(z.number().int()).optional(),
      })
      .optional(),
  }),
});

export const updateDriveStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PUBLISHED', 'CLOSED']),
  }),
});
