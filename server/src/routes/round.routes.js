import { Router } from 'express';
import {
  createRound, listRounds, listResults, recordResult,
  myNotifications, markAllRead,
} from '../controllers/round.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createRoundSchema, roundResultSchema } from '../validations/round.schema.js';

const router = Router();

router.use(authenticate);

// mounted at /api
router.get('/drives/:id/rounds', listRounds);
router.post('/drives/:id/rounds', requireRole('TPO', 'RECRUITER'), validate(createRoundSchema), createRound);
router.get('/rounds/:id/results', requireRole('TPO', 'RECRUITER'), listResults);
router.post('/rounds/:id/results', requireRole('TPO', 'RECRUITER'), validate(roundResultSchema), recordResult);

router.get('/notifications/me', myNotifications);
router.patch('/notifications/read-all', markAllRead);

export default router;