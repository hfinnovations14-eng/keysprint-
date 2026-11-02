import { Response } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

// Seed default tournaments if database has none
const seedDefaultTournamentsIfEmpty = async () => {
  try {
    const count = await prisma.tournament.count();
    if (count > 0) return;

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    await prisma.tournament.createMany({
      data: [
        {
          title: 'Speed Sprint Weekly Cup',
          description: 'Open division sprint cup. Maximize your WPM and accuracy over competitive 1v1 sprints to top the leaderboard.',
          status: 'active',
          startTime: new Date(now - dayMs),
          endTime: new Date(now + 3 * dayMs),
          entryFeeCoins: 100,
          minLevel: 1,
          prizePoolCoins: 5000,
          trackId: 'green-valley',
          rules: 'Open to all levels. High-speed 1v1 heats. Best single-race WPM + accuracy determines championship points.'
        },
        {
          title: 'Midnight Drifters Invitational',
          description: 'High-stakes nighttime street sprint championship through the neon city highway.',
          status: 'upcoming',
          startTime: new Date(now + 2 * dayMs),
          endTime: new Date(now + 5 * dayMs),
          entryFeeCoins: 250,
          minLevel: 2,
          prizePoolCoins: 15000,
          trackId: 'city-night',
          rules: 'Level 2+ required. Double points awarded for races exceeding 110 WPM with >98% accuracy.'
        },
        {
          title: 'Apex Championship Series',
          description: 'Grand master tournament series featuring KeySprint elite racing veterans.',
          status: 'completed',
          startTime: new Date(now - 7 * dayMs),
          endTime: new Date(now - 1 * dayMs),
          entryFeeCoins: 500,
          minLevel: 3,
          prizePoolCoins: 30000,
          trackId: 'desert-rush',
          rules: 'Level 3+ championship series. Top 3 finalists share 30,000 Coin prize pool and exclusive car cosmetics.'
        }
      ]
    });
  } catch (err) {
    console.error('Error seeding default tournaments:', err);
  }
};

export const getTournaments = async (req: AuthRequest, res: Response) => {
  try {
    await seedDefaultTournamentsIfEmpty();

    const userId = req.user?.userId;

    const tournaments = await prisma.tournament.findMany({
      orderBy: { startTime: 'asc' },
      include: {
        _count: {
          select: { participants: true }
        },
        participants: userId ? {
          where: { userId }
        } : false
      }
    });

    const payload = tournaments.map(t => {
      const isRegistered = userId ? (t.participants && t.participants.length > 0) : false;
      const userParticipant = isRegistered ? t.participants[0] : null;

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        startTime: t.startTime,
        endTime: t.endTime,
        entryFeeCoins: t.entryFeeCoins,
        minLevel: t.minLevel,
        prizePoolCoins: t.prizePoolCoins,
        trackId: t.trackId,
        rules: t.rules,
        participantCount: t._count.participants,
        isRegistered,
        userStats: userParticipant ? {
          bestWpm: userParticipant.bestWpm,
          bestAccuracy: userParticipant.bestAccuracy,
          points: userParticipant.points,
          racesPlayed: userParticipant.racesPlayed
        } : null
      };
    });

    return res.json({ tournaments: payload });
  } catch (error: any) {
    console.error('Get tournaments error:', error);
    return res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
};

export const getTournamentDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        _count: {
          select: { participants: true }
        },
        participants: {
          orderBy: [{ points: 'desc' }, { bestWpm: 'desc' }],
          take: 10,
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    let isRegistered = false;
    let userEntry: any = null;

    if (userId) {
      const userPart = await prisma.tournamentParticipant.findUnique({
        where: {
          tournamentId_userId: {
            tournamentId: id,
            userId
          }
        }
      });
      if (userPart) {
        isRegistered = true;
        userEntry = userPart;
      }
    }

    const standings = tournament.participants.map((p, idx) => ({
      rank: idx + 1,
      userId: p.userId,
      nickname: p.user.profile?.nickname || 'Racer',
      avatar: p.user.profile?.avatarId || '🏎️',
      points: p.points,
      bestWpm: p.bestWpm,
      bestAccuracy: p.bestAccuracy,
      racesPlayed: p.racesPlayed,
      isYou: userId === p.userId
    }));

    return res.json({
      tournament: {
        id: tournament.id,
        title: tournament.title,
        description: tournament.description,
        status: tournament.status,
        startTime: tournament.startTime,
        endTime: tournament.endTime,
        entryFeeCoins: tournament.entryFeeCoins,
        minLevel: tournament.minLevel,
        prizePoolCoins: tournament.prizePoolCoins,
        trackId: tournament.trackId,
        rules: tournament.rules,
        participantCount: tournament._count.participants,
        isRegistered,
        userEntry
      },
      standings
    });
  } catch (error: any) {
    console.error('Get tournament details error:', error);
    return res.status(500).json({ error: 'Failed to fetch tournament details' });
  }
};

