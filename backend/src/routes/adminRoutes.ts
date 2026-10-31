import { Router } from 'express';
import { 
  getDashboardMetrics, 
  listUsers, 
  updateUserStatus, 
  listPassages, 
  createPassage, 
  retirePassage,
  getAntiCheatLogs,
  getStaffAuditLogs
} from '../controllers/adminController.js';
import { requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/metrics', requireAdmin, getDashboardMetrics);
router.get('/users', requireAdmin, listUsers);
router.put('/users/:userId/status', requireAdmin, updateUserStatus);
router.get('/passages', requireAdmin, listPassages);
router.post('/passages', requireAdmin, createPassage);
router.put('/passages/:passageId/retire', requireAdmin, retirePassage);
router.get('/anticheat', requireAdmin, getAntiCheatLogs);
router.get('/audit', requireAdmin, getStaffAuditLogs);

export default router;
