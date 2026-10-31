import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen05LoginProps {
  onNavigate: (screenId: string) => void;
}

export const Screen05Login: React.FC<Screen05LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('screen-19'); // Go to Dashboard
  };

  return (
    <div className="screen-page auth-screen">
      <div className="content-wrapper">
        <div className="auth-card-single card">
          <div className="text-center mb-4">
            <div className="auth-car-mini">
              <SvgCar id="starter" size={130} />
            </div>
            <span className="badge badge-orange">Driver Login</span>
            <h2 className="mt-2">Welcome Back, Racer!</h2>
            <p className="text-secondary text-sm">Enter your credentials to load your garage and stats.</p>
          </div>

          {/* Social Auth */}
          <div className="social-auth-group mb-4">
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
          </div>

          <div className="auth-divider">
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleLogin} className="auth-form-fields">
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-field-icon" />
                <input 
                  type="email" 
                  required 
                  placeholder="name@example.com" 
                  className="input-field with-icon"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="label-with-action">
                <label className="input-label">Password</label>
                <button 
                  type="button" 
                  onClick={() => onNavigate('screen-06')} 
                  className="link-forgot"
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-field-icon" />
                <input 
                  type="password" 
                  required 
                  placeholder="Enter your password" 
                  className="input-field with-icon"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg full-width">
              <span>Sign In to Track</span>
            </button>

            <div className="auth-footer-link text-center mt-3">
              <span>New driver? </span>
              <button type="button" onClick={() => onNavigate('screen-04')} className="link-bold">
                Create Free Account
              </button>
            </div>

            <div className="guest-fallback-box mt-3 text-center">
              <span>Just want a quick test? </span>
              <button type="button" onClick={() => onNavigate('screen-09')} className="link-inline">
                Play as Guest (Instant)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
