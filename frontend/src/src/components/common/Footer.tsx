import React from 'react';
import { Flag, Shield, Heart, Trophy, Globe, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (screenId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="content-wrapper footer-inner">
        <div className="footer-top">
          {/* Col 1: Brand */}
          <div className="footer-col brand-col">
            <div className="brand-logo footer-logo" onClick={() => onNavigate('screen-01')}>
              <div className="logo-icon-wrap">
                <span className="logo-spark">⚡</span>
                <span className="logo-car">🏎️</span>
              </div>
              <span className="logo-text">Key<span>Sprint</span></span>
            </div>
            <p className="footer-desc">
              The premier browser-based multiplayer typing racing platform. Boost your typing speed, 
              challenge friends in real-time rooms, unlock vibrant cartoon supercars, and race to victory!
            </p>
            <div className="footer-badges">
              <span className="footer-chip">🎮 100% Free to Play</span>
              <span className="footer-chip">🛡️ Non-Pay-to-Win</span>
              <span className="footer-chip">🔒 Safe for All Ages</span>
            </div>
          </div>

          {/* Col 2: Game Modes */}
          <div className="footer-col">
            <h4 className="footer-heading">Racing Modes</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('screen-10')}>Quick Multiplayer</button></li>
              <li><button onClick={() => onNavigate('screen-17')}>Private Room with Friends</button></li>
              <li><button onClick={() => onNavigate('screen-15')}>Race with Bots</button></li>
              <li><button onClick={() => onNavigate('screen-14')}>Solo Practice & Drills</button></li>
              <li><button onClick={() => onNavigate('screen-32')}>Tournaments & Cups</button></li>
            </ul>
          </div>

          {/* Col 3: Community & Rewards */}
          <div className="footer-col">
            <h4 className="footer-heading">Garage & Social</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('screen-24')}>Vehicle Garage</button></li>
              <li><button onClick={() => onNavigate('screen-25')}>Coins Cosmetic Shop</button></li>
              <li><button onClick={() => onNavigate('screen-29')}>Global Leaderboards</button></li>
              <li><button onClick={() => onNavigate('screen-27')}>Achievements & Badges</button></li>
              <li><button onClick={() => onNavigate('screen-30')}>Friends Network</button></li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="footer-col">
            <h4 className="footer-heading">Support & Rules</h4>
            <ul className="footer-links">
              <li><button onClick={() => onNavigate('screen-02')}>How to Play</button></li>
              <li><button onClick={() => onNavigate('screen-03')}>About KeySprint</button></li>
              <li><button onClick={() => onNavigate('screen-36')}>Help & FAQ</button></li>
              <li><button onClick={() => onNavigate('screen-37')}>Report an Issue / Cheater</button></li>
              <li><button onClick={() => onNavigate('screen-38')}>Terms & Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('admin-01')} className="admin-link">Staff Admin Portal</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 KeySprint Platform. All rights reserved. Built according to SRS v1.0 specifications.</p>
          <div className="footer-legal-tags">
            <span>Desktop & Mobile Web</span>
            <span>•</span>
            <span>No Real-Money Gambling</span>
            <span>•</span>
            <span>Fair Play Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
