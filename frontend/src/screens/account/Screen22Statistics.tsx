import React, { useState } from 'react';
import { BarChart3, TrendingUp, Zap, Target, Calendar, Award, ArrowLeft } from 'lucide-react';

interface Screen22StatisticsProps {
  onNavigate: (screenId: string) => void;
}

export const Screen22Statistics: React.FC<Screen22StatisticsProps> = ({ onNavigate }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

  // Sample speed points for chart
  const speedHistory = [
    { day: 'Mon', wpm: 124, acc: 96 },
    { day: 'Tue', wpm: 130, acc: 97 },
    { day: 'Wed', wpm: 128, acc: 98 },
    { day: 'Thu', wpm: 135, acc: 97 },
    { day: 'Fri', wpm: 132, acc: 99 },
    { day: 'Sat', wpm: 138, acc: 98 },
    { day: 'Sun', wpm: 142, acc: 99 },
  ];

  const weakKeys = [
    { key: 'P', errorRate: '14%', note: 'Right pinky reach' },
    { key: 'Q', errorRate: '12%', note: 'Left pinky reach' },
    { key: 'B', errorRate: '9%', note: 'Left index stretch' },
    { key: ';', errorRate: '8%', note: 'Punctuation cadence' }
  ];

  return (
    <div className="screen-page stats-screen">
      <div className="content-wrapper">
        <div className="stats-master-card card">
          {/* Header */}
          <div className="section-header-row mb-4">
            <div>
              <span className="badge badge-orange">Driver Telemetry</span>
              <h2>Statistics & Analytics</h2>
              <p className="text-secondary text-sm">Detailed typing telemetry, consistency ratings, and key accuracy.</p>
            </div>
            
            <div className="time-filter-pills">
              <button 
                className={`tab-btn ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => setTimeRange('7d')}
              >
                7 Days
              </button>
              <button 
                className={`tab-btn ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => setTimeRange('30d')}
              >
                30 Days
              </button>
              <button 
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
              <div className="kpi-value text-orange">142 WPM</div>
              <span className="kpi-note">+14 WPM vs last week</span>
            </div>

            <div className="stat-kpi-card card card-cream">
              <span className="kpi-label">Average Net Speed</span>
              <div className="kpi-value text-blue">131 WPM</div>
              <span className="kpi-note">Across 256 matches</span>
            </div>

            <div className="stat-kpi-card card card-cream">
              <span className="kpi-label">Median Accuracy</span>
              <div className="kpi-value text-green">98.2%</div>
              <span className="kpi-note">Top 5% precision</span>
            </div>

            <div className="stat-kpi-card card card-cream">
              <span className="kpi-label">Typing Consistency</span>
              <div className="kpi-value text-purple">94%</div>
              <span className="kpi-note">Low keystroke jitter</span>
            </div>
          </div>

          {/* Speed Trend Visual Chart */}
          <div className="chart-container-card card mt-4">
            <div className="chart-header">
              <h4>Speed Progression Trend (WPM)</h4>
              <span className="badge badge-green">Steady Growth</span>
            </div>

            <div className="visual-bar-chart">
              {speedHistory.map((item, idx) => (
                <div key={idx} className="chart-column">
                  <div className="bar-track">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${(item.wpm / 160) * 100}%` }}
                      title={`${item.wpm} WPM (${item.acc}% Acc)`}
                    >
                      <span className="bar-tooltip">{item.wpm}</span>
                    </div>
                  </div>
                  <span className="column-label">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Keys Heatmap Section */}
          <div className="weak-keys-section card card-cream mt-4">
            <div className="section-header-row mb-3">
              <div>
                <h4>Weak Keys Analysis</h4>
                <p className="text-secondary text-sm">Characters where most delays or corrections occurred.</p>
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate('screen-14')}
              >
                Launch Targeted Drill
              </button>
            </div>

            <div className="weak-keys-grid">
              {weakKeys.map(wk => (
                <div key={wk.key} className="weak-key-card card">
                  <div className="key-letter-box">{wk.key}</div>
                  <div className="key-meta">
                    <strong className="text-orange">{wk.errorRate} Error Rate</strong>
                    <span className="text-xs text-secondary">{wk.note}</span>
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
