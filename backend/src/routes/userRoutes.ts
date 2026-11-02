import { Router } from 'express';
import { 
  updateProfile, 
  purchaseItem, 
  equipItem, 
  getUserAchievements, 
  getDailyChallenges, 
  claimDailyChallenge 
} from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.put('/profile', authenticateToken, updateProfile);
router.post('/store/purchase', authenticateToken, purchaseItem);
router.post('/garage/equip', authenticateToken, equipItem);
router.get('/achievements', authenticateToken, getUserAchievements);
router.get('/daily-challenges', authenticateToken, getDailyChallenges);
router.post('/daily-challenges/claim', authenticateToken, claimDailyChallenge);

export default router;
