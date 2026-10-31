import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { country, limit = '50' } = req.query;
    const take = Math.min(Number(limit) || 50, 100);

    const where: any = {
      user: {
        status: 'active'
      }
    };

    if (country && typeof country === 'string' && country !== 'all') {
      where.user.profile = {
        countryCode: country
      };
    }

    const stats = await prisma.playerStats.findMany({
      where,
      orderBy: [
        { verifiedBestWpm: 'desc' },
        { winsCount: 'desc' }
      ],
      take,
      include: {
        user: {
          select: {
            id: true,
            profile: true
          }
        }
      }
    });

    const formatted = stats.map((item, index) => ({
      rank: index + 1,
      userId: item.userId,
      nickname: item.user?.profile?.nickname || 'Racer',
      avatar: item.user?.profile?.avatarId || '🏎️',
      country: item.user?.profile?.countryCode || 'US',
      wpm: item.verifiedBestWpm,
      accuracy: item.accuracy,
      races: item.racesCount,
      wins: item.winsCount,
      level: item.level
    }));

    return res.json({ leaderboard: formatted });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
