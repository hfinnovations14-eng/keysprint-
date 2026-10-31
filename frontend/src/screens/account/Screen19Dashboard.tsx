import React from 'react';
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
  Plus, 
  ChevronRight,
  Play
} from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { RECENT_RACES } from '../../data/mockData';

interface Screen19DashboardProps {
  onNavigate: (screenId: string) => void;
  username?: string;
  level?: number;
}

export const Screen19Dashboard: React.FC<Screen19DashboardProps> = ({ 
  onNavigate,
  username = 'Alex',
  level = 12
}) => {
  return (
    <div className="screen-page dashboard-screen">
      <div className="content-wrapper">
        <div className="dashboard-layout-container">
          
          {/* SIDEBAR NAVIGATION (Matching Reference Image 06) */}
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

          {/* MAIN DASHBOARD CONTENT (Matching Reference Image 06) */}
          <main className="dashboard-main-area">
            {/* WELCOME BANNER CARD */}
            <div className="dash-welcome-card card card-cream">
              <div className="welcome-avatar-wrap">
                <span className="welcome-avatar">🏎️</span>
              </div>
              <div className="welcome-details">
                <h2>Welcome Back, {username}!</h2>
                <div className="dash-level-line">
                  <span className="level-text">Level {level}</span>
                  <div className="dash-xp-track">
                    <div className="dash-xp-fill" style={{ width: '48%' }} />
                  </div>
                  <span className="xp-fraction-text">720 / 1,500 XP</span>
                </div>
              </div>
            </div>

            {/* QUICK STATS ROW (Matching Reference Image 06) */}
            <div className="dash-stats-row mt-4">
              <div className="dash-stat-box card">
                <div className="dash-stat-icon blue"><Zap size={20} /></div>
                <div>
                  <div className="dash-stat-number">132 WPM</div>
                  <div className="dash-stat-label">Best Speed</div>
                </div>
              </div>

              <div className="dash-stat-box card">
                <div className="dash-stat-icon green"><Target size={20} /></div>
                <div>
                  <div className="dash-stat-number">98%</div>
                  <div className="dash-stat-label">Accuracy</div>
                </div>
              </div>

              <div className="dash-stat-box card">
                <div className="dash-stat-icon gold"><Flag size={20} /></div>
                <div>
                  <div className="dash-stat-number">256</div>
                  <div className="dash-stat-label">Races Played</div>
                </div>
              </div>

              <div className="dash-stat-box card">
                <div className="dash-stat-icon orange"><Flame size={20} /></div>
                <div>
                  <div className="dash-stat-number">12</div>
                  <div className="dash-stat-label">Win Streak</div>
                </div>
              </div>
            </div>

            {/* RECENT RACES TABLE (Matching Reference Image 06) */}
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
                    {RECENT_RACES.map((race, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{race.track}</strong>
                        </td>
                        <td>
                          <span className={`rank-tag ${race.rank === '1st' ? 'rank-1' : race.rank === '2nd' ? 'rank-2' : 'rank-3'}`}>
                            {race.rank}
                          </span>
                        </td>
                        <td><strong>{race.wpm}</strong> WPM</td>
                        <td>{race.accuracy}%</td>
                        <td>
                          <div className="table-rewards">
                            <span className="badge badge-gold">+{race.xp} XP</span>
                            <span className="badge badge-orange">+{race.coins} 🪙</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CURRENT EQUIPPED VEHICLE SPOTLIGHT */}
            <div className="dash-car-spotlight card card-cream mt-4">
              <div className="spotlight-content">
                <span className="badge badge-orange">Currently Equipped</span>
                <h3>Blaze Runner (Rare)</h3>
                <p className="text-secondary text-sm">Equipped for public racing matchmaking.</p>
                <button 
                  className="btn btn-secondary btn-sm mt-3"
                  onClick={() => onNavigate('screen-24')}
                >
                  Change Vehicle in Garage
                </button>
              </div>
              <div className="spotlight-car-graphic">
                <SvgCar id="blaze" size={170} animatedNitro={true} />
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};
