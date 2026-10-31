import React, { useState, useEffect } from 'react';
import { Loader2, X, Users, ShieldCheck, MapPin, Zap } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen11MatchmakingQueueProps {
  onNavigate: (screenId: string) => void;
}

export const Screen11MatchmakingQueue: React.FC<Screen11MatchmakingQueueProps> = ({ onNavigate }) => {
  const [seconds, setSeconds] = useState(4);
  const [playerSlots, setPlayerSlots] = useState([
    { id: '1', name: 'AlexPro (You)', avatar: '🏎️', car: 'starter', isYou: true, isBot: false },
    { id: '2', name: 'Emma', avatar: '👩‍🦰', car: 'blaze', isYou: false, isBot: false },
    { id: '3', name: 'Liam', avatar: '👱‍♂️', car: 'golden', isYou: false, isBot: false },
    { id: '4', name: 'Bot Turbo [AI]', avatar: '🤖', car: 'forest', isYou: false, isBot: true },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onNavigate('screen-12'); // Transition to countdown lobby!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onNavigate]);

  return (
    <div className="screen-page queue-screen">
      <div className="content-wrapper">
        <div className="queue-container card">
          {/* Top Status */}
          <div className="queue-top-status text-center">
            <div className="queue-spinner-ring">
              <Loader2 size={36} className="spinner-icon text-orange" />
            </div>
            <span className="badge badge-orange mt-3">Matchmaking Active</span>
            <h2 className="mt-2">Finding Worthy Racers...</h2>
            <p className="text-secondary text-sm">
              Connecting you with players near your 142 WPM skill tier. Starting in <strong>{seconds}s</strong>.
            </p>
          </div>

          {/* Selected Track & Settings Banner */}
          <div className="queue-settings-banner card-cream">
            <div className="setting-pill">
              <MapPin size={16} className="text-orange" />
              <span>Track: <strong>Green Valley</strong></span>
            </div>
            <div className="setting-pill">
              <Zap size={16} className="text-green" />
              <span>Difficulty: <strong>Normal (220 chars)</strong></span>
            </div>
            <div className="setting-pill">
              <ShieldCheck size={16} className="text-blue" />
              <span>Server-Authoritative Room #8492</span>
            </div>
          </div>

          {/* Racer Slots (4 of 6 filled) */}
          <div className="queue-slots-grid">
            {playerSlots.map((slot, idx) => (
              <div key={slot.id} className={`slot-card ${slot.isYou ? 'slot-you' : ''}`}>
                <div className="slot-header">
                  <span className="slot-number">Lane {idx + 1}</span>
                  {slot.isBot && <span className="bot-tag">AI BOT</span>}
                  {slot.isYou && <span className="you-tag">YOU</span>}
                </div>
                <div className="slot-car-preview">
                  <SvgCar id={slot.car as any} size={110} />
                </div>
                <div className="slot-player-meta">
                  <span className="slot-avatar">{slot.avatar}</span>
                  <span className="slot-name">{slot.name}</span>
                </div>
              </div>
            ))}

            {/* Empty waiting slot */}
            <div className="slot-card slot-empty">
              <span className="empty-lane-text">Lane 5</span>
              <div className="empty-placeholder-ring">
                <span>Waiting...</span>
              </div>
            </div>

            <div className="slot-card slot-empty">
              <span className="empty-lane-text">Lane 6</span>
              <div className="empty-placeholder-ring">
                <span>Waiting...</span>
              </div>
            </div>
          </div>

          {/* Cancel button */}
          <div className="queue-actions text-center mt-4">
            <button 
              className="btn btn-outline"
              onClick={() => onNavigate('screen-10')}
            >
              <X size={16} />
              <span>Cancel Matchmaking</span>
            </button>
            <button 
              className="btn btn-primary ml-2"
              onClick={() => onNavigate('screen-12')}
            >
              <span>Skip to Countdown Lobby</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
