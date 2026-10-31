import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Check, X, Eye, Activity } from 'lucide-react';

export const Admin07AntiCheat: React.FC = () => {
  const [flaggedMatches, setFlaggedMatches] = useState([
    {
      id: 'FLG-8401',
      user: 'MacroRacer99',
      wpm: 218,
      acc: 100,
      reason: 'Burst speed exceeded 200 WPM threshold (SRS AT-19); zero keystroke variance.',
      time: '12 mins ago',
      status: 'Pending Review'
    },
    {
      id: 'FLG-8402',
      user: 'GhostKeys_Bot',
      wpm: 205,
      acc: 99,
      reason: 'Inter-keystroke cadence identical to 4 decimal places (synthetic timing).',
      time: '45 mins ago',
      status: 'Pending Review'
    },
    {
      id: 'FLG-8403',
      user: 'TurboTypist_Real',
      wpm: 192,
      acc: 98,
      reason: 'Sudden jump from 90 WPM baseline to 192 WPM in Green Valley.',
      time: '2 hours ago',
      status: 'Under Investigation'
    }
  ]);

  const handleAction = (id: string, action: 'ban' | 'pardon') => {
    setFlaggedMatches(prev => prev.filter(m => m.id !== id));
    alert(`Case ${id}: Player ${action === 'ban' ? 'Sanctioned & Banned from Leaderboard' : 'Cleared & Verified'}.`);
  };

  return (
    <div className="admin-page-view">
      <div className="admin-page-header mb-4">
        <h2>Anti-Cheat & Keystroke Telemetry Review (SRS FR-D06)</h2>
        <p className="text-secondary text-sm">Triage flagged suspicious race scores before results publish to the Global Leaderboard.</p>
      </div>

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
                onClick={() => handleAction(m.id, 'ban')}
              >
                <X size={15} />
                <span>Confirm Cheat & Ban Account</span>
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => handleAction(m.id, 'pardon')}
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
    </div>
  );
};
