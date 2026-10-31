import React, { useState } from 'react';
import { CheckCircle2, Edit3, Trophy, Zap, Target, Flag, Flame, Globe } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';
import { useAuth } from '../../context/AuthContext';
import { CARS_DATA } from '../../data/carsData';
import { ACHIEVEMENTS_DATA } from '../../data/mockData';

interface Screen20ProfileProps {
  onNavigate: (screenId: string) => void;
}

export const Screen20Profile: React.FC<Screen20ProfileProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Stats' | 'Cars' | 'Achievements'>('Overview');

  const displayName = user?.profile?.nickname || 'AlexPro';
  const displayAvatar = user?.profile?.avatarId || '🏎️';
  const displayCountry = user?.profile?.countryCode === 'PK' ? '🇵🇰 Pakistan' :
    user?.profile?.countryCode === 'GB' ? '🇬🇧 United Kingdom' :
    user?.profile?.countryCode === 'CA' ? '🇨🇦 Canada' :
    '🇺🇸 United States';
  const displayLevel = user?.stats?.level || 12;
  const displayXp = user?.stats?.xp || 720;
  const nextLevelXp = displayLevel * 1000;
  const xpPercent = Math.min(100, Math.round((displayXp % 1000) / 10));
  const bestSpeed = user?.stats?.verifiedBestWpm || 132;
  const avgSpeed = user?.stats?.avgWpm || 118;
  const accuracy = user?.stats?.accuracy || 98;
  const totalRaces = user?.stats?.racesCount || 256;
  const wins = user?.stats?.winsCount || 84;
  const bio = user?.profile?.bio || 'Typing enthusiast and sports car collector. Aiming for 180+ WPM!';

  // Equipped car
  const equippedCarItem = user?.inventory?.find(i => i.isEquipped);
  const equippedCarId = (equippedCarItem?.itemId as any) || 'blaze';

  return (
    <div className="screen-page profile-screen">
      <div className="content-wrapper">
        
        {/* PLAYER PROFILE BANNER */}
        <div className="profile-banner-card card">
          <div className="profile-banner-inner">
            <div className="profile-avatar-large">
              <span>{displayAvatar}</span>
            </div>
            
            <div className="profile-meta-info">
              <div className="profile-name-row">
                <h2>{displayName}</h2>
                <CheckCircle2 size={20} className="text-blue verified-badge" />
                <span className="country-badge">{displayCountry}</span>
              </div>
              
              <div className="profile-level-row">
                <span className="profile-level-pill">Level {displayLevel}</span>
                <div className="profile-xp-track">
                  <div className="profile-xp-fill" style={{ width: `${xpPercent}%` }} />
                </div>
                <span className="profile-xp-text">{displayXp} / {nextLevelXp} XP</span>
              </div>
            </div>

            <div className="profile-banner-action">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigate('screen-21')}
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* PROFILE SUB-TABS */}
        <div className="profile-tabs-strip mt-4">
          <div className="tab-list">
            {(['Overview', 'Stats', 'Cars', 'Achievements'] as const).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="profile-tab-content mt-4">
            <div className="profile-overview-grid">
              {/* Driver Showcase Car */}
              <div className="card profile-car-card text-center">
                <span className="badge badge-orange mb-2">Equipped Vehicle</span>
                <div className="profile-car-render">
                  <SvgCar id={equippedCarId} size={220} animatedNitro={true} />
                </div>
                <h3 className="mt-2">Blaze Runner</h3>
                <p className="text-secondary text-sm">Tunable Nitro Racing Chassis</p>
                <div className="car-showcase-actions mt-3">
                  <button className="btn btn-secondary btn-sm full-width" onClick={() => onNavigate('screen-24')}>
                    Manage in Garage
                  </button>
                </div>
              </div>

              {/* Bio & Career Highlights */}
              <div className="card profile-highlights-card">
                <h3>Driver Bio</h3>
                <p className="text-secondary mt-2 mb-4">
                  {bio}
                </p>

                <h4 className="mb-2">Career Career Snapshot</h4>
                <div className="career-grid">
                  <div className="career-stat-item">
                    <span className="career-stat-val text-blue">{bestSpeed} WPM</span>
                    <span className="career-stat-lbl">Record Speed</span>
                  </div>
                  <div className="career-stat-item">
                    <span className="career-stat-val text-green">{accuracy}%</span>
                    <span className="career-stat-lbl">Accuracy</span>
                  </div>
                  <div className="career-stat-item">
                    <span className="career-stat-val text-orange">{wins}</span>
                    <span className="career-stat-lbl">Victories</span>
                  </div>
                  <div className="career-stat-item">
                    <span className="career-stat-val text-purple">{totalRaces}</span>
                    <span className="career-stat-lbl">Races Logged</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED STATS */}
        {activeTab === 'Stats' && (
          <div className="profile-tab-content mt-4">
            <div className="card">
              <h3>Speed & Performance Analytics</h3>
              <div className="stats-metric-row mt-3">
                <div className="metric-pill">Average Speed: <strong>{avgSpeed} WPM</strong></div>
                <div className="metric-pill">Top Burst: <strong>{bestSpeed + 15} WPM</strong></div>
                <div className="metric-pill">Win Ratio: <strong>{Math.round((wins / Math.max(1, totalRaces)) * 100)}%</strong></div>
              </div>
              <div className="mt-4">
                <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('screen-22')}>
                  Open Deep Telemetry View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CARS */}
        {activeTab === 'Cars' && (
          <div className="profile-tab-content mt-4">
            <div className="garage-grid-simple">
              {CARS_DATA.map((car) => (
                <div key={car.id} className="car-inventory-card card text-center">
                  <div className="car-thumb-wrap">
                    <SvgCar id={car.id} size={130} />
                  </div>
                  <h4 className="mt-2">{car.name}</h4>
                  <span className={`badge badge-${car.category.toLowerCase()}`}>{car.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === 'Achievements' && (
          <div className="profile-tab-content mt-4">
            <div className="achievements-preview-grid">
              {ACHIEVEMENTS_DATA.map((ach) => (
                <div key={ach.id} className="achievement-card card">
                  <span className="ach-icon">{ach.icon}</span>
                  <div>
                    <h4>{ach.title}</h4>
                    <p className="text-secondary text-xs">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
