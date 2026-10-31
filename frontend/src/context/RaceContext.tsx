import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
}

export interface RaceResultSummary {
  wpm: number;
  accuracy: number;
  time: string;
  durationSec: number;
  place: number;
  coinsEarned: number;
  xpEarned: number;
}

interface RaceContextType {
  roomId: string | null;
  passageText: string;
  roomStatus: 'idle' | 'waiting' | 'countdown' | 'racing' | 'finished';
  players: RacePlayer[];
  countdown: number;
  lastResult: RaceResultSummary | null;
  joinMatchmaking: (targetRoomId?: string) => void;
  leaveMatchmaking: () => void;
  sendProgress: (progress: number, wpm: number, accuracy: number) => void;
  submitFinalRace: (stats: { wpm: number; accuracy: number; durationSec: number; place: number }) => Promise<RaceResultSummary>;
  setPassageText: (text: string) => void;
}

const DEFAULT_PASSAGE = "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway at breakneck velocity.";

const RaceContext = createContext<RaceContextType | undefined>(undefined);

export const RaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [passageText, setPassageText] = useState<string>(DEFAULT_PASSAGE);
  const [roomStatus, setRoomStatus] = useState<'idle' | 'waiting' | 'countdown' | 'racing' | 'finished'>('idle');
  const [players, setPlayers] = useState<RacePlayer[]>([]);
  const [countdown, setCountdown] = useState<number>(4);
  const [lastResult, setLastResult] = useState<RaceResultSummary | null>(null);

  const socketRef = useRef(getSocket());

  useEffect(() => {
    const s = connectSocket();
    socketRef.current = s;

    s.on('room.update', (data: { roomId: string; status: any; passageText: string; players: RacePlayer[] }) => {
      setRoomId(data.roomId);
      setRoomStatus(data.status);
      if (data.passageText) setPassageText(data.passageText);
      setPlayers(data.players || []);
    });

    s.on('match.countdown', (data: { count: number }) => {
      setRoomStatus('countdown');
      setCountdown(data.count);
    });

    s.on('match.start', (data: { startTime: number; passageText: string; roomId: string }) => {
      setRoomStatus('racing');
      if (data.passageText) setPassageText(data.passageText);
      if (data.roomId) setRoomId(data.roomId);
    });

    s.on('players.progress', (data: { players: RacePlayer[] }) => {
      setPlayers(data.players || []);
    });

    return () => {
      s.off('room.update');
      s.off('match.countdown');
      s.off('match.start');
      s.off('players.progress');
    };
  }, []);

  const joinMatchmaking = (targetRoomId?: string) => {
    const s = connectSocket();
    const equippedItem = user?.inventory?.find(i => i.isEquipped);
    const carId = equippedItem?.itemId || 'blaze';
    const nickname = user?.profile?.nickname || `Driver_${Math.floor(1000 + Math.random() * 9000)}`;
    const avatar = user?.profile?.avatarId || '🏎️';

    setRoomStatus('waiting');
    setCountdown(4);

    s.emit('match.join', {
      userId: user?.id,
      nickname,
      carId,
      avatar,
      roomId: targetRoomId
    });
  };

  const leaveMatchmaking = () => {
    disconnectSocket();
    setRoomStatus('idle');
    setPlayers([]);
    setRoomId(null);
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

    try {
      const res = await api.submitRaceResult({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        durationSec: stats.durationSec,
        place: stats.place,
        mode: 'quick'
      });
      if (res.rewards) {
        earnedCoins = res.rewards.coinsEarned;
        earnedXp = res.rewards.xpEarned;
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
      xpEarned: earnedXp
    };

    setLastResult(summary);
    return summary;
  };

  return (
    <RaceContext.Provider
      value={{
        roomId,
        passageText,
        roomStatus,
        players,
        countdown,
        lastResult,
        joinMatchmaking,
        leaveMatchmaking,
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
