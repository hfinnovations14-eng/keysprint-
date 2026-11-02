import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { nickname, avatarId, countryCode, bio } = req.body;

    const updated = await prisma.profile.update({
      where: { userId },
      data: {
        ...(nickname && { nickname: nickname.trim() }),
        ...(avatarId && { avatarId }),
        ...(countryCode && { countryCode }),
        ...(bio !== undefined && { bio })
      }
    });

    return res.json({ profile: updated });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  itemType: 'car' | 'trail' | 'bundle';
  category: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  bundledItems?: Array<{ itemId: string; itemType: string }>;
}

export const ITEM_CATALOG: Record<string, CatalogItem> = {
  // Vehicles
  starter: { id: 'starter', name: 'Starter Car', price: 0, itemType: 'car', category: 'Common' },
  blaze: { id: 'blaze', name: 'Blaze Runner', price: 1200, itemType: 'car', category: 'Rare' },
  golden: { id: 'golden', name: 'Golden Flash', price: 1800, itemType: 'car', category: 'Epic' },
  neon: { id: 'neon', name: 'Neon Rider', price: 2000, itemType: 'car', category: 'Epic' },
  shadow: { id: 'shadow', name: 'Shadow X', price: 2500, itemType: 'car', category: 'Legendary' },
  ice: { id: 'ice', name: 'Ice Drift', price: 1400, itemType: 'car', category: 'Rare' },
  forest: { id: 'forest', name: 'Forest Beast', price: 1500, itemType: 'car', category: 'Rare' },
  rose: { id: 'rose', name: 'Rose Racer', price: 1900, itemType: 'car', category: 'Epic' },
  retro: { id: 'retro', name: 'Retro Classic', price: 2200, itemType: 'car', category: 'Epic' },
  jeep: { id: 'jeep', name: 'Jeep Pioneer', price: 1600, itemType: 'car', category: 'Common' },

  // Nitro Trails
  'trail-nitro-cyan': { id: 'trail-nitro-cyan', name: 'Frostbite Vapor Trail', price: 600, itemType: 'trail', category: 'Rare' },
  'trail-solar-gold': { id: 'trail-solar-gold', name: 'Hypernova Golden Flare', price: 900, itemType: 'trail', category: 'Epic' },
  'trail-void-purple': { id: 'trail-void-purple', name: 'Singularity Drift Smoke', price: 1200, itemType: 'trail', category: 'Legendary' },

  // Special Bundles
  'bundle-racing-legend': {
    id: 'bundle-racing-legend',
    name: 'Racing Legend Pack (Bundle)',
    price: 3500,
    itemType: 'bundle',
    category: 'Legendary',
    bundledItems: [
      { itemId: 'blaze', itemType: 'car' },
      { itemId: 'golden', itemType: 'car' },
      { itemId: 'shadow', itemType: 'car' },
      { itemId: 'trail-void-purple', itemType: 'trail' }
    ]
  }
};

export const purchaseItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { itemId } = req.body;

    if (!itemId || typeof itemId !== 'string') {
      return res.status(400).json({ error: 'Valid itemId required' });
    }

    const catalogItem = ITEM_CATALOG[itemId];
    if (!catalogItem) {
      return res.status(404).json({ error: `Item '${itemId}' not found in catalog` });
    }

    // Authoritative server-side price and item type (never trust client cost)
    const cost = catalogItem.price;
    const itemType = catalogItem.itemType;

    const transaction = await prisma.$transaction(async (tx) => {
      const stats = await tx.playerStats.findUnique({ where: { userId } });
      if (!stats || stats.coins < cost) {
        throw new Error('INSUFFICIENT_FUNDS');
      }

      let grantedItem = null;

      if (itemType === 'bundle' && catalogItem.bundledItems) {
        // Verify user doesn't already own all bundled items
        const ownedItems = await tx.inventoryItem.findMany({
          where: {
            userId,
            itemId: { in: catalogItem.bundledItems.map(b => b.itemId) }
          }
        });

        if (ownedItems.length === catalogItem.bundledItems.length) {
          throw new Error('ALREADY_OWNED');
        }

        const ownedItemIds = new Set(ownedItems.map(o => o.itemId));
        for (const item of catalogItem.bundledItems) {
          if (!ownedItemIds.has(item.itemId)) {
            await tx.inventoryItem.create({
              data: {
                userId,
                itemId: item.itemId,
                itemType: item.itemType,
                isEquipped: false
              }
            });
          }
        }
        grantedItem = { itemId, itemType, name: catalogItem.name };
      } else {
        const existing = await tx.inventoryItem.findUnique({
          where: { userId_itemId: { userId, itemId } }
        });
        if (existing) {
          throw new Error('ALREADY_OWNED');
        }

        grantedItem = await tx.inventoryItem.create({
          data: {
            userId,
            itemId,
            itemType,
            isEquipped: false
          }
        });
      }

      const updatedCoins = stats.coins - cost;
      await tx.playerStats.update({
        where: { userId },
        data: { coins: updatedCoins }
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          delta: -cost,
          reason: `purchase_${itemType}_${itemId}`,
          balancePost: updatedCoins
        }
      });

      return { newItem: grantedItem, coins: updatedCoins };
    });

    return res.json({
      message: 'Purchase successful',
      item: transaction.newItem,
      coins: transaction.coins
    });
  } catch (error: any) {
    if (error.message === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({ error: 'Insufficient KeySprint coins' });
    }
    if (error.message === 'ALREADY_OWNED' || error.code === 'P2002') {
      return res.status(400).json({ error: 'Item is already owned' });
    }
    console.error('Purchase error:', error);
    return res.status(500).json({ error: 'Failed to process purchase' });
  }
};

