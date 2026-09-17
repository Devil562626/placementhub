import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().email('Invalid email') }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(10, 'Reset token required'),
    password: z.string().min(6, 'Password min 6 chars'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Current password required'),
    newPassword: z.string().min(6, 'New password min 6 chars'),
  }),
});