// Unit Tests for KeySprint Phase 4.2: Friends & Social Hardening
import test from 'node:test';
import assert from 'node:assert/strict';

// Model helper functions modeling Phase 4.2 social rules

export function validateFriendRequest({ requesterId, targetUserId, existingRelationship }) {
  if (!targetUserId) {
    return { status: 400, error: 'Target racer not found' };
  }
  if (requesterId === targetUserId) {
    return { status: 400, error: 'You cannot send a friend request to yourself' };
  }
  if (existingRelationship) {
    if (existingRelationship.status === 'blocked') {
      return { status: 403, error: 'User is blocked or unavailable' };
    }
    if (existingRelationship.status === 'accepted') {
      return { status: 400, error: 'You are already friends with this racer' };
    }
    if (existingRelationship.status === 'pending') {
      return { status: 400, error: 'A pending friend request already exists' };
    }
  }
  return { status: 200, success: true };
}

export function validateChallengeRequest({ requesterId, friendUserId, friendship, lastChallengeTimeMs, nowMs }) {
  if (!friendUserId) {
    return { status: 400, error: 'friendUserId is required' };
  }
  if (requesterId === friendUserId) {
    return { status: 400, error: 'You cannot challenge yourself' };
  }
  if (friendship?.status === 'blocked') {
    return { status: 403, error: 'User is blocked or unavailable' };
  }
  if (!friendship || friendship.status !== 'accepted') {
    return { status: 400, error: 'You can only challenge accepted friends' };
  }
  if (lastChallengeTimeMs && nowMs - lastChallengeTimeMs < 30000) {
    const waitSec = Math.ceil((30000 - (nowMs - lastChallengeTimeMs)) / 1000);
    return { status: 429, error: `Please wait ${waitSec}s before challenging this friend again` };
  }
  return { status: 200, success: true };
}

export function filterFriendsLeaderboard(allStats, currentUserId, acceptedFriendships) {
  const friendIds = new Set([
    currentUserId,
    ...acceptedFriendships
      .filter(f => f.status === 'accepted')
      .map(f => f.requesterId === currentUserId ? f.receiverId : f.requesterId)
  ]);

  return allStats
    .filter(stat => friendIds.has(stat.userId))
    .sort((a, b) => b.verifiedBestWpm - a.verifiedBestWpm)
    .map((stat, idx) => ({
      rank: idx + 1,
      userId: stat.userId,
      wpm: stat.verifiedBestWpm,
      isYou: stat.userId === currentUserId
    }));
}

export class PresenceManager {
  constructor() {
    this.onlineUsers = new Map(); // userId -> Set<socketId>
  }

  register(userId, socketId) {
    let set = this.onlineUsers.get(userId);
    if (!set) {
      set = new Set();
      this.onlineUsers.set(userId, set);
    }
    set.add(socketId);
  }

  disconnect(socketId) {
    for (const [userId, set] of this.onlineUsers.entries()) {
      if (set.has(socketId)) {
        set.delete(socketId);
        if (set.size === 0) {
          this.onlineUsers.delete(userId);
        }
        break;
      }
    }
  }

  isOnline(userId) {
    const set = this.onlineUsers.get(userId);
    return !!(set && set.size > 0);
  }
}

// ==========================================
// TESTS
// ==========================================

test('Friend Request: Prevents self-request and validates target presence', () => {
  const selfReq = validateFriendRequest({ requesterId: 'user_1', targetUserId: 'user_1' });
  assert.equal(selfReq.status, 400);
  assert.equal(selfReq.error, 'You cannot send a friend request to yourself');

  const emptyReq = validateFriendRequest({ requesterId: 'user_1', targetUserId: '' });
  assert.equal(emptyReq.status, 400);
});

test('Friend Request: Prevents duplicate requests and handles existing states', () => {
  const pendingReq = validateFriendRequest({
    requesterId: 'user_1',
    targetUserId: 'user_2',
    existingRelationship: { status: 'pending' }
  });
  assert.equal(pendingReq.status, 400);
  assert.equal(pendingReq.error, 'A pending friend request already exists');

  const acceptedReq = validateFriendRequest({
    requesterId: 'user_1',
    targetUserId: 'user_2',
    existingRelationship: { status: 'accepted' }
  });
  assert.equal(acceptedReq.status, 400);
  assert.equal(acceptedReq.error, 'You are already friends with this racer');
});

