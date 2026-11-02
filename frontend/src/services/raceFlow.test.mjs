// Unit Tests for KeySprint Phase 2: Multiplayer & Race Flow Repair
import test from 'node:test';
import assert from 'node:assert/strict';

// Helper functions modeling Phase 2 race flow logic

/**
 * Validates transition logic for matchmaking to pre-race lobby and live race
 */
export function determineLobbyNavigation(roomStatus, countdown) {
  if (roomStatus === 'racing' || countdown === 0) {
    return 'screen-13'; // Live Race
  }
  if (roomStatus === 'countdown') {
    return 'screen-12'; // Pre-Race Lobby
  }
  return 'screen-11'; // Matchmaking Queue
}

/**
 * Bot profile calibration generator as implemented in RaceContext
 */
export function getBotProfiles(difficulty = 'normal') {
  if (difficulty === 'easy') {
    return [
      { name: 'Turbo Bot [AI]', carId: 'jeep', avatar: '🤖', baseWpm: 52 },
      { name: 'Rookie Drift [AI]', carId: 'starter', avatar: '🏎️', baseWpm: 48 },
      { name: 'Cadence Cruiser [AI]', carId: 'forest', avatar: '⚡', baseWpm: 56 }
    ];
  }
  if (difficulty === 'advanced') {
    return [
      { name: 'Nitro Nova [AI]', carId: 'shadow', avatar: '🚀', baseWpm: 148 },
      { name: 'SpeedMaster AI [AI]', carId: 'golden', avatar: '👑', baseWpm: 154 },
      { name: 'Apex Predator [AI]', carId: 'neon', avatar: '⚡', baseWpm: 162 }
    ];
  }
  return [
    { name: 'Apex AI [AI]', carId: 'golden', avatar: '⚡', baseWpm: 104 },
    { name: 'Turbo Bot [AI]', carId: 'blaze', avatar: '🤖', baseWpm: 96 },
    { name: 'Drift Bot [AI]', carId: 'forest', avatar: '🏎️', baseWpm: 110 }
  ];
}

/**
 * Calculates bot progress step per second for a given passage
 */
export function calculateBotProgressStep(botWpm, passageWordCount) {
  const wordsPerSec = botWpm / 60;
  return (wordsPerSec / passageWordCount) * 100;
}

/**
 * Placement calculation against finished competitors
 */
export function calculatePlacement(userId, players) {
  const fasterOpponents = players.filter(
    p => p.socketId !== 'local_you' && p.userId !== userId && p.finished
  ).length;
  return fasterOpponents + 1;
}

/**
 * Guest session validation logic
 */
export function validateGuestSubmission(token, payload) {
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return { success: false, status: 401, error: 'Unauthorized: missing guest or auth token' };
  }
  if (payload.wpm > 250) {
    return { success: false, status: 400, error: 'Unrealistic typing speed flagged for review' };
  }
  if (payload.place < 1 || payload.place > 4) {
    return { success: false, status: 400, error: 'Invalid race placement' };
  }
  return { success: true, status: 200 };
}

// ----------------------------------------------------------------------
// Tests: 1. Multiplayer Countdown Synchronization
// ----------------------------------------------------------------------

test('Multiplayer Sync: Screen11 Matchmaking immediately routes to Screen12 when roomStatus enters countdown', () => {
  // While searching, stays on matchmaking
  assert.equal(determineLobbyNavigation('waiting', 3), 'screen-11');

  // As soon as room enters countdown, routes to lobby without waiting for countdown to hit 1
  assert.equal(determineLobbyNavigation('countdown', 3), 'screen-12');
  assert.equal(determineLobbyNavigation('countdown', 2), 'screen-12');
  assert.equal(determineLobbyNavigation('countdown', 1), 'screen-12');
});

test('Multiplayer Sync: Screen12 PreRaceLobby transitions to Screen13 when countdown hits 0 or roomStatus is racing', () => {
  // Authoritative countdown countdown hits 0
  assert.equal(determineLobbyNavigation('countdown', 0), 'screen-13');

  // Or server broadcasts match.start -> status = 'racing'
  assert.equal(determineLobbyNavigation('racing', 0), 'screen-13');
  assert.equal(determineLobbyNavigation('racing', 2), 'screen-13');
});

// ----------------------------------------------------------------------
// Tests: 2. Bot Race Initialization & Calibration
// ----------------------------------------------------------------------

