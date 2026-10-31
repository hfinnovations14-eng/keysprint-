import React, { useState } from 'react';
import { CheckCircle2, Edit3, Trophy, Zap, Target, Flag, Flame, Globe } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { CARS_DATA } from '../../data/carsData';
import { ACHIEVEMENTS_DATA } from '../../data/mockData';

interface Screen20ProfileProps {
  onNavigate: (screenId: string) => void;
}

export const Screen20Profile: React.FC<Screen20ProfileProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Stats' | 'Cars' | 'Achievements'>('Overview');

  return (
    <div className="screen-page profile-screen">
      <div className="content-wrapper">
        
        {/* PLAYER PROFILE BANNER (Matching Reference Image 14) */}
        <div className="profile-banner-card card">
          <div className="profile-banner-inner">
            <div className="profile-avatar-large">
              <span>🏎️</span>
            </div>
            
            <div className="profile-meta-info">
              <div className="profile-name-row">
                <h2>AlexPro</h2>
                <CheckCircle2 size={20} className="text-blue verified-badge" />
                <span className="country-badge">🇺🇸 United States</span>
              </div>
              
              <div className="profile-level-row">
                <span className="profile-level-pill">Level 12</span>
                <div className="profile-xp-track">
                  <div className="profile-xp-fill" style={{ width: '48%' }} />
                </div>
                <span className="profile-xp-text">720 / 1,500 XP</span>
              </div>
            </div>

            <div className="profile-banner-action">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('screen-21')}
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* PROFILE SUB-TABS */}
        <div className="profile-tabs-strip mt-4">
          <div className="tab-list">
            {(['Overview', 'Stats', 'Cars', 'Achievements'] as const).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* OVERVIEW CONTENT (Matching Reference Image 14) */}
        {activeTab === 'Overview' && (
          <div className="profile-overview-content mt-4">
            {/* 6 Key Stats Grid */}
            <div className="profile-stats-grid">
              <div className="prof-stat-box card">
                <div className="stat-label">Best Speed</div>
                <div className="stat-val text-orange">142 WPM</div>
                <div className="stat-sub">Verified in Green Valley</div>
              </div>

              <div className="prof-stat-box card">
                <div className="stat-label">Accuracy</div>
                <div className="stat-val text-green">98%</div>
                <div className="stat-sub">All-time average</div>
              </div>

              <div className="prof-stat-box card">
                <div className="stat-label">Races Played</div>
                <div className="stat-val">256</div>
                <div className="stat-sub">Public & private rooms</div>
              </div>

              <div className="prof-stat-box card">
                <div className="stat-label">Podium Wins</div>
                <div className="stat-val text-gold">24</div>
                <div className="stat-sub">1st place finishes</div>
              </div>

              <div className="prof-stat-box card">
                <div className="stat-label">Win Streak</div>
                <div className="stat-val text-purple">12</div>
                <div className="stat-sub">Consecutive victories</div>
              </div>

              <div className="prof-stat-box card">
                <div className="stat-label">Global Rank</div>
                <div className="stat-val text-blue">Top 10%</div>
                <div className="stat-sub">Rank #1 in US league</div>
              </div>
            </div>

            {/* Showcase Cars */}
            <div className="profile-showcase-section card card-cream mt-4">
              <div className="section-header-row mb-3">
                <h3>Favorite Vehicle</h3>
                <span className="badge badge-orange">Equipped</span>
              </div>
              <div className="showcase-car-body">
                <SvgCar id="blaze" size={200} animatedNitro={true} />
                <div className="showcase-car-text">
                  <h4>Blaze Runner (Rare)</h4>
                  <p className="text-secondary text-sm">
                    Tuned for high-precision typing cadence. 142 WPM verified record set with this vehicle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'Stats' && (
          <div className="mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('screen-22')}
            >
              Open Full Statistics & Analytics (Screen 22)
            </button>
          </div>
        )}

        {/* CARS TAB */}
        {activeTab === 'Cars' && (
          <div className="profile-cars-grid mt-4">
            {CARS_DATA.map(c => (
              <div key={c.id} className="car-card card">
                <SvgCar id={c.id} size={130} />
                <h4 className="mt-2">{c.name}</h4>
                <span className={`badge badge-${c.category.toLowerCase()}`}>{c.category}</span>
              </div>
            ))}
          </div>
        )}

        {/* ACHIEVEMENTS TAB */}
        {activeTab === 'Achievements' && (
          <div className="profile-achieve-grid mt-4">
            {ACHIEVEMENTS_DATA.map(a => (
              <div key={a.id} className="achieve-card card card-cream">
                <span className="achieve-icon">{a.icon}</span>
                <h4>{a.title}</h4>
                <p className="text-xs text-secondary">{a.desc}</p>
                <span className="badge badge-gold mt-2">{a.progress}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
