import React, { useState } from 'react';
import { Flag, Filter, Calendar, Trophy, Zap, ChevronRight, ArrowLeft } from 'lucide-react';
import { RECENT_RACES } from '../../data/mockData';

interface Screen23RaceHistoryProps {
  onNavigate: (screenId: string) => void;
}

export const Screen23RaceHistory: React.FC<Screen23RaceHistoryProps> = ({ onNavigate }) => {
  const [filterMode, setFilterMode] = useState('All');

  const detailedRaces = [
    { id: 'r101', track: 'Green Valley', mode: 'Public Quick Race', rank: '1st', wpm: 142, acc: 99, duration: '01:26', date: 'Oct 29, 2026', xp: 50, coins: 30 },
    { id: 'r102', track: 'Desert Rush', mode: 'Private Room #89', rank: '2nd', wpm: 128, acc: 97, duration: '01:34', date: 'Oct 29, 2026', xp: 30, coins: 20 },
    { id: 'r103', track: 'City Night', mode: 'Public Quick Race', rank: '1st', wpm: 135, acc: 98, duration: '01:29', date: 'Oct 29, 2026', xp: 50, coins: 30 },
    { id: 'r104', track: 'Snow Land', mode: 'Bot Match (Normal)', rank: '3rd', wpm: 120, acc: 95, duration: '01:42', date: 'Oct 28, 2026', xp: 20, coins: 10 },
    { id: 'r105', track: 'Green Valley', mode: 'Public Quick Race', rank: '1st', wpm: 140, acc: 99, duration: '01:27', date: 'Oct 28, 2026', xp: 50, coins: 30 },
    { id: 'r106', track: 'Desert Rush', mode: 'Public Quick Race', rank: '2nd', wpm: 131, acc: 97, duration: '01:32', date: 'Oct 27, 2026', xp: 30, coins: 20 },
  ];

  return (
    <div className="screen-page history-screen">
      <div className="content-wrapper">
        <div className="history-card card">
          <div className="section-header-row mb-4">
            <div>
              <span className="badge badge-orange">Logs</span>
              <h2>Race History & Replays</h2>
              <p className="text-secondary text-sm">Full verifiable audit trail of your completed competitive matches.</p>
            </div>

            <div className="history-filter-pills">
              {['All', 'Public', 'Private', 'Bots'].map((f) => (
                <button
                  key={f}
                  className={`tab-btn ${filterMode === f ? 'active' : ''}`}
                  onClick={() => setFilterMode(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="races-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Track Arena</th>
                  <th>Mode</th>
                  <th>Placement</th>
                  <th>Net Speed</th>
                  <th>Accuracy</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {detailedRaces.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.track}</strong></td>
                    <td><span className="badge badge-blue">{r.mode}</span></td>
                    <td>
                      <span className={`rank-tag ${r.rank === '1st' ? 'rank-1' : r.rank === '2nd' ? 'rank-2' : 'rank-3'}`}>
                        {r.rank}
                      </span>
                    </td>
                    <td><strong>{r.wpm}</strong> WPM</td>
                    <td>{r.acc}%</td>
                    <td>{r.duration}</td>
                    <td className="text-secondary text-sm">{r.date}</td>
                    <td>
                      <div className="table-rewards">
                        <span className="badge badge-gold">+{r.xp} XP</span>
                        <span className="badge badge-orange">+{r.coins} 🪙</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};
