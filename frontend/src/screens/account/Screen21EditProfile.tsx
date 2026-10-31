import React, { useState, useEffect } from 'react';
import { User, Globe, Shield, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Screen21EditProfileProps {
  onNavigate: (screenId: string) => void;
}

export const Screen21EditProfile: React.FC<Screen21EditProfileProps> = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const [nickname, setNickname] = useState(user?.profile?.nickname || 'AlexPro');
  const [country, setCountry] = useState(user?.profile?.countryCode || 'US');
  const [bio, setBio] = useState(user?.profile?.bio || 'Typing enthusiast and sports car collector. Aiming for 180+ WPM!');
  const [profilePublic, setProfilePublic] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.profile?.avatarId || '🏎️');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setNickname(user.profile.nickname);
      setCountry(user.profile.countryCode || 'US');
      if (user.profile.bio) setBio(user.profile.bio);
      if (user.profile.avatarId) setSelectedAvatar(user.profile.avatarId);
    }
  }, [user]);

  const avatarChoices = ['🏎️', '⚡', '🌸', '🥷', '🚀', '🔥', '💥', '🎯', '👑', '🐱'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        nickname,
        avatarId: selectedAvatar,
        countryCode: country,
        bio
      });
      onNavigate('screen-20'); // Back to profile
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
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
                    disabled={loading}
                  >
                    <span>{av}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group mb-3">
              <label className="input-label">Public Nickname</label>
              <div className="input-icon-wrap">
                <User size={18} className="input-field-icon" />
                <input 
                  type="text" 
                  required 
                  maxLength={16}
                  className="input-field with-icon"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group mb-3">
              <label className="input-label">Country Representation</label>
              <div className="input-icon-wrap">
                <Globe size={18} className="input-field-icon" />
                <select 
                  className="input-field with-icon"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={loading}
                >
                  <option value="US">🇺🇸 United States</option>
                  <option value="PK">🇵🇰 Pakistan</option>
                  <option value="GB">🇬🇧 United Kingdom</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="DE">🇩🇪 Germany</option>
                  <option value="JP">🇯🇵 Japan</option>
                  <option value="BR">🇧🇷 Brazil</option>
                  <option value="IN">🇮🇳 India</option>
                  <option value="AU">🇦🇺 Australia</option>
                </select>
              </div>
            </div>

            <div className="input-group mb-4">
              <label className="input-label">Driver Bio</label>
              <textarea 
                rows={3}
                maxLength={180}
                className="input-field textarea-field"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="checkbox-row mb-4">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={profilePublic} 
                  onChange={(e) => setProfilePublic(e.target.checked)} 
                  disabled={loading}
                />
                <span>Show profile and statistics on public leaderboards</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <span className="flex-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> Saving Changes...
                </span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Driver Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
