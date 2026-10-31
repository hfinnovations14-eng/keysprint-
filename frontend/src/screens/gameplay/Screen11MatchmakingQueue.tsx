import * as React from 'react';
import { useEffect } from 'react';
import { Loader2, X, ShieldCheck, MapPin, Zap } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { useRace } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';

interface Screen11MatchmakingQueueProps {
  onNavigate: (screenId: string) => void;
}

export const Screen11MatchmakingQueue: React.FC<Screen11MatchmakingQueueProps> = ({ onNavigate }: Screen11MatchmakingQueueProps) => {
  const { user } = useAuth();
  const { roomId, roomStatus, players, countdown, joinMatchmaking, leaveMatchmaking } = useRace();

  useEffect(() => {
    joinMatchmaking();
    return () => {
      // Don't leave if advancing to screen-12 or screen-13
    };
  }, []);

  useEffect(() => {
    if (roomStatus === 'countdown' && countdown <= 1) {
      const t = setTimeout(() => {
        onNavigate('screen-12');
      }, 500);
      return () => clearTimeout(t);
    }
  }, [roomStatus, countdown, onNavigate]);

  const handleCancel = () => {
    leaveMatchmaking();
    onNavigate('screen-10');
  };

  return (
    <div className="screen-page queue-screen">
      <div className="content-wrapper">
        <div className="queue-container card">
          {/* Top Status */}
          <div className="queue-top-status text-center">
            <div className="queue-spinner-ring">
              <Loader2 size={36} className="spinner-icon text-orange" />
            </div>
            <span className="badge badge-orange mt-3">
              {roomStatus === 'countdown' ? 'Starting Grid Ready' : 'Matchmaking Active'}
            </span>
            <h2 className="mt-2">
              {roomStatus === 'countdown' ? 'Racers Assembled! Launching Grid...' : 'Finding Worthy Racers...'}
            </h2>
            <p className="text-secondary text-sm">
              Connecting with drivers on live WebSockets. Starting in <strong>{countdown}s</strong>.
            </p>
          </div>

          {/* Selected Track & Settings Banner */}
          <div className="queue-settings-banner card-cream">
            <div className="setting-pill">
              <MapPin size={16} className="text-orange" />
              <span>Track: <strong>Night Grand Prix</strong></span>
            </div>
            <div className="setting-pill">
              <Zap size={16} className="text-green" />
              <span>Difficulty: <strong>Normal (Curated)</strong></span>
            </div>
            <div className="setting-pill">
              <ShieldCheck size={16} className="text-blue" />
              <span>Server-Authoritative Room #{roomId ? roomId.slice(-4) : 'SYNC'}</span>
            </div>
          </div>

          {/* Racer Slots (Real Socket Players) */}
          <div className="queue-slots-grid">
            {players.map((slot, idx) => {
              const isYou = slot.userId === user?.id || slot.socketId === slot.userId;
              return (
                <div key={slot.socketId} className={`slot-card ${isYou ? 'slot-you' : ''}`}>
                  <div className="slot-header">
                    <span className="slot-number">Lane {idx + 1}</span>
                    {slot.isBot && <span className="bot-tag">AI BOT</span>}
                    {isYou && <span className="you-tag">YOU</span>}
                  </div>
                  <div className="slot-car-preview">
                    <SvgCar id={(slot.carId as CarModelId) || 'blaze'} size={110} />
                  </div>
                  <div className="slot-player-meta">
                    <span className="slot-avatar">{slot.avatar || '🏎️'}</span>
                    <span className="slot-name">{slot.nickname}</span>
                  </div>
                </div>
              );
            })}

            {/* Empty waiting slots if room not yet full */}
            {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, i) => (
              <div key={i} className="slot-card slot-empty">
                <span className="empty-lane-text">Lane {players.length + i + 1}</span>
                <div className="empty-placeholder-ring">
                  <span>Searching...</span>
                </div>
              </div>
            ))}
          </div>

          {/* Cancel button */}
          <div className="queue-actions text-center mt-4">
            <button 
              className="btn btn-outline"
              onClick={handleCancel}
            >
              <X size={16} />
              <span>Cancel Matchmaking</span>
            </button>
            <button 
              className="btn btn-primary ml-2"
              onClick={() => onNavigate('screen-12')}
            >
              <span>Instant Grid (Screen 12)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
