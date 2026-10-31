import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getRandomPassage = async (req: AuthRequest, res: Response) => {
  try {
    const { difficulty } = req.query;

    const where: any = { status: 'active' };
    if (difficulty && typeof difficulty === 'string') {
      where.difficulty = difficulty;
    }

    const count = await prisma.passage.count({ where });
    if (count === 0) {
      return res.json({
        passage: {
          id: 'default',
          text: 'The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway.',
          difficulty: 'normal',
          category: 'general'
        }
      });
    }

    const skip = Math.floor(Math.random() * count);
    const randomPassage = await prisma.passage.findFirst({
      where,
      skip
    });

    return res.json({ passage: randomPassage });
  } catch (error: any) {
    console.error('Passage fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch passage' });
  }
};

export const submitRaceResult = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { wpm, accuracy, durationSec, place, passageId, mode = 'quick' } = req.body;

    if (wpm > 250) {
      return res.status(400).json({ error: 'Unrealistic typing speed flagged for review' });
    }

    let xpEarned = 50;
    if (place === 1) xpEarned += 50;
    else if (place === 2) xpEarned += 30;
    else if (place === 3) xpEarned += 15;

    let coinsEarned = 100 + Math.floor((accuracy / 100) * 50);

    const result = await prisma.$transaction(async (tx) => {
      const race = await tx.raceResult.create({
        data: {
          userId,
          wpm: Math.round(wpm),
          accuracy: Number(accuracy),
          durationSec: Number(durationSec),
          place: Number(place),
          passageId,
          mode,
          xpEarned,
          coinsEarned
        }
      });

      const stats = await tx.playerStats.findUnique({ where: { userId } });
      const currentStats = stats || {
        verifiedBestWpm: 0,
        avgWpm: 0,
        racesCount: 0,
        winsCount: 0,
        xp: 0,
        level: 1,
        coins: 0
      };

      const newRacesCount = currentStats.racesCount + 1;
      const newWinsCount = place === 1 ? currentStats.winsCount + 1 : currentStats.winsCount;
      const newBestWpm = Math.max(currentStats.verifiedBestWpm, Math.round(wpm));
      const newAvgWpm = Math.round(
        (currentStats.avgWpm * currentStats.racesCount + wpm) / newRacesCount
      );
      const newXp = currentStats.xp + xpEarned;
      const newLevel = Math.floor(newXp / 1000) + 1;
      const newCoins = currentStats.coins + coinsEarned;

      await tx.playerStats.upsert({
        where: { userId },
        update: {
          racesCount: newRacesCount,
          winsCount: newWinsCount,
          verifiedBestWpm: newBestWpm,
          avgWpm: newAvgWpm,
          xp: newXp,
          level: newLevel,
          coins: newCoins
        },
        create: {
          userId,
          racesCount: 1,
          winsCount: place === 1 ? 1 : 0,
          verifiedBestWpm: Math.round(wpm),
          avgWpm: Math.round(wpm),
          accuracy: Number(accuracy),
          xp: xpEarned,
          level: newLevel,
          coins: newCoins
        }
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          delta: coinsEarned,
          reason: 'race_reward',
          balancePost: newCoins
        }
      });

      return { race, newCoins, newLevel, newXp };
    });

    return res.status(201).json({
      message: 'Race result submitted successfully',
      result
    });
  } catch (error: any) {
    console.error('Submit race error:', error);
    return res.status(500).json({ error: 'Failed to record race result' });
  }
};

export const getRaceHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const history = await prisma.raceResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return res.json({ history });
  } catch (error: any) {
    console.error('Race history error:', error);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
};
