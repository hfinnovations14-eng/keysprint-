import React from 'react';
import { TrendingUp, Users, Smartphone, Monitor, Globe } from 'lucide-react';

export const Admin08Analytics: React.FC = () => {
  return (
    <div className="admin-page-view">
      <div className="admin-page-header mb-4">
        <h2>Analytics & Growth Funnels (SRS FR-D08)</h2>
        <p className="text-secondary text-sm">Conversion telemetry, typing speed distributions, and platform retention curves.</p>
      </div>

      <div className="admin-kpi-grid mb-4">
        <div className="admin-metric-card card">
          <span className="metric-title">Visitor → First Race Conversion</span>
          <div className="admin-metric-val text-green">64.2%</div>
          <span className="text-xs text-secondary">Zero friction guest entry (SRS 10.3)</span>
        </div>

        <div className="admin-metric-card card">
          <span className="metric-title">Guest → Registered Account</span>
          <div className="admin-metric-val text-orange">38.7%</div>
          <span className="text-xs text-secondary">Driven by garage unlocks</span>
        </div>

        <div className="admin-metric-card card">
          <span className="metric-title">Day-1 Retention (D1)</span>
          <div className="admin-metric-val text-blue">48.5%</div>
          <span className="text-xs text-secondary">Day-7 Retention (D7): 29.1%</span>
        </div>

        <div className="admin-metric-card card">
          <span className="metric-title">Median Races / User / Day</span>
          <div className="admin-metric-val text-purple">6.4</div>
          <span className="text-xs text-secondary">Avg 14.8 minutes active play</span>
        </div>
      </div>

      {/* Speed Distribution Curves */}
      <div className="card mb-4">
        <h3 className="mb-3">Global Typing Speed Distribution (WPM)</h3>
        <div className="distribution-bars-container">
          <div className="dist-col">
            <div className="dist-bar" style={{ height: '20%' }}>4%</div>
            <span className="dist-label">&lt;40</span>
          </div>
          <div className="dist-col">
            <div className="dist-bar" style={{ height: '45%' }}>14%</div>
            <span className="dist-label">40-60</span>
          </div>
          <div className="dist-col">
            <div className="dist-bar" style={{ height: '80%' }}>32%</div>
            <span className="dist-label">60-90</span>
          </div>
          <div className="dist-col">
            <div className="dist-bar" style={{ height: '100%' }}>38%</div>
            <span className="dist-label">90-120</span>
          </div>
          <div className="dist-col">
            <div className="dist-bar" style={{ height: '35%' }}>9%</div>
            <span className="dist-label">120-150</span>
          </div>
          <div className="dist-col">
            <div className="dist-bar" style={{ height: '15%' }}>3%</div>
            <span className="dist-label">150+</span>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="admin-split-grid">
        <div className="card card-cream">
          <h4 className="mb-2">Device Viewports (SRS 6.3)</h4>
          <div className="device-stat-row">
            <div className="flex-center gap-2"><Monitor size={16} /> <span>Desktop (&gt;=1200px)</span></div>
            <strong>68%</strong>
          </div>
          <div className="device-stat-row mt-2">
            <div className="flex-center gap-2"><Smartphone size={16} /> <span>Mobile (&lt;768px)</span></div>
            <strong>24%</strong>
          </div>
          <div className="device-stat-row mt-2">
            <div className="flex-center gap-2"><Monitor size={16} /> <span>Tablet (768-1199px)</span></div>
            <strong>8%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