export const equipItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { itemId, itemType = 'car' } = req.body;

    if (!itemId || typeof itemId !== 'string') {
      return res.status(400).json({ error: 'Valid itemId required' });
    }

    await prisma.$transaction(async (tx) => {
      let userItem = await tx.inventoryItem.findUnique({
        where: { userId_itemId: { userId, itemId } }
      });

      // Free starter car reconciliation: auto-grant starter if user doesn't have it yet
      if (!userItem) {
        if (itemId === 'starter') {
          userItem = await tx.inventoryItem.create({
            data: {
              userId,
              itemId: 'starter',
              itemType: 'car',
              isEquipped: true
            }
          });
        } else {
          throw new Error('NOT_OWNED');
        }
      }

      // Ensure item matches the requested equipment category
      if (userItem.itemType !== itemType) {
        throw new Error('INVALID_ITEM_TYPE');
      }

      // Un-equip any currently active item of this type
      await tx.inventoryItem.updateMany({
        where: { userId, itemType, isEquipped: true },
        data: { isEquipped: false }
      });

      // Equip the target item
      await tx.inventoryItem.update({
        where: { userId_itemId: { userId, itemId } },
        data: { isEquipped: true }
      });
    });

    return res.json({ message: 'Item equipped successfully', itemId, itemType });
  } catch (error: any) {
    if (error.message === 'NOT_OWNED') {
      return res.status(400).json({ error: 'You do not own this vehicle' });
    }
    if (error.message === 'INVALID_ITEM_TYPE') {
      return res.status(400).json({ error: 'Item cannot be equipped in this slot' });
    }
    console.error('Equip item error:', error);
    return res.status(500).json({ error: 'Failed to equip item' });
  }
};

