import React, { useState } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Grid, 
  Layout, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle, 
  ChevronRight,
  Eye,
  Sliders,
  ExternalLink
} from 'lucide-react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface ScreenMeta {
  id: string;
  code: string;
  name: string;
  section: 'Public' | 'Auth' | 'Gameplay' | 'Account' | 'Garage & Shop' | 'Social' | 'Practice' | 'Settings' | 'Admin' | 'Responsive' | 'Overview';
  phase: 'MVP' | 'V1' | 'V2';
}

export const SCREEN_INVENTORY: ScreenMeta[] = [
  // SECTION A — PUBLIC
  { id: 'screen-01', code: '01', name: 'Homepage (Marketing & Hero)', section: 'Public', phase: 'MVP' },
  { id: 'screen-02', code: '02', name: 'How to Play (Visual Rules)', section: 'Public', phase: 'MVP' },
  { id: 'screen-03', code: '03', name: 'About KeySprint Platform', section: 'Public', phase: 'MVP' },

  // SECTION B — AUTHENTICATION
  { id: 'screen-04', code: '04', name: 'Sign Up / Register', section: 'Auth', phase: 'MVP' },
  { id: 'screen-05', code: '05', name: 'Login (Email & OAuth)', section: 'Auth', phase: 'MVP' },
  { id: 'screen-06', code: '06', name: 'Forgot Password', section: 'Auth', phase: 'MVP' },
  { id: 'screen-07', code: '07', name: 'Reset Password', section: 'Auth', phase: 'MVP' },
  { id: 'screen-08', code: '08', name: 'Email Verification', section: 'Auth', phase: 'MVP' },
  { id: 'screen-09', code: '09', name: 'Guest Quick Entry', section: 'Auth', phase: 'MVP' },

  // SECTION C — GAMEPLAY
  { id: 'screen-10', code: '10', name: 'Race Mode Selection', section: 'Gameplay', phase: 'MVP' },
  { id: 'screen-11', code: '11', name: 'Public Matchmaking Queue', section: 'Gameplay', phase: 'MVP' },
  { id: 'screen-12', code: '12', name: 'Pre-Race Countdown Lobby', section: 'Gameplay', phase: 'MVP' },
  { id: 'screen-13', code: '13', name: 'Live Multiplayer Typing Race', section: 'Gameplay', phase: 'MVP' },
  { id: 'screen-14', code: '14', name: 'Practice Typing Interface', section: 'Gameplay', phase: 'MVP' },
  { id: 'screen-15', code: '15', name: 'Race Against Bots (AI)', section: 'Gameplay', phase: 'MVP' },
  { id: 'screen-16', code: '16', name: 'Race Results Celebration', section: 'Gameplay', phase: 'MVP' },
  { id: 'screen-17', code: '17', name: 'Private Room Creation', section: 'Gameplay', phase: 'V1' },
  { id: 'screen-18', code: '18', name: 'Private Room Lobby', section: 'Gameplay', phase: 'V1' },

  // SECTION D — PLAYER ACCOUNT & PROGRESS
  { id: 'screen-19', code: '19', name: 'Player User Dashboard', section: 'Account', phase: 'MVP' },
  { id: 'screen-20', code: '20', name: 'Public Player Profile', section: 'Account', phase: 'MVP' },
  { id: 'screen-21', code: '21', name: 'Edit Profile & Avatar', section: 'Account', phase: 'MVP' },
  { id: 'screen-22', code: '22', name: 'Statistics & Speed Analytics', section: 'Account', phase: 'V1' },
  { id: 'screen-23', code: '23', name: 'Race History & Logs', section: 'Account', phase: 'MVP' },

  // SECTION E — CARS & REWARDS
  { id: 'screen-24', code: '24', name: 'Garage (Vehicle Fleet)', section: 'Garage & Shop', phase: 'MVP' },
  { id: 'screen-25', code: '25', name: 'Cosmetic Store & Bundles', section: 'Garage & Shop', phase: 'MVP' },
  { id: 'screen-26', code: '26', name: 'Purchase Confirmation Modal', section: 'Garage & Shop', phase: 'MVP' },
  { id: 'screen-27', code: '27', name: 'Achievements & Milestones', section: 'Garage & Shop', phase: 'V1' },
  { id: 'screen-28', code: '28', name: 'Daily Challenges & Quests', section: 'Garage & Shop', phase: 'V1' },

  // SECTION F — COMPETITION & SOCIAL
  { id: 'screen-29', code: '29', name: 'Global & Country Leaderboard', section: 'Social', phase: 'MVP' },
  { id: 'screen-30', code: '30', name: 'Friends & Social Network', section: 'Social', phase: 'V1' },
  { id: 'screen-31', code: '31', name: 'Invites & Notifications Drawer', section: 'Social', phase: 'MVP' },
  { id: 'screen-32', code: '32', name: 'Tournaments & Weekend Cups', section: 'Social', phase: 'V2' },

  // SECTION G — PRACTICE & LEARNING
  { id: 'screen-33', code: '33', name: 'Practice Drills Selector', section: 'Practice', phase: 'MVP' },
  { id: 'screen-34', code: '34', name: 'Practice Results & Weak Keys', section: 'Practice', phase: 'V1' },

  // SECTION H — SETTINGS & SUPPORT
  { id: 'screen-35', code: '35', name: 'Settings (Audio, Motion, Privacy)', section: 'Settings', phase: 'MVP' },
  { id: 'screen-36', code: '36', name: 'Help Center & FAQs', section: 'Settings', phase: 'MVP' },
  { id: 'screen-37', code: '37', name: 'Contact & Anti-Cheat Report', section: 'Settings', phase: 'MVP' },
  { id: 'screen-38', code: '38', name: 'Legal (Privacy, Terms, Fair Play)', section: 'Settings', phase: 'MVP' },
  { id: 'screen-39', code: '39', name: 'System States (404, Offline, Reconnect)', section: 'Settings', phase: 'MVP' },

  // SECTION I — COMPLETE ADMIN PANEL
  { id: 'admin-01', code: 'AD-01', name: 'Admin Overview Dashboard', section: 'Admin', phase: 'MVP' },
  { id: 'admin-02', code: 'AD-02', name: 'Admin User Moderation', section: 'Admin', phase: 'MVP' },
  { id: 'admin-03', code: 'AD-03', name: 'Admin Passage CMS', section: 'Admin', phase: 'MVP' },
  { id: 'admin-04', code: 'AD-04', name: 'Admin Game Configuration', section: 'Admin', phase: 'MVP' },
  { id: 'admin-05', code: 'AD-05', name: 'Admin Garage & Shop Catalog', section: 'Admin', phase: 'V1' },
  { id: 'admin-06', code: 'AD-06', name: 'Admin XP & Rewards Engine', section: 'Admin', phase: 'V1' },
  { id: 'admin-07', code: 'AD-07', name: 'Admin Anti-Cheat & Cadence Triage', section: 'Admin', phase: 'V1' },
  { id: 'admin-08', code: 'AD-08', name: 'Admin Analytics & Funnels', section: 'Admin', phase: 'V1' },
  { id: 'admin-09', code: 'AD-09', name: 'Admin Staff Roles & Audit Logs', section: 'Admin', phase: 'MVP' },

  // SECTION J & K — RESPONSIVE & OVERVIEW
  { id: 'responsive-views', code: 'RESP', name: 'Responsive Mobile & Tablet Frames', section: 'Responsive', phase: 'MVP' },
  { id: 'overview-board', code: 'ALL', name: 'Design Contact Sheet (All Screens)', section: 'Overview', phase: 'MVP' }
];

