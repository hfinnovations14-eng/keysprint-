import { Request, Response } from 'express';
import { prisma } from '../config/db.js';

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const [totalUsers, totalRaces, totalPassages, avgStats] = await Promise.all([
      prisma.user.count(),
      prisma.raceResult.count(),
      prisma.passage.count({ where: { status: 'active' } }),
      prisma.playerStats.aggregate({
        _avg: {
          verifiedBestWpm: true,
          accuracy: true
        }
      })
    ]);

    return res.json({
      metrics: {
        totalUsers,
        totalRaces,
        totalPassages,
        avgWpm: Math.round(avgStats._avg.verifiedBestWpm || 0),
        avgAccuracy: Math.round((avgStats._avg.accuracy || 0) * 10) / 10,
        activeLobbies: 4,
        queueWaitTime: '4.2s',
        serverUptime: '99.98%'
      }
    });
  } catch (error: any) {
    console.error('Admin metrics error:', error);
    return res.status(500).json({ error: 'Failed to fetch admin metrics' });
  }
};

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
        stats: true
      }
    });

    return res.json({ users });
  } catch (error: any) {
    console.error('List users error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status, role } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(status && { status }),
        ...(role && { role })
      }
    });

    return res.json({ user: updated });
  } catch (error: any) {
    console.error('Update user status error:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
};

export const listPassages = async (req: Request, res: Response) => {
  try {
    const passages = await prisma.passage.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ passages });
  } catch (error: any) {
    console.error('List passages error:', error);
    return res.status(500).json({ error: 'Failed to fetch passages' });
  }
};

export const createPassage = async (req: Request, res: Response) => {
  try {
    const { text, difficulty = 'normal', category = 'general' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Passage text required' });
    }

    const passage = await prisma.passage.create({
      data: {
        text: text.trim(),
        difficulty,
        category
      }
    });

    return res.status(201).json({ passage });
  } catch (error: any) {
    console.error('Create passage error:', error);
    return res.status(500).json({ error: 'Failed to create passage' });
  }
};
