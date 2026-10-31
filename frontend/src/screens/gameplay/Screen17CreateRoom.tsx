import React, { useState } from 'react';
import { Lock, Users, Copy, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { TRACKS_DATA } from '../../data/carsData';

interface Screen17CreateRoomProps {
  onNavigate: (screenId: string) => void;
}

export const Screen17CreateRoom: React.FC<Screen17CreateRoomProps> = ({ onNavigate }) => {
  const [roomName, setRoomName] = useState("Alex's Fast Lane");
  const [roomCode, setRoomCode] = useState('SPRINT-89');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [selectedTrack, setSelectedTrack] = useState('green-valley');
  const [fillWithBots, setFillWithBots] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('screen-18'); // Enter Lobby
  };

  return (
    <div className="screen-page room-screen">
      <div className="content-wrapper">
        <div className="room-create-card card">
          <div className="page-header-block text-center">
            <span className="badge badge-gold">Custom Lobby</span>
            <h1 className="page-title">Create Private Room</h1>
            <p className="page-subtitle">Configure race rules and invite friends with an exclusive code.</p>
          </div>

          <form onSubmit={handleCreate} className="room-form mt-4">
            <div className="input-group">
              <label className="input-label">Room Title</label>
              <input 
                type="text" 
                className="input-field"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            <div className="room-settings-row mt-3">
              <div className="input-group flex-1">
                <label className="input-label">Shareable Room Code</label>
                <div className="input-with-badge">
                  <input 
                    type="text" 
                    readOnly 
                    className="input-field font-mono font-bold text-orange"
                    value={roomCode}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm copy-code-btn"
                    onClick={() => alert(`Room code ${roomCode} copied!`)}
                  >
                    <Copy size={14} />
                    <span>Copy</span>
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
                  <strong>Fill Open Slots with Bots</strong>
                  <p className="text-xs text-secondary">If fewer friends join, fill remaining spots with AI cars.</p>
                </div>
              </label>

              <label className="toggle-row mt-2">
                <input 
                  type="checkbox" 
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <div>
                  <strong>Invite-Only Privacy</strong>
                  <p className="text-xs text-secondary">Only racers with the direct 6-char link can enter.</p>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg full-width mt-4">
              <span>Create Lobby & Wait for Friends</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