export const registerTournament = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const tournament = await prisma.tournament.findUnique({
      where: { id }
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament.status === 'completed') {
      return res.status(400).json({ error: 'This tournament has already completed' });
    }

    // Check duplicate registration
    const existing = await prisma.tournamentParticipant.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId: id,
          userId
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'You are already registered for this tournament' });
    }

    // Check level eligibility
    const stats = await prisma.playerStats.findUnique({
      where: { userId }
    });

    if (!stats || stats.level < tournament.minLevel) {
      return res.status(400).json({
        error: `Requires driver Level ${tournament.minLevel} or higher (current Level: ${stats?.level || 1})`
      });
    }

    // Check coin balance
    if (stats.coins < tournament.entryFeeCoins) {
      return res.status(400).json({
        error: `Insufficient coins. Tournament entry fee is ${tournament.entryFeeCoins} coins (current balance: ${stats.coins})`
      });
    }

    // Execute atomic registration & coin deduction
    const result = await prisma.$transaction(async (tx) => {
      let balancePost = stats.coins;

      if (tournament.entryFeeCoins > 0) {
        const updatedStats = await tx.playerStats.update({
          where: { userId },
          data: {
            coins: { decrement: tournament.entryFeeCoins }
          }
        });
        balancePost = updatedStats.coins;

        await tx.walletTransaction.create({
          data: {
            userId,
            delta: -tournament.entryFeeCoins,
            reason: 'tournament_entry',
            balancePost
          }
        });
      }

      const participant = await tx.tournamentParticipant.create({
        data: {
          tournamentId: id,
          userId,
          bestWpm: 0,
          bestAccuracy: 100.0,
          points: 0,
          racesPlayed: 0
        }
      });

      return { participant, balancePost };
    });

    return res.status(201).json({
      message: 'Successfully registered for tournament',
      participant: result.participant,
      balancePost: result.balancePost
    });
  } catch (error: any) {
    console.error('Tournament registration error:', error);
    return res.status(500).json({ error: 'Failed to register for tournament' });
  }
};

export const submitTournamentRace = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const { wpm, accuracy, durationSec, place } = req.body;

    const tournament = await prisma.tournament.findUnique({
      where: { id }
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament.status !== 'active') {
      return res.status(400).json({ error: 'Tournament is not actively accepting race submissions' });
    }

    const participant = await prisma.tournamentParticipant.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId: id,
          userId
        }
      }
    });

    if (!participant) {
      return res.status(403).json({ error: 'You must register for this tournament before participating in races' });
    }

    const safeWpm = Math.min(250, Math.max(0, Math.round(Number(wpm) || 0)));
    const safeAcc = Math.min(100, Math.max(0, Math.round(Number(accuracy) || 0)));
    const safePlace = Math.max(1, Number(place) || 1);

    // Calculate tournament points: Base WPM + Accuracy factor + Podium bonus
    let earnedPoints = safeWpm + Math.round(safeAcc * 0.5);
    if (safePlace === 1) earnedPoints += 50;
    else if (safePlace === 2) earnedPoints += 30;
    else if (safePlace === 3) earnedPoints += 15;

    const updatedParticipant = await prisma.tournamentParticipant.update({
      where: { id: participant.id },
      data: {
        bestWpm: Math.max(participant.bestWpm, safeWpm),
        bestAccuracy: Math.max(participant.bestAccuracy, safeAcc),
        racesPlayed: { increment: 1 },
        points: { increment: earnedPoints }
      }
    });

    // Public MMR isolation: we do NOT update playerStats verifiedBestWpm here.
    return res.json({
      message: 'Tournament race recorded successfully',
      participant: updatedParticipant,
      earnedPoints
    });
  } catch (error: any) {
    console.error('Submit tournament race error:', error);
    return res.status(500).json({ error: 'Failed to record tournament race' });
  }
};

export const getTournamentStandings = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const standings = await prisma.tournamentParticipant.findMany({
      where: { tournamentId: id },
      orderBy: [{ points: 'desc' }, { bestWpm: 'desc' }],
      take: 50,
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    });

    const ranked = standings.map((s, idx) => ({
      rank: idx + 1,
      userId: s.userId,
      nickname: s.user.profile?.nickname || 'Racer',
      avatar: s.user.profile?.avatarId || '🏎️',
      points: s.points,
      bestWpm: s.bestWpm,
      bestAccuracy: s.bestAccuracy,
      racesPlayed: s.racesPlayed,
      isYou: userId === s.userId
    }));

    return res.json({ standings: ranked });
  } catch (error: any) {
    console.error('Get tournament standings error:', error);
    return res.status(500).json({ error: 'Failed to fetch tournament standings' });
  }
};

