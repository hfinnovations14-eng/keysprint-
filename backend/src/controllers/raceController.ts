import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { getRoomByCode } from '../sockets/raceSocket.js';

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

const WEAK_KEY_DRILLS: Record<string, string> = {
  P: "Peter piper picked a pack of purple peppers promptly while purple sports prototypes powered past the pit lane perimeter.",
  Q: "Quick quartz quality requires quiet technique and quaint quintessential quotes about quantum mechanics and torque equations.",
  B: "Blue turbo boosters blast blazing backfires beneath balanced bumpers as brave drivers battle between broad boundaries.",
  Z: "Zealous zooming zebra sports cars zigzagged through freezing blizzard zones with zero hesitation and maximized velocity.",
  X: "Extreme apex execution exhibits extraordinary axle acceleration and unexpected explosive exhaust expansion.",
  C: "Crisp cornering clutches conquer curved circuits as classic custom chassis circle clean competitive courses."
};

const NUMBERS_PUNCTUATION_DRILLS = [
  "In 2026, race #48 clocked 134.5 WPM at $2,500 prize valuation; 99.8% precision with [10/10] nitro boosts!",
  "Lap 1: 01:24.89; Lap 2: 01:23.12 (delta: -1.77s). Fuel pressure at 45.8 PSI, engine temp 98.4°C @ 8,500 RPM.",
  "Formula 1 regulations: Section 14.2(b) stipulates that car weight must exceed 798kg (including driver + tires)."
];

