import * as React from 'react';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Gift, Star, Coins, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DAILY_CHALLENGES } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface Screen28DailyChallengesProps {
  onNavigate: (screenId: string) => void;
  onClaimReward?: (coins: number, xp: number) => void;
}

interface DailyQuestItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  max: number;
  completed: boolean;
  claimed: boolean;
  xpReward: number;
  coinReward: number;
}

export const Screen28DailyChallenges: React.FC<Screen28DailyChallengesProps> = ({ 
  onNavigate,
  onClaimReward 
}: Screen28DailyChallengesProps) => {
  const { user, updateCoins, refreshUser } = useAuth();
  const [challenges, setChallenges] = useState<DailyQuestItem[]>(DAILY_CHALLENGES as DailyQuestItem[]);
  const [resetsIn, setResetsIn] = useState<string>('14h 28m');
  const [loading, setLoading] = useState<boolean>(true);
  const [claimLoading, setClaimLoading] = useState<string | null>(null);
  const [claimError, setClaimError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    setLoading(true);
    setClaimError(null);
    try {
      const data = await api.getDailyChallenges();
      if (data && data.challenges && data.challenges.length > 0) {
        setChallenges(data.challenges);
        if (data.resetsIn) setResetsIn(data.resetsIn);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleClaim = async (id: string, coins: number, xp: number) => {
    setClaimLoading(id);
    setClaimError(null);
    try {
      const res = await api.claimDailyChallenge(id);
      
      // Update UI state
      setChallenges(prev => prev.map(c => c.id === id ? { ...c, claimed: true } : c));

      // Refresh Auth State
      await refreshUser();
      if (res.stats && typeof res.stats.newCoins === 'number') {
        updateCoins(res.stats.newCoins);
      } else {
        const currentCoins = user?.stats?.coins ?? 2500;
        updateCoins(currentCoins + coins);
      }

      if (onClaimReward) onClaimReward(coins, xp);

      // Confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim challenge');
    } finally {
      setClaimLoading(null);
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const claimedCount = challenges.filter(c => c.claimed).length;

  return (
    <div className="screen-page challenges-screen">
      <div className="content-wrapper">
        <div className="challenges-card card">
          {/* Header */}
          <div className="section-header-row mb-4">
            <div>
              <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
                <span className="badge badge-orange">Daily Rotation</span>
                <span className="badge badge-gold">
                  {claimedCount} / {challenges.length} Claimed
                </span>
              </div>
              <h1 className="page-title">Daily Challenges</h1>
              <p className="page-subtitle">Refreshes every 24 hours at 00:00 UTC. Earn quick coins and XP boosts.</p>
            </div>

            <div className="flex-center gap-3">
              <button 
                type="button" 
                className="btn btn-outline btn-sm flex-center gap-1"
                onClick={fetchChallenges}
              >
                <RefreshCw size={14} className={loading ? 'spinner-icon' : ''} />
                <span>Refresh</span>
              </button>

              <div className="time-remaining-pill card-cream">
                <Clock size={16} className="text-orange" />
                <span>Resets in: <strong>{resetsIn}</strong></span>
              </div>
            </div>
          </div>

          {claimError && (
            <div className="alert alert-danger mb-3 flex-center gap-2">
              <AlertCircle size={16} />
              <span>{claimError}</span>
            </div>
          )}

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
                        className="c-progress-bar"
                        style={{ width: `${Math.min(100, (c.progress / c.max) * 100)}%` }}
                      />
                    </div>
                    <span className="c-count-text">
                      <strong>{c.progress}</strong> / {c.max}
                    </span>
                  </div>
                </div>

                <div className="c-action-wrap">
                  {c.claimed ? (
                    <button className="btn btn-secondary btn-sm" disabled>
                      <CheckCircle2 size={16} className="text-green" />
                      <span>Claimed</span>
                    </button>
                  ) : c.completed ? (
                    <button 
                      className="btn btn-primary btn-sm btn-pulse"
                      disabled={claimLoading === c.id}
                      onClick={() => handleClaim(c.id, c.coinReward, c.xpReward)}
                    >
                      <Gift size={16} />
                      <span>{claimLoading === c.id ? 'Claiming...' : 'Claim Reward'}</span>
                    </button>
                  ) : (
                    <button className="btn btn-secondary btn-sm" disabled>
                      <span>In Progress</span>
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
