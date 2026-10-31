import React, { useState } from 'react';
import { User, AlertCircle, Play, Sparkles } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen09GuestEntryProps {
  onNavigate: (screenId: string) => void;
}

export const Screen09GuestEntry: React.FC<Screen09GuestEntryProps> = ({ onNavigate }) => {
  const [guestName, setGuestName] = useState('Guest_' + Math.floor(1000 + Math.random() * 9000));
  const [selectedAvatar, setSelectedAvatar] = useState('🏎️');

  const avatars = ['🏎️', '⚡', '🚀', '🐱', '🦊', '🦁', '🤖', '👑'];

  const handleStartGuest = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('screen-10'); // Jump straight into mode selection!
  };

  return (
    <div className="screen-page auth-screen">
      <div className="content-wrapper">
        <div className="auth-card-single card">
          <div className="text-center mb-4">
            <div className="auth-car-mini">
              <SvgCar id="starter" size={130} />
            </div>
            <span className="badge badge-orange">Quick Play</span>
            <h2 className="mt-2">Play as Guest</h2>
            <p className="text-secondary text-sm">
              Jump straight onto the asphalt with zero sign-up required!
            </p>
          </div>

          {/* Warning / Transient Data notice from SRS */}
          <div className="guest-warning-card card-cream">
            <AlertCircle size={20} className="text-orange flex-shrink-0" />
            <p className="text-xs">
              <strong>Notice:</strong> Guest racing stats, earned coins, and unlocks are stored temporarily 
              in your current browser session. You can convert to a full free account anytime to preserve your records.
            </p>
          </div>

          <form onSubmit={handleStartGuest} className="auth-form-fields mt-4">
            <div className="input-group">
              <label className="input-label">Your Guest Nickname</label>
              <div className="input-icon-wrap">
                <User size={18} className="input-field-icon" />
                <input 
                  type="text" 
                  required 
                  maxLength={15}
                  className="input-field with-icon"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group mt-3">
              <label className="input-label">Pick a Temporary Avatar</label>
              <div className="avatar-picker-row">
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    className={`avatar-choice-btn ${selectedAvatar === av ? 'active' : ''}`}
                    onClick={() => setSelectedAvatar(av)}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg full-width mt-4">
              <Play size={18} fill="#FFFFFF" />
              <span>Launch Race Mode</span>
            </button>

            <div className="auth-footer-link text-center mt-3">
              <span>Want permanent progress? </span>
              <button type="button" onClick={() => onNavigate('screen-04')} className="link-bold">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
