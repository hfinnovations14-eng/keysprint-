import React, { useState } from 'react';
import { Bot, Play, ShieldAlert, Cpu, ArrowLeft } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen15BotRaceProps {
  onNavigate: (screenId: string) => void;
}

export const Screen15BotRace: React.FC<Screen15BotRaceProps> = ({ onNavigate }) => {
  const [botDifficulty, setBotDifficulty] = useState<'easy' | 'normal' | 'advanced'>('normal');

  return (
    <div className="screen-page bot-race-screen">
      <div className="content-wrapper">
        <div className="bot-race-card card">
          <div className="page-header-block text-center">
            <span className="badge badge-blue">AI Opposition</span>
            <h1 className="page-title">Race Against Bots</h1>
            <p className="page-subtitle">
              Test your pace against deterministic computer algorithms with calibrated WPM curves.
            </p>
          </div>

          {/* Difficulty Tiers */}
          <div className="bot-difficulty-grid mt-4">
            <div 
              className={`bot-tier-card card ${botDifficulty === 'easy' ? 'selected' : ''}`}
              onClick={() => setBotDifficulty('easy')}
            >
              <div className="tier-badge green">Beginner</div>
              <SvgCar id="jeep" size={120} />
              <h3>Easy Bots</h3>
              <p className="text-sm text-secondary">Cruising speed ~45–60 WPM. Occasional pauses to mimic rookie drivers.</p>
              <span className="wpm-tag">Target: 55 WPM</span>
            </div>

            <div 
              className={`bot-tier-card card ${botDifficulty === 'normal' ? 'selected' : ''}`}
              onClick={() => setBotDifficulty('normal')}
            >
              <div className="tier-badge orange">Balanced</div>
              <SvgCar id="forest" size={120} />
              <h3>Normal Bots</h3>
              <p className="text-sm text-secondary">Consistent cadence ~90–115 WPM. Solid sparring partner for everyday practice.</p>
              <span className="wpm-tag">Target: 105 WPM</span>
            </div>

            <div 
              className={`bot-tier-card card ${botDifficulty === 'advanced' ? 'selected' : ''}`}
              onClick={() => setBotDifficulty('advanced')}
            >
              <div className="tier-badge purple">Hardcore</div>
              <SvgCar id="shadow" size={120} />
              <h3>Advanced Bots</h3>
              <p className="text-sm text-secondary">Laser-sharp ~140–165 WPM. Flawless rhythm pushing expert typists to the limit.</p>
              <span className="wpm-tag">Target: 150 WPM</span>
            </div>
          </div>

          {/* Launch Bot Match */}
          <div className="text-center mt-5">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('screen-13')}
            >
              <Play size={20} fill="#FFFFFF" />
              <span>Launch Race Against {botDifficulty.toUpperCase()} Bots</span>
            </button>
            <div className="mt-2">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => onNavigate('screen-10')}
              >
                <ArrowLeft size={16} />
                <span>Change Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
