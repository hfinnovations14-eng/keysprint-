import { Router } from 'express';
import { register, login, guestEntry, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/guest', guestEntry);
router.get('/me', authenticateToken, getMe);

export default router;
