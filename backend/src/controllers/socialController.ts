import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { isUserOnline, sendSocketNotification } from '../sockets/raceSocket.js';

export const getFriends = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { receiverId: userId }]
      },
      include: {
        requester: {
          include: {
            profile: true,
            stats: true,
            inventory: { where: { isEquipped: true } }
          }
        },
        receiver: {
          include: {
            profile: true,
            stats: true,
            inventory: { where: { isEquipped: true } }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const friends: any[] = [];
    const incomingRequests: any[] = [];
    const outgoingRequests: any[] = [];

    for (const f of friendships) {
      const isRequester = f.requesterId === userId;
      const otherUser = isRequester ? f.receiver : f.requester;
      if (!otherUser) continue;

      const online = isUserOnline(otherUser.id);
      const equippedCar = otherUser.inventory[0]?.itemId || 'blaze';

      const friendPayload = {
        friendshipId: f.id,
        id: otherUser.id,
        name: otherUser.profile?.nickname || 'Racer',
        avatar: otherUser.profile?.avatarId || '🏎️',
        country: otherUser.profile?.countryCode || 'US',
        wpm: otherUser.stats?.avgWpm || 100,
        bestWpm: otherUser.stats?.verifiedBestWpm || 100,
        races: otherUser.stats?.racesCount || 0,
        level: otherUser.stats?.level || 1,
        car: equippedCar,
        status: online ? 'Online' : 'Offline',
        canChallenge: online,
        createdAt: f.createdAt
      };

      if (f.status === 'accepted') {
        friends.push(friendPayload);
      } else if (f.status === 'pending') {
        if (isRequester) {
          outgoingRequests.push(friendPayload);
        } else {
          incomingRequests.push(friendPayload);
        }
      }
    }

    return res.json({
      friends,
      incomingRequests,
      outgoingRequests
    });
  } catch (error: any) {
    console.error('Get friends error:', error);
    return res.status(500).json({ error: 'Failed to fetch friends' });
  }
};

export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const q = ((req.query.q as string) || '').trim();
    if (!q) {
      return res.json({ users: [] });
    }

    const matchedProfiles = await prisma.profile.findMany({
      where: {
        nickname: { contains: q },
        userId: { not: userId }
      },
      include: {
        user: {
          include: {
            stats: true,
            inventory: { where: { isEquipped: true } }
          }
        }
      },
      take: 15
    });

    // Check existing friendship relations with current user
    const userFriendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { receiverId: userId }]
      }
    });

    const relationMap = new Map<string, { status: string; friendshipId: string; isRequester: boolean }>();
    for (const f of userFriendships) {
      const otherId = f.requesterId === userId ? f.receiverId : f.requesterId;
      relationMap.set(otherId, {
        status: f.status,
        friendshipId: f.id,
        isRequester: f.requesterId === userId
      });
    }

    const results = matchedProfiles.map(p => {
      const u = p.user;
      const relation = relationMap.get(p.userId);
      let relationship: 'friend' | 'pending_sent' | 'pending_received' | 'none' = 'none';

      if (relation) {
        if (relation.status === 'accepted') relationship = 'friend';
        else if (relation.status === 'pending') {
          relationship = relation.isRequester ? 'pending_sent' : 'pending_received';
        }
      }

      return {
        id: p.userId,
        name: p.nickname,
        avatar: p.avatarId,
        country: p.countryCode,
        bestWpm: u.stats?.verifiedBestWpm || 0,
        races: u.stats?.racesCount || 0,
        level: u.stats?.level || 1,
        car: u.inventory[0]?.itemId || 'blaze',
        isOnline: isUserOnline(p.userId),
        relationship,
        friendshipId: relation?.friendshipId
      };
    });

    return res.json({ users: results });
  } catch (error: any) {
    console.error('Search users error:', error);
    return res.status(500).json({ error: 'Failed to search users' });
  }
};

