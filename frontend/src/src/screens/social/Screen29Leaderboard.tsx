import React, { useState } from 'react';
import { Trophy, Globe, Users, Flag, Search, ChevronRight, Award } from 'lucide-react';
import { GLOBAL_LEADERBOARD, LeaderboardUser } from '../../data/mockData';

interface Screen29LeaderboardProps {
  onNavigate: (screenId: string) => void;
}

export const Screen29Leaderboard: React.FC<Screen29LeaderboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Global' | 'Friends' | 'Country'>('Global');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = GLOBAL_LEADERBOARD.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="screen-page leaderboard-screen">
      <div className="content-wrapper">
        
        {/* HEADER & TABS (Matching Reference Image 04) */}
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
            <div className="podium-avatar">⚡</div>
            <h3>TypeMaster</h3>
            <span className="podium-country">🇩🇪 Germany</span>
            <div className="podium-stat-pill">
              <strong>175</strong> WPM • 98% Acc
            </div>
            <span className="podium-races-sub">980 Races</span>
          </div>

          {/* 1st Place Gold */}
          <div className="podium-card card card-cream place-1">
            <div className="podium-crown gold-crown">👑 🥇</div>
            <div className="podium-avatar">🏎️</div>
            <h3>AlexPro</h3>
            <span className="podium-country">🇺🇸 United States</span>
            <div className="podium-stat-pill gold">
              <strong>182</strong> WPM • 99% Acc
            </div>
            <span className="podium-races-sub">1,240 Races</span>
          </div>

          {/* 3rd Place Bronze */}
          <div className="podium-card card card-cream place-3">
            <div className="podium-crown">🥉</div>
            <div className="podium-avatar">🌸</div>
            <h3>SpeedyGirl</h3>
            <span className="podium-country">🇨🇦 Canada</span>
            <div className="podium-stat-pill">
              <strong>170</strong> WPM • 98% Acc
            </div>
            <span className="podium-races-sub">860 Races</span>
          </div>
        </div>

        {/* SEARCH & LEADERBOARD TABLE (Matching Reference Image 04) */}
        <div className="leaderboard-table-card card">
          <div className="table-search-bar mb-3">
            <div className="input-icon-wrap flex-1">
              <Search size={18} className="input-field-icon" />
              <input 
                type="text" 
                placeholder="Search driver by nickname or country..."
                className="input-field with-icon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="races-table-wrapper">
            <table className="custom-table leaderboard-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Rank</th>
                  <th>Player</th>
                  <th>Speed (WPM)</th>
                  <th>Accuracy</th>
                  <th>Races</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((player) => (
                  <tr 
                    key={player.rank}
                    className={player.isCurrentUser ? 'current-user-row' : ''}
                    onClick={() => onNavigate('screen-20')}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span className={`board-rank-pill rank-${player.rank <= 3 ? player.rank : 'norm'}`}>
                        #{player.rank}
                      </span>
                    </td>
                    <td>
                      <div className="board-player-cell">
                        <span className="b-avatar">{player.avatar}</span>
                        <div>
                          <strong className="b-name">{player.name}</strong>
                          {player.isCurrentUser && <span className="you-pill">YOU</span>}
                          <div className="b-country text-xs text-secondary">{player.country}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="b-wpm font-bold">{player.wpm}</span> WPM
                    </td>
                    <td>{player.accuracy}%</td>
                    <td className="text-secondary">{player.races.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PINNED PERSONAL POSITION (SRS FR-L04) */}
          <div className="pinned-personal-rank card-cream mt-3">
            <div className="pinned-left">
              <span className="badge badge-orange">Your Verified Standing</span>
              <span>You are ranked <strong>#1 Globally</strong> with <strong>182 WPM</strong> peak.</span>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('screen-22')}
            >
              Telemetry Stats
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
