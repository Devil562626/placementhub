import { Router } from 'express';
import multer from 'multer';
import { listStudents, getMe, updateMe, uploadResume } from '../controllers/student.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { updateProfileSchema } from '../validations/student.schema.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  },
});

router.use(authenticate);

router.get('/', requireRole('TPO', 'ADMIN'), listStudents);
router.get('/me', requireRole('STUDENT'), getMe);
router.patch('/me', requireRole('STUDENT'), validate(updateProfileSchema), updateMe);
router.post('/me/resume', requireRole('STUDENT'), upload.single('resume'), uploadResume);

export default router;