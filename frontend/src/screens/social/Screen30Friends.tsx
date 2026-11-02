import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Swords, Send, Check, X, Shield, RefreshCw, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useRace } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';
import { FRIENDS_DATA } from '../../data/mockData';

interface Screen30FriendsProps {
  onNavigate: (screenId: string) => void;
}

interface FriendItem {
  friendshipId: string;
  id: string;
  name: string;
  avatar: string;
  country: string;
  wpm: number;
  bestWpm: number;
  races: number;
  level: number;
  car: string;
  status: 'Online' | 'Offline' | 'In Game';
  canChallenge: boolean;
}

interface SearchUserItem {
  id: string;
  name: string;
  avatar: string;
  country: string;
  bestWpm: number;
  races: number;
  level: number;
  car: string;
  isOnline: boolean;
  relationship: 'friend' | 'pending_sent' | 'pending_received' | 'none';
  friendshipId?: string;
}

export const Screen30Friends: React.FC<Screen30FriendsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { createPrivateRoom } = useRace();

  const [activeTab, setActiveTab] = useState<'Friends' | 'Requests' | 'Find'>('Friends');
  const [searchTerm, setSearchTerm] = useState('');
  const [friendsList, setFriendsList] = useState<FriendItem[]>(FRIENDS_DATA as any[]);
  const [incomingRequests, setIncomingRequests] = useState<FriendItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchUserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searching, setSearching] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const data = await api.getFriends();
      if (data) {
        if (data.friends) setFriendsList(data.friends);
        if (data.incomingRequests) setIncomingRequests(data.incomingRequests);
      }
    } catch {
      // offline fallback to mock
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Search users with debounce
  useEffect(() => {
    if (activeTab !== 'Find' || !searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await api.searchUsers(searchTerm.trim());
        if (data && data.users) {
          setSearchResults(data.users);
        }
      } catch {
        // search error fallback
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [searchTerm, activeTab]);

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleSendRequest = async (targetUserId: string, name: string) => {
    try {
      await api.sendFriendRequest({ targetUserId });
      showNotification(`Friend request sent to ${name}!`);
      // Update local search results
      setSearchResults(prev => prev.map(u => u.id === targetUserId ? { ...u, relationship: 'pending_sent' } : u));
    } catch (err: any) {
      showNotification(err.message || 'Failed to send request');
    }
  };

  const handleAcceptRequest = async (friendshipId: string, name: string) => {
    try {
      await api.acceptFriendRequest(friendshipId);
      showNotification(`Accepted friend request from ${name}!`);
      fetchFriends();
    } catch (err: any) {
      showNotification(err.message || 'Failed to accept request');
    }
  };

  const handleRemoveFriend = async (friendshipId: string, name: string) => {
    try {
      await api.removeFriend(friendshipId);
      showNotification(`Removed ${name} from friends`);
      fetchFriends();
    } catch (err: any) {
      showNotification(err.message || 'Failed to remove');
    }
  };

  const handleChallenge = (friend: FriendItem) => {
    const roomCode = `SPRINT-${Math.floor(10 + Math.random() * 90)}`;
    api.challengeFriend({ friendUserId: friend.id, roomCode }).catch(() => {});

    createPrivateRoom({
      roomName: `${user?.profile?.nickname || 'Driver'} vs ${friend.name}`,
      roomCode,
      maxPlayers: 2,
      trackId: 'green-valley',
      fillWithBots: false
    });

    onNavigate('screen-18');
  };

  const filteredFriends = friendsList.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="screen-page friends-screen">
      <div className="content-wrapper">
        <div className="friends-master-card card">
          
          {/* HEADER & TABS (Matching Reference Image 12) */}
          <div className="section-header-row mb-4">
            <div>
              <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
                <span className="badge badge-orange">Driver Community</span>
                <span className="badge badge-green flex-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>{friendsList.length} Rivals Connected</span>
                </span>
              </div>
              <h1 className="page-title">Friends & Social</h1>
              <p className="page-subtitle">Connect with fellow typists, challenge them to duels, and race together.</p>
            </div>

            <div className="flex-center gap-2">
              <button 
                type="button" 
                className="btn btn-outline btn-sm flex-center gap-1"
                onClick={fetchFriends}
              >
                <RefreshCw size={14} className={loading ? 'spinner-icon' : ''} />
                <span>Refresh</span>
              </button>

              <button 
                className="btn btn-primary btn-sm flex-center gap-1"
                onClick={() => { setActiveTab('Find'); setSearchTerm(''); }}
              >
                <UserPlus size={16} />
                <span>Find Racers</span>
              </button>
            </div>
          </div>

          {/* Feedback banner */}
          {actionMessage && (
            <div className="alert alert-success mb-3 flex-center gap-2">
              <Check size={16} />
              <span>{actionMessage}</span>
            </div>
          )}

          {/* Search bar & Tabs */}
          <div className="friends-controls-bar mb-4">
            <div className="input-icon-wrap flex-1">
              <Search size={18} className="input-field-icon" />
              <input 
                type="text" 
                placeholder={activeTab === 'Find' ? 'Search by driver nickname (e.g. Emma, Liam)...' : 'Filter your friends list...'}
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
                Requests ({incomingRequests.length})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'Find' ? 'active' : ''}`}
                onClick={() => setActiveTab('Find')}
              >
                Find Players
              </button>
            </div>
          </div>

          {/* TAB 1: FRIENDS LIST */}
          {activeTab === 'Friends' && (
            <div className="friends-list-stack">
              {filteredFriends.length === 0 ? (
                <div className="card-cream p-5 text-center">
                  <p className="text-secondary">No rivals found in your friend list.</p>
                  <button 
                    className="btn btn-primary btn-sm mt-3"
                    onClick={() => { setActiveTab('Find'); setSearchTerm(''); }}
                  >
                    <UserPlus size={14} />
                    <span>Find & Add Racers</span>
                  </button>
                </div>
              ) : (
                filteredFriends.map((f) => (
                  <div key={f.friendshipId || f.id} className="friend-row-card card card-cream">
                    <div className="friend-left-cell">
                      <span className="friend-avatar" style={{ fontSize: 28 }}>{f.avatar}</span>
                      <div className="friend-identity">
                        <div className="friend-name-line">
                          <strong>{f.name}</strong>
                          <span className={`status-dot-pill ${f.status === 'In Game' ? 'in-game' : f.status === 'Online' ? 'online' : 'offline'}`}>
                            {f.status}
                          </span>
                        </div>
                        <span className="friend-meta-sub text-xs text-secondary">
                          Car: {f.car} • Best: {f.bestWpm} WPM • Level {f.level}
                        </span>
                      </div>
                    </div>

                    <div className="friend-action-cell flex-center gap-2">
                      <button 
                        className="btn btn-primary btn-sm flex-center gap-1"
                        onClick={() => handleChallenge(f)}
                      >
                        <Swords size={15} />
                        <span>Challenge to Race</span>
                      </button>

                      {f.friendshipId && (
                        <button 
                          className="btn btn-outline btn-sm text-muted"
                          title="Remove Friend"
                          onClick={() => handleRemoveFriend(f.friendshipId, f.name)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: INCOMING REQUESTS */}
          {activeTab === 'Requests' && (
            <div className="friend-requests-list">
              {incomingRequests.length === 0 ? (
                <div className="card-cream p-5 text-center">
                  <p className="text-secondary">No pending friend requests.</p>
                </div>
              ) : (
                incomingRequests.map((req) => (
                  <div key={req.friendshipId} className="friend-row-card card card-cream">
                    <div className="friend-left-cell">
                      <span className="friend-avatar" style={{ fontSize: 28 }}>{req.avatar}</span>
                      <div>
                        <strong>{req.name}</strong>
                        <span className="text-xs text-secondary block">
                          Best {req.bestWpm} WPM • Wants to be your racing rival
                        </span>
                      </div>
                    </div>
                    <div className="friend-action-cell flex-center gap-2">
                      <button 
                        className="btn btn-primary btn-sm flex-center gap-1"
                        onClick={() => handleAcceptRequest(req.friendshipId, req.name)}
                      >
                        <Check size={14} />
                        <span>Accept</span>
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm flex-center gap-1"
                        onClick={() => handleRemoveFriend(req.friendshipId, req.name)}
                      >
                        <X size={14} />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: FIND PLAYERS */}
          {activeTab === 'Find' && (
            <div className="find-players-container">
              {searchResults.length === 0 && !searching && (
                <div className="find-players-box card-cream text-center py-5">
                  <Users size={40} className="text-orange mb-2" />
                  <h3>Discover KeySprint Drivers</h3>
                  <p className="text-secondary text-sm">
                    Search for players by nickname (e.g. <code>Emma</code>, <code>Liam</code>, <code>Sophia</code>, <code>RacerX</code>) to challenge them.
                  </p>
                </div>
              )}

              {searching && (
                <div className="card-cream p-4 text-center">
                  <p className="text-secondary">Searching driver database...</p>
                </div>
              )}

              <div className="friends-list-stack mt-3">
                {searchResults.map((user) => (
                  <div key={user.id} className="friend-row-card card card-cream">
                    <div className="friend-left-cell">
                      <span className="friend-avatar" style={{ fontSize: 28 }}>{user.avatar}</span>
                      <div>
                        <div className="flex-center gap-2">
                          <strong>{user.name}</strong>
                          <span className={`status-dot-pill ${user.isOnline ? 'online' : 'offline'}`}>
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <span className="text-xs text-secondary block">
                          Best: {user.bestWpm} WPM • Level {user.level} • {user.races} races
                        </span>
                      </div>
                    </div>

                    <div className="friend-action-cell">
                      {user.relationship === 'friend' && (
                        <span className="badge badge-green flex-center gap-1">
                          <CheckCircle2 size={12} /> Friends
                        </span>
                      )}
                      {user.relationship === 'pending_sent' && (
                        <span className="badge badge-gold">Request Sent</span>
                      )}
                      {user.relationship === 'pending_received' && user.friendshipId && (
                        <button 
                          className="btn btn-primary btn-sm flex-center gap-1"
                          onClick={() => handleAcceptRequest(user.friendshipId!, user.name)}
                        >
                          <Check size={14} />
                          <span>Accept Request</span>
                        </button>
                      )}
                      {user.relationship === 'none' && (
                        <button 
                          className="btn btn-primary btn-sm flex-center gap-1"
                          onClick={() => handleSendRequest(user.id, user.name)}
                        >
                          <UserPlus size={14} />
                          <span>Add Rival</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