export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { targetUserId, nickname } = req.body;
    let targetId = targetUserId;

    if (!targetId && nickname) {
      const profile = await prisma.profile.findFirst({
        where: { nickname: { equals: nickname.trim() } }
      });
      if (profile) targetId = profile.userId;
    }

    if (!targetId) {
      return res.status(400).json({ error: 'Target racer not found' });
    }

    if (targetId === userId) {
      return res.status(400).json({ error: 'You cannot send a friend request to yourself' });
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, receiverId: targetId },
          { requesterId: targetId, receiverId: userId }
        ]
      }
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ error: 'You are already friends with this racer' });
      }
      return res.status(400).json({ error: 'A pending friend request already exists' });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId: userId,
        receiverId: targetId,
        status: 'pending'
      }
    });

    // Fetch sender profile for notification
    const senderProfile = await prisma.profile.findUnique({ where: { userId } });
    const senderName = senderProfile?.nickname || 'A racer';

    const notif = await prisma.userNotification.create({
      data: {
        userId: targetId,
        type: 'friend_request',
        title: 'New Friend Request',
        message: `${senderName} wants to add you as a racing rival!`,
        data: JSON.stringify({ requesterId: userId, requesterName: senderName, friendshipId: friendship.id })
      }
    });

    sendSocketNotification(targetId, 'notification.new', notif);

    return res.status(201).json({
      message: 'Friend request sent',
      friendship
    });
  } catch (error: any) {
    console.error('Send friend request error:', error);
    return res.status(500).json({ error: 'Failed to send friend request' });
  }
};

export const acceptFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { friendshipId } = req.body;
    if (!friendshipId) return res.status(400).json({ error: 'friendshipId is required' });

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    });

    if (!friendship || friendship.receiverId !== userId) {
      return res.status(404).json({ error: 'Friend request not found or unauthorized' });
    }

    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'accepted' }
    });

    // Notify requester
    const receiverProfile = await prisma.profile.findUnique({ where: { userId } });
    const receiverName = receiverProfile?.nickname || 'Your rival';

    const notif = await prisma.userNotification.create({
      data: {
        userId: friendship.requesterId,
        type: 'friend_accepted',
        title: 'Friend Request Accepted',
        message: `${receiverName} accepted your friend request! You can now challenge each other directly.`,
        data: JSON.stringify({ friendId: userId, friendName: receiverName })
      }
    });

    sendSocketNotification(friendship.requesterId, 'notification.new', notif);

    return res.json({
      message: 'Friend request accepted',
      friendship: updated
    });
  } catch (error: any) {
    console.error('Accept friend request error:', error);
    return res.status(500).json({ error: 'Failed to accept friend request' });
  }
};

export const removeFriendship = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const friendship = await prisma.friendship.findUnique({
      where: { id }
    });

    if (!friendship || (friendship.requesterId !== userId && friendship.receiverId !== userId)) {
      return res.status(404).json({ error: 'Friendship not found or unauthorized' });
    }

    await prisma.friendship.delete({ where: { id } });

    return res.json({ message: 'Friendship removed successfully' });
  } catch (error: any) {
    console.error('Remove friendship error:', error);
    return res.status(500).json({ error: 'Failed to remove friendship' });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const notifications = await prisma.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return res.json({
      notifications,
      unreadCount
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    if (id === 'all') {
      await prisma.userNotification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      return res.json({ message: 'All notifications marked as read' });
    }

    await prisma.userNotification.updateMany({
      where: { id, userId },
      data: { isRead: true }
    });

    return res.json({ message: 'Notification marked as read' });
  } catch (error: any) {
    console.error('Mark notification read error:', error);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const challengeFriend = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { friendUserId, roomCode } = req.body;
    if (!friendUserId) return res.status(400).json({ error: 'friendUserId is required' });

    const code = roomCode || `SPRINT-${Math.floor(10 + Math.random() * 90)}`;

    const myProfile = await prisma.profile.findUnique({ where: { userId } });
    const myName = myProfile?.nickname || 'Your rival';
    const myAvatar = myProfile?.avatarId || '🏎️';

    const notif = await prisma.userNotification.create({
      data: {
        userId: friendUserId,
        type: 'race_invite',
        title: 'Private Race Challenge!',
        message: `${myName} challenged you to a typing duel in room ${code}!`,
        data: JSON.stringify({
          roomCode: code,
          challengerId: userId,
          challengerName: myName,
          challengerAvatar: myAvatar
        })
      }
    });

    sendSocketNotification(friendUserId, 'notification.new', notif);
    sendSocketNotification(friendUserId, 'social.challenge_received', {
      roomCode: code,
      challengerName: myName,
      challengerAvatar: myAvatar
    });

    return res.json({
      message: 'Race challenge sent successfully',
      roomCode: code
    });
  } catch (error: any) {
    console.error('Challenge friend error:', error);
    return res.status(500).json({ error: 'Failed to send challenge' });
  }
};

