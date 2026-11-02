import * as React from 'react';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

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
  clearRoomError: () => void;
  joinMatchmaking: (targetRoomId?: string) => void;
  leaveMatchmaking: () => void;
  createPrivateRoom: (options: {
    roomName: string;
    roomCode: string;
    maxPlayers: number;
    trackId: string;
    fillWithBots: boolean;
  }) => void;
  joinPrivateRoom: (roomCode: string) => Promise<{ success: boolean; message?: string }>;
  toggleReady: () => void;
  startPrivateRace: () => void;
  leaveRoom: () => void;
  sendProgress: (progress: number, wpm: number, accuracy: number) => void;
  submitFinalRace: (stats: { wpm: number; accuracy: number; durationSec: number; place: number }) => Promise<RaceResultSummary>;
  setPassageText: (text: string) => void;
}

const DEFAULT_PASSAGE = "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway at breakneck velocity.";

const RaceContext = createContext<RaceContextType | undefined>(undefined);

export const RaceProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const { user, refreshUser } = useAuth();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomMeta, setRoomMeta] = useState<RoomMeta | null>(null);
  const [passageText, setPassageText] = useState<string>(DEFAULT_PASSAGE);
  const [roomStatus, setRoomStatus] = useState<'idle' | 'waiting' | 'countdown' | 'racing' | 'finished'>('idle');
  const [players, setPlayers] = useState<RacePlayer[]>([]);
  const [countdown, setCountdown] = useState<number>(3);
  const [lastResult, setLastResult] = useState<RaceResultSummary | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);

  const socketRef = useRef(getSocket());

  useEffect(() => {
    const s = connectSocket();
    socketRef.current = s;

    s.on('room.update', (data: {
      roomId: string;
      code?: string;
      name?: string;
      isPrivate?: boolean;
      hostSocketId?: string;
      maxPlayers?: number;
      trackId?: string;
      fillWithBots?: boolean;
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
        fillWithBots: data.fillWithBots ?? true
      });
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
      s.off('room.update');
      s.off('room.error');
      s.off('match.countdown');
      s.off('match.start');
      s.off('players.progress');
    };
  }, [user?.id]);

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

  const joinMatchmaking = (targetRoomId?: string) => {
    const s = connectSocket();
    const { carId, nickname, avatar, userId } = getDriverPayload();

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

  const createPrivateRoom = (options: {
    roomName: string;
    roomCode: string;
    maxPlayers: number;
    trackId: string;
    fillWithBots: boolean;
  }) => {
    const s = connectSocket();
    const { carId, nickname, avatar, userId } = getDriverPayload();

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
      fillWithBots: options.fillWithBots
    });
  };

  const joinPrivateRoom = async (code: string): Promise<{ success: boolean; message?: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setRoomError('Please enter a valid room code.');
      return { success: false, message: 'Please enter a valid room code.' };
    }

    setRoomError(null);
    const s = connectSocket();
    const { carId, nickname, avatar, userId } = getDriverPayload();

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

  const leaveRoom = () => {
    if (roomId) {
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
    const s = getSocket();
    s.emit('progress.update', {
      roomId,
      progress,
      wpm,
      accuracy
    });
  };

  const submitFinalRace = async (stats: { wpm: number; accuracy: number; durationSec: number; place: number }) => {
    const min = Math.floor(stats.durationSec / 60);
    const sec = Math.floor(stats.durationSec % 60);
    const formattedTime = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;

    let earnedCoins = 100 + Math.floor((stats.accuracy / 100) * 50);
    let earnedXp = 50;
    if (stats.place === 1) earnedXp += 50;
    else if (stats.place === 2) earnedXp += 30;
    else if (stats.place === 3) earnedXp += 15;

    let unlocked: any[] = [];
    try {
      const res = await api.submitRaceResult({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        durationSec: stats.durationSec,
        place: stats.place,
        mode: roomMeta?.isPrivate ? 'private' : 'quick'
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
      place: stats.place,
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
        clearRoomError,
        joinMatchmaking,
        leaveMatchmaking,
        createPrivateRoom,
        joinPrivateRoom,
        toggleReady,
        startPrivateRace,
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
