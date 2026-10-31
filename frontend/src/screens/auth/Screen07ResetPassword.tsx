import React, { useState } from 'react';
import { Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen07ResetPasswordProps {
  onNavigate: (screenId: string) => void;
}

export const Screen07ResetPassword: React.FC<Screen07ResetPasswordProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <div className="screen-page auth-screen">
      <div className="content-wrapper">
        <div className="auth-card-single card">
          <div className="text-center mb-4">
            <div className="auth-car-mini">
              <SvgCar id="ice" size={120} />
            </div>
            <span className="badge badge-orange">Security</span>
            <h2 className="mt-2">Set New Password</h2>
            <p className="text-secondary text-sm">Please choose a strong password with at least 8 characters.</p>
          </div>

          {done ? (
            <div className="success-feedback-box text-center">
              <CheckCircle size={44} className="text-green mb-2" />
              <h3>Password Updated!</h3>
              <p className="text-secondary text-sm mt-2">
                Your password has been securely reset. You can now log into KeySprint.
              </p>
              <button 
                className="btn btn-primary full-width mt-4"
                onClick={() => onNavigate('screen-05')}
              >
                Continue to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="auth-form-fields">
              <div className="input-group">
                <label className="input-label">New Password</label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-field-icon" />
                  <input 
                    type="password" 
                    required 
                    placeholder="Min 8 characters" 
                    className="input-field with-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Confirm New Password</label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-field-icon" />
                  <input 
                    type="password" 
                    required 
                    placeholder="Repeat new password" 
                    className="input-field with-icon"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="password-strength-box">
                <div className="strength-bar-track">
                  <div className="strength-bar-fill" style={{ width: password.length > 7 ? '100%' : '50%' }} />
                </div>
                <span className="strength-label">{password.length > 7 ? 'Strong Password' : 'Moderate'}</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg full-width">
                <span>Save New Password</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
