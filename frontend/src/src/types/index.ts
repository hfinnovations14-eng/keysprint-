// Shared TypeScript Interfaces for KeySprint Platform

export interface UserProfile {
  id: string;
  userId: string;
  nickname: string;
  avatarId: string;
  countryCode: string;
  bio?: string;
}

export interface UserStats {
  id: string;
  userId: string;
  verifiedBestWpm: number;
  avgWpm: number;
  accuracy: number;
  racesCount: number;
  winsCount: number;
  xp: number;
  level: number;
  coins: number;
}

export interface InventoryItem {
  id: string;
  userId: string;
  itemId: string;
  itemType: string;
  isEquipped: boolean;
}

export interface CurrentUser {
  id: string;
  email?: string;
  role: 'player' | 'moderator' | 'admin';
  profile: UserProfile;
  stats: UserStats;
  inventory: InventoryItem[];
}

export interface RacePassage {
  id: string;
  text: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  category: string;
}

export interface LeaderboardRacer {
  rank: number;
  userId: string;
  nickname: string;
  avatar: string;
  country: string;
  wpm: number;
  accuracy: number;
  races: number;
  wins: number;
  level: number;
}
