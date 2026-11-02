import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Coins, ChevronRight, Shield, Award, Sparkles, AlertCircle, CheckCircle2, RefreshCw, X, Play, Users } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useRace } from '../../context/RaceContext';

interface Screen32TournamentsProps {
  onNavigate: (screenId: string) => void;
}

interface TournamentItem {
  id: string;
  title: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
  startTime: string;
  endTime: string;
  entryFeeCoins: number;
  minLevel: number;
  prizePoolCoins: number;
  trackId: string;
  rules: string;
  participantCount: number;
  isRegistered: boolean;
  userStats?: {
    bestWpm: number;
    bestAccuracy: number;
    points: number;
    racesPlayed: number;
  } | null;
}

interface StandingItem {
  rank: number;
  userId: string;
  nickname: string;
  avatar: string;
  points: number;
  bestWpm: number;
  bestAccuracy: number;
  racesPlayed: number;
  isYou: boolean;
}

export const Screen32Tournaments: React.FC<Screen32TournamentsProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const { startBotRace } = useRace();

  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  // Standings modal state
  const [standingsModalOpen, setStandingsModalOpen] = useState(false);
  const [activeTournamentForStandings, setActiveTournamentForStandings] = useState<TournamentItem | null>(null);
  const [standings, setStandings] = useState<StandingItem[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(false);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTournaments();
      if (res.tournaments) {
        setTournaments(res.tournaments);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleRegister = async (t: TournamentItem) => {
    setRegisteringId(t.id);
    setError(null);
    setFeedback(null);

    try {
      await api.registerTournament(t.id);
      setFeedback(`Successfully registered for "${t.title}"! Entry fee deducted.`);
      await refreshUser();
      await fetchTournaments();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleOpenStandings = async (t: TournamentItem) => {
    setActiveTournamentForStandings(t);
    setStandingsModalOpen(true);
    setStandingsLoading(true);
    try {
      const res = await api.getTournamentStandings(t.id);
      if (res.standings) {
        setStandings(res.standings);
      }
    } catch (err: any) {
      console.error('Failed to load standings:', err);
    } finally {
      setStandingsLoading(false);
    }
  };

  const handleStartTournamentRace = async (t: TournamentItem) => {
    // Launch competitive race calibrated for this tournament track
    try {
      await startBotRace('normal');
      onNavigate('screen-13');
    } catch {
      onNavigate('screen-10');
    }
  };

  const formatCountdown = (isoDate: string, status: string) => {
    const diff = new Date(isoDate).getTime() - Date.now();
    if (diff <= 0) {
      return status === 'active' ? 'Ends soon' : 'Ended';
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const getCarForIdx = (idx: number): CarModelId => {
    const cars: CarModelId[] = ['blaze', 'starter', 'golden', 'retro', 'jeep', 'shadow'];
    return cars[idx % cars.length];
  };

  return (
    <div className="screen-page tournaments-screen">
      <div className="content-wrapper">
        
        {/* HEADER */}
        <div className="tournaments-header-row mb-4">
          <div>
            <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
              <span className="badge badge-gold">Special Events</span>
              <span className="badge badge-purple">SRS V2 Scope Expansion</span>
            </div>
            <h1 className="page-title">Competitive Tournaments</h1>
            <p className="page-subtitle">
              Compete in official sprint brackets, win exclusive coin prize pools, and climb the championship ladder!
            </p>
          </div>

          <div className="flex-center gap-2">
            <button 
              type="button" 
              className="btn btn-outline btn-sm flex-center gap-1"
              onClick={fetchTournaments}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'spinner-icon' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK & ERROR BANNERS */}
        {feedback && (
          <div className="alert alert-success mb-3 flex-center gap-2">
            <CheckCircle2 size={16} />
            <span>{feedback}</span>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mb-3 flex-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && tournaments.length === 0 && (
          <div className="card-cream p-5 text-center">
            <RefreshCw size={28} className="spinner-icon mx-auto text-orange mb-2" />
            <p className="text-secondary font-medium">Loading championship brackets...</p>
          </div>
        )}

        {/* TOURNAMENT CARDS GRID */}
        {!loading && tournaments.length === 0 && !error && (
          <div className="card-cream p-5 text-center">
            <Trophy size={36} className="text-muted mx-auto mb-2" />
            <h3>No Active Tournaments</h3>
            <p className="text-secondary text-sm">Check back soon for the next weekend sprint event.</p>
          </div>
        )}

        <div className="tournaments-cards-grid">
          {tournaments.map((t, idx) => {
            const isCompleted = t.status === 'completed';
            const isActive = t.status === 'active';
            const isUpcoming = t.status === 'upcoming';
            const carId = getCarForIdx(idx);

            return (
              <div key={t.id} className={`tournament-card card ${t.isRegistered ? 'border-orange' : ''}`}>
                <div className="t-card-top">
                  <div className={`t-icon-box ${isActive ? 'orange' : isUpcoming ? 'blue' : 'gold'}`}>
                    <Trophy size={24} className={isActive ? 'text-orange' : isUpcoming ? 'text-blue' : 'text-gold'} />
                  </div>
                  <div className="t-title-wrap">
                    <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
                      <span className={`badge ${isActive ? 'badge-green' : isUpcoming ? 'badge-blue' : 'badge-gold'}`}>
                        {isActive ? 'Live' : isUpcoming ? 'Upcoming' : 'Completed'}
                      </span>
                      <span className="badge badge-outline text-xs">
                        Min Lvl {t.minLevel}
                      </span>
                    </div>
                    <h3>{t.title}</h3>
                    <div className="t-countdown-line">
                      <Clock size={13} className="text-secondary" />
                      <span>
                        {isActive ? 'Ends in ' : isUpcoming ? 'Starts in ' : 'Status: '}
                        <strong>{formatCountdown(isActive ? t.endTime : t.startTime, t.status)}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="t-car-display">
                  <SvgCar id={carId} size={150} />
                </div>

                <div className="p-3 text-xs text-secondary">
                  <p>{t.description}</p>
                  <div className="flex-between mt-2 pt-2 border-t border-cream">
                    <span>👥 {t.participantCount} Drivers Registered</span>
                    <span>📍 Track: <strong>{t.trackId}</strong></span>
                  </div>
                </div>

                <div className="t-card-bottom card-cream">
                  <div className="t-prize-wrap">
                    <span className="t-prize-label">Prize Pool</span>
                    <span className="t-prize-amount font-bold">🪙 {t.prizePoolCoins.toLocaleString()} Coins</span>
                  </div>

                  <div className="flex-center gap-2">
                    <button 
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={() => handleOpenStandings(t)}
                    >
                      Standings
                    </button>

                    {isCompleted ? (
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenStandings(t)}
                      >
                        Results
                      </button>
                    ) : t.isRegistered ? (
                      isActive ? (
                        <button 
                          type="button" 
                          className="btn btn-primary btn-sm flex-center gap-1"
                          onClick={() => handleStartTournamentRace(t)}
                        >
                          <Play size={14} fill="#FFFFFF" />
                          <span>Race Heat</span>
                        </button>
                      ) : (
                        <button type="button" className="btn btn-secondary btn-sm" disabled>
                          Registered ✓
                        </button>
                      )
                    ) : (
                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        disabled={registeringId === t.id}
                        onClick={() => handleRegister(t)}
                      >
                        {registeringId === t.id
                          ? 'Joining...'
                          : t.entryFeeCoins > 0
                          ? `Register (🪙 ${t.entryFeeCoins})`
                          : 'Free Entry'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ROADMAP ARCHITECTURE NOTICE */}
        <div className="v2-roadmap-banner card card-cream mt-5">
          <Shield size={24} className="text-purple flex-shrink-0" />
          <div className="v2-text">
            <strong>SRS Phase V2 Feature: Seasonal Brackets & Tournaments (Integrated)</strong>
            <p className="text-xs text-secondary mt-1">
              Backend persistence, atomic coin entry deductions, eligibility validation, and isolated championship standings are fully operational in this release.
            </p>
          </div>
        </div>

        {/* STANDINGS MODAL */}
        {standingsModalOpen && activeTournamentForStandings && (
          <div className="modal-backdrop flex-center">
            <div className="modal-card card" style={{ maxWidth: 600, width: '92%' }}>
              <div className="modal-header-row flex-between pb-3 border-b border-cream">
                <div>
                  <span className="badge badge-gold">Tournament Standings</span>
                  <h2 className="text-xl font-bold mt-1">{activeTournamentForStandings.title}</h2>
                  <p className="text-xs text-secondary mt-0.5">{activeTournamentForStandings.rules}</p>
                </div>
                <button 
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setStandingsModalOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="modal-body py-3" style={{ maxHeight: 380, overflowY: 'auto' }}>
                {standingsLoading ? (
                  <div className="text-center py-4">
                    <RefreshCw size={24} className="spinner-icon mx-auto text-orange" />
                    <p className="text-xs text-secondary mt-2">Loading championship rankings...</p>
                  </div>
                ) : standings.length === 0 ? (
                  <div className="text-center py-4 text-secondary">
                    <p>No racers have recorded race heats in this tournament yet.</p>
                  </div>
                ) : (
                  <div className="standings-table">
                    {standings.map((s) => (
                      <div 
                        key={s.userId} 
                        className={`standing-row flex-between py-2 px-3 mb-1 rounded ${s.isYou ? 'bg-orange/15 font-bold border border-orange' : 'bg-cream'}`}
                      >
                        <div className="flex-center gap-2">
                          <span className="standing-rank text-sm font-black" style={{ width: 24 }}>
                            {s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : `#${s.rank}`}
                          </span>
                          <span className="standing-avatar">{s.avatar}</span>
                          <span className="standing-name text-sm">{s.nickname} {s.isYou && '(You)'}</span>
                        </div>

                        <div className="flex-center gap-3 text-xs">
                          <span className="text-secondary">{s.bestWpm} WPM</span>
                          <span className="text-secondary">{s.bestAccuracy}% Acc</span>
                          <span className="badge badge-orange font-bold font-mono">{s.points} PTS</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer pt-3 border-t border-cream flex-between">
                <span className="text-xs text-secondary">
                  Prize Pool: 🪙 {activeTournamentForStandings.prizePoolCoins.toLocaleString()} Coins
                </span>
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setStandingsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
