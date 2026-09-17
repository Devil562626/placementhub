import { Router } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/ApiResponse.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticate, requireRole('TPO', 'ADMIN'));

router.get('/', asyncHandler(async (req, res) => {
  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });
  ok(res, companies);
}));

export default router;