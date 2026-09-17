import { Router } from 'express';
import { applyToDrive, listDriveApplications } from '../controllers/application.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = Router();

router.use(authenticate);

// mounted at /api/drives
router.post('/:id/apply', requireRole('STUDENT'), applyToDrive);
router.get('/:id/applications', requireRole('TPO', 'RECRUITER'), listDriveApplications);

export default router;