export const getUserAchievements = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const [allAchievements, userAchievements, stats, carCount] = await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true }
      }),
      prisma.playerStats.findUnique({ where: { userId } }),
      prisma.inventoryItem.count({ where: { userId, itemType: 'car' } })
    ]);

    const earnedMap = new Map(userAchievements.map(ua => [ua.achievementId, ua.earnedAt]));

    const userRaces = stats?.racesCount || 0;
    const userWins = stats?.winsCount || 0;
    const bestWpm = stats?.verifiedBestWpm || 0;
    const avgAcc = stats?.accuracy || 0;

    const formatted = allAchievements.map(ach => {
      const isCompleted = earnedMap.has(ach.id);
      let progressText = '0/1';
      let progressPercent = 0;
      let category: 'Completed' | 'In Progress' | 'Locked' = isCompleted ? 'Completed' : 'Locked';

      if (isCompleted) {
        progressText = 'Completed';
        progressPercent = 100;
      } else {
        switch (ach.code) {
          case 'first_race':
            progressText = `${Math.min(1, userRaces)}/1`;
            progressPercent = (Math.min(1, userRaces) / 1) * 100;
            if (userRaces > 0) category = 'In Progress';
            break;
          case 'speed_demon_100':
            progressText = `${Math.min(100, bestWpm)}/100 WPM`;
            progressPercent = Math.min(100, (bestWpm / 100) * 100);
            if (bestWpm >= 70) category = 'In Progress';
            break;
          case 'speed_demon_125':
            progressText = `${Math.min(125, bestWpm)}/125 WPM`;
            progressPercent = Math.min(100, (bestWpm / 125) * 100);
            if (bestWpm >= 90) category = 'In Progress';
            break;
          case 'speed_demon_150':
            progressText = `${Math.min(150, bestWpm)}/150 WPM`;
            progressPercent = Math.min(100, (bestWpm / 150) * 100);
            if (bestWpm >= 110) category = 'In Progress';
            break;
          case 'sharpshooter_98':
            progressText = `${avgAcc.toFixed(1)}/98.0%`;
            progressPercent = Math.min(100, (avgAcc / 98) * 100);
            if (avgAcc >= 90) category = 'In Progress';
            break;
          case 'sharpshooter_100':
            progressText = `${avgAcc.toFixed(1)}/100%`;
            progressPercent = Math.min(100, avgAcc);
            if (avgAcc >= 95) category = 'In Progress';
            break;
          case 'podium_winner':
            progressText = `${Math.min(1, userWins)}/1 Win`;
            progressPercent = Math.min(100, (userWins / 1) * 100);
            if (userWins > 0) category = 'In Progress';
            break;
          case 'podium_master_10':
            progressText = `${Math.min(10, userWins)}/10 Wins`;
            progressPercent = Math.min(100, (userWins / 10) * 100);
            if (userWins > 0) category = 'In Progress';
            break;
          case 'racer_veteran_10':
            progressText = `${Math.min(10, userRaces)}/10 Races`;
            progressPercent = Math.min(100, (userRaces / 10) * 100);
            if (userRaces > 0) category = 'In Progress';
            break;
          case 'racer_veteran_50':
            progressText = `${Math.min(50, userRaces)}/50 Races`;
            progressPercent = Math.min(100, (userRaces / 50) * 100);
            if (userRaces >= 10) category = 'In Progress';
            break;
          case 'fleet_owner_3':
            progressText = `${Math.min(3, carCount)}/3 Cars`;
            progressPercent = Math.min(100, (carCount / 3) * 100);
            if (carCount > 1) category = 'In Progress';
            break;
          case 'private_duelist':
            progressText = '0/1 Race';
            progressPercent = 0;
            break;
        }
      }

      return {
        id: ach.id,
        code: ach.code,
        title: ach.title,
        desc: ach.description,
        icon: ach.badgeIcon,
        rewardXP: ach.xpReward,
        rewardCoins: ach.coinReward,
        category,
        progress: progressText,
        progressPercent: Math.round(progressPercent),
        earnedAt: earnedMap.get(ach.id) || null
      };
    });

    return res.json({ achievements: formatted });
  } catch (error: any) {
    console.error('Fetch achievements error:', error);
    return res.status(500).json({ error: 'Failed to fetch achievements' });
  }
};

const DAILY_QUESTS_POOL = [
  {
    id: 'quest_sprint_3',
    title: 'Daily Grand Prix',
    description: 'Complete 3 multiplayer typing races today',
    max: 3,
    xpReward: 200,
    coinReward: 150,
    type: 'race_count'
  },
  {
    id: 'quest_speed_100',
    title: 'Velocity Surge',
    description: 'Hit 100 WPM or higher in any race mode today',
    max: 1,
    xpReward: 250,
    coinReward: 200,
    type: 'wpm_target',
    targetWpm: 100
  },
  {
    id: 'quest_accuracy_98',
    title: 'Precision Master',
    description: 'Finish a race with 98% accuracy or higher today',
    max: 1,
    xpReward: 300,
    coinReward: 250,
    type: 'accuracy_target',
    targetAcc: 98
  },
  {
    id: 'quest_win_1',
    title: 'Podium Hunter',
    description: 'Win 1st place in an official race today',
    max: 1,
    xpReward: 350,
    coinReward: 300,
    type: 'win_count'
  },
  {
    id: 'quest_private_1',
    title: 'Friend Duelist',
    description: 'Compete in a custom private room lobby today',
    max: 1,
    xpReward: 200,
    coinReward: 150,
    type: 'private_race'
  }
];

