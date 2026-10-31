import { Router } from 'express';
import { getRandomPassage, submitRaceResult, getRaceHistory } from '../controllers/raceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/passage', getRandomPassage);
router.post('/result', authenticateToken, submitRaceResult);
router.get('/history', authenticateToken, getRaceHistory);

export default router;
