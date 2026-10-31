import * as React from 'react';
import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Check, X, Eye, Activity, RotateCcw, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const Admin07AntiCheat: React.FC = () => {
  const [flaggedMatches, setFlaggedMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchFlags = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminAntiCheat();
      if (res.logs) {
        setFlaggedMatches(res.logs);
      }
    } catch (err) {
      console.error('Failed to load anti cheat flags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleAction = async (match: any, action: 'ban' | 'pardon') => {
    try {
      if (action === 'ban' && match.userId) {
        await api.updateUserStatus(match.userId, 'suspended');
      }
      setFlaggedMatches(prev => prev.filter(m => m.id !== match.id));
      setFeedback(`Case ${match.id}: Driver ${match.user} has been ${action === 'ban' ? 'Sanctioned & Banned from Leaderboards' : 'Cleared & Verified'}.`);
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to execute moderation action:', err);
    }
  };

  return (
    <div className="admin-page-view">
      <div className="section-header-row mb-4">
        <div>
          <h2>Anti-Cheat & Keystroke Telemetry Review (SRS FR-D06)</h2>
          <p className="text-secondary text-sm">Triage flagged suspicious race scores and burst speeds exceeding competitive thresholds.</p>
        </div>

        <button className="btn btn-outline btn-sm flex-center gap-1" onClick={fetchFlags}>
          <RotateCcw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {feedback && (
        <div className="card card-cream mb-4 flex-center gap-2 text-green">
          <Check size={18} />
          <span className="font-bold text-sm">{feedback}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-5">
          <Loader2 size={36} className="animate-spin text-orange mx-auto mb-2" />
          <p className="text-secondary">Auditing recent keystroke cadence logs...</p>
        </div>
      ) : (
        <div className="flagged-queue-cards-stack">
          {flaggedMatches.map((m) => (
            <div key={m.id} className="flagged-card card card-cream mb-3">
              <div className="flagged-top-row">
                <div className="flex-center gap-2">
                  <ShieldAlert size={20} className="text-red" />
                  <span className="font-mono font-bold">{m.id}</span>
                  <span className="badge badge-orange">{m.status}</span>
                </div>
                <span className="text-secondary text-xs">{m.time}</span>
              </div>

              <div className="flagged-details-grid mt-3">
                <div>
                  <span className="text-secondary text-xs">Flagged Driver</span>
                  <h4>{m.user}</h4>
                </div>
                <div>
                  <span className="text-secondary text-xs">Reported Speed</span>
                  <h4 className="text-red">{m.wpm} WPM</h4>
                </div>
                <div>
                  <span className="text-secondary text-xs">Accuracy</span>
                  <h4>{m.acc}%</h4>
                </div>
              </div>

              <p className="flagged-reason-text mt-3 text-secondary text-sm">
                <strong>Telemetry Finding:</strong> {m.reason}
              </p>

              <div className="flagged-actions-row mt-4">
                <button 
                  className="btn btn-outline btn-sm text-red"
                  onClick={() => handleAction(m, 'ban')}
                >
                  <X size={15} />
                  <span>Confirm Cheat & Sanction Account</span>
                </button>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleAction(m, 'pardon')}
                >
                  <Check size={15} />
                  <span>Pardon & Approve Run</span>
                </button>
              </div>
            </div>
          ))}

          {flaggedMatches.length === 0 && (
            <div className="card text-center py-5">
              <Check size={36} className="text-green mx-auto mb-2" />
              <h3>No Pending Anti-Cheat Flags</h3>
              <p className="text-secondary text-sm">All recent race results meet deterministic human cadence validation.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