test('Bot Calibration: Difficulty tiers produce correctly calibrated WPM ranges', () => {
  const easyBots = getBotProfiles('easy');
  assert.equal(easyBots.length, 3);
  for (const bot of easyBots) {
    assert.ok(bot.baseWpm >= 45 && bot.baseWpm <= 60, `Easy bot WPM ${bot.baseWpm} should be ~45-60`);
  }

  const normalBots = getBotProfiles('normal');
  assert.equal(normalBots.length, 3);
  for (const bot of normalBots) {
    assert.ok(bot.baseWpm >= 90 && bot.baseWpm <= 115, `Normal bot WPM ${bot.baseWpm} should be ~90-115`);
  }

  const advancedBots = getBotProfiles('advanced');
  assert.equal(advancedBots.length, 3);
  for (const bot of advancedBots) {
    assert.ok(bot.baseWpm >= 145 && bot.baseWpm <= 165, `Advanced bot WPM ${bot.baseWpm} should be ~145-165`);
  }
});

test('Bot Progression: Step calculation precisely achieves target finish time', () => {
  const passageWords = 25; // 25-word test passage
  const botWpm = 60; // 60 WPM = 1 word / sec -> 25 seconds to finish
  const stepPerSec = calculateBotProgressStep(botWpm, passageWords);

  // 1 word of 25 = 4% per second
  assert.equal(stepPerSec, 4.0);

  // In 25 seconds, progress must equal 100%
  const totalProgress = stepPerSec * 25;
  assert.equal(totalProgress, 100.0);
});

test('Bot Race Placement: Accurately identifies placement against finished AI opponents', () => {
  const myUserId = 'usr_guest_42';

  // Scenario A: User finishes before all bots
  const playersAllPending = [
    { socketId: 'local_you', userId: myUserId, finished: true },
    { socketId: 'bot_1', userId: 'bot_1', finished: false },
    { socketId: 'bot_2', userId: 'bot_2', finished: false },
    { socketId: 'bot_3', userId: 'bot_3', finished: false }
  ];
  assert.equal(calculatePlacement(myUserId, playersAllPending), 1);

  // Scenario B: One bot finished earlier, two still racing
  const playersOneFinished = [
    { socketId: 'local_you', userId: myUserId, finished: true },
    { socketId: 'bot_1', userId: 'bot_1', finished: true },
    { socketId: 'bot_2', userId: 'bot_2', finished: false },
    { socketId: 'bot_3', userId: 'bot_3', finished: false }
  ];
  assert.equal(calculatePlacement(myUserId, playersOneFinished), 2);

  // Scenario C: Two bots finished earlier
  const playersTwoFinished = [
    { socketId: 'local_you', userId: myUserId, finished: true },
    { socketId: 'bot_1', userId: 'bot_1', finished: true },
    { socketId: 'bot_2', userId: 'bot_2', finished: true },
    { socketId: 'bot_3', userId: 'bot_3', finished: false }
  ];
  assert.equal(calculatePlacement(myUserId, playersTwoFinished), 3);
});

// ----------------------------------------------------------------------
// Tests: 3. Guest Race Authentication
// ----------------------------------------------------------------------

test('Guest Auth: Unauthenticated submission fails without token (preventing 401 in UI)', () => {
  const result = validateGuestSubmission('', { wpm: 85, accuracy: 98, place: 1 });
  assert.equal(result.success, false);
  assert.equal(result.status, 401);
});

test('Guest Auth: Auto-provisioned guest token submits race result successfully', () => {
  const mockGuestJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockGuestToken';
  const validPayload = {
    wpm: 88,
    accuracy: 99,
    durationSec: 18,
    place: 1
  };

  const result = validateGuestSubmission(mockGuestJwt, validPayload);
  assert.equal(result.success, true);
  assert.equal(result.status, 200);
});

test('Guest Auth: Enforces anti-cheat limits on guest and regular submissions', () => {
  const mockGuestJwt = 'mockGuestToken';
  const hackedPayload = {
    wpm: 320, // Cheated speed
    accuracy: 100,
    durationSec: 5,
    place: 1
  };

  const result = validateGuestSubmission(mockGuestJwt, hackedPayload);
  assert.equal(result.success, false);
  assert.equal(result.status, 400);
});

