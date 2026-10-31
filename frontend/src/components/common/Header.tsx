import React, { useState } from 'react';
import { Trophy, ShoppingBag, Flag, User, Bell, ChevronDown, Sparkles, Shield, Wrench, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentScreenId: string;
  onNavigate: (screenId: string) => void;
  coins?: number;
  level?: number;
  username?: string;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreenId,
  onNavigate,
  coins: propCoins,
  level: propLevel,
  username: propUsername
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayCoins = user?.stats?.coins !== undefined ? user.stats.coins : (propCoins ?? 2500);
  const displayLevel = user?.stats?.level || propLevel || 1;
  const displayUsername = user?.profile?.nickname || propUsername || 'Driver';
  const displayAvatar = user?.profile?.avatarId || '🏎️';

  const navItems = [
    { id: 'screen-01', label: 'Home' },
    { id: 'screen-10', label: 'Play' },
    { id: 'screen-29', label: 'Leaderboard' },
    { id: 'screen-25', label: 'Shop' },
    { id: 'screen-24', label: 'Garage' },
  ];

  const moreItems = [
    { id: 'screen-09', label: 'Guest Mode' },
    { id: 'screen-14', label: 'Solo Practice' },
    { id: 'screen-30', label: 'Friends & Social' },
    { id: 'screen-27', label: 'Achievements' },
    { id: 'screen-22', label: 'Statistics & Analytics' },
    { id: 'screen-32', label: 'Tournaments (V2)' },
    { id: 'screen-02', label: 'How to Play' },
    { id: 'screen-03', label: 'About KeySprint' },
    { id: 'screen-36', label: 'Help & FAQ' },
    { id: 'admin-01', label: '👑 Admin Panel' }
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Logo */}
        <div 
          className="brand-logo" 
          onClick={() => onNavigate('screen-01')}
          role="button"
          tabIndex={0}
        >
          <div className="logo-icon-wrap">
            <span className="logo-spark">⚡</span>
            <span className="logo-car">🏎️</span>
          </div>
          <span className="logo-text">Key<span>Sprint</span></span>
        </div>

        {/* Primary Desktop Nav */}
        <nav className="header-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${currentScreenId === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}

          {/* More Dropdown */}
          <div className="nav-dropdown-wrap">
            <button 
              className="nav-link dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>More</span>
              <ChevronDown size={14} className={`caret ${dropdownOpen ? 'rotate' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {moreItems.map((item) => (
                  <button
                    key={item.id}
                    className="dropdown-item"
                    onClick={() => {
                      onNavigate(item.id);
                      setDropdownOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* User Right Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="auth-profile-bar">
              {/* Virtual Coin Balance */}
              <div 
                className="coin-pill"
                onClick={() => onNavigate('screen-25')}
                title="Your Virtual Coin Balance (Earned by Racing)"
              >
                <span className="coin-icon">🪙</span>
                <span className="coin-amount">{displayCoins.toLocaleString()}</span>
              </div>

              {/* Notification Bell */}
              <button 
                className="icon-action-btn"
                onClick={() => onNavigate('screen-31')}
                title="Notifications"
              >
                <Bell size={18} />
                <span className="notification-dot" />
              </button>

              {/* Player Avatar & Level Pill */}
              <div 
                className="user-pill cursor-pointer"
                onClick={() => onNavigate('screen-19')}
                title="View Dashboard"
              >
                <div className="user-avatar-small">
                  <span>{displayAvatar}</span>
                </div>
                <div className="user-info-text">
                  <span className="user-name">{displayUsername}</span>
                  <span className="user-level-badge">Lv. {displayLevel}</span>
                </div>
              </div>

              {/* Settings Cog */}
              <button 
                className="icon-action-btn"
                onClick={() => onNavigate('screen-35')}
                title="Settings"
              >
                <Wrench size={18} />
              </button>

              {/* Logout button */}
              <button
                className="icon-action-btn hover:text-red-500"
                onClick={() => {
                  logout();
                  onNavigate('screen-01');
                }}
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="guest-actions flex-center gap-2">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => onNavigate('screen-05')}
              >
                Login
              </button>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('screen-04')}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className="mobile-link"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
            <div className="mobile-divider" />
            {moreItems.map((item) => (
              <button
                key={item.id}
                className="mobile-link"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
