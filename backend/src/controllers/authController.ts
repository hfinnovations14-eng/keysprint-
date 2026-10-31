import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'keysprint_secret';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, nickname, countryCode } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({ error: 'Email, password, and nickname are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        authProvider: 'local',
        profile: {
          create: {
            nickname: nickname.trim(),
            countryCode: countryCode || 'US',
            avatarId: '🏎️'
          }
        },
        stats: {
          create: {
            coins: 2500,
            level: 1,
            xp: 0
          }
        },
        inventory: {
          create: [
            { itemId: 'blaze', itemType: 'car', isEquipped: true }
          ]
        }
      },
      include: {
        profile: true,
        stats: true,
        inventory: true
      }
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
        stats: newUser.stats,
        inventory: newUser.inventory
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        stats: true,
        inventory: true
      }
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'This account has been suspended by an administrator' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        stats: user.stats,
        inventory: user.inventory
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const guestLogin = async (req: Request, res: Response) => {
  try {
    const { nickname } = req.body;
    const guestNickname = (nickname && nickname.trim()) || `Guest_${Math.floor(1000 + Math.random() * 9000)}`;

    const guestUser = await prisma.user.create({
      data: {
        authProvider: 'guest',
        role: 'player',
        profile: {
          create: {
            nickname: guestNickname,
            avatarId: '🏎️',
            countryCode: 'US'
          }
        },
        stats: {
          create: {
            coins: 1000,
            level: 1,
            xp: 0
          }
        },
        inventory: {
          create: [
            { itemId: 'starter', itemType: 'car', isEquipped: true }
          ]
        }
      },
      include: {
        profile: true,
        stats: true,
        inventory: true
      }
    });

    const token = jwt.sign(
      { userId: guestUser.id, role: guestUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Guest session created',
      token,
      user: {
        id: guestUser.id,
        role: guestUser.role,
        profile: guestUser.profile,
        stats: guestUser.stats,
        inventory: guestUser.inventory
      }
    });
  } catch (error: any) {
    console.error('Guest login error:', error);
    return res.status(500).json({ error: 'Failed to create guest session' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        stats: true,
        inventory: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
        stats: user.stats,
        inventory: user.inventory
      }
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
