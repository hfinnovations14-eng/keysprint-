import React, { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { useAuth } from '../../context/AuthContext';

interface Screen05LoginProps {
  onNavigate: (screenId: string) => void;
}

export const Screen05Login: React.FC<Screen05LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await login(email, password);
      onNavigate('screen-19'); // Go to Dashboard on success!
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@keysprint.io');
    setPassword('admin123');
    setErrorMessage(null);
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

          {/* Demo Admin Quick Pill */}
          <div className="card-cream p-2 mb-3 flex-center justify-between text-xs rounded-lg">
            <span className="text-secondary">Demo Admin Account:</span>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="badge badge-orange cursor-pointer hover:opacity-80 flex-center gap-1 border-0"
              title="Click to auto-fill admin@keysprint.io"
            >
              <Sparkles size={12} /> Auto-fill Admin
            </button>
          </div>

          {errorMessage && (
            <div className="alert alert-danger mb-3 flex-center gap-2 p-3 text-sm rounded bg-red-50 text-red-700 border border-red-200">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  disabled={loading}
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg full-width" disabled={loading}>
              {loading ? (
                <span className="flex-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> Signing In...
                </span>
              ) : (
                <span>Sign In to Track</span>
              )}
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
