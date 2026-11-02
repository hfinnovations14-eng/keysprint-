import * as React from 'react';
import { useState, useEffect } from 'react';
import { Trophy, CheckCircle, Lock, Flame, Star, Coins, Sparkles, RefreshCw } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../../data/mockData';
import { api } from '../../services/api';

interface Screen27AchievementsProps {
  onNavigate: (screenId: string) => void;
}

interface AchievementItem {
  id: string;
  code?: string;
  title: string;
  desc: string;
  icon: string;
  rewardXP: number;
  rewardCoins: number;
  category: 'All' | 'In Progress' | 'Completed' | 'Locked';
  progress?: string;
  progressPercent?: number;
  earnedAt?: string | null;
}

export const Screen27Achievements: React.FC<Screen27AchievementsProps> = ({ 
  onNavigate 
}: Screen27AchievementsProps) => {
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Completed' | 'Locked'>('All');
  const [achievements, setAchievements] = useState<AchievementItem[]>(ACHIEVEMENTS_DATA as any[]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const data = await api.getAchievements();
      if (data && data.achievements && data.achievements.length > 0) {
        setAchievements(data.achievements);
      }
    } catch {
      // Fallback to local mock data if offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const filteredAchievements = filter === 'All'
    ? achievements
    : achievements.filter(a => a.category === filter);

  const completedCount = achievements.filter(a => a.category === 'Completed').length;
  const inProgressCount = achievements.filter(a => a.category === 'In Progress').length;
  const lockedCount = achievements.filter(a => a.category === 'Locked').length;

  return (
    <div className="screen-page achievements-screen">
      <div className="content-wrapper">
        
        {/* HEADER & FILTER TABS (Matching Reference Image 11) */}
        <div className="achievements-header-row mb-4">
          <div>
            <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
              <span className="badge badge-orange">Driver Milestones</span>
              <span className="badge badge-green flex-center gap-1">
                <CheckCircle size={12} />
                <span>{completedCount} / {achievements.length} Unlocked</span>
              </span>
            </div>
            <h1 className="page-title">Achievements</h1>
            <p className="page-subtitle">Complete skill challenges to earn driver badges, bonus XP, and coin wallets.</p>
          </div>

          <div className="flex-center gap-3">
            <button 
              type="button" 
              className="btn btn-outline btn-sm flex-center gap-1"
              onClick={fetchAchievements}
              title="Refresh Achievements"
            >
              <RefreshCw size={14} className={loading ? 'spinner-icon' : ''} />
              <span>Refresh</span>
            </button>

            <div className="tab-list">
              <button
                type="button"
                className={`tab-btn ${filter === 'All' ? 'active' : ''}`}
                onClick={() => setFilter('All')}
              >
                All ({achievements.length})
              </button>
              <button
                type="button"
                className={`tab-btn ${filter === 'Completed' ? 'active' : ''}`}
                onClick={() => setFilter('Completed')}
              >
                Completed ({completedCount})
              </button>
              <button
                type="button"
                className={`tab-btn ${filter === 'In Progress' ? 'active' : ''}`}
                onClick={() => setFilter('In Progress')}
              >
                In Progress ({inProgressCount})
              </button>
              <button
                type="button"
                className={`tab-btn ${filter === 'Locked' ? 'active' : ''}`}
                onClick={() => setFilter('Locked')}
              >
                Locked ({lockedCount})
              </button>
            </div>
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
                      <Flame size={12} /> {item.progress || 'In Progress'}
                    </span>
                  )}
                  {item.category === 'Locked' && (
                    <span className="badge badge-secondary flex-center gap-1">
                      <Lock size={12} /> {item.progress || 'Locked'}
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
                      <div 
                        className="achieve-fill" 
                        style={{ width: `${Math.max(5, item.progressPercent || 35)}%` }} 
                      />
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