export const getDailyChallenges = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const dayOfYear = Math.floor((now.getTime() - new Date(Date.UTC(now.getUTCFullYear(), 0, 0)).getTime()) / (1000 * 60 * 60 * 24));
    const selectedQuests = [
      DAILY_QUESTS_POOL[dayOfYear % DAILY_QUESTS_POOL.length],
      DAILY_QUESTS_POOL[(dayOfYear + 1) % DAILY_QUESTS_POOL.length],
      DAILY_QUESTS_POOL[(dayOfYear + 2) % DAILY_QUESTS_POOL.length]
    ];

    const todayRaces = await prisma.raceResult.findMany({
      where: {
        userId,
        createdAt: { gte: startOfDay }
      }
    });

    const claims = await prisma.dailyChallengeClaim.findMany({
      where: {
        userId,
        claimedDate: todayStr
      }
    });
    const claimedSet = new Set(claims.map(c => c.challengeId));

    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const msUntilReset = endOfDay.getTime() - now.getTime();
    const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60));
    const minsUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));
    const resetTimeFormatted = `${hoursUntilReset}h ${minsUntilReset}m`;

    const challenges = selectedQuests.map(q => {
      let progress = 0;
      switch (q.type) {
        case 'race_count':
          progress = todayRaces.length;
          break;
        case 'wpm_target':
          progress = todayRaces.some(r => r.wpm >= (q.targetWpm || 100)) ? 1 : 0;
          break;
        case 'accuracy_target':
          progress = todayRaces.some(r => r.accuracy >= (q.targetAcc || 98)) ? 1 : 0;
          break;
        case 'win_count':
          progress = todayRaces.filter(r => r.place === 1).length;
          break;
        case 'private_race':
          progress = todayRaces.some(r => r.mode === 'private') ? 1 : 0;
          break;
      }

      const clampedProgress = Math.min(q.max, progress);
      const isCompleted = clampedProgress >= q.max;
      const isClaimed = claimedSet.has(q.id);

      return {
        id: q.id,
        title: q.title,
        description: q.description,
        progress: clampedProgress,
        max: q.max,
        completed: isCompleted,
        claimed: isClaimed,
        xpReward: q.xpReward,
        coinReward: q.coinReward
      };
    });

    return res.json({
      challenges,
      resetsIn: resetTimeFormatted,
      date: todayStr
    });
  } catch (error: any) {
    console.error('Fetch daily challenges error:', error);
    return res.status(500).json({ error: 'Failed to fetch daily challenges' });
  }
};

export const claimDailyChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { challengeId } = req.body;
    if (!challengeId) return res.status(400).json({ error: 'challengeId is required' });

    const quest = DAILY_QUESTS_POOL.find(q => q.id === challengeId);
    if (!quest) return res.status(404).json({ error: 'Challenge not found' });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const existingClaim = await prisma.dailyChallengeClaim.findUnique({
      where: {
        userId_challengeId_claimedDate: {
          userId,
          challengeId,
          claimedDate: todayStr
        }
      }
    });
    if (existingClaim) {
      return res.status(400).json({ error: 'Challenge reward already claimed today' });
    }

    const todayRaces = await prisma.raceResult.findMany({
      where: {
        userId,
        createdAt: { gte: startOfDay }
      }
    });

    let completed = false;
    switch (quest.type) {
      case 'race_count':
        completed = todayRaces.length >= quest.max;
        break;
      case 'wpm_target':
        completed = todayRaces.some(r => r.wpm >= (quest.targetWpm || 100));
        break;
      case 'accuracy_target':
        completed = todayRaces.some(r => r.accuracy >= (quest.targetAcc || 98));
        break;
      case 'win_count':
        completed = todayRaces.filter(r => r.place === 1).length >= quest.max;
        break;
      case 'private_race':
        completed = todayRaces.some(r => r.mode === 'private');
        break;
    }

    if (!completed) {
      return res.status(400).json({ error: 'Challenge criteria not yet completed' });
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.dailyChallengeClaim.create({
        data: {
          userId,
          challengeId,
          claimedDate: todayStr
        }
      });

      const stats = await tx.playerStats.findUnique({ where: { userId } });
      const currentCoins = stats?.coins || 0;
      const currentXp = stats?.xp || 0;
      const newCoins = currentCoins + quest.coinReward;
      const newXp = currentXp + quest.xpReward;
      const newLevel = Math.floor(newXp / 1000) + 1;

      await tx.playerStats.update({
        where: { userId },
        data: {
          coins: newCoins,
          xp: newXp,
          level: newLevel
        }
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          delta: quest.coinReward,
          reason: `daily_quest_${quest.id}`,
          balancePost: newCoins
        }
      });

      return { newCoins, newXp, newLevel };
    });

    return res.json({
      message: 'Challenge reward claimed successfully',
      challengeId,
      xpEarned: quest.xpReward,
      coinsEarned: quest.coinReward,
      stats: result
    });
  } catch (error: any) {
    console.error('Claim daily challenge error:', error);
    return res.status(500).json({ error: 'Failed to claim challenge reward' });
  }
};
