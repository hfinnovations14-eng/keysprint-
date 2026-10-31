import { Router } from 'express';
import { 
  getDashboardMetrics, 
  listUsers, 
  updateUserStatus, 
  listPassages, 
  createPassage, 
  deletePassage 
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/metrics', getDashboardMetrics);
router.get('/users', listUsers);
router.patch('/users/:userId', updateUserStatus);
router.get('/passages', listPassages);
router.post('/passages', createPassage);
router.delete('/passages/:id', deletePassage);

export default router;
