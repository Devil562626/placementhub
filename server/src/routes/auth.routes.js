import { Router } from 'express';
import {
  register, login, me, createStaff, listUsers,
  forgotPassword, resetPassword, changePassword,
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { registerSchema, loginSchema, createStaffSchema } from '../validations/auth.schema.js';
import { forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../validations/password.schema.js';

const router = Router();

// public
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

// authenticated
router.get('/me', authenticate, me);
router.patch('/change-password', authenticate, validate(changePasswordSchema), changePassword);

// staff management (TPO/Admin only)
router.post('/staff', authenticate, requireRole('TPO', 'ADMIN'), validate(createStaffSchema), createStaff);
router.get('/users', authenticate, requireRole('TPO', 'ADMIN'), listUsers);

export default router;