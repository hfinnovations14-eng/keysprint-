// KeySprint Typing Telemetry & Weak-Key Diagnostics Service

export interface KeyTelemetry {
  key: string;
  errors: number;
  total: number;
  errorRate: number; // percentage
  finger: string;
  hand: 'left' | 'right';
  note: string;
}

const STORAGE_KEY = 'keysprint_keystrokes_v1';

const FINGER_MAP: Record<string, { hand: 'left' | 'right'; finger: string; note: string }> = {
  Q: { hand: 'left', finger: 'Pinky', note: 'Left pinky reach' },
  W: { hand: 'left', finger: 'Ring', note: 'Left ring finger' },
  E: { hand: 'left', finger: 'Middle', note: 'Left middle finger' },
  R: { hand: 'left', finger: 'Index', note: 'Left index reach' },
  T: { hand: 'left', finger: 'Index', note: 'Left index stretch' },
  Y: { hand: 'right', finger: 'Index', note: 'Right index stretch' },
  U: { hand: 'right', finger: 'Index', note: 'Right index reach' },
  I: { hand: 'right', finger: 'Middle', note: 'Right middle finger' },
  O: { hand: 'right', finger: 'Ring', note: 'Right ring finger' },
  P: { hand: 'right', finger: 'Pinky', note: 'Right pinky reach' },

  A: { hand: 'left', finger: 'Pinky', note: 'Home row left pinky' },
  S: { hand: 'left', finger: 'Ring', note: 'Home row left ring' },
  D: { hand: 'left', finger: 'Middle', note: 'Home row left middle' },
  F: { hand: 'left', finger: 'Index', note: 'Home row left index' },
  G: { hand: 'left', finger: 'Index', note: 'Left index lateral reach' },
  H: { hand: 'right', finger: 'Index', note: 'Right index lateral reach' },
  J: { hand: 'right', finger: 'Index', note: 'Home row right index' },
  K: { hand: 'right', finger: 'Middle', note: 'Home row right middle' },
  L: { hand: 'right', finger: 'Ring', note: 'Home row right ring' },
  ';': { hand: 'right', finger: 'Pinky', note: 'Home row right pinky' },

  Z: { hand: 'left', finger: 'Pinky', note: 'Bottom row left pinky' },
  X: { hand: 'left', finger: 'Ring', note: 'Bottom row left ring' },
  C: { hand: 'left', finger: 'Middle', note: 'Bottom row left middle' },
  V: { hand: 'left', finger: 'Index', note: 'Bottom row left index' },
  B: { hand: 'left', finger: 'Index', note: 'Bottom row center stretch' },
  N: { hand: 'right', finger: 'Index', note: 'Bottom row center stretch' },
  M: { hand: 'right', finger: 'Index', note: 'Bottom row right index' },
  ',': { hand: 'right', finger: 'Middle', note: 'Bottom row right middle' },
  '.': { hand: 'right', finger: 'Ring', note: 'Bottom row right ring' },
  '/': { hand: 'right', finger: 'Pinky', note: 'Bottom row right pinky' }
};

const DEFAULT_BASELINE: Record<string, { errors: number; total: number }> = {
  P: { errors: 7, total: 50 },
  Q: { errors: 6, total: 50 },
  B: { errors: 5, total: 55 },
  Z: { errors: 4, total: 40 },
  X: { errors: 3, total: 45 },
  ';': { errors: 4, total: 50 },
  E: { errors: 2, total: 120 },
  T: { errors: 3, total: 95 },
  A: { errors: 2, total: 90 },
  S: { errors: 1, total: 85 }
};

export const getStoredTelemetry = (): Record<string, { errors: number; total: number }> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return { ...DEFAULT_BASELINE };
};

export const recordKeystroke = (expectedChar: string, isError: boolean) => {
  const upper = expectedChar.toUpperCase();
  if (!FINGER_MAP[upper]) return;

  const data = getStoredTelemetry();
  if (!data[upper]) {
    data[upper] = { errors: 0, total: 0 };
  }
  data[upper].total += 1;
  if (isError) {
    data[upper].errors += 1;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage fallback
  }
};

export const getAllKeyTelemetry = (): KeyTelemetry[] => {
  const data = getStoredTelemetry();
  const keys = Object.keys(FINGER_MAP);

  return keys.map(k => {
    const stat = data[k] || { errors: 0, total: 20 };
    const total = Math.max(1, stat.total);
    const errors = stat.errors;
    const errorRate = Math.round((errors / total) * 100);
    const meta = FINGER_MAP[k];

    return {
      key: k,
      errors,
      total,
      errorRate,
      finger: meta.finger,
      hand: meta.hand,
      note: meta.note
    };
  });
};

export const getTopWeakKeys = (limit = 4): KeyTelemetry[] => {
  const all = getAllKeyTelemetry();
  return all
    .sort((a, b) => b.errorRate - a.errorRate || b.errors - a.errors)
    .slice(0, limit);
};

export const getHeatmapColor = (errorRate: number): string => {
  if (errorRate >= 12) return '#EF4444'; // Red: Critical weak key
  if (errorRate >= 7) return '#FF5A1F';  // Orange: Moderate error hotspot
  if (errorRate >= 4) return '#F59E0B';  // Yellow: Slight hesitation
  return '#10B981';                      // Green: Confident & precise
};

// Global transient state for launching practice drills
export interface ActiveDrillConfig {
  mode: 'normal' | 'keys' | 'numbers' | 'timed';
  durationSec?: number;
  targetKeys?: string[];
  customTitle?: string;
}

let activeDrillConfig: ActiveDrillConfig = {
  mode: 'normal',
  durationSec: 60
};

export const setActiveDrillConfig = (config: ActiveDrillConfig) => {
  activeDrillConfig = { ...config };
};

export const getActiveDrillConfig = (): ActiveDrillConfig => {
  return activeDrillConfig;
};

export interface PracticeSessionResult {
  speed: number;
  accuracy: number;
  errors: number;
  mode: string;
  drillTitle: string;
  errorKeys: string[];
}

let lastPracticeSession: PracticeSessionResult = {
  speed: 108,
  accuracy: 97,
  errors: 3,
  mode: 'normal',
  drillTitle: 'Standard Practice Passage',
  errorKeys: ['P', 'Q']
};

export const setLastPracticeSession = (res: PracticeSessionResult) => {
  lastPracticeSession = { ...res };
};

export const getLastPracticeSession = (): PracticeSessionResult => {
  return lastPracticeSession;
};
