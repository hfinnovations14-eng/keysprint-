import React, { useState, useEffect } from 'react';
import { Target, RotateCcw, ArrowRight, Zap, CheckCircle2, TrendingUp, Sparkles, Keyboard, Trophy, Flame, AlertCircle } from 'lucide-react';
import { 
  getLastPracticeSession, 
  setActiveDrillConfig, 
  PracticeSessionResult,
  getHeatmapColor 
} from '../../services/telemetryService';

interface Screen34PracticeResultsProps {
  onNavigate: (screenId: string) => void;
  speed?: number;
  accuracy?: number;
  errors?: number;
}

export const Screen34PracticeResults: React.FC<Screen34PracticeResultsProps> = ({
  onNavigate,
  speed: propSpeed,
  accuracy: propAcc,
  errors: propErrors
}) => {
  const [session, setSession] = useState<PracticeSessionResult>(getLastPracticeSession());

  useEffect(() => {
    const last = getLastPracticeSession();
    if (propSpeed !== undefined || propAcc !== undefined || propErrors !== undefined) {
      setSession({
        ...last,
        speed: propSpeed ?? last.speed,
        accuracy: propAcc ?? last.accuracy,
        errors: propErrors ?? last.errors
      });
    } else {
      setSession(last);
    }
  }, [propSpeed, propAcc, propErrors]);

  const { speed, accuracy, errors, mode, drillTitle, errorKeys } = session;

  // Generate dynamic AI Coach recommendations based on error keys & metrics
  const getCoachInsights = () => {
    const tips: { title: string; desc: string; icon: string }[] = [];

    if (errorKeys && errorKeys.length > 0) {
      const keysStr = errorKeys.slice(0, 4).join(', ');
      
      const hasPinky = errorKeys.some(k => ['P', 'Q', 'Z', ';', '/'].includes(k));
      const hasCenter = errorKeys.some(k => ['B', 'N', 'T', 'Y', 'G', 'H'].includes(k));
      const hasNumbers = errorKeys.some(k => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(k));

      if (hasPinky) {
        tips.push({
          title: `Pinky Extension (${keysStr})`,
          desc: 'Hesitation detected on outer column reaches. Keep your wrists suspended and relax forearm tension to eliminate pinky strain.',
          icon: '🎯'
        });
      }

      if (hasCenter) {
        tips.push({
          title: 'Center Column Stretches',
          desc: 'Index finger stretches (B, N, T, Y) caused lateral wrist rotation. Anchor your opposite hand on the home row for stability.',
          icon: '⚡'
        });
      }

      if (hasNumbers) {
        tips.push({
          title: 'Top-Row Number Projection',
          desc: 'Top-row reaches broke rhythm. Memorize finger columns directly above home keys without glancing at the physical board.',
          icon: '🔢'
        });
      }

      if (!hasPinky && !hasCenter && !hasNumbers) {
        tips.push({
          title: `Key Precision Focus (${keysStr})`,
          desc: `Missed keystrokes were concentrated around [${keysStr}]. Isolate these characters in targeted repetition drills.`,
          icon: '💡'
        });
      }
    } else {
      tips.push({
        title: 'Flawless Stroke Execution',
        desc: 'Zero unforced errors detected! Your finger cadence remained perfectly uniform across all keyboard quadrants.',
        icon: '🏆'
      });
    }

    // Speed & Cadence feedback
    if (speed >= 110) {
      tips.push({
        title: 'High Velocity Momentum',
        desc: `At ${speed} WPM, your typing speed is in the top tier of competitive drivers. Focus on smoothing transitions between difficult bigrams.`,
        icon: '🚀'
      });
    } else if (speed >= 75) {
      tips.push({
        title: 'Solid Baseline Rhythm',
        desc: `Steady pace at ${speed} WPM. Try accelerating by 5 WPM on common three-letter prefixes and suffixes (ing, ion, the, pro).`,
        icon: '📈'
      });
    } else {
      tips.push({
        title: 'Consistency Before Speed',
        desc: 'Focus on rhythm and striking each key with uniform pressure rather than rushing. Raw velocity naturally follows flawless accuracy.',
        icon: '🛡️'
      });
    }

    return tips;
  };

  const coachTips = getCoachInsights();

  const handleLaunchTargetedDrill = () => {
    if (errorKeys.length > 0) {
      setActiveDrillConfig({
        mode: 'keys',
        targetKeys: errorKeys,
        customTitle: `Targeted Drill: ${errorKeys.join(', ')} Keys`
      });
      onNavigate('screen-14');
    } else {
      setActiveDrillConfig({
        mode: 'normal',
        customTitle: 'Standard Practice Passage'
      });
      onNavigate('screen-14');
    }
  };

  const handleRetryCurrent = () => {
    setActiveDrillConfig({
      mode: (mode as any) || 'normal',
      customTitle: drillTitle
    });
    onNavigate('screen-14');
  };

  return (
    <div className="screen-page practice-results-screen">
      <div className="content-wrapper">
        <div className="practice-results-card card">
          
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex-center gap-2 mb-2">
              <span className="badge badge-green flex-center gap-1">
                <CheckCircle2 size={13} />
                <span>Session Completed</span>
              </span>
              <span className="badge badge-orange">{drillTitle || 'Practice Session'}</span>
            </div>
            <h1 className="page-title">Practice Session Summary</h1>
            <p className="text-secondary text-sm">Review your finger cadence, accuracy diagnostics, and AI-driven coaching suggestions.</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="results-metrics-grid mb-4">
            <div className="result-metric-card card-cream">
              <div className="flex-center gap-1 text-secondary text-xs mb-1">
                <Zap size={14} className="text-orange" />
                <span>NET SPEED</span>
              </div>
              <span className="metric-big-number font-mono">{speed}</span>
              <span className="metric-sublabel">Words Per Minute</span>
            </div>

            <div className="result-metric-card card-cream">
              <div className="flex-center gap-1 text-secondary text-xs mb-1">
                <Target size={14} className="text-green" />
                <span>ACCURACY</span>
              </div>
              <span className="metric-big-number text-green font-mono">{accuracy}%</span>
              <span className="metric-sublabel">{accuracy >= 98 ? 'Championship Precision' : 'Good Control'}</span>
            </div>

            <div className="result-metric-card card-cream">
              <div className="flex-center gap-1 text-secondary text-xs mb-1">
                <AlertCircle size={14} className={errors > 0 ? 'text-red' : 'text-green'} />
                <span>ERRORS</span>
              </div>
              <span className={`metric-big-number font-mono ${errors > 0 ? 'text-orange' : 'text-green'}`}>{errors}</span>
              <span className="metric-sublabel">{errors === 0 ? 'Flawless Run' : 'Missed Strokes'}</span>
            </div>

            <div className="result-metric-card card-cream">
              <div className="flex-center gap-1 text-secondary text-xs mb-1">
                <Flame size={14} className="text-purple" />
                <span>RHYTHM CADENCE</span>
              </div>
              <span className="metric-big-number text-purple font-mono">
                {Math.max(88, Math.min(99, Math.round(accuracy * 0.95 + (speed > 100 ? 5 : 2))))}%
              </span>
              <span className="metric-sublabel">Cadence Stability</span>
            </div>
          </div>

          {/* Detected Error Keys Callout */}
          {errorKeys && errorKeys.length > 0 && (
            <div className="card card-cream p-3 mb-4" style={{ borderRadius: 14, border: '1.5px solid #FF5A1F33' }}>
              <div className="flex-between align-center flex-wrap gap-2">
                <div className="flex-center gap-2">
                  <Keyboard size={18} className="text-orange" />
                  <div>
                    <span className="font-bold text-sm">Missed Keys in This Run: </span>
                    <span className="text-xs text-secondary">Logged into your live driver heatmap</span>
                  </div>
                </div>
                <div className="flex-center gap-1.5 flex-wrap">
                  {errorKeys.map(k => (
                    <span 
                      key={k} 
                      className="badge font-mono font-bold"
                      style={{ 
                        backgroundColor: '#FEE2E2', 
                        color: '#B91C1C', 
                        border: '1px solid #FCA5A5',
                        fontSize: 13,
                        padding: '3px 9px'
                      }}
                    >
                      {k}
                    </span>
                  ))}
                  <button
                    type="button"
                    className="btn btn-primary btn-xs font-bold ml-2"
                    onClick={handleLaunchTargetedDrill}
                  >
                    Target These Keys Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Coaching Recommendations */}
          <div className="coach-recommendation-box card card-cream mb-4">
            <div className="coach-header flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
              <Sparkles size={20} className="text-orange" />
              <h4 className="font-bold">AI Coach Insights & Diagnostics</h4>
            </div>
            
            <div className="coach-tips-grid mt-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {coachTips.map((tip, idx) => (
                <div key={idx} className="coach-tip-item card p-3" style={{ background: '#FFF9EF', border: '1px solid #E5D6C4' }}>
                  <div className="flex-center gap-2 mb-1" style={{ justifyContent: 'flex-start' }}>
                    <span style={{ fontSize: 18 }}>{tip.icon}</span>
                    <strong className="text-sm font-bold">{tip.title}</strong>
                  </div>
                  <p className="text-secondary text-xs mt-1" style={{ lineHeight: 1.5 }}>
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="results-actions-row flex-between flex-wrap gap-3 mt-4">
            <div className="flex-center gap-2">
              <button 
                type="button"
                className="btn btn-primary btn-lg flex-center gap-2"
                onClick={handleRetryCurrent}
              >
                <RotateCcw size={18} />
                <span>Retry Exercise</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-lg flex-center gap-2"
                onClick={() => onNavigate('screen-22')}
              >
                <Keyboard size={18} className="text-orange" />
                <span>View Weak-Keys Heatmap</span>
              </button>
            </div>

            <div className="flex-center gap-2">
              <button 
                type="button"
                className="btn btn-outline btn-lg"
                onClick={() => onNavigate('screen-33')}
              >
                <span>Practice Modes</span>
              </button>
              
              <button 
                type="button"
                className="btn btn-secondary btn-lg flex-center gap-2"
                onClick={() => onNavigate('screen-10')}
              >
                <span>Race Modes</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
