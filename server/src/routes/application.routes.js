import { Router } from 'express';
import { myApplications, updateStatus } from '../controllers/application.controller.js';
import { createOffer } from '../controllers/offer.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateAppStatusSchema } from '../validations/application.schema.js';
import { createOfferSchema } from '../validations/offer.schema.js';

const router = Router();

router.use(authenticate);

// mounted at /api/applications
router.get('/me', requireRole('STUDENT'), myApplications);
router.post('/:id/offer', requireRole('TPO', 'RECRUITER'), validate(createOfferSchema), createOffer);
router.patch('/:id/status', requireRole('TPO', 'RECRUITER', 'STUDENT'), validate(updateAppStatusSchema), updateStatus);

export default router;
