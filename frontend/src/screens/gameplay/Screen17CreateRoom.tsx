import React, { useState } from 'react';
import { Lock, Users, Copy, Sparkles, MapPin, ArrowRight, RefreshCw, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import { TRACKS_DATA } from '../../data/carsData';
import { useRace } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';

interface Screen17CreateRoomProps {
  onNavigate: (screenId: string) => void;
}

export const Screen17CreateRoom: React.FC<Screen17CreateRoomProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { createPrivateRoom, joinPrivateRoom, roomError, clearRoomError } = useRace();

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [roomName, setRoomName] = useState(
    user?.profile?.nickname ? `${user.profile.nickname}'s Grand Prix` : "Alex's Fast Lane"
  );
  const [roomCode, setRoomCode] = useState(() => {
    const prefixes = ['SPRINT', 'APEX', 'TURBO', 'NITRO', 'DRIFT', 'HYPER'];
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return `${prefix}-${suffix}`;
  });
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [selectedTrack, setSelectedTrack] = useState('green-valley');
  const [fillWithBots, setFillWithBots] = useState(true);
  const [botDifficulty, setBotDifficulty] = useState<'easy' | 'normal' | 'advanced'>('normal');
  const [isPrivate, setIsPrivate] = useState(true);

  // Join Tab State
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const generateNewCode = () => {
    const prefixes = ['SPRINT', 'APEX', 'TURBO', 'NITRO', 'DRIFT', 'HYPER'];
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    setRoomCode(`${prefix}-${suffix}`);
  };

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    clearRoomError();

    createPrivateRoom({
      roomName: roomName.trim() || 'Private Race Lobby',
      roomCode: roomCode.trim().toUpperCase(),
      maxPlayers,
      trackId: selectedTrack,
      fillWithBots,
      botDifficulty
    });

    onNavigate('screen-18'); // Enter Lobby
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setIsJoining(true);
    clearRoomError();

    const result = await joinPrivateRoom(joinCodeInput);
    setIsJoining(false);

    if (result.success) {
      onNavigate('screen-18'); // Enter Lobby
    }
  };

  return (
    <div className="screen-page room-screen">
      <div className="content-wrapper">
        <div className="room-create-card card">

          {/* Top Return Button */}
          <div className="flex-between mb-3">
            <button 
              type="button" 
              className="btn btn-outline btn-sm flex-center gap-1"
              onClick={() => onNavigate('screen-10')}
            >
              <ArrowLeft size={14} />
              <span>Back to Modes</span>
            </button>
            <span className="badge badge-gold">Custom Lobby</span>
          </div>

          <div className="page-header-block text-center">
            <h1 className="page-title">Private Multiplayer Arena</h1>
            <p className="page-subtitle">Race against your friends or colleagues with an exclusive room code.</p>
          </div>

          {/* Tab Switcher: Create vs Join */}
          <div className="tab-list mt-3 flex-center">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => { setActiveTab('create'); clearRoomError(); }}
            >
              Create New Room
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'join' ? 'active' : ''}`}
              onClick={() => { setActiveTab('join'); clearRoomError(); }}
            >
              Join with Code
            </button>
          </div>

          {/* Error Banner */}
          {roomError && (
            <div className="alert alert-danger mt-3 flex-center gap-2">
              <AlertCircle size={16} />
              <span>{roomError}</span>
            </div>
          )}

          {activeTab === 'create' ? (
            <form onSubmit={handleCreate} className="room-form mt-4">
              <div className="input-group">
                <label className="input-label">Room Title</label>
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="e.g. Speed Demons Cup"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <div className="room-settings-row mt-3">
                <div className="input-group flex-1">
                  <div className="flex-between">
                    <label className="input-label">Shareable Room Code</label>
                    <button
                      type="button"
                      className="link-bold text-xs flex-center gap-1"
                      onClick={generateNewCode}
                    >
                      <RefreshCw size={12} />
                      <span>Roll Code</span>
                    </button>
                  </div>
                  <div className="input-with-badge">
                    <input 
                      type="text" 
                      className="input-field font-mono font-bold text-orange uppercase"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm copy-code-btn"
                      onClick={handleCopyCode}
                    >
                      <Copy size={14} />
                      <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="input-group flex-1">
                  <label className="input-label">Max Racers</label>
                  <select 
                    className="input-field"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  >
                    <option value={2}>2 Racers (Head to Head)</option>
                    <option value={3}>3 Racers</option>
                    <option value={4}>4 Racers (Standard)</option>
                    <option value={6}>6 Racers (Grand Prix)</option>
                  </select>
                </div>
              </div>

              {/* Track Selector */}
              <div className="input-group mt-3">
                <label className="input-label">Select Race Track</label>
                <div className="room-tracks-pills">
                  {TRACKS_DATA.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`track-pill-btn ${selectedTrack === t.id ? 'active' : ''}`}
                      onClick={() => setSelectedTrack(t.id)}
                    >
                      <span>{t.name}</span>
                      <span className="pill-diff">{t.difficulty}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="room-toggles-list card-cream mt-4">
                <label className="toggle-row">
                  <input 
                    type="checkbox" 
                    checked={fillWithBots}
                    onChange={(e) => setFillWithBots(e.target.checked)}
                  />
                  <div>
                    <strong>Fill Open Slots with AI Bots</strong>
                    <p className="text-xs text-secondary">Automatically populate empty grid slots when host starts the match.</p>
                  </div>
                </label>

                {fillWithBots && (
                  <div className="room-bot-difficulty-selector mt-2 pl-4 py-2" style={{ borderLeft: '2px solid var(--color-orange, #f97316)' }}>
                    <label className="text-xs font-semibold text-secondary block mb-1">AI Bot Difficulty</label>
                    <div className="flex gap-2 flex-wrap">
                      {(['easy', 'normal', 'advanced'] as const).map(diff => (
                        <button
                          key={diff}
                          type="button"
                          className={`btn btn-xs ${botDifficulty === diff ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setBotDifficulty(diff)}
                        >
                          {diff === 'easy' ? '🟢 Easy (~50 WPM)' : diff === 'normal' ? '🟡 Normal (~95 WPM)' : '🔴 Advanced (~150 WPM)'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="toggle-row mt-2">
                  <input 
                    type="checkbox" 
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  <div>
                    <strong>Invite-Only Privacy</strong>
                    <p className="text-xs text-secondary">Only drivers with your secret room code can access this lobby.</p>
                  </div>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-lg full-width mt-4">
                <span>Create Lobby & Wait for Friends</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin} className="room-form mt-4">
              <div className="card-cream p-4 text-center">
                <div className="avatar-chip mx-auto mb-2" style={{ width: 50, height: 50, fontSize: 24 }}>
                  🏁
                </div>
                <h3>Enter Friend's Room Code</h3>
                <p className="text-sm text-secondary mt-1">
                  Ask the lobby host for their 6-character code (e.g. <code>SPRINT-89</code>).
                </p>

                <div className="mt-3 max-w-sm mx-auto">
                  <input 
                    type="text" 
                    className="input-field text-center font-mono font-bold uppercase text-lg text-orange"
                    placeholder="ENTER CODE"
                    maxLength={12}
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    autoFocus
                  />

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg full-width mt-3"
                    disabled={!joinCodeInput.trim() || isJoining}
                  >
                    <LogIn size={18} />
                    <span>{isJoining ? 'Connecting to Grid...' : 'Join Race Lobby'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
