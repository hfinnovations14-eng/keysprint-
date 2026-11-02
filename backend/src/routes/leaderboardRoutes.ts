import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';
import { authenticateOptionalToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticateOptionalToken, getLeaderboard);

export default router;
