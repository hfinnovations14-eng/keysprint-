import React, { useState, useEffect } from 'react';
import { Flag, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen12PreRaceLobbyProps {
  onNavigate: (screenId: string) => void;
}

export const Screen12PreRaceLobby: React.FC<Screen12PreRaceLobbyProps> = ({ onNavigate }) => {
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

  return (
    <div className="screen-page pre-race-screen">
      <div className="content-wrapper">
        <div className="pre-race-card card">
          {/* Header */}
          <div className="pre-race-header text-center">
            <span className="badge badge-orange">Starting Grid Formed</span>
            <h2>Get Ready to Sprint!</h2>
            <p className="text-secondary text-sm">Synchronizing passage and authoritative start clocks...</p>
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
            <div className="lineup-racer-card card-cream">
              <span className="lane-badge">Lane 1</span>
              <SvgCar id="blaze" size={130} />
              <div className="racer-meta">
                <strong>AlexPro (You)</strong>
                <span className="car-label">Blaze Runner • Lv. 12</span>
              </div>
            </div>

            <div className="lineup-racer-card card-cream">
              <span className="lane-badge">Lane 2</span>
              <SvgCar id="golden" size={130} />
              <div className="racer-meta">
                <strong>Emma</strong>
                <span className="car-label">Golden Flash • Lv. 14</span>
              </div>
            </div>

            <div className="lineup-racer-card card-cream">
              <span className="lane-badge">Lane 3</span>
              <SvgCar id="forest" size={130} />
              <div className="racer-meta">
                <strong>Liam</strong>
                <span className="car-label">Forest Beast • Lv. 9</span>
              </div>
            </div>

            <div className="lineup-racer-card card-cream">
              <span className="lane-badge">Lane 4</span>
              <SvgCar id="starter" size={130} />
              <div className="racer-meta">
                <strong>Sophia</strong>
                <span className="car-label">Starter Car • Lv. 8</span>
              </div>
            </div>
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
