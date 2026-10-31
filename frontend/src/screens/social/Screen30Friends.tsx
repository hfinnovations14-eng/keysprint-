import React, { useState } from 'react';
import { Users, Search, UserPlus, Swords, Send, Check, X, Shield } from 'lucide-react';
import { FRIENDS_DATA } from '../../data/mockData';

interface Screen30FriendsProps {
  onNavigate: (screenId: string) => void;
}

export const Screen30Friends: React.FC<Screen30FriendsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Friends' | 'Requests' | 'Find'>('Friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsList, setFriendsList] = useState(FRIENDS_DATA);

  return (
    <div className="screen-page friends-screen">
      <div className="content-wrapper">
        <div className="friends-master-card card">
          
          {/* HEADER & TABS (Matching Reference Image 12) */}
          <div className="section-header-row mb-4">
            <div>
              <span className="badge badge-orange">Driver Community</span>
              <h1 className="page-title">Friends & Social</h1>
              <p className="page-subtitle">Connect with fellow typists, challenge them to duels, and race together.</p>
            </div>

            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('Find')}
            >
              <UserPlus size={16} />
              <span>Add Friend</span>
            </button>
          </div>

          {/* Search bar & Tabs (Matching Reference Image 12) */}
          <div className="friends-controls-bar mb-4">
            <div className="input-icon-wrap flex-1">
              <Search size={18} className="input-field-icon" />
              <input 
                type="text" 
                placeholder="Search Friends..."
                className="input-field with-icon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="tab-list">
              <button 
                className={`tab-btn ${activeTab === 'Friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('Friends')}
              >
                Friends ({friendsList.length})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'Requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('Requests')}
              >
                Requests (3)
              </button>
              <button 
                className={`tab-btn ${activeTab === 'Find' ? 'active' : ''}`}
                onClick={() => setActiveTab('Find')}
              >
                Find Players
              </button>
            </div>
          </div>

          {/* FRIENDS LIST (Matching Reference Image 12) */}
          {activeTab === 'Friends' && (
            <div className="friends-list-stack">
              {friendsList.map((f) => (
                <div key={f.id} className="friend-row-card card card-cream">
                  <div className="friend-left-cell">
                    <span className="friend-avatar">{f.avatar}</span>
                    <div className="friend-identity">
                      <div className="friend-name-line">
                        <strong>{f.name}</strong>
                        <span className={`status-dot-pill ${f.status === 'In Game' ? 'in-game' : f.status === 'Online' ? 'online' : 'offline'}`}>
                          {f.status}
                        </span>
                      </div>
                      <span className="friend-meta-sub text-xs text-secondary">
                        {f.car} • {f.wpm} WPM Avg
                      </span>
                    </div>
                  </div>

                  <div className="friend-action-cell">
                    {f.canChallenge ? (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => onNavigate('screen-17')}
                      >
                        <Swords size={15} />
                        <span>Challenge</span>
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onNavigate('screen-17')}
                      >
                        <Send size={14} />
                        <span>Invite to Room</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'Requests' && (
            <div className="friend-requests-list">
              <div className="friend-row-card card card-cream">
                <div className="friend-left-cell">
                  <span className="friend-avatar">🏎️</span>
                  <div>
                    <strong>RacerX_99</strong>
                    <span className="text-xs text-secondary block">160 WPM • Wants to be friends</span>
                  </div>
                </div>
                <div className="friend-action-cell gap-2">
                  <button className="btn btn-primary btn-sm"><Check size={14} /> Accept</button>
                  <button className="btn btn-secondary btn-sm"><X size={14} /> Reject</button>
                </div>
              </div>
            </div>
          )}

          {/* FIND PLAYERS */}
          {activeTab === 'Find' && (
            <div className="find-players-box card-cream text-center py-4">
              <Users size={36} className="text-orange mb-2" />
              <h3>Discover Racers Nearby</h3>
              <p className="text-secondary text-sm">Enter a player nickname or search by country code.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