interface ScreenSwitcherToolbarProps {
  currentScreenId: string;
  onSelectScreen: (screenId: string) => void;
  viewport: ViewportMode;
  onSetViewport: (v: ViewportMode) => void;
}

export const ScreenSwitcherToolbar: React.FC<ScreenSwitcherToolbarProps> = ({
  currentScreenId,
  onSelectScreen,
  viewport,
  onSetViewport
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const currentScreen = SCREEN_INVENTORY.find(s => s.id === currentScreenId) || SCREEN_INVENTORY[0];

  return (
    <aside className={`screen-switcher-bar ${collapsed ? 'collapsed' : ''}`} aria-label="KeySprint UI/UX Design System Inspector">
      <div className="switcher-header">
        <div className="switcher-brand">
          <span className="badge badge-orange">KeySprint UI System</span>
          <span className="screen-counter-pill">50+ Screens • SRS v1.0</span>
        </div>

        {/* Viewport controls */}
        <div className="viewport-toggle-group">
          <button 
            className={`v-btn ${viewport === 'desktop' ? 'active' : ''}`}
            onClick={() => onSetViewport('desktop')}
            title="Desktop 1440px standard canvas"
          >
            <Monitor size={15} />
            <span>1440px</span>
          </button>
          <button 
            className={`v-btn ${viewport === 'tablet' ? 'active' : ''}`}
            onClick={() => onSetViewport('tablet')}
            title="Tablet 834px canvas"
          >
            <Tablet size={15} />
            <span>834px</span>
          </button>
          <button 
            className={`v-btn ${viewport === 'mobile' ? 'active' : ''}`}
            onClick={() => onSetViewport('mobile')}
            title="Mobile 390px canvas"
          >
            <Smartphone size={15} />
            <span>390px</span>
          </button>
        </div>

        {/* Quick jump to Contact Sheet & Responsive View */}
        <div className="action-buttons-group">
          <button 
            className={`tool-action-btn ${currentScreenId === 'overview-board' ? 'highlight' : ''}`}
            onClick={() => onSelectScreen('overview-board')}
            title="View master design contact sheet of all screens"
          >
            <Grid size={15} />
            <span>Overview Board</span>
          </button>

          <button 
            className={`tool-action-btn ${currentScreenId === 'responsive-views' ? 'highlight' : ''}`}
            onClick={() => onSelectScreen('responsive-views')}
            title="Side-by-side Mobile & Tablet views"
          >
            <Layout size={15} />
            <span>Device Frames</span>
          </button>

          <button 
            className="collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Inspector" : "Collapse Inspector"}
          >
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="switcher-body">
          <div className="current-screen-info">
            <span className="current-code-tag">{currentScreen.code}</span>
            <div className="current-meta-text">
              <strong className="current-screen-title">{currentScreen.name}</strong>
              <div className="current-tags">
                <span className="tag-section">{currentScreen.section}</span>
                <span className={`tag-phase phase-${currentScreen.phase.toLowerCase()}`}>
                  {currentScreen.phase}
                </span>
              </div>
            </div>
          </div>

          {/* Screen Dropdown selector */}
          <div className="screen-selector-dropdown-wrap">
            <label className="dropdown-label">Jump to Screen:</label>
            <select 
              value={currentScreenId}
              onChange={(e) => onSelectScreen(e.target.value)}
              className="screen-select-dropdown"
            >
              {['Public', 'Auth', 'Gameplay', 'Account', 'Garage & Shop', 'Social', 'Practice', 'Settings', 'Admin', 'Responsive', 'Overview'].map((sec) => (
                <optgroup key={sec} label={`── ${sec.toUpperCase()} ──`}>
                  {SCREEN_INVENTORY.filter(s => s.section === sec).map(s => (
                    <option key={s.id} value={s.id}>
                      [{s.code}] {s.name} ({s.phase})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      )}
    </aside>
  );
};