export const getPracticeDrill = async (req: AuthRequest, res: Response) => {
  try {
    const { mode = 'normal', keys = '', duration = '60' } = req.query;

    if (mode === 'numbers') {
      const idx = Math.floor(Math.random() * NUMBERS_PUNCTUATION_DRILLS.length);
      return res.json({
        drill: {
          id: `drill_num_${idx}`,
          title: 'Numbers & Punctuation Practice',
          text: NUMBERS_PUNCTUATION_DRILLS[idx],
          mode: 'numbers'
        }
      });
    }

    if (mode === 'keys') {
      const keyList = (typeof keys === 'string' ? keys.split(',') : ['P', 'Q'])
        .map(k => k.trim().toUpperCase())
        .filter(k => k);

      let drillText = '';
      for (const k of keyList) {
        if (WEAK_KEY_DRILLS[k]) {
          drillText += (drillText ? ' ' : '') + WEAK_KEY_DRILLS[k];
        }
      }
      if (!drillText) {
        drillText = "Quick purple prototypes zigzagged between balanced borders with extreme precision and torque.";
      }

      return res.json({
        drill: {
          id: `drill_keys_${keyList.join('_')}`,
          title: `Targeted Drill: ${keyList.join(', ')} Keys`,
          text: drillText,
          mode: 'keys',
          targetKeys: keyList
        }
      });
    }

    if (mode === 'timed') {
      const longPassages = [
        "Consistent rhythm and calm hand position unlock maximum typing speed. Keep your fingers hovering lightly above the home row, striking each letter with relaxed precision. Focus on smooth keystrokes rather than rushing, because rhythm naturally transforms into velocity.",
        "High performance motorsport engineering requires complete synchronization between mechanical hardware and human reaction timing. A racing driver processes tire friction and apex curvature in split seconds, just as an elite typist translates words into finger movements without hesitation."
      ];
      const idx = Math.floor(Math.random() * longPassages.length);
      return res.json({
        drill: {
          id: `drill_timed_${duration}`,
          title: `${duration}s Timed Speed Sprint`,
          text: longPassages[idx],
          mode: 'timed',
          durationSec: Number(duration) || 60
        }
      });
    }

    return getRandomPassage(req, res);
  } catch (error: any) {
    console.error('Practice drill error:', error);
    return res.status(500).json({ error: 'Failed to generate practice drill' });
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
      if (stats) {
        const newRacesCount = stats.racesCount + 1;
        const newWinsCount = place === 1 ? stats.winsCount + 1 : stats.winsCount;
        const newBestWpm = Math.max(stats.verifiedBestWpm, Math.round(wpm));
        const newAvgWpm = Math.round((stats.avgWpm * stats.racesCount + wpm) / newRacesCount);
        const newAccuracy = Number(((stats.accuracy * stats.racesCount + accuracy) / newRacesCount).toFixed(1));
        const newXp = stats.xp + xpEarned;
        const newLevel = Math.floor(newXp / 1000) + 1;
        const newCoins = stats.coins + coinsEarned;

        await tx.playerStats.update({
          where: { userId },
          data: {
            racesCount: newRacesCount,
            winsCount: newWinsCount,
            verifiedBestWpm: newBestWpm,
            avgWpm: newAvgWpm,
            accuracy: newAccuracy,
            xp: newXp,
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

        // Evaluate Driver Achievements
        const existingAchievements = await tx.userAchievement.findMany({
          where: { userId },
          include: { achievement: true }
        });
        const ownedCodes = new Set(existingAchievements.map(ua => ua.achievement.code));
        const carCount = await tx.inventoryItem.count({ where: { userId, itemType: 'car' } });

        const codesToAward: string[] = [];
        if (!ownedCodes.has('first_race') && newRacesCount >= 1) codesToAward.push('first_race');
        if (!ownedCodes.has('speed_demon_100') && wpm >= 100) codesToAward.push('speed_demon_100');
        if (!ownedCodes.has('speed_demon_125') && wpm >= 125) codesToAward.push('speed_demon_125');
        if (!ownedCodes.has('speed_demon_150') && wpm >= 150) codesToAward.push('speed_demon_150');
        if (!ownedCodes.has('sharpshooter_98') && accuracy >= 98) codesToAward.push('sharpshooter_98');
        if (!ownedCodes.has('sharpshooter_100') && accuracy >= 100) codesToAward.push('sharpshooter_100');
        if (!ownedCodes.has('podium_winner') && place === 1) codesToAward.push('podium_winner');
        if (!ownedCodes.has('podium_master_10') && newWinsCount >= 10) codesToAward.push('podium_master_10');
        if (!ownedCodes.has('racer_veteran_10') && newRacesCount >= 10) codesToAward.push('racer_veteran_10');
        if (!ownedCodes.has('racer_veteran_50') && newRacesCount >= 50) codesToAward.push('racer_veteran_50');
        if (!ownedCodes.has('fleet_owner_3') && carCount >= 3) codesToAward.push('fleet_owner_3');
        if (!ownedCodes.has('private_duelist') && mode === 'private') codesToAward.push('private_duelist');

        const newlyUnlocked: any[] = [];
        let bonusXp = 0;
        let bonusCoins = 0;

        for (const code of codesToAward) {
          const ach = await tx.achievement.findUnique({ where: { code } });
          if (ach) {
            await tx.userAchievement.create({
              data: {
                userId,
                achievementId: ach.id
              }
            });
            bonusXp += ach.xpReward;
            bonusCoins += ach.coinReward;
            newlyUnlocked.push(ach);
          }
        }

        if (bonusCoins > 0 || bonusXp > 0) {
          const finalCoins = newCoins + bonusCoins;
          const finalXp = newXp + bonusXp;
          const finalLevel = Math.floor(finalXp / 1000) + 1;

          await tx.playerStats.update({
            where: { userId },
            data: {
              coins: finalCoins,
              xp: finalXp,
              level: finalLevel
            }
          });

          await tx.walletTransaction.create({
            data: {
              userId,
              delta: bonusCoins,
              reason: 'achievement_reward',
              balancePost: finalCoins
            }
          });
        }

        return {
          race,
          unlockedAchievements: newlyUnlocked,
          totalXpEarned: xpEarned + bonusXp,
          totalCoinsEarned: coinsEarned + bonusCoins
        };
      }

      return {
        race,
        unlockedAchievements: [],
        totalXpEarned: xpEarned,
        totalCoinsEarned: coinsEarned
      };
    });

    return res.status(201).json({
      message: 'Race result saved successfully',
      result: result.race,
      rewards: { xpEarned: result.totalXpEarned, coinsEarned: result.totalCoinsEarned },
      unlockedAchievements: result.unlockedAchievements
    });
  } catch (error: any) {
    console.error('Submit race error:', error);
    return res.status(500).json({ error: 'Failed to save race result' });
  }
};

export const getRaceHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const races = await prisma.raceResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return res.json({ races });
  } catch (error: any) {
    console.error('Race history error:', error);
    return res.status(500).json({ error: 'Failed to fetch race history' });
  }
};

export const checkRoomExists = async (req: AuthRequest, res: Response) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ error: 'Room code is required' });
    }

    const room = getRoomByCode(code);
    if (!room) {
      return res.status(404).json({ exists: false, error: 'Room not found or expired' });
    }

    return res.json({
      exists: true,
      room
    });
  } catch (error: any) {
    console.error('Check room error:', error);
    return res.status(500).json({ error: 'Failed to check room status' });
  }
};
