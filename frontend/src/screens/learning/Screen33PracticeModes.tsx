import React, { useState } from 'react';
import { Keyboard, Clock, Hash, AlertCircle, Play, ChevronRight, Sparkles, BookOpen, ArrowLeft } from 'lucide-react';
import { setActiveDrillConfig, getTopWeakKeys } from '../../services/telemetryService';

interface Screen33PracticeModesProps {
  onNavigate: (screenId: string) => void;
}

export const Screen33PracticeModes: React.FC<Screen33PracticeModesProps> = ({ onNavigate }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const topWeakKeys = getTopWeakKeys(3);
  const weakKeysLabel = topWeakKeys.map(k => k.key).join(', ') || 'P, Q, B';

  const handleLaunchDrill = (mode: 'normal' | 'timed' | 'numbers' | 'keys') => {
    if (mode === 'timed') {
      setActiveDrillConfig({
        mode: 'timed',
        durationSec: selectedDuration,
        customTitle: `${selectedDuration}s Timed Speed Sprint`
      });
    } else if (mode === 'keys') {
      setActiveDrillConfig({
        mode: 'keys',
        targetKeys: topWeakKeys.map(k => k.key),
        customTitle: `Targeted Drill: ${weakKeysLabel} Keys`
      });
    } else if (mode === 'numbers') {
      setActiveDrillConfig({
        mode: 'numbers',
        customTitle: 'Numbers & Symbols Reach Drill'
      });
    } else {
      setActiveDrillConfig({
        mode: 'normal',
        customTitle: 'Standard Practice Passage'
      });
    }

    onNavigate('screen-14');
  };

  const drills = [
    { 
      id: 'passage', 
      mode: 'normal' as const,
      title: 'Curated Passages', 
      icon: '📖', 
      desc: 'Engaging motorsport stories, literature, and general touch typing quotes.',
      tag: 'All Levels'
    },
    { 
      id: 'timed', 
      mode: 'timed' as const,
      title: 'Timed Sprint Tests', 
      icon: '⏱️', 
      desc: `Benchmark raw speed in a fixed ${selectedDuration}s window with continuous text flow.`,
      tag: `${selectedDuration}s Window`
    },
    { 
      id: 'numbers', 
      mode: 'numbers' as const,
      title: 'Numbers & Symbols', 
      icon: '🔢', 
      desc: 'Sharpen top-row numerical keys, punctuation, percentages, and financial notation.',
      tag: 'Precision'
    },
    { 
      id: 'weak', 
      mode: 'keys' as const,
      title: 'Difficult-Key Drills', 
      icon: '🎯', 
      desc: `Custom passages tailored specifically for your weakest keys: ${weakKeysLabel}.`,
      tag: `Target: ${weakKeysLabel}`
    }
  ];

  return (
    <div className="screen-page practice-modes-screen">
      <div className="content-wrapper">
        <div className="practice-selector-card card">
          <div className="flex-between mb-3">
            <button 
              type="button" 
              className="btn btn-outline btn-sm flex-center gap-1"
              onClick={() => onNavigate('screen-10')}
            >
              <ArrowLeft size={14} />
              <span>Back to Modes</span>
            </button>
            <span className="badge badge-orange">Training Academy</span>
          </div>

          <div className="page-header-block text-center">
            <h1 className="page-title">Practice Mode Selection</h1>
            <p className="page-subtitle">Zero pressure, no ranked ranking loss, pure skill and rhythm conditioning.</p>
          </div>

          <div className="drills-selection-grid mt-4">
            {drills.map((d) => (
              <div 
                key={d.id} 
                className="drill-card card card-interactive"
                onClick={() => handleLaunchDrill(d.mode)}
              >
                <div className="drill-icon">{d.icon}</div>
                <div className="flex-between align-center mt-2">
                  <h3 className="font-bold">{d.title}</h3>
                  <span className="badge badge-secondary text-xs">{d.tag}</span>
                </div>
                <p className="text-secondary text-sm mt-1">{d.desc}</p>
                <div className="drill-bottom mt-4 flex-between">
                  <span className="badge badge-orange flex-center gap-1">
                    <Play size={12} fill="#FF5A1F" />
                    <span>Start Practice</span>
                  </span>
                  <ChevronRight size={16} className="text-orange" />
                </div>
              </div>
            ))}
          </div>

          {/* Timed Presets */}
          <div className="timed-presets-card card-cream mt-5 p-4" style={{ borderRadius: 16 }}>
            <div className="flex-between flex-wrap gap-2">
              <div>
                <h4 className="font-bold flex-center gap-2">
                  <Clock size={18} className="text-orange" />
                  <span>Timed Test Duration Window</span>
                </h4>
                <p className="text-xs text-secondary mt-0.5">
                  Select your test duration. When you launch a Timed Sprint, the countdown begins on first keystroke.
                </p>
              </div>

              <div className="timed-buttons-row flex-center gap-2">
                {[15, 30, 60, 120].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    className={`btn ${selectedDuration === sec ? 'btn-primary' : 'btn-secondary'} btn-sm font-bold`}
                    onClick={() => setSelectedDuration(sec)}
                  >
                    {sec}s Sprint
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
