import * as React from 'react';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import { api, getAuthToken } from '../services/api';

export interface RacePlayer {
  socketId: string;
  userId: string;
  nickname: string;
  carId: string;
  avatar: string;
  progress: number;
  wpm: number;
  accuracy: number;
  finished: boolean;
  finishTime?: number;
  isBot?: boolean;
  isHost?: boolean;
  isReady?: boolean;
}

export interface RoomMeta {
  roomId: string;
  code?: string;
  name?: string;
  isPrivate: boolean;
  isHost: boolean;
  maxPlayers: number;
  trackId: string;
  fillWithBots: boolean;
  botDifficulty?: 'easy' | 'normal' | 'advanced';
}

export interface RaceResultSummary {
  wpm: number;
  accuracy: number;
  time: string;
  durationSec: number;
  place: number;
  coinsEarned: number;
  xpEarned: number;
  unlockedAchievements?: Array<{
    id: string;
    code: string;
    title: string;
    description: string;
    badgeIcon: string;
    xpReward: number;
    coinReward: number;
  }>;
}

export interface IncomingChallenge {
  roomCode: string;
  challengerName: string;
  challengerAvatar: string;
}

interface RaceContextType {
  roomId: string | null;
  roomCode: string | null;
  roomMeta: RoomMeta | null;
  passageText: string;
  roomStatus: 'idle' | 'waiting' | 'countdown' | 'racing' | 'finished';
  players: RacePlayer[];
  countdown: number;
  lastResult: RaceResultSummary | null;
  roomError: string | null;
  incomingChallenge: IncomingChallenge | null;
  dismissChallenge: () => void;
  clearRoomError: () => void;
  joinMatchmaking: (targetRoomId?: string) => void;
  leaveMatchmaking: () => void;
  createPrivateRoom: (options: {
    roomName: string;
    roomCode: string;
    maxPlayers: number;
    trackId: string;
    fillWithBots: boolean;
    botDifficulty?: 'easy' | 'normal' | 'advanced';
  }) => void;
  joinPrivateRoom: (roomCode: string) => Promise<{ success: boolean; message?: string }>;
  toggleReady: () => void;
  startPrivateRace: () => void;
  requestRematch: () => void;
  startBotRace: (difficulty?: 'easy' | 'normal' | 'advanced') => Promise<void>;
  leaveRoom: () => void;
  sendProgress: (progress: number, wpm: number, accuracy: number) => void;
  submitFinalRace: (stats: { wpm: number; accuracy: number; durationSec: number; place: number }) => Promise<RaceResultSummary>;
  setPassageText: (text: string) => void;
}

const DEFAULT_PASSAGE = "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway at breakneck velocity.";

const RaceContext = createContext<RaceContextType | undefined>(undefined);

