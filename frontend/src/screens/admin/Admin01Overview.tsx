import React from 'react';
import { Users, Flag, Clock, CheckCircle, AlertTriangle, Activity, ArrowUpRight } from 'lucide-react';

export const Admin01Overview: React.FC = () => {
  return (
    <div className="admin-page-view">
      <div className="admin-page-header mb-4">
        <h2>Operations Overview Dashboard</h2>
        <p className="text-secondary text-sm">Real-time health, server-authoritative socket concurrency, and telemetry.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="admin-kpi-grid mb-4">
        <div className="admin-metric-card card">
          <div className="admin-metric-top">
            <span className="metric-title">Active Daily Drivers (DAU)</span>
            <Users size={18} className="text-orange" />
          </div>
          <div className="admin-metric-val">18,492</div>
          <div className="admin-metric-change positive flex-center gap-1">
            <ArrowUpRight size={14} /> +12.4% vs yesterday
          </div>
        </div>

        <div className="admin-metric-card card">
          <div className="admin-metric-top">
            <span className="metric-title">Live Race Rooms</span>
            <Flag size={18} className="text-blue" />
          </div>
          <div className="admin-metric-val">412</div>
          <div className="admin-metric-sub text-secondary text-xs">88% Public • 12% Private</div>
        </div>

        <div className="admin-metric-card card">
          <div className="admin-metric-top">
            <span className="metric-title">Avg. Queue Match Time</span>
            <Clock size={18} className="text-green" />
          </div>
          <div className="admin-metric-val">4.2s</div>
          <div className="admin-metric-sub text-green text-xs">Well under 8s target (SRS FR-R01)</div>
        </div>

        <div className="admin-metric-card card">
          <div className="admin-metric-top">
            <span className="metric-title">Race Completion Rate</span>
            <CheckCircle size={18} className="text-gold" />
          </div>
          <div className="admin-metric-val">96.8%</div>
          <div className="admin-metric-sub text-secondary text-xs">3.2% Disconnect / Abandon</div>
        </div>
      </div>

      {/* Live System Activity Table & Queue Health */}
      <div className="admin-split-grid">
        <div className="card">
          <h3 className="mb-3">Regional Gateway Latency (SRS NFR-03)</h3>
          <div className="gateway-table-wrap">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Concurrent Racers</th>
                  <th>Socket p95 Latency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>US-East (N. Virginia)</strong></td>
                  <td>6,840</td>
                  <td className="text-green font-bold">24 ms</td>
                  <td><span className="badge badge-green">Healthy</span></td>
                </tr>
                <tr>
                  <td><strong>EU-Central (Frankfurt)</strong></td>
                  <td>5,120</td>
                  <td className="text-green font-bold">31 ms</td>
                  <td><span className="badge badge-green">Healthy</span></td>
                </tr>
                <tr>
                  <td><strong>AP-Northeast (Tokyo)</strong></td>
                  <td>4,210</td>
                  <td className="text-green font-bold">42 ms</td>
                  <td><span className="badge badge-green">Healthy</span></td>
                </tr>
                <tr>
                  <td><strong>SA-East (São Paulo)</strong></td>
                  <td>2,322</td>
                  <td className="text-green font-bold">58 ms</td>
                  <td><span className="badge badge-green">Healthy</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card-cream">
          <h3 className="mb-2">Operational Alerts & Flags</h3>
          <div className="alert-items-list mt-3">
            <div className="admin-alert-row card mb-2">
              <span className="alert-dot orange" />
              <div>
                <strong>3 Suspicious Speed Bursts Quarantined</strong>
                <p className="text-xs text-secondary">Anti-cheat triggered on burst speeds exceeding 200 WPM.</p>
              </div>
            </div>
            <div className="admin-alert-row card">
              <span className="alert-dot green" />
              <div>
                <strong>Automated Daily Backups Completed</strong>
                <p className="text-xs text-secondary">PostgreSQL point-in-time snapshot archived (SRS NFR-10).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
