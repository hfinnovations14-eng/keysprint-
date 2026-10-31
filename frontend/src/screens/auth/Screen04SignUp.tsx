import React, { useState } from 'react';
import { Trophy, CheckCircle, ArrowRight, ShieldCheck, Mail, Lock, User } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen04SignUpProps {
  onNavigate: (screenId: string) => void;
}

export const Screen04SignUp: React.FC<Screen04SignUpProps> = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('screen-08'); // Go to Email Verification
  };

  return (
    <div className="screen-page auth-screen">
      <div className="content-wrapper">
        <div className="auth-card-split card">
          {/* LEFT: Sign Up Form */}
          <div className="auth-form-side">
            <div className="auth-header">
              <span className="badge badge-orange">Join the Grid</span>
              <h2>Create Your Account</h2>
              <p className="auth-subtext">Join thousands of players and start racing!</p>
            </div>

            {/* Social Auth Buttons */}
            <div className="social-auth-group">
              <button 
                type="button" 
                className="social-btn google-btn"
                onClick={() => onNavigate('screen-19')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button 
                type="button" 
                className="social-btn apple-btn"
                onClick={() => onNavigate('screen-19')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.92-2.84-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.73 1 .08 2.03-.49 2.65-1.24z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-fields">
              <div className="input-group">
                <label className="input-label">Username</label>
                <div className="input-icon-wrap">
                  <User size={18} className="input-field-icon" />
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter username" 
                    className="input-field with-icon"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email</label>
                <div className="input-icon-wrap">
                  <Mail size={18} className="input-field-icon" />
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter email" 
                    className="input-field with-icon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-field-icon" />
                  <input 
                    type="password" 
                    required 
                    placeholder="Create a password (min 8 chars)" 
                    className="input-field with-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <p className="auth-terms-note">
                By signing up, you agree to the <button type="button" onClick={() => onNavigate('screen-38')} className="link-inline">Terms of Service</button> and <button type="button" onClick={() => onNavigate('screen-38')} className="link-inline">Privacy Policy</button>.
              </p>

              <button type="submit" className="btn btn-primary btn-lg full-width">
                <span>Sign Up</span>
              </button>

              <div className="auth-footer-link">
                <span>Already have an account? </span>
                <button type="button" onClick={() => onNavigate('screen-05')} className="link-bold">
                  Log In
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Visual Car & Trophy Banner */}
          <div className="auth-visual-side">
            <div className="visual-decor-wrap">
              <div className="golden-trophy-badge">
                <Trophy size={48} className="trophy-gold" />
              </div>

              <div className="auth-car-showcase">
                <SvgCar id="blaze" size={260} animatedNitro={true} />
              </div>

              <div className="auth-perks-list">
                <div className="perk-item">
                  <CheckCircle size={20} className="text-green" />
                  <span>Free to Play Forever</span>
                </div>
                <div className="perk-item">
                  <CheckCircle size={20} className="text-green" />
                  <span>Unlock Cool Cartoon Supercars</span>
                </div>
                <div className="perk-item">
                  <CheckCircle size={20} className="text-green" />
                  <span>Track Your Typing Progress & WPM</span>
                </div>
                <div className="perk-item">
                  <CheckCircle size={20} className="text-green" />
                  <span>Compete Worldwide on Leaderboards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
