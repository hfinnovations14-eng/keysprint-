import { Router } from 'express';
import { getRandomPassage, submitRaceResult, getRaceHistory, checkRoomExists, getPracticeDrill } from '../controllers/raceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/passage', getRandomPassage);
router.get('/practice/drill', getPracticeDrill);
router.post('/result', authenticateToken, submitRaceResult);
router.get('/history', authenticateToken, getRaceHistory);
router.get('/room/:code', checkRoomExists);

export default router;
