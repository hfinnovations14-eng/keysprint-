import * as React from 'react';
import { useState, useEffect } from 'react';
import { Flag, Filter, Calendar, Trophy, Zap, ChevronRight, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

interface Screen23RaceHistoryProps {
  onNavigate: (screenId: string) => void;
}

interface DbRaceResult {
  id: string;
  mode: string;
  wpm: number;
  accuracy: number;
  durationSec: number;
  place: number;
  xpEarned: number;
  coinsEarned: number;
  createdAt: string;
}

export const Screen23RaceHistory: React.FC<Screen23RaceHistoryProps> = ({ 
  onNavigate 
}: Screen23RaceHistoryProps) => {
  const [filterMode, setFilterMode] = useState<string>('All');
  const [races, setRaces] = useState<DbRaceResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await api.getRaceHistory();
        if (res.races) {
          setRaces(res.races);
        }
      } catch (err) {
        console.error('Failed to load race history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  const formatPlacement = (place: number) => {
    if (place === 1) return '1st';
    if (place === 2) return '2nd';
    if (place === 3) return '3rd';
    return `${place}th`;
  };

  const getRankClass = (place: number) => {
    if (place === 1) return 'rank-1';
    if (place === 2) return 'rank-2';
    if (place === 3) return 'rank-3';
    return 'rank-4';
  };

  const filteredRaces = filterMode === 'All' 
    ? races 
    : races.filter(r => r.mode.toLowerCase().includes(filterMode.toLowerCase()));

  return (
    <div className="screen-page history-screen">
      <div className="content-wrapper">
        <div className="history-card card">
          <div className="section-header-row mb-4">
            <div>
              <span className="badge badge-orange">Driver Audit Logs</span>
              <h2>Race History & Replays</h2>
              <p className="text-secondary text-sm">Full verifiable audit trail of your completed competitive matches from database.</p>
            </div>

            <div className="history-filter-pills">
              {['All', 'Quick', 'Private', 'Bot'].map((f) => (
                <button
                  key={f}
                  className={`tab-btn ${filterMode === f ? 'active' : ''}`}
                  onClick={() => setFilterMode(f)}
                >
                  {f === 'All' ? 'All Races' : `${f} Mode`}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <Loader2 size={36} className="animate-spin text-orange mx-auto mb-2" />
              <p className="text-secondary">Loading telemetry records from database...</p>
            </div>
          ) : filteredRaces.length === 0 ? (
            <div className="card card-cream text-center py-5">
              <Trophy size={48} className="text-orange mx-auto mb-3" />
              <h3>No Matches Recorded Yet</h3>
              <p className="text-secondary max-w-md mx-auto mt-2">
                Join a live matchmaking queue or practice race to establish your verified driver track record!
              </p>
              <button 
                className="btn btn-primary btn-lg mt-4"
                onClick={() => onNavigate('screen-11')}
              >
                Enter Matchmaking Grid
              </button>
            </div>
          ) : (
            <div className="races-table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Match Mode</th>
                    <th>Placement</th>
                    <th>Net Speed</th>
                    <th>Accuracy</th>
                    <th>Duration</th>
                    <th>Date</th>
                    <th>Rewards</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRaces.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className="badge badge-blue">
                          {r.mode.toUpperCase()} RACE
                        </span>
                      </td>
                      <td>
                        <span className={`rank-tag ${getRankClass(r.place)}`}>
                          {formatPlacement(r.place)}
                        </span>
                      </td>
                      <td><strong>{r.wpm}</strong> WPM</td>
                      <td>{r.accuracy}%</td>
                      <td>{formatDuration(r.durationSec)}</td>
                      <td className="text-secondary text-sm">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>
                        <div className="table-rewards">
                          <span className="badge badge-gold">+{r.xpEarned} XP</span>
                          <span className="badge badge-orange">+{r.coinsEarned} 🪙</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
