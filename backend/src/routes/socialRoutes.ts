import { Router } from 'express';
import {
  getFriends,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship,
  getNotifications,
  markNotificationRead,
  challengeFriend
} from '../controllers/socialController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/friends', authenticateToken, getFriends);
router.get('/users/search', authenticateToken, searchUsers);
router.post('/friends/request', authenticateToken, sendFriendRequest);
router.put('/friends/accept', authenticateToken, acceptFriendRequest);
router.delete('/friends/:id', authenticateToken, removeFriendship);
router.get('/notifications', authenticateToken, getNotifications);
router.put('/notifications/:id/read', authenticateToken, markNotificationRead);
router.post('/challenge', authenticateToken, challengeFriend);

export default router;

