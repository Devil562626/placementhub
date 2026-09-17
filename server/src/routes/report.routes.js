import { Router } from 'express';
import { summary, exportCsv } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticate, requireRole('TPO', 'ADMIN'));

router.get('/summary', summary);
router.get('/export', exportCsv);

export default router;
