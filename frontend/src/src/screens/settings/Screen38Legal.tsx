import React, { useState } from 'react';
import { Shield, FileText, Scale } from 'lucide-react';

interface Screen38LegalProps {
  onNavigate: (screenId: string) => void;
}

export const Screen38Legal: React.FC<Screen38LegalProps> = ({ onNavigate }) => {
  const [tab, setTab] = useState<'Privacy' | 'Terms' | 'Rules'>('Privacy');

  return (
    <div className="screen-page legal-screen">
      <div className="content-wrapper">
        <div className="legal-card card">
          <div className="legal-tabs-header mb-4">
            <div className="tab-list">
              <button 
                className={`tab-btn ${tab === 'Privacy' ? 'active' : ''}`}
                onClick={() => setTab('Privacy')}
              >
                <Shield size={16} />
                <span>Privacy Policy</span>
              </button>
              <button 
                className={`tab-btn ${tab === 'Terms' ? 'active' : ''}`}
                onClick={() => setTab('Terms')}
              >
                <FileText size={16} />
                <span>Terms of Service</span>
              </button>
              <button 
                className={`tab-btn ${tab === 'Rules' ? 'active' : ''}`}
                onClick={() => setTab('Rules')}
              >
                <Scale size={16} />
                <span>Fair Play Rules</span>
              </button>
            </div>
          </div>

          <div className="legal-article-body">
            {tab === 'Privacy' && (
              <div>
                <h2>Privacy Policy (SRS v1.0 Compliant)</h2>
                <p className="text-secondary text-sm mb-4">Last Updated: October 2026</p>

                <h3>1. Information We Collect</h3>
                <p>
                  KeySprint minimizes personal data collection. For registered users, we retain account emails, 
                  selected public nicknames, country designations, and typing telemetry (keystroke cadence used for anti-cheat verification).
                </p>

                <h3 className="mt-4">2. Child Safety & Minor Protection</h3>
                <p>
                  Underage players automatically default to restricted profile visibility. We never sell personal information 
                  or integrate commercial third-party behavioral tracking pixels.
                </p>

                <h3 className="mt-4">3. Data Retention & Deletion</h3>
                <p>
                  Players can request immediate account erasure via Account Settings. All associated personal records will be purged without invalidating anonymized public race result integrity.
                </p>
              </div>
            )}

            {tab === 'Terms' && (
              <div>
                <h2>Terms of Service</h2>
                <p className="text-secondary text-sm mb-4">Last Updated: October 2026</p>

                <h3>1. Virtual Currency & Economy</h3>
                <p>
                  KeySprint coins and vehicle unlocks have strictly zero cash or monetary value. 
                  Virtual credits are earned exclusively through typing gameplay and can never be exchanged, cashed out, or wagered.
                </p>

                <h3 className="mt-4">2. Prohibited Conduct</h3>
                <p>
                  The use of automated scripts, typing macros, simulated keystroke injections, or offensive language 
                  in player nicknames will result in immediate permanent disqualification and account suspension.
                </p>
              </div>
            )}

            {tab === 'Rules' && (
              <div>
                <h2>Fair Play & Competitive Guidelines</h2>
                <p className="text-secondary text-sm mb-4">Rules for All Ranked and Public Races</p>

                <ul className="legal-rules-list">
                  <li><strong>Human Input Only:</strong> All characters must be typed manually on a physical or approved on-screen keyboard.</li>
                  <li><strong>Monotonic Progress:</strong> Forward track progress requires sequential accuracy. Paste attempts are rejected by the engine.</li>
                  <li><strong>No Pay-to-Win:</strong> All cosmetic vehicles, wheels, and trails operate on strictly identical velocity physics.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
