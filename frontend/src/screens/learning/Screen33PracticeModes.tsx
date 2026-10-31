import React, { useState } from 'react';
import { Keyboard, Clock, Hash, AlertCircle, Play, ChevronRight } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen33PracticeModesProps {
  onNavigate: (screenId: string) => void;
}

export const Screen33PracticeModes: React.FC<Screen33PracticeModesProps> = ({ onNavigate }) => {
  const [selectedDuration, setSelectedDuration] = useState('60');

  const drills = [
    { id: 'passage', title: 'Curated Passages', icon: '📖', desc: 'Engaging real-world articles, quotes, and motorsport stories.' },
    { id: 'timed', title: 'Timed Sprint Tests', icon: '⏱️', desc: 'Benchmark raw speed in fixed 15s, 30s, 60s, or 120s windows.' },
    { id: 'numbers', title: 'Numbers & Symbols', icon: '🔢', desc: 'Sharpen top-row numerical keys and punctuation reach speed.' },
    { id: 'weak', title: 'Difficult-Key Drills', icon: '🎯', desc: 'AI-tailored passages emphasizing your most frequent typo characters.' }
  ];

  return (
    <div className="screen-page practice-modes-screen">
      <div className="content-wrapper">
        <div className="practice-selector-card card">
          <div className="page-header-block text-center">
            <span className="badge badge-orange">Training Academy</span>
            <h1 className="page-title">Practice Mode Selection</h1>
            <p className="page-subtitle">Zero pressure, no opponents, pure skill conditioning.</p>
          </div>

          <div className="drills-selection-grid mt-4">
            {drills.map((d) => (
              <div 
                key={d.id} 
                className="drill-card card card-interactive"
                onClick={() => onNavigate('screen-14')}
              >
                <div className="drill-icon">{d.icon}</div>
                <h3>{d.title}</h3>
                <p className="text-secondary text-sm">{d.desc}</p>
                <div className="drill-bottom mt-3">
                  <span className="badge badge-orange">Start Drill</span>
                  <ChevronRight size={16} className="text-orange" />
                </div>
              </div>
            ))}
          </div>

          {/* Timed Presets */}
          <div className="timed-presets-card card-cream mt-5">
            <h4>Select Timed Test Duration</h4>
            <div className="timed-buttons-row mt-2">
              {['15', '30', '60', '120'].map((sec) => (
                <button
                  key={sec}
                  className={`btn ${selectedDuration === sec ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setSelectedDuration(sec)}
                >
                  {sec} Seconds Sprint
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
