import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { country, filter } = req.query;

    let targetUserIds: string[] | undefined = undefined;

    if (filter === 'friends') {
      const currentUserId = req.user?.userId;
      if (!currentUserId) {
        return res.status(401).json({ error: 'Authentication required to view friends leaderboard' });
      }

      const friendships = await prisma.friendship.findMany({
        where: {
          status: 'accepted',
          OR: [{ requesterId: currentUserId }, { receiverId: currentUserId }]
        }
      });

      const friendIds = friendships.map(f =>
        f.requesterId === currentUserId ? f.receiverId : f.requesterId
      );

      // Friends leaderboard includes current user + accepted friends
      targetUserIds = [currentUserId, ...friendIds];
    }

    const userWhere: any = {
      status: 'active'
    };

    if (targetUserIds) {
      userWhere.id = { in: targetUserIds };
    }

    if (country && typeof country === 'string' && country !== 'all') {
      userWhere.profile = { countryCode: country };
    }

    const topStats = await prisma.playerStats.findMany({
      where: {
        user: userWhere,
        racesCount: { gt: 0 }
      },
      orderBy: {
        verifiedBestWpm: 'desc'
      },
      take: 50,
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    const leaderboard = topStats.map((stat, idx) => ({
      rank: idx + 1,
      userId: stat.userId,
      nickname: stat.user.profile?.nickname || 'Racer',
      avatar: stat.user.profile?.avatarId || '🏎️',
      country: stat.user.profile?.countryCode || 'US',
      wpm: stat.verifiedBestWpm,
      accuracy: stat.accuracy,
      races: stat.racesCount,
      wins: stat.winsCount,
      level: stat.level,
      isYou: req.user?.userId === stat.userId
    }));

    return res.json({ leaderboard });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
