import React, { useState, useEffect } from 'react';
import { Trophy, Globe, Users, Flag, Search, ChevronRight, Award, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { GLOBAL_LEADERBOARD, LeaderboardUser } from '../../data/mockData';

interface Screen29LeaderboardProps {
  onNavigate: (screenId: string) => void;
}

export const Screen29Leaderboard: React.FC<Screen29LeaderboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Global' | 'Friends' | 'Country'>('Global');
  const [searchTerm, setSearchTerm] = useState('');
  const [dbLeaderboard, setDbLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const countryParam = activeTab === 'Country' ? 'US' : undefined;
        const res = await api.getLeaderboard(countryParam);
        if (res.leaderboard && res.leaderboard.length > 0) {
          setDbLeaderboard(res.leaderboard);
        }
      } catch (e) {
        console.error('Failed to fetch leaderboard:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  // Combine DB data or fallback to mock
  const sourceList = dbLeaderboard.length >= 3 ? dbLeaderboard.map((item: any) => ({
    rank: item.rank,
    name: item.nickname,
    avatar: item.avatar || '🏎️',
    wpm: item.wpm,
    accuracy: item.accuracy,
    races: item.races,
    country: item.country === 'PK' ? '🇵🇰 Pakistan' : item.country === 'GB' ? '🇬🇧 United Kingdom' : '🇺🇸 United States',
    isYou: false
  })) : GLOBAL_LEADERBOARD;

  const filteredUsers = sourceList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top1 = filteredUsers[0] || GLOBAL_LEADERBOARD[0];
  const top2 = filteredUsers[1] || GLOBAL_LEADERBOARD[1];
  const top3 = filteredUsers[2] || GLOBAL_LEADERBOARD[2];

  return (
    <div className="screen-page leaderboard-screen">
      <div className="content-wrapper">
        
        {/* HEADER & TABS */}
        <div className="leaderboard-header-row mb-4">
          <div>
            <span className="badge badge-gold">Hall of Speed</span>
            <h1 className="page-title">Global Leaderboard</h1>
            <p className="page-subtitle">Verified peak WPM records across competitive multiplayer sprints.</p>
          </div>

          <div className="tab-list">
            {(['Global', 'Friends', 'Country'] as const).map((tab) => (
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

        {/* PODIUM TOP 3 HIGHLIGHT CARDS */}
        <div className="podium-cards-grid mb-5">
          {/* 2nd Place Silver */}
          <div className="podium-card card card-cream place-2">
            <div className="podium-crown">🥈</div>
            <div className="podium-avatar">{top2.avatar}</div>
            <h3>{top2.name}</h3>
            <span className="podium-country">{top2.country}</span>
            <div className="podium-stat-pill">
              <strong>{top2.wpm}</strong> WPM • {top2.accuracy}% Acc
            </div>
            <span className="podium-races-sub">{top2.races} Races</span>
          </div>

          {/* 1st Place Gold */}
          <div className="podium-card card card-cream place-1">
            <div className="podium-crown gold-crown">👑 🥇</div>
            <div className="podium-avatar">{top1.avatar}</div>
            <h3>{top1.name}</h3>
            <span className="podium-country">{top1.country}</span>
            <div className="podium-stat-pill gold-pill">
              <strong>{top1.wpm}</strong> WPM • {top1.accuracy}% Acc
            </div>
            <span className="podium-races-sub">{top1.races} Races • Grand Prix Champion</span>
          </div>

          {/* 3rd Place Bronze */}
          <div className="podium-card card card-cream place-3">
            <div className="podium-crown">🥉</div>
            <div className="podium-avatar">{top3.avatar}</div>
            <h3>{top3.name}</h3>
            <span className="podium-country">{top3.country}</span>
            <div className="podium-stat-pill">
              <strong>{top3.wpm}</strong> WPM • {top3.accuracy}% Acc
            </div>
            <span className="podium-races-sub">{top3.races} Races</span>
          </div>
        </div>

        {/* SEARCH & LEADERBOARD TABLE */}
        <div className="card">
          <div className="table-search-row mb-3">
            <div className="input-icon-wrap search-box">
              <Search size={18} className="input-field-icon" />
              <input 
                type="text" 
                placeholder="Search racers by name or nation..." 
                className="input-field with-icon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading && (
              <span className="flex-center gap-2 text-sm text-secondary">
                <Loader2 size={16} className="animate-spin" /> Syncing live database...
              </span>
            )}
          </div>

          <div className="races-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Driver</th>
                  <th>Country</th>
                  <th>Peak Speed</th>
                  <th>Accuracy</th>
                  <th>Total Races</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((racer, idx) => {
                  const isCurrentUser = (racer as any).isYou;
                  return (
                    <tr key={idx} className={isCurrentUser ? 'current-user-row' : ''}>
                      <td>
                        <span className={`rank-badge rank-${racer.rank <= 3 ? racer.rank : 'other'}`}>
                          #{racer.rank}
                        </span>
                      </td>
                      <td>
                        <div className="flex-center gap-2 justify-start">
                          <span className="driver-avatar-mini">{racer.avatar}</span>
                          <strong>{racer.name}</strong>
                          {isCurrentUser && <span className="badge badge-orange text-xs">YOU</span>}
                        </div>
                      </td>
                      <td>{racer.country}</td>
                      <td><strong>{racer.wpm} WPM</strong></td>
                      <td>{racer.accuracy}%</td>
                      <td>{racer.races}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
