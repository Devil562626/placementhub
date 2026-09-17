import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

// NOTE: real email delivery needs an SMTP provider (Gmail app-password, Resend, etc.).
// For now the reset token is logged to the server console and returned in dev only.
// This is honest, testable, and upgradeable in one place.

export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  // do NOT reveal whether the email exists (security best practice)
  if (!user) return { sent: true };

  const token = crypto.randomBytes(32).toString('hex');
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken: token, passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000) },
  });

  console.log('=== PASSWORD RESET ===');
  console.log('Email: ' + email);
  console.log('Reset token: ' + token);
  console.log('(Valid 15 min. Wire an email service in password.service.js for production.)');

  return { sent: true, ...(process.env.NODE_ENV !== 'production' && { devToken: token }) };
}

export async function resetPassword(token, password) {
  const user = await prisma.user.findFirst({
    where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired reset link');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(password, 10),
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });
  return { reset: true };
}

export async function changePassword(userId, oldPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'User not found');

  const match = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!match) throw new ApiError(401, 'Current password is incorrect');
  if (oldPassword === newPassword) throw new ApiError(400, 'New password must be different');

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });
  return { changed: true };
}