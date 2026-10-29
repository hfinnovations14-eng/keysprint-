import React, { useState } from 'react';
import { Smartphone, Tablet, Play, Trophy, Warehouse, User, ChevronRight } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { GLOBAL_LEADERBOARD } from '../../data/mockData';
import { CARS_DATA } from '../../data/carsData';

interface ScreenResponsiveViewsProps {
  onNavigate: (screenId: string) => void;
}

export const ScreenResponsiveViews: React.FC<ScreenResponsiveViewsProps> = ({ onNavigate }) => {
  const [activeMobileView, setActiveMobileView] = useState<'home' | 'race' | 'garage' | 'leaderboard'>('home');

  return (
    <div className="screen-page responsive-showcase-screen">
      <div className="content-wrapper">
        <div className="page-header-block text-center mb-4">
          <span className="badge badge-orange">Mobile & Tablet Adaptations</span>
          <h1 className="page-title">Responsive Device Frames (390px Mobile & 834px Tablet)</h1>
          <p className="page-subtitle">
            Faithfully adapting KeySprint's multi-lane racing, typing passage viewport, and navigation for touch devices.
          </p>
        </div>

        {/* 4 SIDE-BY-SIDE MOBILE MOCKUPS (Matching Reference Image 16) */}
        <div className="mobile-mockups-carousel">
          
          {/* PHONE 1: MOBILE HOMEPAGE */}
          <div className="phone-device-frame">
            <div className="phone-notch"><span className="notch-camera" /></div>
            <div className="phone-screen-content">
              {/* Mobile Header */}
              <div className="m-header">
                <span className="m-logo">⚡ KeySprint</span>
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate('screen-04')}>Join</button>
              </div>

              {/* Mobile Hero */}
              <div className="m-hero text-center py-4">
                <h2 className="m-title">Type. Race.<br /><span className="text-orange">Have Fun!</span></h2>
                <p className="m-subtext text-xs text-secondary mt-1">A fun typing game for everyone.</p>
                <button className="btn btn-primary btn-sm mt-3" onClick={() => onNavigate('screen-10')}>
                  <Play size={14} fill="#FFF" /> Play Now
                </button>
                <div className="m-hero-car mt-3">
                  <SvgCar id="blaze" size={140} animatedNitro={true} />
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="m-bottom-nav">
                <button className="m-nav-item active"><span className="icon">🏠</span><span>Home</span></button>
                <button className="m-nav-item" onClick={() => onNavigate('screen-10')}><span className="icon">🏁</span><span>Play</span></button>
                <button className="m-nav-item" onClick={() => onNavigate('screen-24')}><span className="icon">🚗</span><span>Garage</span></button>
                <button className="m-nav-item" onClick={() => onNavigate('screen-20')}><span className="icon">👤</span><span>Profile</span></button>
              </div>
            </div>
            <span className="phone-caption">Mobile Screen 01: Home</span>
          </div>

          {/* PHONE 2: MOBILE LIVE RACING */}
          <div className="phone-device-frame">
            <div className="phone-notch"><span className="notch-camera" /></div>
            <div className="phone-screen-content race-mode">
              {/* Top race passage */}
              <div className="m-race-passage card-cream">
                <span className="m-lap">1/4</span>
                <span className="m-text"><strong>The quick brown</strong> fox jumps over the lazy dog</span>
                <span className="m-timer">⏱️ 00:26</span>
              </div>

              {/* 3D Track mini view */}
              <div className="m-track-view">
                <img src="/assets/race_track.jpg" alt="Track" className="m-track-img" />
                <div className="m-track-overlay">
                  <div className="m-lane-car" style={{ left: '55%' }}>
                    <SvgCar id="blaze" size={70} />
                  </div>
                  <div className="m-lane-car" style={{ left: '42%' }}>
                    <SvgCar id="golden" size={70} />
                  </div>
                </div>
              </div>

              {/* Bottom HUD */}
              <div className="m-hud-bar card-dark">
                <div>
                  <span className="m-wpm">128 WPM</span>
                  <span className="m-acc">98% Acc</span>
                </div>
                <div className="m-progress-pill">
                  <div className="m-progress-fill" style={{ width: '55%' }} />
                </div>
              </div>

              {/* Virtual Keyboard Indicator (SRS AT-18) */}
              <div className="m-virtual-keyboard">
                <div className="kb-row"><span>Q</span><span>W</span><span>E</span><span>R</span><span>T</span><span>Y</span><span>U</span><span>I</span><span>O</span><span>P</span></div>
                <div className="kb-row"><span>A</span><span>S</span><span>D</span><span>F</span><span>G</span><span>H</span><span>J</span><span>K</span><span>L</span></div>
                <div className="kb-row"><span>Z</span><span>X</span><span>C</span><span>V</span><span>B</span><span>N</span><span>M</span></div>
                <div className="kb-space"><span>SPACE BAR</span></div>
              </div>
            </div>
            <span className="phone-caption">Mobile Screen 13: Live Race</span>
          </div>

          {/* PHONE 3: MOBILE GARAGE */}
          <div className="phone-device-frame">
            <div className="phone-notch"><span className="notch-camera" /></div>
            <div className="phone-screen-content">
              <div className="m-header">
                <span className="m-logo">Garage</span>
                <span className="badge badge-orange">🪙 2,450</span>
              </div>

              <div className="m-garage-preview text-center py-3">
                <span className="badge badge-blue">Starter Car (Equipped)</span>
                <div className="my-2">
                  <SvgCar id="starter" size={130} />
                </div>
                <button className="btn btn-secondary btn-sm" disabled>Equipped</button>
              </div>

              {/* Car Cards Scroll */}
              <div className="m-garage-scroll">
                <div className="m-car-mini-card">
                  <SvgCar id="blaze" size={80} />
                  <span>Blaze</span>
                </div>
                <div className="m-car-mini-card">
                  <SvgCar id="golden" size={80} />
                  <span>Golden</span>
                </div>
                <div className="m-car-mini-card">
                  <SvgCar id="neon" size={80} />
                  <span>Neon</span>
                </div>
              </div>

              <div className="m-bottom-nav">
                <button className="m-nav-item" onClick={() => onNavigate('screen-01')}><span className="icon">🏠</span><span>Home</span></button>
                <button className="m-nav-item" onClick={() => onNavigate('screen-10')}><span className="icon">🏁</span><span>Play</span></button>
                <button className="m-nav-item active"><span className="icon">🚗</span><span>Garage</span></button>
                <button className="m-nav-item" onClick={() => onNavigate('screen-20')}><span className="icon">👤</span><span>Profile</span></button>
              </div>
            </div>
            <span className="phone-caption">Mobile Screen 24: Garage</span>
          </div>

          {/* PHONE 4: MOBILE LEADERBOARD */}
          <div className="phone-device-frame">
            <div className="phone-notch"><span className="notch-camera" /></div>
            <div className="phone-screen-content">
              <div className="m-header">
                <span className="m-logo">Leaderboard</span>
                <div className="m-tab-pills">
                  <span className="m-tab-pill active">Global</span>
                  <span className="m-tab-pill">Friends</span>
                </div>
              </div>

              <div className="m-board-list">
                {GLOBAL_LEADERBOARD.slice(0, 5).map((p) => (
                  <div key={p.rank} className="m-board-row">
                    <span className="m-board-rank">#{p.rank}</span>
                    <span className="m-board-name">{p.name}</span>
                    <strong className="m-board-wpm">{p.wpm} WPM</strong>
                  </div>
                ))}
              </div>

              <div className="m-bottom-nav">
                <button className="m-nav-item" onClick={() => onNavigate('screen-01')}><span className="icon">🏠</span><span>Home</span></button>
                <button className="m-nav-item" onClick={() => onNavigate('screen-10')}><span className="icon">🏁</span><span>Play</span></button>
                <button className="m-nav-item" onClick={() => onNavigate('screen-24')}><span className="icon">🚗</span><span>Garage</span></button>
                <button className="m-nav-item active" onClick={() => onNavigate('screen-20')}><span className="icon">👤</span><span>Profile</span></button>
              </div>
            </div>
            <span className="phone-caption">Mobile Screen 29: Leaderboard</span>
          </div>

        </div>

      </div>
    </div>
  );
};
