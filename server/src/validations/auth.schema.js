import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name too short'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password min 6 chars'),
    role: z.enum(['STUDENT', 'TPO', 'RECRUITER']).optional(),
    rollNo: z.string().optional(),
    branch: z.string().optional(),
    gradYear: z.number().int().optional(),
    cgpa: z.number().min(0).max(10).optional(),
    companyName: z.string().optional(),
    designation: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password required'),
  }),
});
