export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  races: number;
  country: string;
  isCurrentUser?: boolean;
}

export const GLOBAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'AlexPro', avatar: '🏎️', wpm: 182, accuracy: 99, races: 1240, country: 'United States', isCurrentUser: true },
  { rank: 2, name: 'TypeMaster', avatar: '⚡', wpm: 175, accuracy: 98, races: 980, country: 'Germany' },
  { rank: 3, name: 'SpeedyGirl', avatar: '🌸', wpm: 170, accuracy: 98, races: 860, country: 'Canada' },
  { rank: 4, name: 'KeyNinja', avatar: '🥷', wpm: 168, accuracy: 97, races: 810, country: 'Japan' },
  { rank: 5, name: 'FlashType', avatar: '🚀', wpm: 165, accuracy: 97, races: 760, country: 'United Kingdom' },
  { rank: 6, name: 'RacerX', avatar: '🔥', wpm: 160, accuracy: 96, races: 720, country: 'France' },
  { rank: 7, name: 'NitroKeys', avatar: '💥', wpm: 158, accuracy: 96, races: 690, country: 'Australia' },
  { rank: 8, name: 'TypingAce', avatar: '🎯', wpm: 155, accuracy: 95, races: 650, country: 'South Korea' },
  { rank: 9, name: 'ShiftDrifter', avatar: '🏁', wpm: 152, accuracy: 95, races: 610, country: 'Brazil' },
  { rank: 10, name: 'VelocityKing', avatar: '👑', wpm: 150, accuracy: 94, races: 580, country: 'Sweden' }
];

export const FRIENDS_DATA = [
  { id: '1', name: 'Emma', status: 'In Game', avatar: '👩‍🦰', car: 'Blaze Runner', wpm: 138, canChallenge: true },
  { id: '2', name: 'Liam', status: 'In Game', avatar: '👱‍♂️', car: 'Golden Flash', wpm: 142, canChallenge: true },
  { id: '3', name: 'Sophia', status: 'Online', avatar: '👧', car: 'Starter Car', wpm: 125, canChallenge: true },
  { id: '4', name: 'Noah', status: 'Offline', avatar: '🧑', car: 'Shadow X', wpm: 154, canChallenge: false },
  { id: '5', name: 'Oliver', status: 'Offline', avatar: '🧔', car: 'Forest Beast', wpm: 119, canChallenge: false }
];

export const ACHIEVEMENTS_DATA = [
  {
    id: '1',
    title: 'First Race',
    desc: 'Complete and win your first competitive typing race',
    category: 'Completed',
    icon: '🏆',
    rewardXP: 100,
    rewardCoins: 50,
    progress: '1/1'
  },
  {
    id: '2',
    title: 'Speed Starter',
    desc: 'Reach a typing speed of 100 WPM in an official race',
    category: 'Completed',
    icon: '⚡',
    rewardXP: 250,
    rewardCoins: 100,
    progress: '1/1'
  },
  {
    id: '3',
    title: 'Race Streak',
    desc: 'Win 10 multiplayer races in a consecutive streak',
    category: 'In Progress',
    icon: '🔥',
    rewardXP: 500,
    rewardCoins: 250,
    progress: '6/10'
  },
  {
    id: '4',
    title: 'Typing Master',
    desc: 'Maintain a verified 150+ WPM score over 5 races',
    category: 'Locked',
    icon: '🎯',
    rewardXP: 1000,
    rewardCoins: 500,
    progress: '142/150 WPM'
  },
  {
    id: '5',
    title: 'Car Collector',
    desc: 'Unlock and own at least 5 different racing vehicles in your garage',
    category: 'Locked',
    icon: '🚗',
    rewardXP: 800,
    rewardCoins: 400,
    progress: '2/5 Cars'
  },
  {
    id: '6',
    title: 'Tournament Pro',
    desc: 'Claim first place in an official Weekend Cup event',
    category: 'Locked',
    icon: '👑',
    rewardXP: 2000,
    rewardCoins: 1500,
    progress: '0/1 Win'
  }
];

export const DAILY_CHALLENGES = [
  {
    id: 'c1',
    title: 'Speed Demon',
    description: 'Reach 120 WPM in any race mode today',
    progress: 1,
    max: 1,
    completed: true,
    claimed: false,
    xpReward: 150,
    coinReward: 75
  },
  {
    id: 'c2',
    title: 'Precision Driver',
    description: 'Finish 3 races with 98% accuracy or higher',
    progress: 2,
    max: 3,
    completed: false,
    claimed: false,
    xpReward: 200,
    coinReward: 100
  },
  {
    id: 'c3',
    title: 'Tire Burner',
    description: 'Complete 5 multiplayer races in Green Valley',
    progress: 5,
    max: 5,
    completed: true,
    claimed: true,
    xpReward: 250,
    coinReward: 125
  }
];

export const RECENT_RACES = [
  { track: 'Green Valley', rank: '1st', wpm: 142, accuracy: 99, xp: 50, coins: 30, date: '10 mins ago' },
  { track: 'Desert Rush', rank: '2nd', wpm: 128, accuracy: 97, xp: 30, coins: 20, date: '1 hour ago' },
  { track: 'City Night', rank: '1st', wpm: 135, accuracy: 98, xp: 50, coins: 30, date: '3 hours ago' },
  { track: 'Snow Land', rank: '3rd', wpm: 120, accuracy: 95, xp: 20, coins: 10, date: 'Yesterday' }
];

export const SAMPLE_PASSAGES = [
  {
    id: 'p1',
    difficulty: 'Normal',
    text: 'The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway.'
  },
  {
    id: 'p2',
    difficulty: 'Easy',
    text: 'Racing is not just about raw engine horsepower, but rhythmic cadence and calm precision under pressure.'
  },
  {
    id: 'p3',
    difficulty: 'Hard',
    text: 'Supercharged twin-turbochargers ignite high-octane fuel mixtures as checkered flags wave wildly across the stadium finish line.'
  }
];
