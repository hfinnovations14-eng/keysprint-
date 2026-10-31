import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Flag, 
  Warehouse, 
  Trophy, 
  Users, 
  BarChart3, 
  Settings, 
  Zap, 
  Target, 
  Flame, 
  ChevronRight,
  Play
} from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { RECENT_RACES } from '../../data/mockData';

interface Screen19DashboardProps {
  onNavigate: (screenId: string) => void;
  username?: string;
  level?: number;
}

export const Screen19Dashboard: React.FC<Screen19DashboardProps> = ({ 
  onNavigate,
  username: propUsername,
  level: propLevel
}) => {
  const { user } = useAuth();
  const [raceHistory, setRaceHistory] = useState<any[]>([]);

  // Fetch real race history if logged in
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getRaceHistory();
        if (res.races && res.races.length > 0) {
          setRaceHistory(res.races);
        }
      } catch {
        // Fallback to static mock races if user hasn't raced yet
      }
    };
    fetchHistory();
  }, []);

  const displayName = user?.profile?.nickname || propUsername || 'Alex';
  const displayLevel = user?.stats?.level || propLevel || 12;
  const displayXp = user?.stats?.xp || 720;
  const nextLevelXp = displayLevel * 1000;
  const xpPercent = Math.min(100, Math.round((displayXp % 1000) / 10));
  const bestSpeed = user?.stats?.verifiedBestWpm || 132;
  const accuracy = user?.stats?.accuracy || 98;
  const totalRaces = user?.stats?.racesCount || 256;
  const wins = user?.stats?.winsCount || 12;

  // Active equipped car
  const equippedCarItem = user?.inventory?.find(i => i.isEquipped);
  const equippedCarId = (equippedCarItem?.itemId as any) || 'blaze';

  return (
    <div className="screen-page dashboard-screen">
      <div className="content-wrapper">
        <div className="dashboard-layout-container">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="dashboard-sidebar card">
            <nav className="dash-nav-list">
              <button className="dash-nav-item active" onClick={() => onNavigate('screen-19')}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button className="dash-nav-item" onClick={() => onNavigate('screen-23')}>
                <Flag size={18} />
                <span>My Races</span>
              </button>
              <button className="dash-nav-item" onClick={() => onNavigate('screen-24')}>
                <Warehouse size={18} />
                <span>Garage</span>
              </button>
              <button className="dash-nav-item" onClick={() => onNavigate('screen-27')}>
                <Trophy size={18} />
                <span>Achievements</span>
              </button>
              <button className="dash-nav-item" onClick={() => onNavigate('screen-30')}>
                <Users size={18} />
                <span>Friends</span>
              </button>
              <button className="dash-nav-item" onClick={() => onNavigate('screen-22')}>
                <BarChart3 size={18} />
                <span>Statistics</span>
              </button>
              <button className="dash-nav-item" onClick={() => onNavigate('screen-35')}>
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </nav>

            <div className="sidebar-quick-play mt-4">
              <button 
                className="btn btn-primary full-width"
                onClick={() => onNavigate('screen-10')}
              >
                <Play size={16} fill="#FFFFFF" />
                <span>Quick Play</span>
              </button>
            </div>
          </aside>

          {/* MAIN DASHBOARD CONTENT */}
          <main className="dashboard-main-area">
            {/* WELCOME BANNER CARD */}
            <div className="dash-welcome-card card card-cream">
              <div className="welcome-avatar-wrap">
                <span className="welcome-avatar">{user?.profile?.avatarId || '🏎️'}</span>
              </div>
              <div className="welcome-details">
                <h2>Welcome Back, {displayName}!</h2>
                <div className="dash-level-line">
                  <span className="level-text">Level {displayLevel}</span>
                  <div className="dash-xp-track">
                    <div className="dash-xp-fill" style={{ width: `${xpPercent}%` }} />
                  </div>
                  <span className="xp-fraction-text">{displayXp} / {nextLevelXp} XP</span>
                </div>
              </div>

              <div className="dash-equipped-car ml-auto">
                <SvgCar id={equippedCarId} size={110} />
              </div>
            </div>

            {/* QUICK STATS ROW */}
            <div className="dash-stats-row mt-4">
              <div className="dash-stat-box card">
                <div className="dash-stat-icon blue"><Zap size={20} /></div>
                <div>
                  <div className="dash-stat-number">{bestSpeed} WPM</div>
                  <div className="dash-stat-label">Best Speed</div>
                </div>
              </div>

              <div className="dash-stat-box card">
                <div className="dash-stat-icon green"><Target size={20} /></div>
                <div>
                  <div className="dash-stat-number">{accuracy}%</div>
                  <div className="dash-stat-label">Accuracy</div>
                </div>
              </div>

              <div className="dash-stat-box card">
                <div className="dash-stat-icon gold"><Flag size={20} /></div>
                <div>
                  <div className="dash-stat-number">{totalRaces}</div>
                  <div className="dash-stat-label">Races Played</div>
                </div>
              </div>

              <div className="dash-stat-box card">
                <div className="dash-stat-icon orange"><Flame size={20} /></div>
                <div>
                  <div className="dash-stat-number">{wins}</div>
                  <div className="dash-stat-label">Victories</div>
                </div>
              </div>
            </div>

            {/* RECENT RACES TABLE */}
            <div className="dash-races-card card mt-4">
              <div className="section-header-row mb-3">
                <h3>Recent Races</h3>
                <button 
                  className="link-bold flex-center gap-1"
                  onClick={() => onNavigate('screen-23')}
                >
                  <span>View All</span>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="races-table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Track Arena</th>
                      <th>Rank</th>
                      <th>Speed</th>
                      <th>Accuracy</th>
                      <th>Rewards</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(raceHistory.length > 0 ? raceHistory.slice(0, 5) : RECENT_RACES).map((race, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="flex-center gap-2 justify-start">
                            <span>🏁</span>
                            <span>{race.track || 'Night Highway Grand Prix'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${race.place === 1 ? 'badge-gold' : 'badge-cream'}`}>
                            #{race.place || race.rank || 1}
                          </span>
                        </td>
                        <td><strong>{race.wpm} WPM</strong></td>
                        <td>{race.accuracy}%</td>
                        <td>
                          <span className="badge badge-orange">
                            +{race.coinsEarned || race.coins || 100} Coins
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
