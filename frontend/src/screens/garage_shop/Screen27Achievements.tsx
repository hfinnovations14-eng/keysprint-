import React, { useState } from 'react';
import { Trophy, CheckCircle, Lock, Flame, Star, Coins } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../../data/mockData';

interface Screen27AchievementsProps {
  onNavigate: (screenId: string) => void;
}

export const Screen27Achievements: React.FC<Screen27AchievementsProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Locked'>('All');

  const filteredAchievements = filter === 'All'
    ? ACHIEVEMENTS_DATA
    : ACHIEVEMENTS_DATA.filter(a => a.category === filter);

  return (
    <div className="screen-page achievements-screen">
      <div className="content-wrapper">
        
        {/* HEADER & FILTER TABS (Matching Reference Image 11) */}
        <div className="achievements-header-row mb-4">
          <div>
            <span className="badge badge-orange">Driver Milestones</span>
            <h1 className="page-title">Achievements</h1>
            <p className="page-subtitle">Complete skill challenges to earn driver badges, bonus XP, and coin wallets.</p>
          </div>

          <div className="tab-list">
            {(['All', 'In Progress', 'Completed', 'Locked'] as const).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ACHIEVEMENTS CARDS GRID (Matching Reference Image 11) */}
        <div className="achievements-grid">
          {filteredAchievements.map((item) => (
            <div key={item.id} className="achievement-card card card-cream">
              <div className="achieve-card-header">
                <div className="achieve-icon-wrap">
                  <span className="achieve-big-icon">{item.icon}</span>
                </div>
                
                <div className="achieve-status-badge">
                  {item.category === 'Completed' && (
                    <span className="badge badge-green flex-center gap-1">
                      <CheckCircle size={12} /> Completed
                    </span>
                  )}
                  {item.category === 'In Progress' && (
                    <span className="badge badge-orange flex-center gap-1">
                      <Flame size={12} /> Progress {item.progress}
                    </span>
                  )}
                  {item.category === 'Locked' && (
                    <span className="badge badge-secondary flex-center gap-1">
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </div>
              </div>

              <div className="achieve-card-body mt-3">
                <h3 className="achieve-title">{item.title}</h3>
                <p className="achieve-desc text-secondary text-sm">{item.desc}</p>
                
                {item.category === 'In Progress' && (
                  <div className="achieve-progress-bar-wrap mt-3">
                    <div className="achieve-track">
                      <div className="achieve-fill" style={{ width: '60%' }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="achieve-card-footer mt-4">
                <div className="reward-tags-row">
                  <span className="reward-tag-item">⭐ +{item.rewardXP} XP</span>
                  <span className="reward-tag-item">🪙 +{item.rewardCoins} Coins</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
