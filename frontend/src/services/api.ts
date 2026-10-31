// KeySprint Frontend API Service

const BASE_URL = '/api/v1';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('keysprint_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('keysprint_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('keysprint_token');
};

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  // Auth
  register: (body: { email: string; password: string; nickname: string; countryCode?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  guestLogin: (nickname?: string) =>
    request('/auth/guest', { method: 'POST', body: JSON.stringify({ nickname }) }),

  getMe: () => request('/auth/me'),

  // Race
  getPassage: (difficulty?: string) =>
    request(`/race/passage${difficulty ? `?difficulty=${difficulty}` : ''}`),

  submitRaceResult: (result: {
    wpm: number;
    accuracy: number;
    durationSec: number;
    place: number;
    passageId?: string;
    mode?: string;
  }) => request('/race/result', { method: 'POST', body: JSON.stringify(result) }),

  getRaceHistory: () => request('/race/history'),

  // Leaderboard
  getLeaderboard: (country?: string) =>
    request(`/leaderboard${country && country !== 'all' ? `?country=${country}` : ''}`),

  // User & Shop
  updateProfile: (profile: { nickname?: string; avatarId?: string; countryCode?: string; bio?: string }) =>
    request('/user/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  purchaseStoreItem: (itemId: string, cost: number, itemType: string = 'car') =>
    request('/user/store/purchase', { method: 'POST', body: JSON.stringify({ itemId, cost, itemType }) }),

  equipItem: (itemId: string, itemType: string = 'car') =>
    request('/user/garage/equip', { method: 'POST', body: JSON.stringify({ itemId, itemType }) }),

  // Admin
  getAdminMetrics: () => request('/admin/metrics'),
  getAdminUsers: () => request('/admin/users'),
  getAdminPassages: () => request('/admin/passages'),
  createAdminPassage: (passage: { text: string; difficulty: string; category: string }) =>
    request('/admin/passages', { method: 'POST', body: JSON.stringify(passage) }),
};