export const RaceProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { user, refreshUser, ensureGuestSession } = useAuth();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomMeta, setRoomMeta] = useState<RoomMeta | null>(null);
  const [passageText, setPassageText] = useState<string>(DEFAULT_PASSAGE);
  const [roomStatus, setRoomStatus] = useState<'idle' | 'waiting' | 'countdown' | 'racing' | 'finished'>('idle');
  const [players, setPlayers] = useState<RacePlayer[]>([]);
  const [countdown, setCountdown] = useState<number>(3);
  const [lastResult, setLastResult] = useState<RaceResultSummary | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [incomingChallenge, setIncomingChallenge] = useState<IncomingChallenge | null>(null);

  const socketRef = useRef(getSocket());
  const botIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const s = connectSocket();
    socketRef.current = s;

    const handleRegister = () => {
      if (user?.id) {
        s.emit('user.register', { userId: user.id });
      }
    };

    handleRegister();
    s.on('connect', handleRegister);

    s.on('social.challenge_received', (data: IncomingChallenge) => {
      setIncomingChallenge(data);
    });

    s.on('room.update', (data: {
      roomId: string;
      code?: string;
      name?: string;
      isPrivate?: boolean;
      hostSocketId?: string;
      maxPlayers?: number;
      trackId?: string;
      fillWithBots?: boolean;
      botDifficulty?: 'easy' | 'normal' | 'advanced';
      status: any;
      passageText: string;
      players: RacePlayer[];
    }) => {
      setRoomId(data.roomId);
      setRoomCode(data.code || null);
      setRoomStatus(data.status);
      if (data.passageText) setPassageText(data.passageText);
      setPlayers(data.players || []);

      const currentSocketId = s.id;
      const you = data.players?.find(p => p.socketId === currentSocketId || (user?.id && p.userId === user.id));
      const isHost = !!you?.isHost || data.hostSocketId === currentSocketId;

      setRoomMeta({
        roomId: data.roomId,
        code: data.code,
        name: data.name,
        isPrivate: !!data.isPrivate,
        isHost,
        maxPlayers: data.maxPlayers || 4,
        trackId: data.trackId || 'green-valley',
        fillWithBots: data.fillWithBots ?? true,
        botDifficulty: data.botDifficulty || 'normal'
      });
    });

    s.on('room.rematch_ready', (data: { room?: any }) => {
      setRoomStatus('waiting');
      setCountdown(3);
      setLastResult(null);
      if (data.room?.passageText) setPassageText(data.room.passageText);
      if (data.room?.players) setPlayers(data.room.players);
    });

    s.on('room.error', (data: { message: string }) => {
      setRoomError(data.message);
    });

    s.on('match.countdown', (data: { count: number }) => {
      setRoomStatus('countdown');
      setCountdown(data.count);
    });

    s.on('match.start', (data: { startTime: number; passageText: string; roomId: string; trackId?: string }) => {
      setRoomStatus('racing');
      if (data.passageText) setPassageText(data.passageText);
      if (data.roomId) setRoomId(data.roomId);
    });

    s.on('players.progress', (data: { players: RacePlayer[] }) => {
      setPlayers(data.players || []);
    });

    return () => {
      s.off('connect', handleRegister);
      s.off('room.update');
      s.off('room.rematch_ready');
      s.off('room.error');
      s.off('match.countdown');
      s.off('match.start');
      s.off('players.progress');
      s.off('social.challenge_received');
    };
  }, [user?.id]);

  const dismissChallenge = () => {
    setIncomingChallenge(null);
  };

  const clearRoomError = () => {
    setRoomError(null);
  };

  const getDriverPayload = () => {
    const equippedItem = user?.inventory?.find(i => i.isEquipped);
    const carId = equippedItem?.itemId || 'blaze';
    const nickname = user?.profile?.nickname || `Driver_${Math.floor(1000 + Math.random() * 9000)}`;
    const avatar = user?.profile?.avatarId || '🏎️';
    return { carId, nickname, avatar, userId: user?.id };
  };

  const joinMatchmaking = async (targetRoomId?: string) => {
    let currentUser = user;
    if (!currentUser && !getAuthToken()) {
      try {
        currentUser = await ensureGuestSession();
      } catch (e) {
        console.warn('Guest initialization error:', e);
      }
    }

    const s = connectSocket();
    const equippedItem = currentUser?.inventory?.find(i => i.isEquipped);
    const carId = equippedItem?.itemId || 'blaze';
    const nickname = currentUser?.profile?.nickname || `Driver_${Math.floor(1000 + Math.random() * 9000)}`;
    const avatar = currentUser?.profile?.avatarId || '🏎️';
    const userId = currentUser?.id;

    setRoomStatus('waiting');
    setCountdown(3);
    setRoomError(null);

    s.emit('match.join', {
      userId,
      nickname,
      carId,
      avatar,
      roomId: targetRoomId
    });
  };

  const createPrivateRoom = async (options: {
    roomName: string;
    roomCode: string;
    maxPlayers: number;
    trackId: string;
    fillWithBots: boolean;
    botDifficulty?: 'easy' | 'normal' | 'advanced';
  }) => {
    let currentUser = user;
    if (!currentUser && !getAuthToken()) {
      try {
        currentUser = await ensureGuestSession();
      } catch (e) {
        console.warn('Guest initialization error for create room:', e);
      }
    }

    const s = connectSocket();
    const equippedItem = currentUser?.inventory?.find(i => i.isEquipped);
    const carId = equippedItem?.itemId || 'blaze';
    const nickname = currentUser?.profile?.nickname || `Driver_${Math.floor(1000 + Math.random() * 9000)}`;
    const avatar = currentUser?.profile?.avatarId || '🏎️';
    const userId = currentUser?.id;

    setRoomStatus('waiting');
    setCountdown(3);
    setRoomError(null);

    s.emit('room.create_private', {
      userId,
      nickname,
      carId,
      avatar,
      roomName: options.roomName,
      roomCode: options.roomCode,
      maxPlayers: options.maxPlayers,
      trackId: options.trackId,
      fillWithBots: options.fillWithBots,
      botDifficulty: options.botDifficulty || 'normal'
    });
  };

  const joinPrivateRoom = async (code: string): Promise<{ success: boolean; message?: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setRoomError('Please enter a valid room code.');
      return { success: false, message: 'Please enter a valid room code.' };
    }

    let currentUser = user;
    if (!currentUser && !getAuthToken()) {
      try {
        currentUser = await ensureGuestSession();
      } catch (e) {
        console.warn('Guest initialization error for join room:', e);
      }
    }

    setRoomError(null);
    const s = connectSocket();
    const equippedItem = currentUser?.inventory?.find(i => i.isEquipped);
    const carId = equippedItem?.itemId || 'blaze';
    const nickname = currentUser?.profile?.nickname || `Driver_${Math.floor(1000 + Math.random() * 9000)}`;
    const avatar = currentUser?.profile?.avatarId || '🏎️';
    const userId = currentUser?.id;

    return new Promise((resolve) => {
      const errorHandler = (data: { message: string }) => {
        s.off('room.error', errorHandler);
        s.off('room.joined', successHandler);
        setRoomError(data.message);
        resolve({ success: false, message: data.message });
      };

      const successHandler = () => {
        s.off('room.error', errorHandler);
        s.off('room.joined', successHandler);
        setRoomError(null);
        resolve({ success: true });
      };

      s.once('room.error', errorHandler);
      s.once('room.joined', successHandler);

      s.emit('room.join_private', {
        roomCode: cleanCode,
        userId,
        nickname,
        carId,
        avatar
      });

      // 5s timeout safeguard
      setTimeout(() => {
        s.off('room.error', errorHandler);
        s.off('room.joined', successHandler);
        resolve({ success: false, message: 'Connection timed out. Please try again.' });
      }, 5000);
    });
  };

  const toggleReady = () => {
    if (!roomId) return;
    const s = getSocket();
    s.emit('room.toggle_ready', { roomId });
  };

  const startPrivateRace = () => {
    if (!roomId) return;
    const s = getSocket();
    s.emit('room.host_start', { roomId });
  };

  const requestRematch = () => {
    if (!roomId) return;
    const s = getSocket();
    s.emit('room.rematch', { roomId });
  };

  const startBotRace = async (difficulty: 'easy' | 'normal' | 'advanced' = 'normal') => {
    let currentUser = user;
    if (!currentUser && !getAuthToken()) {
      try {
        currentUser = await ensureGuestSession();
      } catch (e) {
        console.warn('Guest initialization error for bot match:', e);
      }
    }

    let text = DEFAULT_PASSAGE;
    try {
      const res = await api.getPassage(difficulty);
      if (res.passage && res.passage.text) {
        text = res.passage.text;
      }
    } catch {
      // fallback
    }
    setPassageText(text);

    const botProfiles = difficulty === 'easy'
      ? [
          { name: 'Turbo Bot [AI]', carId: 'jeep', avatar: '🤖', baseWpm: 52 },
          { name: 'Rookie Drift [AI]', carId: 'starter', avatar: '🏎️', baseWpm: 48 },
          { name: 'Cadence Cruiser [AI]', carId: 'forest', avatar: '⚡', baseWpm: 56 }
        ]
      : difficulty === 'advanced'
      ? [
          { name: 'Nitro Nova [AI]', carId: 'shadow', avatar: '🚀', baseWpm: 148 },
          { name: 'SpeedMaster AI [AI]', carId: 'golden', avatar: '👑', baseWpm: 154 },
          { name: 'Apex Predator [AI]', carId: 'neon', avatar: '⚡', baseWpm: 162 }
        ]
      : [
          { name: 'Apex AI [AI]', carId: 'golden', avatar: '⚡', baseWpm: 104 },
          { name: 'Turbo Bot [AI]', carId: 'blaze', avatar: '🤖', baseWpm: 96 },
          { name: 'Drift Bot [AI]', carId: 'forest', avatar: '🏎️', baseWpm: 110 }
        ];

    const equippedItem = currentUser?.inventory?.find(i => i.isEquipped);
    const userCar = (equippedItem?.itemId as string) || 'blaze';
    const userNick = currentUser?.profile?.nickname || 'You';
    const userAvatar = currentUser?.profile?.avatarId || '🏎️';

    const playerRacers: RacePlayer[] = [
      {
        socketId: 'local_you',
        userId: currentUser?.id || 'you',
        nickname: userNick,
        carId: userCar,
        avatar: userAvatar,
        progress: 0,
        wpm: 0,
        accuracy: 100,
        finished: false
      },
      ...botProfiles.map((b, idx) => ({
        socketId: `bot_${idx + 1}`,
        userId: `bot_${idx + 1}`,
        nickname: b.name,
        carId: b.carId,
        avatar: b.avatar,
        progress: 0,
        wpm: b.baseWpm,
        accuracy: 98,
        finished: false,
        isBot: true
      }))
    ];

    const botRoomId = `room_bot_${Date.now()}`;
    setRoomId(botRoomId);
    setRoomCode(null);
    setRoomStatus('racing');
    setCountdown(0);
    setPlayers(playerRacers);
    setRoomMeta({
      roomId: botRoomId,
      isPrivate: false,
      isHost: true,
      maxPlayers: 4,
      trackId: 'green-valley',
      fillWithBots: false
    });

    const totalWords = Math.max(5, text.trim().split(/\s+/).length);

    if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    botIntervalRef.current = setInterval(() => {
      setPlayers(prevPlayers => {
        let anyUpdated = false;
        const updated = prevPlayers.map(p => {
          if (p.isBot && !p.finished) {
            anyUpdated = true;
            // Realistic progression: words typed per sec / totalWords * 100
            // Include slight humanized jitter (+/- 5%)
            const wordsPerSec = (p.wpm / 60) * (0.95 + Math.random() * 0.1);
            const step = (wordsPerSec / totalWords) * 100;
            const newProgress = Math.min(100, Math.round((p.progress + step) * 10) / 10);
            const finished = newProgress >= 100;
            return {
              ...p,
              progress: newProgress,
              finished
            };
          }
          return p;
        });

        const allFinished = updated.filter(p => p.isBot).every(p => p.finished);
        if (allFinished && botIntervalRef.current) {
          clearInterval(botIntervalRef.current);
          botIntervalRef.current = null;
        }

        return anyUpdated ? updated : prevPlayers;
      });
    }, 1000);
  };

  const leaveRoom = () => {
    if (botIntervalRef.current) {
      clearInterval(botIntervalRef.current);
      botIntervalRef.current = null;
    }
    if (roomId && !roomId.startsWith('room_bot_')) {
      const s = getSocket();
      s.emit('room.leave', { roomId });
    }
    setRoomStatus('idle');
    setPlayers([]);
    setRoomId(null);
    setRoomCode(null);
    setRoomMeta(null);
    setRoomError(null);
  };

  const leaveMatchmaking = () => {
    leaveRoom();
    disconnectSocket();
  };

  const sendProgress = (progress: number, wpm: number, accuracy: number) => {
    if (!roomId) return;
    if (roomId.startsWith('room_bot_')) {
      setPlayers(prev => prev.map(p => {
        if (!p.isBot) {
          return {
            ...p,
            progress,
            wpm,
            accuracy,
            finished: progress >= 100
          };
        }
        return p;
      }));
      return;
    }
    const s = getSocket();
    s.emit('progress.update', {
      roomId,
      progress,
      wpm,
      accuracy
    });
  };

  const submitFinalRace = async (stats: { wpm: number; accuracy: number; durationSec: number; place: number }) => {
    if (botIntervalRef.current) {
      clearInterval(botIntervalRef.current);
      botIntervalRef.current = null;
    }

    if (!getAuthToken()) {
      try {
        await ensureGuestSession();
      } catch (e) {
        console.warn('Guest auto-session on submit notice:', e);
      }
    }

    const min = Math.floor(stats.durationSec / 60);
    const sec = Math.floor(stats.durationSec % 60);
    const formattedTime = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;

    // Compute placement against finished players/bots
    const fasterOpponents = players.filter(p => !p.socketId.includes('you') && p.userId !== user?.id && p.finished).length;
    const finalPlace = Math.max(1, fasterOpponents + 1);

    let earnedCoins = 100 + Math.floor((stats.accuracy / 100) * 50);
    let earnedXp = 50;
    if (finalPlace === 1) earnedXp += 50;
    else if (finalPlace === 2) earnedXp += 30;
    else if (finalPlace === 3) earnedXp += 15;

    let unlocked: any[] = [];
    try {
      const matchMode = roomId?.startsWith('room_bot_')
        ? 'bot'
        : roomMeta?.isPrivate
        ? 'private'
        : 'quick';

      const res = await api.submitRaceResult({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        durationSec: stats.durationSec,
        place: finalPlace,
        mode: matchMode
      });
      if (res.rewards) {
        earnedCoins = res.rewards.coinsEarned;
        earnedXp = res.rewards.xpEarned;
      }
      if (res.unlockedAchievements) {
        unlocked = res.unlockedAchievements;
      }
      await refreshUser();
    } catch {
      // Offline / guest fallback
    }

    const summary: RaceResultSummary = {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      time: formattedTime,
      durationSec: stats.durationSec,
      place: finalPlace,
      coinsEarned: earnedCoins,
      xpEarned: earnedXp,
      unlockedAchievements: unlocked
    };

    setLastResult(summary);
    return summary;
  };

  return (
    <RaceContext.Provider
      value={{
        roomId,
        roomCode,
        roomMeta,
        passageText,
        roomStatus,
        players,
        countdown,
        lastResult,
        roomError,
        incomingChallenge,
        dismissChallenge,
        clearRoomError,
        joinMatchmaking,
        leaveMatchmaking,
        createPrivateRoom,
        joinPrivateRoom,
        toggleReady,
        startPrivateRace,
        requestRematch,
        startBotRace,
        leaveRoom,
        sendProgress,
        submitFinalRace,
        setPassageText
      }}
    >
      {children}
    </RaceContext.Provider>
  );
};

export const useRace = (): RaceContextType => {
  const context = useContext(RaceContext);
  if (!context) {
    throw new Error('useRace must be used within a RaceProvider');
  }
  return context;
};
