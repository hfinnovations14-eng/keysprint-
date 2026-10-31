import React, { useState } from 'react';
import { Users, UserPlus, Bot, ChevronRight, Sparkles, MapPin, Play } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { TRACKS_DATA, TrackItem } from '../../data/carsData';

interface Screen10RaceModeSelectProps {
  onNavigate: (screenId: string) => void;
  onSelectTrack?: (track: TrackItem) => void;
}

export const Screen10RaceModeSelect: React.FC<Screen10RaceModeSelectProps> = ({ 
  onNavigate,
  onSelectTrack 
}) => {
  const [selectedTrackId, setSelectedTrackId] = useState('green-valley');

  return (
    <div className="screen-page race-mode-screen">
      <div className="content-wrapper">
        {/* Page Heading */}
        <div className="page-header-block text-center">
          <span className="badge badge-orange">Start Racing</span>
          <h1 className="page-title">Choose a Race Mode</h1>
          <p className="page-subtitle">
            Select how you want to compete on the asphalt today.
          </p>
        </div>

        {/* 3 Main Game Mode Cards (Matching Reference Image 03) */}
        <div className="game-modes-grid">
          {/* Card 1: Quick Race */}
          <div 
            className="mode-card card card-interactive"
            onClick={() => onNavigate('screen-11')}
          >
            <div className="mode-car-wrap">
              <SvgCar id="blaze" size={170} />
            </div>
            <h3 className="mode-title">Quick Race</h3>
            <p className="mode-desc">Play with random players in real-time public matchmaking.</p>
            <div className="mode-footer">
              <span className="mode-tag badge badge-orange">2–6 Players</span>
              <span className="mode-arrow"><ChevronRight size={18} /></span>
            </div>
          </div>

          {/* Card 2: Create Room */}
          <div 
            className="mode-card card card-interactive"
            onClick={() => onNavigate('screen-17')}
          >
            <div className="mode-car-wrap">
              <SvgCar id="retro" size={170} />
            </div>
            <h3 className="mode-title">Create Room</h3>
            <p className="mode-desc">Invite your friends to a custom private race with room code.</p>
            <div className="mode-footer">
              <span className="mode-tag badge badge-gold">Custom Lobby</span>
              <span className="mode-arrow"><ChevronRight size={18} /></span>
            </div>
          </div>

          {/* Card 3: Play with Bots */}
          <div 
            className="mode-card card card-interactive"
            onClick={() => onNavigate('screen-15')}
          >
            <div className="mode-car-wrap">
              <SvgCar id="jeep" size={170} />
            </div>
            <h3 className="mode-title">Play with Bots</h3>
            <p className="mode-desc">Race with AI opponents at customized speed profiles.</p>
            <div className="mode-footer">
              <span className="mode-tag badge badge-blue">Solo / AI</span>
              <span className="mode-arrow"><ChevronRight size={18} /></span>
            </div>
          </div>
        </div>

        {/* Recommended Tracks Section */}
        <div className="recommended-tracks-section mt-5">
          <div className="section-header-row mb-3">
            <div>
              <h3>Recommended Tracks</h3>
              <p className="text-secondary text-sm">Select an arena to preload its scenery and ambient conditions.</p>
            </div>
            <button className="link-bold flex-center gap-1">
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="tracks-grid">
            {TRACKS_DATA.map((track) => (
              <div 
                key={track.id} 
                className={`track-card card ${selectedTrackId === track.id ? 'selected' : ''}`}
                onClick={() => setSelectedTrackId(track.id)}
              >
                <div 
                  className="track-thumbnail"
                  style={{ background: track.bgGradient }}
                >
                  <span className="track-icon">🏁</span>
                  <span className="track-diff-badge">{track.difficulty}</span>
                </div>
                <div className="track-info">
                  <h4>{track.name}</h4>
                  <span className="track-plays-text">{track.plays}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instant Solo Practice Quick Link */}
        <div className="practice-quick-banner card card-cream mt-5">
          <div className="banner-text">
            <h4>Just want to warm up your fingers first?</h4>
            <p className="text-secondary text-sm">Jump into Solo Practice mode without competitive pressure.</p>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('screen-14')}
          >
            Open Practice Drills
          </button>
        </div>
      </div>
    </div>
  );
};
