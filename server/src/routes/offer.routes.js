import { Router } from 'express';
import { myOffers, respondToOffer } from '../controllers/offer.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { respondOfferSchema } from '../validations/offer.schema.js';

const router = Router();

router.use(authenticate);

// mounted at /api/offers
router.get('/me', requireRole('STUDENT'), myOffers);
router.patch('/:id/respond', requireRole('STUDENT'), validate(respondOfferSchema), respondToOffer);

export default router;
