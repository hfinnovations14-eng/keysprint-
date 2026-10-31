import React, { useState } from 'react';
import { Clock, CheckCircle2, Gift, Star, Coins, Zap } from 'lucide-react';
import { DAILY_CHALLENGES } from '../../data/mockData';

interface Screen28DailyChallengesProps {
  onNavigate: (screenId: string) => void;
  onClaimReward?: (coins: number, xp: number) => void;
}

export const Screen28DailyChallenges: React.FC<Screen28DailyChallengesProps> = ({ 
  onNavigate,
  onClaimReward 
}) => {
  const [challenges, setChallenges] = useState(DAILY_CHALLENGES);

  const handleClaim = (id: string, coins: number, xp: number) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, claimed: true } : c));
    if (onClaimReward) onClaimReward(coins, xp);
  };

  return (
    <div className="screen-page challenges-screen">
      <div className="content-wrapper">
        <div className="challenges-card card">
          {/* Header */}
          <div className="section-header-row mb-4">
            <div>
              <span className="badge badge-orange">Daily Rotation</span>
              <h1 className="page-title">Daily Challenges</h1>
              <p className="page-subtitle">Refreshes every 24 hours at 00:00 UTC. Earn quick coins and XP boosts.</p>
            </div>

            <div className="time-remaining-pill card-cream">
              <Clock size={16} className="text-orange" />
              <span>Resets in: <strong>14h 28m</strong></span>
            </div>
          </div>

          {/* Daily Quests List */}
          <div className="challenges-list-stack">
            {challenges.map((c) => (
              <div key={c.id} className="challenge-item-card card card-cream">
                <div className="c-icon-wrap">
                  <span className="c-icon">🎯</span>
                </div>

                <div className="c-details-wrap">
                  <div className="c-title-row">
                    <h3>{c.title}</h3>
                    <div className="c-rewards-strip">
                      <span className="badge badge-gold">⭐ +{c.xpReward} XP</span>
                      <span className="badge badge-orange">🪙 +{c.coinReward} Coins</span>
                    </div>
                  </div>
                  
                  <p className="c-desc text-secondary text-sm">{c.description}</p>

                  <div className="c-progress-row mt-2">
                    <div className="c-progress-track">
                      <div 
                        className="c-progress-fill" 
                        style={{ width: `${(c.progress / c.max) * 100}%` }}
                      />
                    </div>
                    <span className="c-progress-text">{c.progress} / {c.max}</span>
                  </div>
                </div>

                <div className="c-action-wrap">
                  {c.claimed ? (
                    <span className="badge badge-secondary flex-center gap-1">
                      <CheckCircle2 size={14} className="text-green" /> Claimed
                    </span>
                  ) : c.completed ? (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleClaim(c.id, c.coinReward, c.xpReward)}
                    >
                      <Gift size={15} />
                      <span>Claim</span>
                    </button>
                  ) : (
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => onNavigate('screen-10')}
                    >
                      Race Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
