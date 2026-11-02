import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, RotateCcw, ArrowLeft, Target, Sparkles, CheckCircle2, Clock, Zap, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';
import { 
  getActiveDrillConfig, 
  setActiveDrillConfig,
  recordKeystroke, 
  setLastPracticeSession,
  getTopWeakKeys 
} from '../../services/telemetryService';

interface Screen14PracticeProps {
  onNavigate: (screenId: string) => void;
}

export const Screen14Practice: React.FC<Screen14PracticeProps> = ({ onNavigate }) => {
  const initialConfig = getActiveDrillConfig();
  const [drillType, setDrillType] = useState<'normal' | 'keys' | 'numbers' | 'custom' | 'timed'>(initialConfig.mode);
  const [drillTitle, setDrillTitle] = useState(initialConfig.customTitle || 'Curated Practice Drill');
  const [passage, setPassage] = useState("Precision and consistency build championship reflexes. Relax your wrists and keep your eyes focused ahead.");
  
  // Custom text mode state
  const [customInputText, setCustomInputText] = useState('');
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  // Typing session state
  const [typed, setTyped] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [errorKeys, setErrorKeys] = useState<string[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);

  // Timed mode state
  const [durationSec, setDurationSec] = useState<number>(initialConfig.durationSec || 60);
  const [timeLeft, setTimeLeft] = useState<number>(initialConfig.durationSec || 60);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  const loadDrill = async (type: 'normal' | 'keys' | 'numbers' | 'custom' | 'timed') => {
    setDrillType(type);
    setTyped('');
    setErrors(0);
    setErrorKeys([]);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setHasStarted(false);
    setIsFinished(false);

    if (type === 'custom') {
      setIsEditingCustom(true);
      return;
    }

    setIsEditingCustom(false);
    const topKeys = getTopWeakKeys(3).map(k => k.key);

    try {
      const res = await api.getPracticeDrill({
        mode: type,
        keys: topKeys.join(','),
        duration: durationSec
      });

      if (res.drill) {
        setPassage(res.drill.text);
        setDrillTitle(res.drill.title || 'Practice Drill');
        if (res.drill.durationSec) {
          setDurationSec(res.drill.durationSec);
          setTimeLeft(res.drill.durationSec);
        }
      } else if (res.passage) {
        setPassage(res.passage.text);
        setDrillTitle('Standard Practice Passage');
      }
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    loadDrill(initialConfig.mode);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [drillType, passage]);

  // Timed countdown ticker
  useEffect(() => {
    if (drillType !== 'timed' || !hasStarted || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [drillType, hasStarted, isFinished]);

  const finishSession = () => {
    setIsFinished(true);
    const finalWpm = Math.max(1, wpm);
    const finalAcc = Math.max(50, Math.min(100, accuracy));

    setLastPracticeSession({
      speed: finalWpm,
      accuracy: finalAcc,
      errors,
      mode: drillType,
      drillTitle,
      errorKeys
    });

    setTimeout(() => {
      onNavigate('screen-34');
    }, 400);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const val = e.target.value;

    if (!hasStarted && val.length > 0) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
    }

    setTotalKeystrokes(prev => prev + 1);
    const targetSlice = passage.slice(0, val.length);

    if (val === targetSlice) {
      setTyped(val);
      const newCorrect = correctKeystrokes + 1;
      setCorrectKeystrokes(newCorrect);

      // Log accurate keystroke in telemetry
      if (val.length > 0) {
        const lastChar = val[val.length - 1];
        recordKeystroke(lastChar, false);
      }

      // Compute Live WPM
      const elapsedMin = Math.max(0.02, (Date.now() - startTimeRef.current) / 60000);
      const curWpm = Math.round((val.length / 5) / elapsedMin);
      setWpm(curWpm);

      // Compute Accuracy
      const currentAcc = Math.round((newCorrect / (totalKeystrokes + 1)) * 100);
      setAccuracy(Math.min(100, Math.max(50, currentAcc)));

      // If reached end of passage
      if (val.length >= passage.length) {
        finishSession();
      }
    } else {
      // Keystroke error!
      setErrors(prev => prev + 1);
      const expectedChar = passage[typed.length] || '';
      if (expectedChar) {
        recordKeystroke(expectedChar, true);
        if (!errorKeys.includes(expectedChar.toUpperCase())) {
          setErrorKeys(prev => [...prev, expectedChar.toUpperCase()]);
        }
      }

      // Compute Accuracy on error
      const currentAcc = Math.round((correctKeystrokes / (totalKeystrokes + 1)) * 100);
      setAccuracy(Math.min(100, Math.max(50, currentAcc)));
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;
    setPassage(customInputText.trim());
    setDrillTitle('Custom User Passage');
    setIsEditingCustom(false);
    setTyped('');
    setErrors(0);
    setHasStarted(false);
  };

  const resetDrill = () => {
    setTyped('');
    setErrors(0);
    setErrorKeys([]);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setHasStarted(false);
    setIsFinished(false);
    setTimeLeft(durationSec);
    inputRef.current?.focus();
  };

  return (
    <div className="screen-page practice-screen" onClick={() => inputRef.current?.focus()}>
      <div className="content-wrapper">
        <div className="practice-master-card card">
          {/* Header */}
          <div className="practice-header-row flex-between">
            <div>
              <span className="badge badge-orange">Training Academy</span>
              <h2 className="mt-1">{drillTitle}</h2>
              <p className="text-secondary text-sm">Targeted finger coordination, touch cadence, and muscle memory training.</p>
            </div>
            <button 
              type="button"
              className="btn btn-secondary btn-sm flex-center gap-1"
              onClick={() => onNavigate('screen-33')}
            >
              <ArrowLeft size={16} />
              <span>All Modes</span>
            </button>
          </div>

          {/* 4 Drill Selector Cards */}
          <div className="practice-types-grid mt-4">
            <div 
              className={`practice-type-card card card-interactive ${drillType === 'normal' ? 'selected' : ''}`}
              onClick={() => loadDrill('normal')}
            >
              <div className="p-type-icon">⌨️</div>
              <h4 className="font-bold">Normal Practice</h4>
              <p className="text-xs text-secondary">Random standard English sentences</p>
            </div>

            <div 
              className={`practice-type-card card card-interactive ${drillType === 'keys' ? 'selected' : ''}`}
              onClick={() => loadDrill('keys')}
            >
              <div className="p-type-icon">🎯</div>
              <h4 className="font-bold">Difficult Keys</h4>
              <p className="text-xs text-secondary">Passages rich in your weak keys</p>
            </div>

            <div 
              className={`practice-type-card card card-interactive ${drillType === 'numbers' ? 'selected' : ''}`}
              onClick={() => loadDrill('numbers')}
            >
              <div className="p-type-icon">🔢</div>
              <h4 className="font-bold">Numbers & Symbols</h4>
              <p className="text-xs text-secondary">Punctuation and top-row reach</p>
            </div>

            <div 
              className={`practice-type-card card card-interactive ${drillType === 'timed' ? 'selected' : ''}`}
              onClick={() => loadDrill('timed')}
            >
              <div className="p-type-icon">⏱️</div>
              <h4 className="font-bold">Timed Sprint</h4>
              <p className="text-xs text-secondary">{durationSec}s continuous speed benchmark</p>
            </div>
          </div>

          {/* Custom Text Editor if mode is custom */}
          {isEditingCustom ? (
            <form onSubmit={handleApplyCustom} className="card-cream p-4 mt-4 text-center">
              <h3 className="font-bold">Paste Custom Practice Text</h3>
              <p className="text-sm text-secondary mt-1">Enter any paragraph, code snippet, or article to drill.</p>
              <textarea 
                className="input-field mt-3 font-mono text-sm"
                rows={4}
                placeholder="Paste your text here..."
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                className="btn btn-primary btn-sm mt-3"
                disabled={!customInputText.trim()}
              >
                <span>Load Custom Text</span>
              </button>
            </form>
          ) : (
            /* Typing Practice Box */
            <div className="practice-typing-arena card-cream mt-4">
              <div className="practice-stats-strip flex-between">
                <div className="flex-center gap-3">
                  <span className="stat-pill"><Zap size={14} className="text-orange" /> <strong>{wpm}</strong> WPM</span>
                  <span className="stat-pill"><CheckCircle2 size={14} className="text-green" /> <strong>{accuracy}%</strong> Acc</span>
                  <span className="stat-pill text-red"><strong>{errors}</strong> Typos</span>
                </div>

                <div className="flex-center gap-3">
                  {drillType === 'timed' && (
                    <span className="badge badge-gold font-bold flex-center gap-1">
                      <Clock size={12} />
                      <span>{timeLeft}s Left</span>
                    </span>
                  )}
                  <span className="stat-pill">
                    <strong>{Math.round((typed.length / passage.length) * 100)}%</strong> Done
                  </span>
                </div>
              </div>

              <div className="practice-text-box mt-3 font-mono">
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
          )}

          {/* Practice Controls */}
          <div className="practice-actions-row flex-between mt-4">
            <button type="button" className="btn btn-outline flex-center gap-1" onClick={resetDrill}>
              <RotateCcw size={16} />
              <span>Restart Drill</span>
            </button>

            <button 
              type="button"
              className="btn btn-primary flex-center gap-1"
              onClick={finishSession}
            >
              <span>Finish & View AI Insights</span>
              <Sparkles size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
