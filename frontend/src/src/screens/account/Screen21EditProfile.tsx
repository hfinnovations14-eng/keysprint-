import React, { useState } from 'react';
import { User, Globe, Shield, Save, ArrowLeft, Camera } from 'lucide-react';

interface Screen21EditProfileProps {
  onNavigate: (screenId: string) => void;
}

export const Screen21EditProfile: React.FC<Screen21EditProfileProps> = ({ onNavigate }) => {
  const [nickname, setNickname] = useState('AlexPro');
  const [country, setCountry] = useState('United States');
  const [bio, setBio] = useState('Typing enthusiast and sports car collector. Aiming for 180+ WPM!');
  const [profilePublic, setProfilePublic] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState('🏎️');

  const avatarChoices = ['🏎️', '⚡', '🌸', '🥷', '🚀', '🔥', '💥', '🎯', '👑', '🐱'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('screen-20'); // Back to profile
  };

  return (
    <div className="screen-page edit-profile-screen">
      <div className="content-wrapper">
        <div className="edit-profile-card card">
          <div className="edit-header-row mb-4">
            <div>
              <span className="badge badge-orange">Driver Identity</span>
              <h2>Edit Profile</h2>
              <p className="text-secondary text-sm">Update your public nickname, country, and privacy settings.</p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('screen-20')}
            >
              <ArrowLeft size={16} />
              <span>Back to Profile</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="edit-form-body">
            {/* Avatar Section */}
            <div className="avatar-selection-box card-cream mb-4">
              <label className="input-label mb-2">Choose Driver Avatar</label>
              <div className="avatar-picker-grid">
                {avatarChoices.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`avatar-tile ${selectedAvatar === av ? 'active' : ''}`}
                    onClick={() => setSelectedAvatar(av)}
                  >
                    <span>{av}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group mb-3">
              <label className="input-label">Public Nickname</label>
              <input 
                type="text" 
                required 
                maxLength={20}
                className="input-field"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <span className="text-xs text-secondary">Visible on leaderboards and in-race lanes.</span>
            </div>

            <div className="input-group mb-3">
              <label className="input-label">Country Representation</label>
              <select 
                className="input-field"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="United States">🇺🇸 United States</option>
                <option value="Canada">🇨🇦 Canada</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="Japan">🇯🇵 Japan</option>
                <option value="Australia">🇦🇺 Australia</option>
                <option value="France">🇫🇷 France</option>
              </select>
            </div>

            <div className="input-group mb-3">
              <label className="input-label">Short Bio</label>
              <textarea 
                rows={3}
                className="input-field"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Privacy Toggles */}
            <div className="privacy-settings-box card-cream mb-4">
              <label className="toggle-row">
                <input 
                  type="checkbox"
                  checked={profilePublic}
                  onChange={(e) => setProfilePublic(e.target.checked)}
                />
                <div>
                  <strong>Public Profile & Statistics</strong>
                  <p className="text-xs text-secondary">Allow other racers to view your speed badges and garage collection.</p>
                </div>
              </label>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
