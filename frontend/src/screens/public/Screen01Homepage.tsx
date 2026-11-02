import React from 'react';
import { Play, Video, Users, Trophy, Sparkles, Gift, ShieldCheck, ChevronRight, Zap, Target } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { GLOBAL_LEADERBOARD } from '../../data/mockData';
import { CARS_DATA } from '../../data/carsData';
import { useAuth } from '../../context/AuthContext';

interface Screen01HomepageProps {
  onNavigate: (screenId: string) => void;
}

export const Screen01Homepage: React.FC<Screen01HomepageProps> = ({ onNavigate }) => {
  const { user, ensureGuestSession } = useAuth();

  const handlePlayNow = async () => {
    if (!user) {
      try {
        await ensureGuestSession();
      } catch (err) {
        console.warn('Guest session notice:', err);
      }
    }
    onNavigate('screen-10');
  };

  return (
    <div className="screen-page homepage-screen">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="content-wrapper hero-inner">
          <div className="hero-content">
            <div className="hero-pill-badge">
              <span className="badge-flame">🔥</span>
              <span>The Next-Gen Typing Racing Platform</span>
            </div>
            
            <h1 className="hero-title">
              Type. Race.<br />
              <span className="hero-title-highlight">Have Fun!</span>
            </h1>

            <p className="hero-description">
              A fun and exciting typing game for everyone. Race with real players, 
              unlock awesome cars, and improve your typing skills in high-octane 2D cartoon sprints.
            </p>

            <div className="hero-cta-group">
              <button 
                className="btn btn-primary btn-lg"
                onClick={handlePlayNow}
              >
                <Play size={20} fill="#FFFFFF" />
                <span>Play Now</span>
              </button>

              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigate('screen-02')}
              >
                <Video size={18} />
                <span>Watch Video</span>
              </button>
            </div>

            {/* Quick Feature Chips */}
            <div className="hero-feature-chips">
              <div className="feature-chip">
                <Users size={16} className="text-orange" />
                <span>Multiplayer Races</span>
              </div>
              <div className="feature-chip">
                <Sparkles size={16} className="text-orange" />
                <span>Custom Cars</span>
              </div>
              <div className="feature-chip">
                <Trophy size={16} className="text-orange" />
                <span>Global Leaderboard</span>
              </div>
              <div className="feature-chip">
                <Gift size={16} className="text-orange" />
                <span>Daily Rewards</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration Graphic */}
          <div className="hero-media-wrapper">
            <div className="hero-banner-card">
              <img 
                src="/assets/hero_banner.jpg" 
                alt="KeySprint 3D Cartoon Racing Red Car and Green Valley" 
                className="hero-banner-img"
              />
              <div className="hero-floating-badge top-left">
                <span className="spark-emoji">⚡</span>
                <div>
                  <strong>Live Multi-Lane</strong>
                  <span>2–6 Racers Real-Time</span>
                </div>
              </div>

              <div className="hero-floating-badge bottom-right">
                <span className="cup-emoji">🏆</span>
                <div>
                  <strong>182 WPM Peak</strong>
                  <span>Server-Validated Speed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip-section">
        <div className="content-wrapper">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap blue">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h3>100K+</h3>
                <p>Active Players</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap green">
                <Zap size={24} />
              </div>
              <div className="stat-info">
                <h3>50+</h3>
                <p>Curated Tracks</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap orange">
                <Target size={24} />
              </div>
              <div className="stat-info">
                <h3>Real-time</h3>
                <p>Multiplayer Sync</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap gold">
                <Trophy size={24} />
              </div>
              <div className="stat-info">
                <h3>Free</h3>
                <p>to Play Forever</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / 3 STEPS */}
      <section className="how-it-works-section">
        <div className="content-wrapper text-center">
          <span className="badge badge-orange">Simple & Addictive</span>
          <h2 className="section-title">How KeySprint Works</h2>
          <p className="section-subtitle">
            Master your keyboard and defeat opponents through pure speed and accuracy.
          </p>

          <div className="steps-cards-grid">
            <div className="step-card card">
              <div className="step-number">01</div>
              <div className="step-icon-box">🏎️</div>
              <h3>Choose Your Ride</h3>
              <p>Pick your favorite vehicle from your personal garage. All cars have identical physics for 100% fair play.</p>
            </div>

            <div className="step-card card">
              <div className="step-number">02</div>
              <div className="step-icon-box">⌨️</div>
              <h3>Type the Passage</h3>
              <p>Type each word accurately as the countdown ends. Correct sequential keystrokes propel your vehicle forward.</p>
            </div>

            <div className="step-card card">
              <div className="step-number">03</div>
              <div className="step-icon-box">🏆</div>
              <h3>Cross the Line & Earn</h3>
              <p>Finish first on the podium, earn XP to level up, and collect virtual coins to unlock custom cosmetic items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CARS PREVIEW */}
      <section className="featured-cars-section">
        <div className="content-wrapper">
          <div className="section-header-row">
            <div>
              <span className="badge badge-orange">Unlockable Garage</span>
              <h2 className="section-title">Featured Racing Supercars</h2>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('screen-24')}
            >
              <span>View Full Garage</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="cars-preview-grid">
            {CARS_DATA.slice(0, 4).map((car) => (
              <div key={car.id} className="car-card card card-interactive" onClick={() => onNavigate('screen-24')}>
                <div className="car-badge-tier">
                  <span className={`badge badge-${car.category.toLowerCase()}`}>{car.category}</span>
                </div>
                <div className="car-illustration-wrap">
                  <SvgCar id={car.id} size={150} />
                </div>
                <h4 className="car-name">{car.name}</h4>
                <div className="car-specs-row">
                  <span>Speed Tier: <strong>{car.topSpeedTier}</strong></span>
                  <span>Accel: <strong>{car.accelerationTier}</strong></span>
                </div>
                <button className="btn btn-outline btn-sm full-width mt-2">
                  Inspect Car
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MINI LEADERBOARD PREVIEW */}
      <section className="mini-leaderboard-section">
        <div className="content-wrapper">
          <div className="mini-board-card card card-cream">
            <div className="mini-board-header">
              <div>
                <span className="badge badge-gold">Top Racers</span>
                <h2>Global Hall of Fame</h2>
                <p>Real-time verified WPM records across competitive public races.</p>
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('screen-29')}
              >
                <span>Full Leaderboard</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="mini-board-table">
              {GLOBAL_LEADERBOARD.slice(0, 5).map((player, idx) => (
                <div key={player.rank} className="mini-row">
                  <div className="rank-col">
                    <span className={`rank-pill rank-${idx + 1}`}>#{player.rank}</span>
                  </div>
                  <div className="player-col">
                    <span className="player-avatar">{player.avatar}</span>
                    <span className="player-name">{player.name}</span>
                    <span className="country-label">{player.country}</span>
                  </div>
                  <div className="wpm-col">
                    <strong>{player.wpm}</strong> WPM
                  </div>
                  <div className="acc-col">
                    <span>{player.accuracy}% Acc</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-banner-section">
        <div className="content-wrapper">
          <div className="cta-card">
            <div className="cta-content">
              <span className="badge badge-orange">Ready, Set, Go!</span>
              <h2>Ready to Test Your Typing Speed?</h2>
              <p>Jump right into a public multiplayer race as a guest or create a free account to track your progress.</p>
              <div className="cta-buttons">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => onNavigate('screen-10')}
                >
                  <Play size={20} fill="#FFFFFF" />
                  <span>Start Racing Now</span>
                </button>
                <button 
                  className="btn btn-secondary btn-lg"
                  onClick={() => onNavigate('screen-09')}
                >
                  <span>Quick Guest Play</span>
                </button>
              </div>
            </div>
            <div className="cta-car-decor">
              <SvgCar id="blaze" size={240} animatedNitro={true} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
