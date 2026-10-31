import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Volume2, VolumeX, Eye, Flag, Zap, RotateCcw, AlertTriangle } from 'lucide-react';
import { SvgCar } from '../../components/common/SvgCar';

interface Screen13LiveRaceProps {
  onNavigate: (screenId: string) => void;
  passageText?: string;
}

export const Screen13LiveRace: React.FC<Screen13LiveRaceProps> = ({ 
  onNavigate,
  passageText = "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway."
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wpm, setWpm] = useState(128);
  const [accuracy, setAccuracy] = useState(98);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);

  // Opponent AI progress (0 to 100%)
  const [opponents, setOpponents] = useState([
    { id: 'emma', name: 'Emma', car: 'golden', avatar: '👩‍🦰', progress: 38, wpm: 122, rank: 2, isYou: false },
    { id: 'liam', name: 'Liam', car: 'forest', avatar: '👱‍♂️', progress: 32, wpm: 115, rank: 3, isYou: false },
    { id: 'sophia', name: 'Sophia', car: 'starter', avatar: '👧', progress: 26, wpm: 108, rank: 4, isYou: false }
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
    setStartTime(Date.now());
  }, []);

  // Timer & Opponent Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);

      // Advance opponents smoothly
      setOpponents(prev => prev.map(opp => {
        const increment = (opp.wpm / 60) * 0.45;
        const newProgress = Math.min(100, opp.progress + increment);
        return { ...opp, progress: newProgress };
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle Keystrokes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const targetSlice = passageText.slice(0, val.length);

    setTotalKeystrokes(prev => prev + 1);

    if (val === targetSlice) {
      setTypedInput(val);
      setErrorIndex(null);
      setCorrectKeystrokes(prev => prev + 1);

      // Compute Live WPM
      const elapsedMinutes = Math.max(0.05, elapsedSeconds / 60);
      const calculatedWpm = Math.round((val.length / 5) / elapsedMinutes);
      if (calculatedWpm > 0) setWpm(calculatedWpm);

      // Compute Accuracy
      const currentAcc = Math.round(((correctKeystrokes + 1) / (totalKeystrokes + 1)) * 100);
      setAccuracy(Math.min(100, Math.max(70, currentAcc)));

      // Check if finished!
      if (val.length === passageText.length) {
        setTimeout(() => {
          onNavigate('screen-16'); // Race Results Celebration!
        }, 600);
      }
    } else {
      setErrorIndex(val.length - 1);
    }
  };

  const userProgress = (typedInput.length / passageText.length) * 100;

  // Split passage text for visual highlight matching image 02
  const typedWordCount = typedInput.trim().split(/\s+/).filter(Boolean).length;
  const currentTypedPart = passageText.slice(0, typedInput.length);
  const remainingPart = passageText.slice(typedInput.length);

  // Determine current position
  const allRacers = [
    { name: 'You', isYou: true, progress: userProgress, avatar: '🏎️', rank: 1 },
    ...opponents
  ].sort((a, b) => b.progress - a.progress);

  const userRank = allRacers.findIndex(r => r.isYou) + 1;

  return (
    <div className="screen-page live-race-screen" onClick={() => inputRef.current?.focus()}>
      <div className="content-wrapper race-canvas-wrapper">
        
        {/* TOP PASSAGE & RACE BAR (Matching Reference Image 02) */}
        <div className="race-top-card card">
          <div className="passage-header-row">
            <div className="lap-counter-pill">
              <span>{userRank}/4</span>
            </div>

            {/* TYPING PASSAGE DISPLAY */}
            <div className="passage-typing-display">
              <span className="typed-completed-badge">{currentTypedPart}</span>
              <span className="blinking-cursor">|</span>
              <span className="typed-remaining-text">{remainingPart}</span>
            </div>

            {/* RACE TIMER */}
            <div className="race-timer-pill">
              <span className="timer-icon">⏱️</span>
              <span className="timer-digits">
                {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
                {String(elapsedSeconds % 60).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Hidden real input capturing user typing */}
          <input 
            ref={inputRef}
            type="text" 
            className="hidden-typing-input"
            value={typedInput}
            onChange={handleInputChange}
            autoFocus
            aria-label="Type race passage"
          />
        </div>

        {/* 3D CARTOON MULTI-LANE TRACK SCENE */}
        <div className="race-track-viewport">
          <img 
            src="/assets/race_track.jpg" 
            alt="Multi-lane asphalt racing highway through green sunny valley" 
            className="race-track-bg-img"
          />

          {/* Floating Player Rankings Panel (Right Side, matching reference image 02) */}
          <div className="floating-standings-card">
            {allRacers.map((racer, idx) => (
              <div 
                key={racer.name} 
                className={`standing-row ${racer.isYou ? 'standing-you' : ''}`}
              >
                <span className="standing-rank">{idx + 1}</span>
                <span className="standing-avatar">{racer.avatar}</span>
                <span className="standing-name">{racer.name}</span>
                {racer.isYou && <span className="standing-wpm">{wpm} WPM</span>}
              </div>
            ))}
          </div>

          {/* Dynamic 2D Lane Overlay with Animated Cars */}
          <div className="lanes-overlay-container">
            {/* Lane 1: Player Car (Blaze Runner Red) */}
            <div className="lane-strip">
              <div 
                className="lane-car-mover"
                style={{ left: `${Math.min(88, Math.max(4, userProgress))}%` }}
              >
                <div className="car-indicator-tag you">You</div>
                <SvgCar id="blaze" size={135} animatedNitro={userProgress > 10} />
              </div>
            </div>

            {/* Lane 2: Emma (Golden Flash) */}
            <div className="lane-strip">
              <div 
                className="lane-car-mover"
                style={{ left: `${Math.min(88, Math.max(4, opponents[0].progress))}%` }}
              >
                <div className="car-indicator-tag">Emma</div>
                <SvgCar id="golden" size={135} />
              </div>
            </div>

            {/* Lane 3: Liam (Forest Beast) */}
            <div className="lane-strip">
              <div 
                className="lane-car-mover"
                style={{ left: `${Math.min(88, Math.max(4, opponents[1].progress))}%` }}
              >
                <div className="car-indicator-tag">Liam</div>
                <SvgCar id="forest" size={135} />
              </div>
            </div>

            {/* Lane 4: Sophia (Starter Car) */}
            <div className="lane-strip">
              <div 
                className="lane-car-mover"
                style={{ left: `${Math.min(88, Math.max(4, opponents[2].progress))}%` }}
              >
                <div className="car-indicator-tag">Sophia</div>
                <SvgCar id="starter" size={135} />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HUD OVERLAY (Matching Reference Image 02) */}
        <div className="race-bottom-hud card card-dark">
          <div className="hud-left-stats">
            <div className="hud-trophy-icon">
              <Trophy size={28} className="text-gold" />
            </div>
            <div className="hud-metric-block">
              <div className="hud-wpm-text">
                <span className="hud-wpm-number">{wpm}</span>
                <span className="hud-wpm-label">WPM</span>
              </div>
              <span className="hud-accuracy-text">{accuracy}% Accuracy</span>
            </div>
          </div>

          {/* Center Progress Bar */}
          <div className="hud-center-track">
            <button 
              className="nitro-hud-btn"
              onClick={() => {
                setWpm(prev => prev + 15);
              }}
              title="Nitro Active"
            >
              <Zap size={18} fill="#38BDF8" className="text-blue" />
            </button>

            <div className="hud-progress-groove">
              <div 
                className="hud-progress-fill" 
                style={{ width: `${userProgress}%` }}
              />
              <div 
                className="hud-car-marker"
                style={{ left: `${userProgress}%` }}
              >
                🏎️
              </div>
              <div className="hud-finish-flag">
                🏁
              </div>
            </div>
          </div>

          {/* Sound & Controls */}
          <div className="hud-right-actions">
            <button 
              className="hud-action-icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute Game Audio" : "Unmute Audio"}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <button 
              className="btn btn-primary btn-sm hud-finish-test-btn"
              onClick={() => onNavigate('screen-16')}
            >
              Finish Race
            </button>

            <button 
              className="hud-quit-btn"
              onClick={() => onNavigate('screen-10')}
              title="Leave Match"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Keyboard Focus Prompt */}
        <div className="typing-guide-helper text-center mt-2">
          <p className="text-xs text-secondary">
            💡 <strong>Keyboard Active:</strong> Type the passage on your keyboard to advance your car forward in Lane 1!
          </p>
        </div>

      </div>
    </div>
  );
};
