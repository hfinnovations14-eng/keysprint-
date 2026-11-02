// Unit Tests for KeySprint Phase 4.1: Private Room & Race Experience
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';

const SECURE_PREFIXES = ['SPRINT', 'APEX', 'TURBO', 'NITRO', 'DRIFT', 'HYPER'];
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateSecureRoomCode() {
  const prefix = SECURE_PREFIXES[Math.floor(Math.random() * SECURE_PREFIXES.length)];
  const bytes = randomBytes(4);
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return `${prefix}-${suffix}`;
}

const BOT_PROFILES_BY_DIFFICULTY = {
  easy: [
    { name: 'Turbo Bot [AI]', carId: 'jeep', avatar: '🤖', baseWpm: 48 },
    { name: 'Rookie Drift [AI]', carId: 'starter', avatar: '🏎️', baseWpm: 52 },
    { name: 'Cadence Cruiser [AI]', carId: 'forest', avatar: '⚡', baseWpm: 55 },
    { name: 'Pace Car [AI]', carId: 'retro', avatar: '🚗', baseWpm: 50 }
  ],
  normal: [
    { name: 'Turbo Bot [AI]', carId: 'thunder', avatar: '🤖', baseWpm: 92 },
    { name: 'Apex AI [AI]', carId: 'golden', avatar: '⚡', baseWpm: 104 },
    { name: 'Drift Bot [AI]', carId: 'forest', avatar: '🏎️', baseWpm: 98 },
    { name: 'Nitro Nova [AI]', carId: 'retro', avatar: '🚀', baseWpm: 100 }
  ],
  advanced: [
    { name: 'Nitro Nova [AI]', carId: 'shadow', avatar: '🚀', baseWpm: 145 },
    { name: 'SpeedMaster AI [AI]', carId: 'golden', avatar: '👑', baseWpm: 152 },
    { name: 'Apex Predator [AI]', carId: 'neon', avatar: '⚡', baseWpm: 160 },
    { name: 'Hyper Velocity [AI]', carId: 'rose', avatar: '🔥', baseWpm: 148 }
  ]
};

function resetRoomForRematch(room) {
  const updatedPlayers = new Map();
  for (const [id, player] of room.players.entries()) {
    if (!player.isBot) {
      updatedPlayers.set(id, {
        ...player,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        finished: false,
        finishTime: undefined,
        isReady: player.isHost
      });
    }
  }

  return {
    ...room,
    status: 'waiting',
    startTime: undefined,
    countdownSeconds: 3,
    players: updatedPlayers
  };
}

function parseInviteUrl(url) {
  try {
    const parsed = new URL(url, 'https://keysprint.app');
    const code = parsed.searchParams.get('room');
    return code ? code.trim().toUpperCase() : null;
  } catch {
    return null;
  }
}

// ==========================================
// TESTS
// ==========================================

test('Room Code Security: Generates high-entropy codes matching authorized schema', () => {
  for (let i = 0; i < 100; i++) {
    const code = generateSecureRoomCode();
    const parts = code.split('-');
    assert.equal(parts.length, 2, `Code ${code} must contain exactly one hyphen separator`);
    assert.ok(SECURE_PREFIXES.includes(parts[0]), `Prefix ${parts[0]} must be in approved prefixes`);
    assert.equal(parts[1].length, 4, `Suffix ${parts[1]} must be exactly 4 characters`);
    for (const char of parts[1]) {
      assert.ok(CODE_ALPHABET.includes(char), `Character ${char} must be in unambiguous alphabet`);
    }
  }
});

test('Room Code Collision: 1,000 sequentially generated codes exhibit zero collisions', () => {
  const seen = new Set();
  for (let i = 0; i < 1000; i++) {
    const code = generateSecureRoomCode();
    assert.ok(!seen.has(code), `Code ${code} collided after ${i} generations`);
    seen.add(code);
  }
  assert.equal(seen.size, 1000);
});

test('Bot Profiles: Difficulty tiers map to distinct WPM ranges with no overlap', () => {
  const easyWpms = BOT_PROFILES_BY_DIFFICULTY.easy.map(b => b.baseWpm);
  const normalWpms = BOT_PROFILES_BY_DIFFICULTY.normal.map(b => b.baseWpm);
  const advancedWpms = BOT_PROFILES_BY_DIFFICULTY.advanced.map(b => b.baseWpm);

  assert.ok(Math.max(...easyWpms) < Math.min(...normalWpms), 'Easy tier must be strictly slower than Normal tier');
  assert.ok(Math.max(...normalWpms) < Math.min(...advancedWpms), 'Normal tier must be strictly slower than Advanced tier');

  // Verify calibrated bounds
  assert.ok(Math.min(...easyWpms) >= 45 && Math.max(...easyWpms) <= 60);
  assert.ok(Math.min(...normalWpms) >= 85 && Math.max(...normalWpms) <= 110);
  assert.ok(Math.min(...advancedWpms) >= 140 && Math.max(...advancedWpms) <= 165);
});

test('Rematch Lifecycle: Resets room status to waiting, clears bots, and resets human stats', () => {
  const sampleRoom = {
    id: 'room_priv_SP-99',
    status: 'finished',
    startTime: Date.now() - 45000,
    countdownSeconds: 0,
    players: new Map([
      ['host_sock', { userId: 'u_host', nickname: 'Host', isHost: true, isReady: true, finished: true, progress: 100, wpm: 112, isBot: false }],
      ['guest_sock', { userId: 'u_guest', nickname: 'Guest', isHost: false, isReady: true, finished: true, progress: 100, wpm: 95, isBot: false }],
      ['bot_1', { userId: 'bot_1', nickname: 'Apex AI', isHost: false, isReady: true, finished: true, progress: 100, wpm: 100, isBot: true }]
    ])
  };

  const rematched = resetRoomForRematch(sampleRoom);

  assert.equal(rematched.status, 'waiting', 'Room status must revert to waiting');
  assert.equal(rematched.startTime, undefined, 'Start time must be cleared');
  assert.equal(rematched.countdownSeconds, 3, 'Countdown must reset to 3');
  assert.equal(rematched.players.size, 2, 'AI Bots must be pruned from lobby');
  assert.ok(!rematched.players.has('bot_1'), 'bot_1 should have been removed');

  const host = rematched.players.get('host_sock');
  assert.equal(host.progress, 0);
  assert.equal(host.wpm, 0);
  assert.equal(host.accuracy, 100);
  assert.equal(host.finished, false);
  assert.equal(host.isReady, true, 'Host should be immediately marked ready');

  const guest = rematched.players.get('guest_sock');
  assert.equal(guest.progress, 0);
  assert.equal(guest.finished, false);
  assert.equal(guest.isReady, false, 'Guest racer must be set to unready until they click ready');
});

test('Invite URL Parsing: Correctly extracts room codes from shareable links', () => {
  assert.equal(parseInviteUrl('https://keysprint.app/?room=APEX-8F7Q'), 'APEX-8F7Q');
  assert.equal(parseInviteUrl('http://localhost:3000/?room=sprint-99z2'), 'SPRINT-99Z2');
  assert.equal(parseInviteUrl('http://localhost:3000/?other=123'), null);
  assert.equal(parseInviteUrl('invalid-url'), null);
});

