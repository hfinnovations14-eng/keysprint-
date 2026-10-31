import React, { useState } from 'react';
import { Trophy, CheckCircle, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { useAuth } from '../../context/AuthContext';

interface Screen04SignUpProps {
  onNavigate: (screenId: string) => void;
}

export const Screen04SignUp: React.FC<Screen04SignUpProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await register({
        email,
        password,
        nickname: username,
        countryCode: 'US'
      });
      onNavigate('screen-19'); // Go directly to dashboard!
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try a different email or nickname.');
    } finally {
      setLoading(false);
    }
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

            {errorMessage && (
              <div className="alert alert-danger mb-3 flex-center gap-2 p-3 text-sm rounded bg-red-50 text-red-700 border border-red-200">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form-fields">
              <div className="input-group">
                <label className="input-label">Nickname / Driver Name</label>
                <div className="input-icon-wrap">
                  <User size={18} className="input-field-icon" />
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. TurboTypist" 
                    className="input-field with-icon"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
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
                    disabled={loading}
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
                    placeholder="Create a password (min 6 chars)" 
                    className="input-field with-icon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <p className="auth-terms-note">
                By signing up, you agree to the <button type="button" onClick={() => onNavigate('screen-38')} className="link-inline">Terms of Service</button> and <button type="button" onClick={() => onNavigate('screen-38')} className="link-inline">Privacy Policy</button>.
              </p>

              <button type="submit" className="btn btn-primary btn-lg full-width" disabled={loading}>
                {loading ? (
                  <span className="flex-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Creating Driver Profile...
                  </span>
                ) : (
                  <span>Sign Up & Claim 2,500 Coins</span>
                )}
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
