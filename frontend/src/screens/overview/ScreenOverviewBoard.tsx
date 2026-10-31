import React, { useState } from 'react';
import { SCREEN_INVENTORY, ScreenMeta } from '../../components/layout/ScreenSwitcherToolbar';
import { Grid, Eye, ExternalLink, CheckCircle2, Filter } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface ScreenOverviewBoardProps {
  onSelectScreen: (screenId: string) => void;
}

export const ScreenOverviewBoard: React.FC<ScreenOverviewBoardProps> = ({ onSelectScreen }) => {
  const [selectedSection, setSelectedSection] = useState<string>('All');

  const sections = ['All', 'Public', 'Auth', 'Gameplay', 'Account', 'Garage & Shop', 'Social', 'Practice', 'Settings', 'Admin', 'Responsive'];

  const filteredScreens = selectedSection === 'All'
    ? SCREEN_INVENTORY.filter(s => s.id !== 'overview-board')
    : SCREEN_INVENTORY.filter(s => s.section === selectedSection && s.id !== 'overview-board');

  const getScreenPreviewContent = (screen: ScreenMeta) => {
    switch (screen.section) {
      case 'Public':
        return <SvgCar id="blaze" size={90} animatedNitro={true} />;
      case 'Auth':
        return <div className="overview-thumb-auth"><span className="thumb-icon">🔐</span><span>Split Layout</span></div>;
      case 'Gameplay':
        return <SvgCar id={screen.id === 'screen-13' ? 'blaze' : 'golden'} size={90} />;
      case 'Account':
        return <div className="overview-thumb-metric"><span className="thumb-wpm">142 WPM</span><span>Lv. 12</span></div>;
      case 'Garage & Shop':
        return <SvgCar id="neon" size={90} />;
      case 'Social':
        return <div className="overview-thumb-podium"><span>👑 #1 AlexPro</span><span>182 WPM</span></div>;
      case 'Practice':
        return <div className="overview-thumb-keys"><span>[Q] [W] [E] [R]</span><span>Drill Mode</span></div>;
      case 'Settings':
        return <div className="overview-thumb-settings"><span>⚙️ Audio & Motion</span></div>;
      case 'Admin':
        return <div className="overview-thumb-admin"><span>🛡️ Telemetry & CMS</span></div>;
      default:
        return <SvgCar id="starter" size={90} />;
    }
  };

  return (
    <div className="screen-page overview-board-screen">
      <div className="content-wrapper">
        
        {/* HEADER & FILTER */}
        <div className="overview-header-block mb-4">
          <div className="section-header-row">
            <div>
              <div className="flex-center gap-2 mb-1">
                <span className="badge badge-orange">Master Design Deliverable</span>
                <span className="badge badge-green flex-center gap-1">
                  <CheckCircle2 size={12} /> 100% SRS v1.0 Coverage
                </span>
              </div>
              <h1 className="page-title">KeySprint Screen Overview Board</h1>
              <p className="page-subtitle">
                Complete contact sheet of all 50+ individual production screens across Public, Player, Gameplay, and Administration flows.
              </p>
            </div>

            <div className="overview-counter-pill card-cream">
              <span className="count-number">{filteredScreens.length}</span>
              <span className="count-label">Screens Shown</span>
            </div>
          </div>

          {/* Section Filter Pills */}
          <div className="overview-filter-bar mt-4">
            <div className="tab-list flex-wrap">
              {sections.map((sec) => (
                <button
                  key={sec}
                  className={`tab-btn ${selectedSection === sec ? 'active' : ''}`}
                  onClick={() => setSelectedSection(sec)}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 50+ SCREENS GRID */}
        <div className="overview-cards-grid">
          {filteredScreens.map((screen) => (
            <div 
              key={screen.id} 
              className="overview-screen-card card card-interactive"
              onClick={() => onSelectScreen(screen.id)}
            >
              <div className="overview-card-header">
                <span className="screen-code-badge">{screen.code}</span>
                <span className={`badge badge-phase phase-${screen.phase.toLowerCase()}`}>
                  {screen.phase}
                </span>
              </div>

              <div className="overview-thumbnail-canvas">
                {getScreenPreviewContent(screen)}
              </div>

              <div className="overview-card-meta">
                <span className="overview-section-tag">{screen.section}</span>
                <h4 className="overview-screen-name">{screen.name}</h4>
              </div>

              <div className="overview-card-action mt-3">
                <button className="btn btn-outline btn-sm full-width flex-center gap-1">
                  <Eye size={14} />
                  <span>View High-Res Screen</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
