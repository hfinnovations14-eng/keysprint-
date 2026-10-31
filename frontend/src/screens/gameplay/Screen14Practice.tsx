import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, RotateCcw, ArrowLeft, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen14PracticeProps {
  onNavigate: (screenId: string) => void;
}

export const Screen14Practice: React.FC<Screen14PracticeProps> = ({ onNavigate }) => {
  const [drillType, setDrillType] = useState<'normal' | 'keys' | 'custom' | 'timed'>('normal');
  const passage = "Precision and consistency build championship reflexes. Relax your wrists and keep your eyes focused ahead.";
  const [typed, setTyped] = useState('');
  const [wpm, setWpm] = useState(105);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [drillType]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === passage.slice(0, val.length)) {
      setTyped(val);
      if (val.length === passage.length) {
        onNavigate('screen-34'); // Practice Results!
      }
    } else {
      setErrors(prev => prev + 1);
    }
  };

  const resetDrill = () => {
    setTyped('');
    setErrors(0);
    inputRef.current?.focus();
  };

  return (
    <div className="screen-page practice-screen" onClick={() => inputRef.current?.focus()}>
      <div className="content-wrapper">
        <div className="practice-master-card card">
          {/* Header */}
          <div className="practice-header-row">
            <div>
              <span className="badge badge-orange">Solo Warmup</span>
              <h2>Improve Your Skills</h2>
              <p className="text-secondary text-sm">Choose a practice drill to focus on specific keys or rhythm.</p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('screen-10')}
            >
              <ArrowLeft size={16} />
              <span>Back to Modes</span>
            </button>
          </div>

          {/* 4 Drill Selector Cards (Matching Reference Image 09) */}
          <div className="practice-types-grid mt-4">
            <div 
              className={`practice-type-card card ${drillType === 'normal' ? 'selected' : ''}`}
              onClick={() => setDrillType('normal')}
            >
              <div className="p-type-icon">⌨️</div>
              <h4>Normal Practice</h4>
              <p className="text-xs text-secondary">Random standard English sentences</p>
            </div>

            <div 
              className={`practice-type-card card ${drillType === 'keys' ? 'selected' : ''}`}
              onClick={() => setDrillType('keys')}
            >
              <div className="p-type-icon">🎯</div>
              <h4>Difficult Keys</h4>
              <p className="text-xs text-secondary">Target your slowest finger reaches</p>
            </div>

            <div 
              className={`practice-type-card card ${drillType === 'custom' ? 'selected' : ''}`}
              onClick={() => setDrillType('custom')}
            >
              <div className="p-type-icon">📝</div>
              <h4>Custom Text</h4>
              <p className="text-xs text-secondary">Paste your own paragraphs to practice</p>
            </div>

            <div 
              className={`practice-type-card card ${drillType === 'timed' ? 'selected' : ''}`}
              onClick={() => setDrillType('timed')}
            >
              <div className="p-type-icon">⏱️</div>
              <h4>Timed Practice</h4>
              <p className="text-xs text-secondary">1 / 2 / 5 minutes speed sprints</p>
            </div>
          </div>

          {/* Typing Practice Box */}
          <div className="practice-typing-arena card-cream mt-4">
            <div className="practice-stats-strip">
              <span className="stat-pill"><strong>{wpm}</strong> WPM</span>
              <span className="stat-pill"><strong>{errors}</strong> Errors</span>
              <span className="stat-pill"><strong>{Math.round((typed.length / passage.length) * 100)}%</strong> Done</span>
            </div>

            <div className="practice-text-box">
              <span className="typed-completed-badge">{typed}</span>
              <span className="blinking-cursor">|</span>
              <span className="typed-remaining-text">{passage.slice(typed.length)}</span>
            </div>

            <input 
              ref={inputRef}
              type="text"
              className="hidden-typing-input"
              value={typed}
              onChange={handleInput}
              autoFocus
            />
          </div>

          {/* Practice Controls */}
          <div className="practice-actions-row mt-4">
            <button className="btn btn-outline" onClick={resetDrill}>
              <RotateCcw size={16} />
              <span>Restart Drill</span>
            </button>

            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('screen-34')}
            >
              <span>View Practice Analysis (Screen 34)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
