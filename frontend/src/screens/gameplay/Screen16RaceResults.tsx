import * as React from 'react';
import { useEffect } from 'react';
import { Trophy, Zap, Clock, Coins, Star, RotateCcw, Share2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRace } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';

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
  wpm: propWpm,
  accuracy: propAcc,
  time: propTime,
  coinsEarned: propCoins,
  xpEarned: propXp
}: Screen16RaceResultsProps) => {
  const { user } = useAuth();
  const { lastResult, joinMatchmaking } = useRace();

  const finalWpm = lastResult?.wpm ?? propWpm ?? 132;
  const finalAcc = lastResult?.accuracy ?? propAcc ?? 98;
  const finalTime = lastResult?.time ?? propTime ?? '00:45';
  const finalCoins = lastResult?.coinsEarned ?? propCoins ?? 150;
  const finalXp = lastResult?.xpEarned ?? propXp ?? 100;
  const finalPlace = lastResult?.place ?? 1;

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const handlePlayAgain = () => {
    joinMatchmaking();
    onNavigate('screen-11');
  };

  const getPlacementTitle = () => {
    if (finalPlace === 1) return 'You Finished 1st! 🏆';
    if (finalPlace === 2) return 'You Finished 2nd! 🥈';
    if (finalPlace === 3) return 'You Finished 3rd! 🥉';
    return `You Finished #${finalPlace}!`;
  };

  const currentLevel = user?.stats?.level || 1;
  const currentXp = user?.stats?.xp || 200;

  return (
    <div className="screen-page results-screen">
      <div className="content-wrapper">
        <div className="results-celebration-card card">
          {/* HEADER / CELEBRATION */}
          <div className="results-hero-header text-center">
            <div className="podium-trophy-ring">
              <Trophy size={48} className="trophy-gold" />
            </div>
            <h1 className="results-headline">{getPlacementTitle()}</h1>
            <p className="text-secondary text-sm">
              Incredible driving! Saved to your official KeySprint career records.
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
              <span className="badge-flame">🏁</span>
              <span>Podium Rank #{finalPlace}</span>
            </div>
          </div>

          {/* PERFORMANCE METRICS GRID */}
          <div className="results-metrics-grid mt-4">
            <div className="result-metric-card card-cream">
              <div className="metric-icon blue"><Zap size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">{finalWpm} WPM</span>
                <span className="metric-sublabel">Typing Speed</span>
              </div>
            </div>

            <div className="result-metric-card card-cream">
              <div className="metric-icon green"><Trophy size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">{finalAcc}%</span>
                <span className="metric-sublabel">Accuracy</span>
              </div>
            </div>

            <div className="result-metric-card card-cream">
              <div className="metric-icon purple"><Clock size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">{finalTime}</span>
                <span className="metric-sublabel">Race Time</span>
              </div>
            </div>

            <div className="result-metric-card card-cream">
              <div className="metric-icon gold"><Coins size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">+{finalCoins}</span>
                <span className="metric-sublabel">Coins Earned</span>
              </div>
            </div>

            <div className="result-metric-card card-cream">
              <div className="metric-icon orange"><Star size={22} /></div>
              <div className="metric-content">
                <span className="metric-big-number">+{finalXp}</span>
                <span className="metric-sublabel">XP Gained</span>
              </div>
            </div>
          </div>

          {/* LEVEL PROGRESS BAR */}
          <div className="results-xp-bar-container card-cream mt-4">
            <div className="xp-bar-header">
              <span>Driver Level {currentLevel}</span>
              <span><strong>{currentXp} XP</strong> (+{finalXp} XP)</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${Math.min(100, (currentXp % 1000) / 10)}%` }} />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="results-actions-row mt-4">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handlePlayAgain}
            >
              <RotateCcw size={18} />
              <span>Race Again</span>
            </button>

            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('screen-10')}
            >
              <ArrowLeft size={18} />
              <span>Back to Modes</span>
            </button>

            <button 
              className="btn btn-outline btn-lg"
              onClick={() => onNavigate('screen-19')}
            >
              <span>Driver Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
