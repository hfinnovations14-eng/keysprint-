import { Router } from 'express';
import { getDashboardMetrics, listUsers, updateUserStatus, listPassages, createPassage } from '../controllers/adminController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/metrics', requireAdmin, getDashboardMetrics);
router.get('/users', requireAdmin, listUsers);
router.put('/users/:userId/status', requireAdmin, updateUserStatus);
router.get('/passages', requireAdmin, listPassages);
router.post('/passages', requireAdmin, createPassage);

export default router;
