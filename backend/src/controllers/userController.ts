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

export const purchaseItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { itemId, itemType = 'car', cost } = req.body;

    if (!itemId || cost === undefined) {
      return res.status(400).json({ error: 'itemId and cost required' });
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const stats = await tx.playerStats.findUnique({ where: { userId } });
      if (!stats || stats.coins < cost) {
        throw new Error('INSUFFICIENT_FUNDS');
      }

      const existing = await tx.inventoryItem.findUnique({
        where: { userId_itemId: { userId, itemId } }
      });
      if (existing) {
        throw new Error('ALREADY_OWNED');
      }

      const updatedCoins = stats.coins - cost;
      await tx.playerStats.update({
        where: { userId },
        data: { coins: updatedCoins }
      });

      const newItem = await tx.inventoryItem.create({
        data: {
          userId,
          itemId,
          itemType,
          isEquipped: false
        }
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          delta: -cost,
          reason: `shop_purchase_${itemId}`,
          balancePost: updatedCoins
        }
      });

      return { newItem, remainingCoins: updatedCoins };
    });

    return res.json({
      message: 'Item purchased successfully',
      item: transaction.newItem,
      coins: transaction.remainingCoins
    });
  } catch (error: any) {
    if (error.message === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({ error: 'Insufficient coins in wallet' });
    }
    if (error.message === 'ALREADY_OWNED') {
      return res.status(400).json({ error: 'Item already owned' });
    }
    console.error('Purchase error:', error);
    return res.status(500).json({ error: 'Purchase failed' });
  }
};

export const equipItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { itemId, itemType = 'car' } = req.body;

    await prisma.$transaction(async (tx) => {
      await tx.inventoryItem.updateMany({
        where: { userId, itemType },
        data: { isEquipped: false }
      });

      await tx.inventoryItem.update({
        where: { userId_itemId: { userId, itemId } },
        data: { isEquipped: true }
      });
    });

    return res.json({ message: `Equipped ${itemId}` });
  } catch (error: any) {
    console.error('Equip error:', error);
    return res.status(500).json({ error: 'Failed to equip item' });
  }
};
