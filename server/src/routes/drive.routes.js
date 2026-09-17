import { Router } from 'express';
import { createDrive, listDrives, getDrive, updateDriveStatus } from '../controllers/drive.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createDriveSchema, updateDriveStatusSchema } from '../validations/drive.schema.js';

const router = Router();

router.use(authenticate);                    // every drive route needs login

router.get('/', listDrives);                 // role-aware (student/tpo/recruiter)
router.get('/:id', getDrive);
router.post('/', requireRole('TPO'), validate(createDriveSchema), createDrive);
router.patch('/:id/status', requireRole('TPO'), validate(updateDriveStatusSchema), updateDriveStatus);

export default router;
