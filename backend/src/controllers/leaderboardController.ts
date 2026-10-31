import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { country } = req.query;

    const userWhere: any = {
      status: 'active'
    };

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
      level: stat.level
    }));

    return res.json({ leaderboard });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
