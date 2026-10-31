import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, KeyRound } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen06ForgotPasswordProps {
  onNavigate: (screenId: string) => void;
}

export const Screen06ForgotPassword: React.FC<Screen06ForgotPasswordProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="screen-page auth-screen">
      <div className="content-wrapper">
        <div className="auth-card-single card">
          <div className="text-center mb-4">
            <div className="auth-car-mini">
              <SvgCar id="retro" size={120} />
            </div>
            <span className="badge badge-orange">Account Recovery</span>
            <h2 className="mt-2">Forgot Password?</h2>
            <p className="text-secondary text-sm">
              Enter your registered email address and we'll dispatch a secure recovery reset link.
            </p>
          </div>

          {submitted ? (
            <div className="success-feedback-box text-center">
              <CheckCircle size={44} className="text-green mb-2" />
              <h3>Check Your Inbox!</h3>
              <p className="text-secondary text-sm mt-2">
                We sent a password reset token to <strong>{email}</strong>. Follow the instructions to choose a new password.
              </p>
              <div className="mt-4 flex-col gap-2">
                <button 
                  className="btn btn-primary full-width"
                  onClick={() => onNavigate('screen-07')}
                >
                  Enter Reset Token (Screen 07)
                </button>
                <button 
                  className="btn btn-outline full-width mt-2"
                  onClick={() => onNavigate('screen-05')}
                >
                  Back to Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form-fields">
              <div className="input-group">
                <label className="input-label">Registered Email</label>
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

              <button type="submit" className="btn btn-primary btn-lg full-width">
                <span>Send Reset Link</span>
              </button>

              <div className="text-center mt-3">
                <button 
                  type="button" 
                  onClick={() => onNavigate('screen-05')}
                  className="link-inline flex-center gap-1"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