test('Block Restriction: Blocked racers cannot send friend requests or challenges', () => {
  const req = validateFriendRequest({
    requesterId: 'user_1',
    targetUserId: 'user_2',
    existingRelationship: { status: 'blocked' }
  });
  assert.equal(req.status, 403);
  assert.equal(req.error, 'User is blocked or unavailable');

  const challenge = validateChallengeRequest({
    requesterId: 'user_1',
    friendUserId: 'user_2',
    friendship: { status: 'blocked' }
  });
  assert.equal(challenge.status, 403);
});

test('Challenge Rate-Limiting: Throttles spam challenges within 30-second window', () => {
  const now = Date.now();
  // Valid challenge after no prior challenge
  const res1 = validateChallengeRequest({
    requesterId: 'u1',
    friendUserId: 'u2',
    friendship: { status: 'accepted' },
    lastChallengeTimeMs: 0,
    nowMs: now
  });
  assert.equal(res1.status, 200);

  // Rate-limited challenge 10 seconds later
  const res2 = validateChallengeRequest({
    requesterId: 'u1',
    friendUserId: 'u2',
    friendship: { status: 'accepted' },
    lastChallengeTimeMs: now,
    nowMs: now + 10000
  });
  assert.equal(res2.status, 429);
  assert.ok(res2.error.includes('Please wait 20s before challenging this friend again'));

  // Allowed after 31 seconds
  const res3 = validateChallengeRequest({
    requesterId: 'u1',
    friendUserId: 'u2',
    friendship: { status: 'accepted' },
    lastChallengeTimeMs: now,
    nowMs: now + 31000
  });
  assert.equal(res3.status, 200);
});

test('Presence Manager: Multi-device socket support survives single-tab disconnects', () => {
  const pm = new PresenceManager();
  assert.equal(pm.isOnline('u1'), false);

  // Device 1 connects
  pm.register('u1', 'sock_tab_1');
  assert.equal(pm.isOnline('u1'), true);

  // Device 2 connects
  pm.register('u1', 'sock_tab_2');
  assert.equal(pm.isOnline('u1'), true);

  // Device 1 disconnects (e.g. closed tab) -> user remains online via Device 2!
  pm.disconnect('sock_tab_1');
  assert.equal(pm.isOnline('u1'), true, 'User must remain online while at least one socket is connected');

  // Device 2 disconnects -> user goes offline
  pm.disconnect('sock_tab_2');
  assert.equal(pm.isOnline('u1'), false, 'User must go offline when all sockets disconnect');
});

test('Friends Leaderboard: Accurately isolates rankings to user and accepted friends', () => {
  const stats = [
    { userId: 'u_stranger_1', verifiedBestWpm: 180 },
    { userId: 'u_friend_1', verifiedBestWpm: 120 },
    { userId: 'u_me', verifiedBestWpm: 105 },
    { userId: 'u_friend_2', verifiedBestWpm: 95 },
    { userId: 'u_stranger_2', verifiedBestWpm: 150 },
    { userId: 'u_pending_rival', verifiedBestWpm: 140 }
  ];

  const friendships = [
    { requesterId: 'u_me', receiverId: 'u_friend_1', status: 'accepted' },
    { requesterId: 'u_friend_2', receiverId: 'u_me', status: 'accepted' },
    { requesterId: 'u_me', receiverId: 'u_pending_rival', status: 'pending' }
  ];

  const friendsLeaderboard = filterFriendsLeaderboard(stats, 'u_me', friendships);

  // Strangers (180, 150) and pending rivals (140) must NOT appear
  assert.equal(friendsLeaderboard.length, 3);
  assert.equal(friendsLeaderboard[0].userId, 'u_friend_1');
  assert.equal(friendsLeaderboard[0].rank, 1);
  assert.equal(friendsLeaderboard[1].userId, 'u_me');
  assert.equal(friendsLeaderboard[1].rank, 2);
  assert.equal(friendsLeaderboard[1].isYou, true);
  assert.equal(friendsLeaderboard[2].userId, 'u_friend_2');
  assert.equal(friendsLeaderboard[2].rank, 3);
});

