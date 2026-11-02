// Unit Tests for KeySprint Phase 4.3: Tournament System
import test from 'node:test';
import assert from 'node:assert/strict';

// Business logic modeling for Tournament validation, registration, scoring, and MMR isolation

export function validateTournamentRegistration({ userStats, tournament, existingRegistration }) {
  if (!tournament) {
    return { status: 404, error: 'Tournament not found' };
  }
  if (tournament.status === 'completed') {
    return { status: 400, error: 'This tournament has already completed' };
  }
  if (existingRegistration) {
    return { status: 400, error: 'You are already registered for this tournament' };
  }
  if (!userStats || userStats.level < tournament.minLevel) {
    return {
      status: 400,
      error: `Requires driver Level ${tournament.minLevel} or higher (current Level: ${userStats?.level || 1})`
    };
  }
  if (userStats.coins < tournament.entryFeeCoins) {
    return {
      status: 400,
      error: `Insufficient coins. Tournament entry fee is ${tournament.entryFeeCoins} coins (current balance: ${userStats.coins})`
    };
  }

  const remainingCoins = userStats.coins - tournament.entryFeeCoins;
  return {
    status: 201,
    success: true,
    participant: {
      tournamentId: tournament.id,
      userId: userStats.userId,
      bestWpm: 0,
      bestAccuracy: 100.0,
      points: 0,
      racesPlayed: 0
    },
    remainingCoins
  };
}

export function computeTournamentPoints(wpm, accuracy, place) {
  const safeWpm = Math.min(250, Math.max(0, Math.round(wpm || 0)));
  const safeAcc = Math.min(100, Math.max(0, Math.round(accuracy || 0)));
  const safePlace = Math.max(1, place || 1);

  let earnedPoints = safeWpm + Math.round(safeAcc * 0.5);
  if (safePlace === 1) earnedPoints += 50;
  else if (safePlace === 2) earnedPoints += 30;
  else if (safePlace === 3) earnedPoints += 15;

  return earnedPoints;
}

export function recordTournamentRace({ participant, tournament, raceResult, publicPlayerStats }) {
  if (tournament.status !== 'active') {
    return { status: 400, error: 'Tournament is not actively accepting race submissions' };
  }
  if (!participant) {
    return { status: 403, error: 'You must register for this tournament before participating in races' };
  }

  const earnedPoints = computeTournamentPoints(raceResult.wpm, raceResult.accuracy, raceResult.place);

  const updatedParticipant = {
    ...participant,
    bestWpm: Math.max(participant.bestWpm, raceResult.wpm),
    bestAccuracy: Math.max(participant.bestAccuracy, raceResult.accuracy),
    racesPlayed: participant.racesPlayed + 1,
    points: participant.points + earnedPoints
  };

  // MMR Isolation: Public playerStats must NOT mutate verifiedBestWpm from tournament races
  const updatedPublicStats = {
    ...publicPlayerStats
    // verifiedBestWpm is deliberately untouched!
  };

  return {
    status: 200,
    participant: updatedParticipant,
    publicStats: updatedPublicStats,
    earnedPoints
  };
}

export function rankTournamentStandings(participants) {
  return [...participants]
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.bestWpm - a.bestWpm;
    })
    .map((p, idx) => ({
      rank: idx + 1,
      userId: p.userId,
      points: p.points,
      bestWpm: p.bestWpm,
      bestAccuracy: p.bestAccuracy,
      racesPlayed: p.racesPlayed
    }));
}

// ==========================================
// TESTS
// ==========================================

test('Tournament Registration: Enforces driver level minimums', () => {
  const t = { id: 't1', status: 'active', minLevel: 3, entryFeeCoins: 100 };
  const user = { userId: 'u1', level: 1, coins: 5000 };

  const res = validateTournamentRegistration({ userStats: user, tournament: t, existingRegistration: null });
  assert.equal(res.status, 400);
  assert.ok(res.error.includes('Requires driver Level 3 or higher'));
});

