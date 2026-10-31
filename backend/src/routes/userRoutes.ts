import { Router } from 'express';
import { updateProfile, purchaseItem, equipItem } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.put('/profile', authenticateToken, updateProfile);
router.post('/store/purchase', authenticateToken, purchaseItem);
router.post('/garage/equip', authenticateToken, equipItem);

export default router;
