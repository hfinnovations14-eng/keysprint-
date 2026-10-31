import React from 'react';
import { Keyboard, Flag, Award, Zap, Shield, Play } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen02HowToPlayProps {
  onNavigate: (screenId: string) => void;
}

export const Screen02HowToPlay: React.FC<Screen02HowToPlayProps> = ({ onNavigate }) => {
  return (
    <div className="screen-page how-to-play-screen">
      <div className="content-wrapper">
        {/* Header */}
        <div className="page-header-block text-center">
          <span className="badge badge-orange">Driver's Manual</span>
          <h1 className="page-title">How to Play KeySprint</h1>
          <p className="page-subtitle">
            Everything you need to know about navigating the asphalt, accelerating your vehicle, and earning podium finishes.
          </p>
        </div>

        {/* 5-Step Illustrated Guide */}
        <div className="rules-cards-stack">
          {/* Rule 1 */}
          <div className="rule-card card">
            <div className="rule-index">1</div>
            <div className="rule-details">
              <h3>Choose a Race Mode</h3>
              <p>
                From the Race Hub, pick between <strong>Quick Multiplayer Race</strong> (2–6 racers), 
                <strong>Private Friends Room</strong> with a custom 6-character room code, or 
                <strong>Bot Race</strong> against customizable AI speed profiles (Easy, Normal, Advanced).
              </p>
            </div>
            <div className="rule-graphic">
              <SvgCar id="starter" size={140} />
            </div>
          </div>

          {/* Rule 2 */}
          <div className="rule-card card">
            <div className="rule-index">2</div>
            <div className="rule-details">
              <h3>The Synchronized 3-2-1 Countdown</h3>
              <p>
                All racers load the exact same passage and undergo a synchronized server countdown: 
                <strong>3... 2... 1... GO!</strong> No keystrokes are registered before the authoritative start signal, 
                guaranteeing an identical starting line for everyone.
              </p>
            </div>
            <div className="rule-graphic countdown-badge">
              <span>3 • 2 • 1</span>
              <strong className="text-orange">GO!</strong>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="rule-card card">
            <div className="rule-index">3</div>
            <div className="rule-details">
              <h3>Type Sequential Characters Accurately</h3>
              <p>
                Your car moves forward along its dedicated lane proportional to <em>validated correct keystrokes</em>. 
                If you misspell a character, the error highlights in red and forward progress pauses until corrected 
                with backspace. Pasting is blocked by anti-cheat controls.
              </p>
            </div>
            <div className="rule-graphic typing-preview-pill">
              <span className="typed-valid">The quick brown </span>
              <span className="typed-cursor">f</span>
              <span className="typed-upcoming">ox jumps over...</span>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="rule-card card">
            <div className="rule-index">4</div>
            <div className="rule-details">
              <h3>Cross the Finish Line & Score</h3>
              <p>
                The first player to commit 100% of the passage triggers the finish order. 
                Your official <strong>Net WPM</strong> is computed by the server: 
                <code>(Correct Characters / 5) / Elapsed Minutes</code>, along with keystroke accuracy percentage.
              </p>
            </div>
            <div className="rule-graphic">
              <SvgCar id="blaze" size={140} animatedNitro={true} />
            </div>
          </div>

          {/* Rule 5 */}
          <div className="rule-card card">
            <div className="rule-index">5</div>
            <div className="rule-details">
              <h3>Earn XP & Collect Garage Cosmetics</h3>
              <p>
                Every completed race awards cumulative account XP to level up your driver license, 
                plus virtual coins to unlock paints, supercars, and trail effects. 
                All vehicles feature strictly equal performance—no pay-to-win mechanics!
              </p>
            </div>
            <div className="rule-graphic reward-box">
              <span className="coin-display">🪙 +50 Coins</span>
              <span className="xp-display">⭐ +120 XP</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rules-bottom-cta text-center mt-5">
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => onNavigate('screen-10')}
          >
            <Play size={18} fill="#FFFFFF" />
            <span>Try a Test Race Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
