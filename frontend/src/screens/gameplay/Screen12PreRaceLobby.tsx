import * as React from 'react';
import { useState, useEffect } from 'react';
import { Flag, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { useRace } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';

interface Screen12PreRaceLobbyProps {
  onNavigate: (screenId: string) => void;
}

export const Screen12PreRaceLobby: React.FC<Screen12PreRaceLobbyProps> = ({ onNavigate }: Screen12PreRaceLobbyProps) => {
  const { user } = useAuth();
  const { players, roomId } = useRace();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => onNavigate('screen-13'), 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onNavigate]);

  const displayPlayers = players.length > 0 ? players : [
    { socketId: '1', userId: user?.id || 'you', nickname: user?.profile?.nickname || 'AlexPro', carId: 'blaze', avatar: '🏎️', progress: 0, wpm: 0, accuracy: 100, finished: false },
    { socketId: '2', userId: 'bot_1', nickname: 'Emma', carId: 'golden', avatar: '👩‍🦰', progress: 0, wpm: 0, accuracy: 100, finished: false, isBot: true },
    { socketId: '3', userId: 'bot_2', nickname: 'Liam', carId: 'forest', avatar: '👱‍♂️', progress: 0, wpm: 0, accuracy: 100, finished: false, isBot: true },
    { socketId: '4', userId: 'bot_3', nickname: 'Sophia', carId: 'starter', avatar: '👧', progress: 0, wpm: 0, accuracy: 100, finished: false, isBot: true }
  ];

  return (
    <div className="screen-page pre-race-screen">
      <div className="content-wrapper">
        <div className="pre-race-card card">
          {/* Header */}
          <div className="pre-race-header text-center">
            <span className="badge badge-orange">Starting Grid Formed</span>
            <h2>Get Ready to Sprint!</h2>
            <p className="text-secondary text-sm">
              Server-authoritative room #{roomId ? roomId.slice(-4) : 'LIVE'} • Synchronizing green lights...
            </p>
          </div>

          {/* Central Animated Countdown Pulse */}
          <div className="countdown-display-stage">
            <div className={`countdown-pulse-circle ${countdown === 0 ? 'go' : ''}`}>
              <span className="countdown-big-number">
                {countdown > 0 ? countdown : 'GO!'}
              </span>
            </div>
            <p className="countdown-hint">
              {countdown > 0 ? 'Place fingers on Home Row keys' : 'RACE IN PROGRESS!'}
            </p>
          </div>

          {/* Racers Grid Lineup */}
          <div className="lineup-grid">
            {displayPlayers.map((player, idx) => {
              const isYou = player.userId === user?.id;
              return (
                <div key={player.socketId} className={`lineup-racer-card card-cream ${isYou ? 'border-orange' : ''}`}>
                  <span className="lane-badge">Lane {idx + 1}</span>
                  <SvgCar id={(player.carId as CarModelId) || 'blaze'} size={130} />
                  <div className="racer-meta">
                    <strong>{player.nickname} {isYou ? '(You)' : ''}</strong>
                    <span className="car-label">{player.isBot ? 'AI Contender' : 'Live Driver'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Manual Jump to Race */}
          <div className="text-center mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('screen-13')}
            >
              <span>Instant Start Race (Screen 13)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