test('Tournament Registration: Validates coin balance and calculates atomic deduction', () => {
  const t = { id: 't1', status: 'active', minLevel: 1, entryFeeCoins: 500 };
  const poorUser = { userId: 'u1', level: 2, coins: 200 };

  const poorRes = validateTournamentRegistration({ userStats: poorUser, tournament: t, existingRegistration: null });
  assert.equal(poorRes.status, 400);
  assert.ok(poorRes.error.includes('Insufficient coins'));

  const richUser = { userId: 'u2', level: 2, coins: 1500 };
  const okRes = validateTournamentRegistration({ userStats: richUser, tournament: t, existingRegistration: null });
  assert.equal(okRes.status, 201);
  assert.equal(okRes.remainingCoins, 1000);
  assert.equal(okRes.participant.tournamentId, 't1');
});

test('Tournament Registration: Blocks duplicate entry to the same tournament', () => {
  const t = { id: 't1', status: 'active', minLevel: 1, entryFeeCoins: 100 };
  const user = { userId: 'u1', level: 5, coins: 10000 };
  const existing = { tournamentId: 't1', userId: 'u1' };

  const res = validateTournamentRegistration({ userStats: user, tournament: t, existingRegistration: existing });
  assert.equal(res.status, 400);
  assert.equal(res.error, 'You are already registered for this tournament');
});

test('Tournament Scoring: Computes standard points with podium and accuracy multipliers', () => {
  // 120 WPM, 98% Acc, 1st place -> 120 + 49 + 50 = 219 points
  const pts1 = computeTournamentPoints(120, 98, 1);
  assert.equal(pts1, 219);

  // 100 WPM, 100% Acc, 2nd place -> 100 + 50 + 30 = 180 points
  const pts2 = computeTournamentPoints(100, 100, 2);
  assert.equal(pts2, 180);

  // 90 WPM, 90% Acc, 4th place (off podium) -> 90 + 45 + 0 = 135 points
  const pts4 = computeTournamentPoints(90, 90, 4);
  assert.equal(pts4, 135);
});

test('MMR Isolation: Tournament race updates tournament standings but leaves public MMR unmodified', () => {
  const tournament = { id: 't_active', status: 'active' };
  const participant = { tournamentId: 't_active', userId: 'u1', bestWpm: 90, bestAccuracy: 95, points: 100, racesPlayed: 1 };
  const publicPlayerStats = { userId: 'u1', verifiedBestWpm: 90, racesCount: 50 };

  const result = recordTournamentRace({
    participant,
    tournament,
    raceResult: { wpm: 140, accuracy: 99, place: 1 },
    publicPlayerStats
  });

  assert.equal(result.status, 200);
  assert.equal(result.participant.bestWpm, 140, 'Tournament participant bestWpm should update to 140');
  assert.equal(result.participant.racesPlayed, 2);
  assert.ok(result.participant.points > 100);

  // CRITICAL CHECK: Public stats verifiedBestWpm must remain at 90, isolated from tournament events
  assert.equal(result.publicStats.verifiedBestWpm, 90, 'Public verified MMR must remain strictly isolated');
});

test('Tournament Standings: Correctly orders participants by points and tie-break WPM', () => {
  const participants = [
    { userId: 'u_bronze', points: 180, bestWpm: 100, bestAccuracy: 98, racesPlayed: 1 },
    { userId: 'u_silver', points: 220, bestWpm: 110, bestAccuracy: 99, racesPlayed: 2 },
    { userId: 'u_gold', points: 250, bestWpm: 125, bestAccuracy: 100, racesPlayed: 2 },
    { userId: 'u_tie_lower_wpm', points: 180, bestWpm: 95, bestAccuracy: 98, racesPlayed: 1 }
  ];

  const standings = rankTournamentStandings(participants);
  assert.equal(standings[0].userId, 'u_gold');
  assert.equal(standings[0].rank, 1);
  assert.equal(standings[1].userId, 'u_silver');
  assert.equal(standings[1].rank, 2);
  assert.equal(standings[2].userId, 'u_bronze'); // Tie break: 100 WPM beats 95 WPM
  assert.equal(standings[2].rank, 3);
  assert.equal(standings[3].userId, 'u_tie_lower_wpm');
  assert.equal(standings[3].rank, 4);
});

