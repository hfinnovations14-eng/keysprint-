import * as React from 'react';
import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Zap, Target, Calendar, Award, ArrowLeft, Trophy, Keyboard, Sparkles, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  getAllKeyTelemetry, 
  getTopWeakKeys, 
  getHeatmapColor, 
  KeyTelemetry,
  setActiveDrillConfig 
} from '../../services/telemetryService';

interface Screen22StatisticsProps {
  onNavigate: (screenId: string) => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/']
];

export const Screen22Statistics: React.FC<Screen22StatisticsProps> = ({ 
  onNavigate 
}: Screen22StatisticsProps) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [recentRaces, setRecentRaces] = useState<any[]>([]);
  const [telemetryKeys, setTelemetryKeys] = useState<KeyTelemetry[]>([]);
  const [selectedKey, setSelectedKey] = useState<KeyTelemetry | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.getRaceHistory();
        if (res.races) {
          const limit = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 50;
          setRecentRaces(res.races.slice(0, limit).reverse());
        }
      } catch (e) {
        console.error('Failed to load telemetry stats:', e);
      }
    };
    fetchHistory();
  }, [timeRange]);

  useEffect(() => {
    const keys = getAllKeyTelemetry();
    setTelemetryKeys(keys);
    const top = getTopWeakKeys(1);
    if (top.length > 0) setSelectedKey(top[0]);
  }, []);

  const bestSpeed = user?.stats?.verifiedBestWpm || 142;
  const avgSpeed = user?.stats?.avgWpm || 128;
  const accuracy = user?.stats?.accuracy || 98.4;
  const racesCount = user?.stats?.racesCount || 256;
  const winsCount = user?.stats?.winsCount || 34;

  const chartData = recentRaces.length > 0
    ? recentRaces.map((r, i) => ({
        label: `R${i + 1}`,
        wpm: r.wpm,
        acc: r.accuracy
      }))
    : [
        { label: 'Mon', wpm: Math.max(70, avgSpeed - 8), acc: 96 },
        { label: 'Tue', wpm: Math.max(75, avgSpeed - 4), acc: 97 },
        { label: 'Wed', wpm: avgSpeed, acc: 98 },
        { label: 'Thu', wpm: Math.max(80, avgSpeed + 2), acc: 97 },
        { label: 'Fri', wpm: Math.max(82, avgSpeed + 4), acc: 99 },
        { label: 'Sat', wpm: Math.max(85, avgSpeed + 8), acc: 98 },
        { label: 'Sun', wpm: bestSpeed, acc: 99 },
      ];

  const topWeakKeys = getTopWeakKeys(4);
  const keyMap = new Map<string, KeyTelemetry>(telemetryKeys.map(k => [k.key, k]));

  const handleLaunchTargetedDrill = () => {
    const targetCodes = topWeakKeys.map(k => k.key);
    setActiveDrillConfig({
      mode: 'keys',
      targetKeys: targetCodes,
      customTitle: `Targeted Drill: ${targetCodes.join(', ')} Keys`
    });
    onNavigate('screen-14');
  };

  return (
    <div className="screen-page stats-screen">
      <div className="content-wrapper">
        <div className="stats-master-card card">
          {/* Header */}
          <div className="section-header-row mb-4">
            <div>
              <span className="badge badge-orange">Driver Telemetry</span>
              <h2>Statistics & Analytics</h2>
              <p className="text-secondary text-sm">Detailed typing telemetry, consistency ratings, and key accuracy from live database records.</p>
            </div>
            
            <div className="time-filter-pills">
              <button 
                type="button"
                className={`tab-btn ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => setTimeRange('7d')}
              >
                7 Days
              </button>
              <button 
                type="button"
                className={`tab-btn ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => setTimeRange('30d')}
              >
                30 Days
              </button>
              <button 
                type="button"
                className={`tab-btn ${timeRange === 'all' ? 'active' : ''}`}
                onClick={() => setTimeRange('all')}
              >
                All-Time
              </button>
            </div>
          </div>

          {/* Metric KPI cards */}
          <div className="stats-kpis-grid">
            <div className="stat-kpi-card card card-cream">
              <span className="kpi-label">Peak Verified Speed</span>
              <div className="kpi-value text-orange">{bestSpeed} WPM</div>
              <span className="kpi-note">Highest recorded speed</span>
            </div>

            <div className="stat-kpi-card card card-cream">
              <span className="kpi-label">Average Net Speed</span>
              <div className="kpi-value text-blue">{avgSpeed} WPM</div>
              <span className="kpi-note">Across {racesCount} matches</span>
            </div>

            <div className="stat-kpi-card card card-cream">
              <span className="kpi-label">Median Accuracy</span>
              <div className="kpi-value text-green">{accuracy}%</div>
              <span className="kpi-note">High precision cadence</span>
            </div>

            <div className="stat-kpi-card card card-cream">
              <span className="kpi-label">Podium Finishes</span>
              <div className="kpi-value text-purple">{winsCount} Wins</div>
              <span className="kpi-note">{Math.round((winsCount / Math.max(1, racesCount)) * 100)}% Win rate</span>
            </div>
          </div>

          {/* Speed Trend Visual Chart */}
          <div className="chart-container-card card mt-4">
            <div className="chart-header flex-between mb-3">
              <div>
                <h4 className="font-bold">Speed Progression Trend (WPM)</h4>
                <p className="text-xs text-secondary">Verified net typing speed over recent matches</p>
              </div>
              <span className="badge badge-green flex-center gap-1">
                <Activity size={12} />
                <span>Live Telemetry</span>
              </span>
            </div>

            <div className="visual-bar-chart">
              {chartData.map((item, idx) => {
                const maxVal = Math.max(160, bestSpeed + 10);
                const percent = Math.min(100, (item.wpm / maxVal) * 100);

                return (
                  <div key={idx} className="chart-column">
                    <div className="bar-track">
                      <div 
                        className="bar-fill" 
                        style={{ height: `${percent}%` }}
                        title={`${item.wpm} WPM (${item.acc}% Acc)`}
                      >
                        <span className="bar-tooltip">{item.wpm}</span>
                      </div>
                    </div>
                    <span className="column-label">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* REAL QWERTY KEYBOARD HEATMAP MATRIX */}
          <div className="heatmap-master-card card card-cream mt-4">
            <div className="section-header-row mb-3">
              <div>
                <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
                  <span className="badge badge-orange flex-center gap-1">
                    <Keyboard size={12} />
                    <span>QWERTY Precision Matrix</span>
                  </span>
                  <span className="badge badge-green">Click any key to inspect</span>
                </div>
                <h4 className="font-bold">Interactive Keyboard Heatmap</h4>
                <p className="text-secondary text-sm">Visualizing key accuracy, finger reach latency, and error density across the keyboard.</p>
              </div>

              {/* Legend */}
              <div className="heatmap-legend flex-center gap-3">
                <div className="flex-center gap-1 text-xs">
                  <span className="legend-dot" style={{ background: '#10B981' }} />
                  <span>Flawless (&gt;97%)</span>
                </div>
                <div className="flex-center gap-1 text-xs">
                  <span className="legend-dot" style={{ background: '#F59E0B' }} />
                  <span>Caution (93–96%)</span>
                </div>
                <div className="flex-center gap-1 text-xs">
                  <span className="legend-dot" style={{ background: '#EF4444' }} />
                  <span>Weak Key (&lt;90%)</span>
                </div>
              </div>
            </div>

            {/* Visual Keyboard Rows */}
            <div className="virtual-keyboard-board card p-3 mt-3">
              {KEYBOARD_ROWS.map((row, rIdx) => (
                <div key={rIdx} className={`keyboard-visual-row row-${rIdx + 1}`}>
                  {row.map(k => {
                    const stat = keyMap.get(k);
                    const errorRate = stat ? stat.errorRate : 0;
                    const heatColor = getHeatmapColor(errorRate);
                    const isSelected = selectedKey?.key === k;

                    return (
                      <button
                        key={k}
                        type="button"
                        className={`heat-key-btn ${isSelected ? 'selected' : ''}`}
                        style={{
                          borderColor: heatColor,
                          boxShadow: isSelected ? `0 0 0 3px ${heatColor}55` : undefined
                        }}
                        onClick={() => stat && setSelectedKey(stat)}
                      >
                        <span className="heat-key-letter">{k}</span>
                        <span className="heat-key-badge" style={{ backgroundColor: heatColor }}>
                          {100 - errorRate}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Selected Key Inspector Callout */}
            {selectedKey && (
              <div className="selected-key-banner card-cream p-3 mt-3 border-orange flex-between">
                <div className="flex-center gap-3">
                  <div 
                    className="key-letter-large font-mono font-bold"
                    style={{ 
                      fontSize: 28, 
                      width: 52, 
                      height: 52, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: 10,
                      background: '#FFFFFF',
                      border: `2px solid ${getHeatmapColor(selectedKey.errorRate)}`,
                      color: getHeatmapColor(selectedKey.errorRate)
                    }}
                  >
                    {selectedKey.key}
                  </div>
                  <div>
                    <h4 className="font-bold text-base">Key '{selectedKey.key}' Diagnostics</h4>
                    <p className="text-xs text-secondary mt-0.5">
                      Finger: <strong>{selectedKey.hand === 'left' ? 'Left Hand' : 'Right Hand'} {selectedKey.finger}</strong> • {selectedKey.note}
                    </p>
                    <span className="text-xs font-semibold text-orange">
                      Accuracy: {100 - selectedKey.errorRate}% ({selectedKey.errors} typos / {selectedKey.total} keystrokes)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm flex-center gap-1"
                  onClick={handleLaunchTargetedDrill}
                >
                  <Sparkles size={14} />
                  <span>Drill Weak Keys</span>
                </button>
              </div>
            )}
          </div>

          {/* Top Weak Keys Grid */}
          <div className="weak-keys-section card card-cream mt-4">
            <div className="section-header-row mb-3">
              <div>
                <h4 className="font-bold">Top Error-Prone Keys</h4>
                <p className="text-secondary text-sm">Targeted characters prioritized for cadence training.</p>
              </div>
              <button 
                type="button"
                className="btn btn-primary btn-sm flex-center gap-1"
                onClick={handleLaunchTargetedDrill}
              >
                <Sparkles size={14} />
                <span>Launch Targeted Drill</span>
              </button>
            </div>

            <div className="weak-keys-grid">
              {topWeakKeys.map(wk => (
                <div 
                  key={wk.key} 
                  className={`weak-key-card card card-interactive ${selectedKey?.key === wk.key ? 'border-orange' : ''}`}
                  onClick={() => setSelectedKey(wk)}
                >
                  <div 
                    className="key-letter-box font-mono font-bold"
                    style={{ color: getHeatmapColor(wk.errorRate) }}
                  >
                    {wk.key}
                  </div>
                  <div className="key-meta">
                    <strong className="text-orange">{wk.errorRate}% Error Rate</strong>
                    <span className="text-xs text-secondary">{wk.finger} ({wk.hand})</span>
                    <span className="text-xs text-muted mt-1">{wk.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
