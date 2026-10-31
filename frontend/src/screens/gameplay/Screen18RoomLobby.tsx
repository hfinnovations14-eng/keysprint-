import React, { useState } from 'react';
import { Users, Copy, Check, Play, UserPlus, LogOut, Crown } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen18RoomLobbyProps {
  onNavigate: (screenId: string) => void;
}

export const Screen18RoomLobby: React.FC<Screen18RoomLobbyProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState([
    { id: '1', name: 'AlexPro (Host)', isHost: true, ready: true, car: 'blaze', avatar: '🏎️' },
    { id: '2', name: 'Emma', isHost: false, ready: true, car: 'golden', avatar: '👩‍🦰' },
    { id: '3', name: 'Liam', isHost: false, ready: false, car: 'forest', avatar: '👱‍♂️' },
  ]);

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="screen-page room-screen">
      <div className="content-wrapper">
        <div className="room-lobby-card card">
          {/* Header */}
          <div className="lobby-header-row">
            <div>
              <span className="badge badge-gold">Private Lobby</span>
              <h2>Alex's Fast Lane</h2>
              <div className="room-code-tag mt-1">
                <span>Room Code: <strong>SPRINT-89</strong></span>
              </div>
            </div>

            <div className="lobby-invite-box">
              <button className="btn btn-secondary btn-sm" onClick={copyLink}>
                {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
                <span>{copied ? 'Link Copied!' : 'Copy Invite Link'}</span>
              </button>
            </div>
          </div>

          {/* Lobby Slots */}
          <div className="lobby-slots-grid mt-4">
            {players.map((p, idx) => (
              <div key={p.id} className="lobby-player-card card-cream">
                <div className="p-header">
                  <span className="p-slot-num">Slot {idx + 1}</span>
                  {p.isHost && <span className="host-badge"><Crown size={12} /> Host</span>}
                </div>
                <div className="p-car-center">
                  <SvgCar id={p.car as any} size={110} />
                </div>
                <div className="p-footer">
                  <span className="p-avatar">{p.avatar}</span>
                  <span className="p-name">{p.name}</span>
                  <span className={`p-ready-pill ${p.ready ? 'ready' : 'waiting'}`}>
                    {p.ready ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
              </div>
            ))}

            {/* Waiting Slot */}
            <div className="lobby-player-card empty-slot">
              <span className="p-slot-num">Slot 4</span>
              <div className="empty-slot-content">
                <UserPlus size={24} className="text-muted" />
                <span>Waiting for Friend or Bot...</span>
              </div>
            </div>
          </div>

          {/* Host Controls */}
          <div className="lobby-actions-row mt-5">
            <button 
              className="btn btn-outline"
              onClick={() => onNavigate('screen-10')}
            >
              <LogOut size={16} />
              <span>Leave Room</span>
            </button>

            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('screen-13')}
            >
              <Play size={18} fill="#FFFFFF" />
              <span>Start Match (Countdown)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
