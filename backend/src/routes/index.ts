import { Router } from 'express';
import authRoutes from './authRoutes.js';
import raceRoutes from './raceRoutes.js';
import userRoutes from './userRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/race', raceRoutes);
router.use('/user', userRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KeySprint API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

export default router;
