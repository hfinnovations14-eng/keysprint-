import React from 'react';
import { Target, RotateCcw, ArrowRight, Zap, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface Screen34PracticeResultsProps {
  onNavigate: (screenId: string) => void;
  speed?: number;
  accuracy?: number;
  errors?: number;
}

export const Screen34PracticeResults: React.FC<Screen34PracticeResultsProps> = ({
  onNavigate,
  speed = 108,
  accuracy = 97,
  errors = 3
}) => {
  return (
    <div className="screen-page practice-results-screen">
      <div className="content-wrapper">
        <div className="practice-results-card card">
          <div className="text-center mb-4">
            <span className="badge badge-green">Session Completed</span>
            <h1 className="page-title mt-2">Practice Session Summary</h1>
            <p className="text-secondary text-sm">Review your finger cadence and AI-driven coaching suggestions.</p>
          </div>

          {/* Key Metrics */}
          <div className="results-metrics-grid mb-4">
            <div className="result-metric-card card-cream">
              <span className="metric-big-number">{speed} WPM</span>
              <span className="metric-sublabel">Net Speed</span>
            </div>
            <div className="result-metric-card card-cream">
              <span className="metric-big-number text-green">{accuracy}%</span>
              <span className="metric-sublabel">Accuracy</span>
            </div>
            <div className="result-metric-card card-cream">
              <span className="metric-big-number text-orange">{errors}</span>
              <span className="metric-sublabel">Total Errors</span>
            </div>
            <div className="result-metric-card card-cream">
              <span className="metric-big-number text-purple">92%</span>
              <span className="metric-sublabel">Rhythm Cadence</span>
            </div>
          </div>

          {/* Coaching Recommendations */}
          <div className="coach-recommendation-box card card-cream mb-4">
            <div className="coach-header">
              <Sparkles size={20} className="text-orange" />
              <h4>AI Coach Insights</h4>
            </div>
            <ul className="coach-tips-list mt-2">
              <li>
                <strong>P & Q Keys:</strong> You hesitated for 210ms on outer top-row reaches. Focus on relaxing your pinkies.
              </li>
              <li>
                <strong>Smoothness:</strong> Your typing cadence stayed exceptionally consistent during the second half of the paragraph.
              </li>
              <li>
                <strong>Recommended Next Step:</strong> Try the "Difficult-Key Drill: Pinky Stretch" to eliminate remaining hesitation.
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="results-actions-row">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate('screen-14')}
            >
              <RotateCcw size={18} />
              <span>Retry Exercise</span>
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate('screen-10')}
            >
              <span>Back to Race Modes</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
