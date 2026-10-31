import React, { useState } from 'react';
import { MailCheck, RotateCcw, ArrowRight } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen08EmailVerificationProps {
  onNavigate: (screenId: string) => void;
}

export const Screen08EmailVerification: React.FC<Screen08EmailVerificationProps> = ({ onNavigate }) => {
  const [code, setCode] = useState(['5', '8', '2', '', '', '']);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('screen-19'); // Verified -> go to user dashboard!
  };

  return (
    <div className="screen-page auth-screen">
      <div className="content-wrapper">
        <div className="auth-card-single card">
          <div className="text-center mb-4">
            <div className="auth-car-mini">
              <SvgCar id="golden" size={130} />
            </div>
            <span className="badge badge-orange">Verification</span>
            <h2 className="mt-2">Verify Your Email</h2>
            <p className="text-secondary text-sm">
              We sent a 6-digit confirmation code to your email. Enter it below to unlock competitive leaderboards.
            </p>
          </div>

          <form onSubmit={handleVerify} className="auth-form-fields">
            <div className="code-inputs-row">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="code-digit-input"
                  value={digit}
                  onChange={(e) => {
                    const newCode = [...code];
                    newCode[idx] = e.target.value;
                    setCode(newCode);
                  }}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-lg full-width mt-4">
              <span>Verify & Enter Dashboard</span>
            </button>

            <div className="resend-control text-center mt-3">
              <span className="text-muted text-sm">Didn't receive the email? </span>
              <button type="button" className="link-inline">
                Resend Code (30s)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
