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
import { computeTypingState } from '../../services/typingEngine';

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
  const [errorKeys, setErrorKeys] = useState<string[]>([]);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFocused, setIsFocused] = useState(true);

  // Timed mode state
  const [durationSec, setDurationSec] = useState<number>(initialConfig.durationSec || 60);
  const [timeLeft, setTimeLeft] = useState<number>(initialConfig.durationSec || 60);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Focus input on mount & load initial drill
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const loadDrill = async (type: 'normal' | 'keys' | 'numbers' | 'custom' | 'timed') => {
    setDrillType(type);
    setTyped('');
    setErrorKeys([]);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setElapsedSeconds(0);
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
    focusInput();
  }, [drillType, passage]);

  // Global keydown capture: automatically focus input on keypress
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Tab' || e.key === 'Escape') return;

      if (!isEditingCustom && document.activeElement !== inputRef.current && (e.key.length === 1 || e.key === 'Backspace')) {
        focusInput();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isEditingCustom]);

  // Elapsed time ticker
  useEffect(() => {
    if (!hasStarted || isFinished) return;
    const ticker = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(ticker);
  }, [hasStarted, isFinished]);

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

  // Compute live typing state
  const typingState = computeTypingState(
    passage,
    typed,
    totalKeystrokes,
    correctKeystrokes,
    elapsedSeconds
  );

  const finishSession = () => {
    if (isFinished) return;
    setIsFinished(true);

    const finalWpm = Math.max(1, typingState.wpm);
    const finalAcc = Math.max(50, typingState.accuracy);
    const errorsCount = Math.max(0, totalKeystrokes - correctKeystrokes);

    setLastPracticeSession({
      speed: finalWpm,
      accuracy: finalAcc,
      errors: errorsCount,
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

    let newTotal = totalKeystrokes;
    let newCorrect = correctKeystrokes;

    if (val.length > typed.length) {
      const charIndex = val.length - 1;
      const typedChar = val[charIndex];
      const expectedChar = passage[charIndex] || '';
      const isMatch = typedChar === expectedChar;

      newTotal += 1;
      setTotalKeystrokes(newTotal);

      if (isMatch) {
        newCorrect += 1;
        setCorrectKeystrokes(newCorrect);
        recordKeystroke(expectedChar, false);
      } else {
        recordKeystroke(expectedChar, true);
        if (expectedChar && !errorKeys.includes(expectedChar.toUpperCase())) {
          setErrorKeys(prev => [...prev, expectedChar.toUpperCase()]);
        }
      }
    }

    setTyped(val);

    const nextState = computeTypingState(
      passage,
      val,
      newTotal,
      newCorrect,
      elapsedSeconds
    );

    if (nextState.isComplete) {
      finishSession();
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    setPassage(customInputText.trim());
    setDrillTitle('Custom Practice Passage');
    setIsEditingCustom(false);
    setTyped('');
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setElapsedSeconds(0);
    setHasStarted(false);
    setIsFinished(false);
  };

  const resetDrill = () => {
    setTyped('');
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setElapsedSeconds(0);
    setHasStarted(false);
    setIsFinished(false);
    setTimeLeft(durationSec);
    focusInput();
  };

  const totalErrors = Math.max(0, totalKeystrokes - correctKeystrokes);

  return (
    <div className="screen-page practice-screen" onClick={focusInput}>
      <div className="content-wrapper">
        <div className="practice-master-card card">
          {/* Header */}
          <div className="flex-between mb-3">
            <button 
              type="button" 
              className="btn btn-outline btn-sm flex-center gap-1"
              onClick={() => onNavigate('screen-33')}
            >
              <ArrowLeft size={14} />
              <span>All Modes</span>
            </button>
            <div className="flex-center gap-2">
              <span className="badge badge-orange">Solo Academy</span>
              <span className="badge badge-secondary">{drillTitle}</span>
            </div>
          </div>

          <div className="practice-header-text text-center mb-4">
            <h1 className="page-title">{drillTitle}</h1>
            <p className="page-subtitle">
              Zero pressure, no ranking points at risk. Focus entirely on rhythm and mechanical muscle memory.
            </p>
          </div>

          {/* Drill Category Tabs */}
          <div className="practice-type-selector-grid">
            <div 
              className={`practice-type-card card card-interactive ${drillType === 'normal' ? 'selected' : ''}`}
              onClick={() => loadDrill('normal')}
            >
              <div className="p-type-icon">📖</div>
              <h4 className="font-bold">Standard Text</h4>
              <p className="text-xs text-secondary">Balanced prose & stories</p>
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
            <div className="practice-typing-arena card-cream mt-4" onClick={focusInput}>
              <div className="practice-stats-strip flex-between">
                <div className="flex-center gap-3">
                  <span className="stat-pill">
                    <Zap size={14} className="text-orange" />
                    <strong>{typingState.wpm}</strong> WPM
                  </span>
                  <span className="stat-pill">
                    <CheckCircle2 size={14} className="text-green" />
                    <strong>{typingState.accuracy}%</strong> Acc
                  </span>
                  <span className="stat-pill text-red">
                    <strong>{totalErrors}</strong> Typos
                  </span>
                </div>

                <div className="flex-center gap-3">
                  {typingState.hasError && (
                    <div className="typo-warning-pill animate-pulse">
                      <AlertTriangle size={13} />
                      <span>Backspace to fix typo</span>
                    </div>
                  )}

                  {drillType === 'timed' && (
                    <span className="badge badge-gold font-bold flex-center gap-1">
                      <Clock size={12} />
                      <span>{timeLeft}s Left</span>
                    </span>
                  )}
                  <span className="stat-pill">
                    <strong>{typingState.progressPercent}%</strong> Done
                  </span>
                </div>
              </div>

              {/* Dedicated Character-by-Character Reading Box */}
              <div 
                className={`race-passage-card ${isFocused ? 'focused' : ''} ${typingState.hasError ? 'has-error' : ''}`}
                onClick={focusInput}
              >
                {!isFocused && (
                  <div className="typing-focus-reminder">
                    Click here or start typing to resume
                  </div>
                )}

                <div className="passage-char-flow">
                  {typingState.diff.map((char) => {
                    const isSpace = char.expected === ' ';
                    if (char.status === 'correct') {
                      return (
                        <span key={char.index} className="char char-correct">
                          {char.expected}
                        </span>
                      );
                    }
                    if (char.status === 'incorrect') {
                      return (
                        <span 
                          key={char.index} 
                          className="char char-incorrect"
                          title={`Typo: typed '${char.typed || ''}', expected '${char.expected}'`}
                        >
                          {isSpace ? '␣' : (char.typed || char.expected)}
                        </span>
                      );
                    }
                    if (char.status === 'current') {
                      return (
                        <span key={char.index} className="char char-current">
                          <span className="cursor-caret" />
                          {char.expected}
                        </span>
                      );
                    }
                    return (
                      <span key={char.index} className="char char-upcoming">
                        {char.expected}
                      </span>
                    );
                  })}
                </div>

                {/* Native Full-Coverage Overlay Input */}
                <input 
                  ref={inputRef}
                  type="text" 
                  className="passage-native-input"
                  value={typed}
                  onChange={handleInput}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Practice passage typing input"
                />
              </div>
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
