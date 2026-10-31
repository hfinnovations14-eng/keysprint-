import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Gamepad2, 
  Eye, 
  Globe, 
  Volume2, 
  Save, 
  AlertTriangle, 
  Trash2 
} from 'lucide-react';

interface Screen35SettingsProps {
  onNavigate: (screenId: string) => void;
}

export const Screen35Settings: React.FC<Screen35SettingsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'Account' | 'Notifications' | 'Privacy' | 'Game Settings' | 'Appearance' | 'Language'>('Account');
  
  // Settings state
  const [username, setUsername] = useState('AlexPro');
  const [email, setEmail] = useState('alex@example.com');
  const [soundEffects, setSoundEffects] = useState(true);
  const [engineAudio, setEngineAudio] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [keyboardLayout, setKeyboardLayout] = useState('QWERTY');
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings successfully saved!');
  };

  return (
    <div className="screen-page settings-screen">
      <div className="content-wrapper">
        <div className="settings-layout-card card">
          
          {/* SETTINGS SIDEBAR (Matching Reference Image 15) */}
          <aside className="settings-sidebar card-cream">
            <h3 className="settings-nav-title">Preferences</h3>
            <nav className="settings-nav-list">
              <button 
                className={`settings-nav-btn ${activeTab === 'Account' ? 'active' : ''}`}
                onClick={() => setActiveTab('Account')}
              >
                <User size={18} />
                <span>Account</span>
              </button>

              <button 
                className={`settings-nav-btn ${activeTab === 'Notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('Notifications')}
              >
                <Bell size={18} />
                <span>Notifications</span>
              </button>

              <button 
                className={`settings-nav-btn ${activeTab === 'Privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('Privacy')}
              >
                <Lock size={18} />
                <span>Privacy</span>
              </button>

              <button 
                className={`settings-nav-btn ${activeTab === 'Game Settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('Game Settings')}
              >
                <Gamepad2 size={18} />
                <span>Game Settings</span>
              </button>

              <button 
                className={`settings-nav-btn ${activeTab === 'Appearance' ? 'active' : ''}`}
                onClick={() => setActiveTab('Appearance')}
              >
                <Eye size={18} />
                <span>Appearance</span>
              </button>

              <button 
                className={`settings-nav-btn ${activeTab === 'Language' ? 'active' : ''}`}
                onClick={() => setActiveTab('Language')}
              >
                <Globe size={18} />
                <span>Language</span>
              </button>
            </nav>
          </aside>

          {/* SETTINGS MAIN FORM (Matching Reference Image 15) */}
          <main className="settings-content-area">
            {activeTab === 'Account' && (
              <form onSubmit={handleSave} className="settings-form">
                <div className="settings-section-header mb-4">
                  <h2>Account Settings</h2>
                  <p className="text-secondary text-sm">Manage your profile details and credential credentials.</p>
                </div>

                {/* Avatar Row */}
                <div className="settings-avatar-row mb-4">
                  <div className="settings-avatar-circle">
                    <span>🏎️</span>
                  </div>
                  <div>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onNavigate('screen-21')}
                    >
                      Change Avatar
                    </button>
                    <p className="text-xs text-secondary mt-1">PNG, JPG, or animated racer icon.</p>
                  </div>
                </div>

                <div className="input-group mb-3">
                  <label className="input-label">Username</label>
                  <input 
                    type="text" 
                    className="input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="input-group mb-4">
                  <label className="input-label">Email</label>
                  <input 
                    type="email" 
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>

                {/* Dangerous Action */}
                <div className="danger-zone-box mt-5">
                  <h4 className="text-red flex-center gap-1">
                    <AlertTriangle size={16} /> Danger Zone
                  </h4>
                  <p className="text-xs text-secondary mt-1">
                    Once you delete your account, all coins and garage cars will be permanently wiped.
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-outline text-red mt-2 btn-sm"
                    onClick={() => confirm('Are you sure you want to delete your account?')}
                  >
                    <Trash2 size={14} /> Delete Account
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'Game Settings' && (
              <div className="game-settings-pane">
                <h2>Game & Accessibility Settings</h2>
                <div className="settings-toggles-stack mt-4">
                  <label className="toggle-row">
                    <input 
                      type="checkbox" 
                      checked={soundEffects}
                      onChange={(e) => setSoundEffects(e.target.checked)}
                    />
                    <div>
                      <strong>Keyboard Typing Audio FX</strong>
                      <p className="text-xs text-secondary">Play subtle tactile click sounds when striking keys.</p>
                    </div>
                  </label>

                  <label className="toggle-row mt-3">
                    <input 
                      type="checkbox" 
                      checked={engineAudio}
                      onChange={(e) => setEngineAudio(e.target.checked)}
                    />
                    <div>
                      <strong>Engine Rumble & Nitro FX</strong>
                      <p className="text-xs text-secondary">Play roaring exhaust and nitro sounds during matches.</p>
                    </div>
                  </label>

                  <label className="toggle-row mt-3">
                    <input 
                      type="checkbox" 
                      checked={reducedMotion}
                      onChange={(e) => setReducedMotion(e.target.checked)}
                    />
                    <div>
                      <strong>Reduced Motion Accessibility (SRS FR-G08)</strong>
                      <p className="text-xs text-secondary">Disable heavy camera shaking, speed lines, and sunburst flashes.</p>
                    </div>
                  </label>

                  <div className="input-group mt-4">
                    <label className="input-label">Keyboard Layout Standard</label>
                    <select 
                      className="input-field"
                      value={keyboardLayout}
                      onChange={(e) => setKeyboardLayout(e.target.value)}
                    >
                      <option value="QWERTY">QWERTY (US Standard)</option>
                      <option value="DVORAK">Dvorak Simplified</option>
                      <option value="COLEMAK">Colemak Ergonomic</option>
                      <option value="AZERTY">AZERTY (French)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div>
                <h2>Notification Preferences</h2>
                <label className="toggle-row mt-4">
                  <input 
                    type="checkbox" 
                    checked={emailNotifs}
                    onChange={(e) => setEmailNotifs(e.target.checked)}
                  />
                  <div>
                    <strong>Weekend Tournament Alerts</strong>
                    <p className="text-xs text-secondary">Receive reminders when new cup brackets open.</p>
                  </div>
                </label>
              </div>
            )}

            {activeTab === 'Privacy' && (
              <div>
                <h2>Data & Privacy Controls</h2>
                <p className="text-secondary text-sm mt-1">KeySprint adheres to child-safe and privacy-by-design standards.</p>
              </div>
            )}

            {activeTab === 'Appearance' && (
              <div>
                <h2>Appearance & Theme</h2>
                <p className="text-secondary text-sm mt-1">KeySprint uses the approved warm cream and arcade orange design system.</p>
              </div>
            )}

            {activeTab === 'Language' && (
              <div>
                <h2>Language & Localization</h2>
                <p className="text-secondary text-sm mt-1">Currently English (US). Additional localization packs planned in V2.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};
