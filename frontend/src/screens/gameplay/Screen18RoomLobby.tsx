import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, Play, UserPlus, LogOut, Crown, ShieldCheck, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { useRace } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';
import { TRACKS_DATA } from '../../data/carsData';

interface Screen18RoomLobbyProps {
  onNavigate: (screenId: string) => void;
}

export const Screen18RoomLobby: React.FC<Screen18RoomLobbyProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    players, 
    roomCode, 
    roomMeta, 
    roomId, 
    roomStatus, 
    countdown,
    toggleReady, 
    startPrivateRace, 
    leaveRoom 
  } = useRace();

  const [copied, setCopied] = useState(false);

  // Auto transition when countdown starts or reaches 0
  useEffect(() => {
    if (roomStatus === 'racing' || (roomStatus === 'countdown' && countdown <= 1)) {
      const timer = setTimeout(() => {
        onNavigate('screen-13'); // Go directly to Live Race!
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [roomStatus, countdown, onNavigate]);

  const activeCode = roomCode || roomMeta?.code || 'SPRINT-89';
  const activeRoomName = roomMeta?.name || `${user?.profile?.nickname || 'Racer'}'s Private Grid`;
  const maxCapacity = roomMeta?.maxPlayers || 4;
  const isHost = roomMeta?.isHost ?? true;

  const selectedTrackData = TRACKS_DATA.find(t => t.id === roomMeta?.trackId) || TRACKS_DATA[0];

  const handleCopyLink = () => {
    try {
      const shareUrl = `${window.location.origin}/?room=${encodeURIComponent(activeCode)}`;
      navigator.clipboard.writeText(`Join my KeySprint race with code: ${activeCode} (${shareUrl})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleLeave = () => {
    leaveRoom();
    onNavigate('screen-17');
  };

  const youPlayer = players.find(p => p.userId === user?.id || (!user?.id && !p.isBot));
  const isYouReady = youPlayer?.isReady ?? false;

  // Fallback racers for preview if socket hasn't populated yet
  const displayRacers = players.length > 0 ? players : [
    {
      socketId: 'host_local',
      userId: user?.id || 'you',
      nickname: user?.profile?.nickname || 'AlexPro',
      carId: 'blaze',
      avatar: user?.profile?.avatarId || '🏎️',
      progress: 0,
      wpm: 0,
      accuracy: 100,
      finished: false,
      isHost: true,
      isReady: true
    }
  ];

  const emptySlotsCount = Math.max(0, maxCapacity - displayRacers.length);

  return (
    <div className="screen-page room-screen">
      <div className="content-wrapper">
        <div className="room-lobby-card card">

          {/* COUNTDOWN OVERLAY IF HOST INITIATED */}
          {roomStatus === 'countdown' && (
            <div className="lobby-countdown-overlay card-cream text-center mb-4 p-4 border-orange">
              <span className="badge badge-orange">Starting Grid Ready</span>
              <h2 className="mt-2 text-2xl font-bold">Race Launching in...</h2>
              <div className="countdown-big-number text-orange text-5xl font-black mt-2">
                {countdown > 0 ? countdown : 'GO!'}
              </div>
              <p className="text-sm text-secondary mt-1">Get your hands on the keyboard!</p>
            </div>
          )}

          {/* Header */}
          <div className="lobby-header-row">
            <div>
              <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
                <span className="badge badge-gold">Private Lobby</span>
                <span className="badge badge-blue flex-center gap-1">
                  <MapPin size={12} />
                  <span>{selectedTrackData.name}</span>
                </span>
                {roomMeta?.fillWithBots && (
                  <span className="badge badge-green">
                    AI Fill: {roomMeta.botDifficulty ? roomMeta.botDifficulty.toUpperCase() : 'NORMAL'}
                  </span>
                )}
              </div>
              <h2>{activeRoomName}</h2>
              <div className="room-code-tag mt-1">
                <span>Room Code: <strong>{activeCode}</strong></span>
              </div>
            </div>

            <div className="lobby-invite-box">
              <button className="btn btn-secondary btn-sm flex-center gap-1" onClick={handleCopyLink}>
                {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                <span>{copied ? 'Invite Code Copied!' : 'Copy Invite Code'}</span>
              </button>
            </div>
          </div>

          {/* Lobby Slots Grid */}
          <div className="lobby-slots-grid mt-4">
            {displayRacers.map((p, idx) => {
              const isYou = p.userId === user?.id || p.socketId === youPlayer?.socketId;
              return (
                <div key={p.socketId || idx} className={`lobby-player-card card-cream ${isYou ? 'border-orange' : ''}`}>
                  <div className="p-header">
                    <span className="p-slot-num">Slot {idx + 1}</span>
                    {p.isHost && (
                      <span className="host-badge">
                        <Crown size={12} /> Host
                      </span>
                    )}
                    {isYou && <span className="you-tag">YOU</span>}
                    {p.isBot && <span className="bot-tag">AI BOT</span>}
                  </div>

                  <div className="p-car-center">
                    <SvgCar id={(p.carId as CarModelId) || 'blaze'} size={110} />
                  </div>

                  <div className="p-footer">
                    <span className="p-avatar">{p.avatar || '🏎️'}</span>
                    <span className="p-name font-semibold">{p.nickname}</span>
                    <span className={`p-ready-pill ${p.isReady || p.isHost ? 'ready' : 'waiting'}`}>
                      {p.isHost ? 'Host (Ready)' : p.isReady ? 'Ready' : 'Not Ready'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Empty Slots */}
            {Array.from({ length: emptySlotsCount }).map((_, i) => (
              <div key={i} className="lobby-player-card empty-slot">
                <span className="p-slot-num">Slot {displayRacers.length + i + 1}</span>
                <div className="empty-slot-content">
                  <UserPlus size={24} className="text-muted" />
                  <span className="text-sm text-secondary font-medium">Waiting for friend...</span>
                  <span className="text-xs text-muted">Share code: {activeCode}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions & Host Controls */}
          <div className="lobby-actions-row mt-5">
            <button 
              type="button"
              className="btn btn-outline"
              onClick={handleLeave}
            >
              <LogOut size={16} />
              <span>Leave Room</span>
            </button>

            <div className="flex-center gap-3">
              {/* If non-host, show Ready toggle */}
              {!isHost && (
                <button
                  type="button"
                  className={`btn ${isYouReady ? 'btn-green' : 'btn-secondary'} btn-lg flex-center gap-2`}
                  onClick={toggleReady}
                >
                  <CheckCircle2 size={18} />
                  <span>{isYouReady ? 'You Are Ready!' : 'Click to Ready Up'}</span>
                </button>
              )}

              {/* Host Start Match Button */}
              {isHost && (
                <button 
                  type="button"
                  className="btn btn-primary btn-lg flex-center gap-2"
                  disabled={roomStatus === 'countdown'}
                  onClick={startPrivateRace}
                >
                  <Play size={18} fill="#FFFFFF" />
                  <span>
                    {roomStatus === 'countdown'
                      ? 'Launching Grid...'
                      : `Start Match (${displayRacers.length}/${maxCapacity})`}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Info pill footer */}
          <div className="card-cream mt-4 p-3 text-center text-xs text-secondary flex-center gap-4">
            <span className="flex-center gap-1">
              <ShieldCheck size={14} className="text-green" />
              <span>Server-Authoritative Room</span>
            </span>
            <span>•</span>
            <span>All racers receive identical keystroke normalization & track physics</span>
            <span>•</span>
            <span>Room #{roomId ? roomId.slice(-6) : activeCode}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
