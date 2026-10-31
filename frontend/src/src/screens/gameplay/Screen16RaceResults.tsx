import React, { useEffect } from 'react';
import { Trophy, Zap, Clock, Coins, Star, RotateCcw, Share2, ArrowLeft } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import confetti from 'canvas-confetti';

interface Screen16RaceResultsProps {
  onNavigate: (screenId: string) => void;
  wpm?: number;
  accuracy?: number;
  time?: string;
  coinsEarned?: number;
  xpEarned?: number;
}

export const Screen16RaceResults: React.FC<Screen16RaceResultsProps> = ({
  onNavigate,
  wpm = 142,
  accuracy = 98,
  time = '01:26',
  coinsEarned = 50,
  xpEarned = 120
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  return (
    <div className="screen-page results-screen">
      <div className="content-wrapper">
        <div className="results-celebration-card card">
          {/* HEADER / CELEBRATION (Matching Reference Image 10) */}
          <div className="results-hero-header text-center">
            <div className="podium-trophy-ring">
              <Trophy size={48} className="trophy-gold" />
            </div>
            <h1 className="results-headline">You Finished 1st!</h1>
            <p className="text-secondary text-sm">
              Incredible driving! You dominated the asphalt in Green Valley.
            </p>
          </div>

          {/* MAIN VISUAL: 3D CELEBRATION STAGE */}
          <div className="results-stage-wrapper">
            <img 
              src="/assets/victory_scene.jpg" 
              alt="KeySprint Grand Prix Champion Victory Podium with Red Sports Car" 
              className="results-stage-img"
            />
            <div className="results-stage-badge">
              <span className="badge-flame">🏆</span>
              <span>1st Place Champion</span>
            </div>
          </div>

          {/* PERFORMANCE METRICS GRID (Matching Reference Image 10) */}
          <div className="results-metrics-grid mt-4">
            <div className="result-metric-card card-cream">
              <div className="metric-icon blue"><Zap size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">{wpm} WPM</span>
                <span className="metric-sublabel">Typing Speed</span>
              </div>
            </div>

            <div className="result-metric-card card-cream">
              <div className="metric-icon green"><Trophy size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">{accuracy}%</span>
                <span className="metric-sublabel">Accuracy</span>
              </div>
            </div>

            <div className="result-metric-card card-cream">
              <div className="metric-icon purple"><Clock size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">{time}</span>
                <span className="metric-sublabel">Race Time</span>
              </div>
            </div>

            <div className="result-metric-card card-cream">
              <div className="metric-icon gold"><Coins size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">+{coinsEarned}</span>
                <span className="metric-sublabel">Coins Earned</span>
              </div>
            </div>

            <div className="result-metric-card card-cream">
              <div className="metric-icon orange"><Star size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">+{xpEarned}</span>
                <span className="metric-sublabel">XP Gained</span>
              </div>
            </div>
          </div>

          {/* LEVEL PROGRESS BAR */}
          <div className="results-xp-bar-container card-cream mt-4">
            <div className="xp-bar-header">
              <span>Driver Level 12</span>
              <span><strong>840 / 1,500 XP</strong> (+{xpEarned} XP)</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: '56%' }} />
            </div>
          </div>

          {/* ACTION BUTTONS (Matching Reference Image 10) */}
          <div className="results-actions-row mt-4">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('screen-13')}
            >
              <RotateCcw size={18} />
              <span>Play Again</span>
            </button>

            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('screen-10')}
            >
              <ArrowLeft size={18} />
              <span>Back to Lobby</span>
            </button>

            <button 
              className="btn btn-outline btn-lg"
              onClick={() => alert('Race result copied to clipboard!')}
            >
              <Share2 size={18} />
              <span>Share Result</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
