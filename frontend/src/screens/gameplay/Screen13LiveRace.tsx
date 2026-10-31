import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Trophy, Volume2, VolumeX, Eye, Flag, Zap, RotateCcw, AlertTriangle } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { useRace } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';

interface Screen13LiveRaceProps {
  onNavigate: (screenId: string) => void;
  passageText?: string;
}

export const Screen13LiveRace: React.FC<Screen13LiveRaceProps> = ({ 
  onNavigate,
  passageText: propPassageText
}: Screen13LiveRaceProps) => {
  const { user } = useAuth();
  const { passageText: racePassage, players, sendProgress, submitFinalRace } = useRace();
  
  const activePassage = propPassageText || racePassage || "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway at breakneck velocity.";

  const [typedInput, setTypedInput] = useState('');
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const raceStartTimeRef = useRef<number>(Date.now());

  // Auto focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
    raceStartTimeRef.current = Date.now();
  }, []);

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const equippedItem = user?.inventory?.find(i => i.isEquipped);
  const userCarId: CarModelId = (equippedItem?.itemId as CarModelId) || 'blaze';
  const userNickname = user?.profile?.nickname || 'You';

  // Handle Keystrokes
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinishing) return;
    const val = e.target.value;
    const targetSlice = activePassage.slice(0, val.length);

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
      const normalizedAcc = Math.min(100, Math.max(50, currentAcc));
      setAccuracy(normalizedAcc);

      const userProg = (val.length / activePassage.length) * 100;
      sendProgress(userProg, calculatedWpm, normalizedAcc);

      // Check if finished!
      if (val.length >= activePassage.length) {
        setIsFinishing(true);

        // Calculate placement
        const fasterOpponents = players.filter(p => p.userId !== user?.id && p.finished).length;
        const finalPlace = fasterOpponents + 1;

        try {
          await submitFinalRace({
            wpm: calculatedWpm,
            accuracy: normalizedAcc,
            durationSec: Math.max(1, elapsedSeconds),
            place: finalPlace
          });
        } catch {
          // Fallback
        }

        setTimeout(() => {
          onNavigate('screen-16'); // Transition to podium celebration!
        }, 500);
      }
    } else {
      setErrorIndex(val.length - 1);
    }
  };

  const userProgress = (typedInput.length / activePassage.length) * 100;

  // Split passage text for visual highlight
  const currentTypedPart = activePassage.slice(0, typedInput.length);
  const remainingPart = activePassage.slice(typedInput.length);

  // Separate user and opponents
  const opponentRacers = players.filter(p => p.userId !== user?.id && p.socketId !== p.userId);
  const defaultOpponents = [
    { socketId: 'opp_1', userId: 'opp_1', nickname: 'Emma', carId: 'golden', avatar: '👩‍🦰', progress: Math.min(95, elapsedSeconds * 3.8), wpm: 122, accuracy: 98, finished: false },
    { socketId: 'opp_2', userId: 'opp_2', nickname: 'Liam', carId: 'forest', avatar: '👱‍♂️', progress: Math.min(90, elapsedSeconds * 3.2), wpm: 115, accuracy: 96, finished: false },
    { socketId: 'opp_3', userId: 'opp_3', nickname: 'Sophia', carId: 'starter', avatar: '👧', progress: Math.min(85, elapsedSeconds * 2.8), wpm: 108, accuracy: 99, finished: false }
  ];

  const activeOpponents = opponentRacers.length > 0 ? opponentRacers : defaultOpponents;

  // Determine current position
  const allRacers = [
    { name: `${userNickname} (You)`, isYou: true, progress: userProgress, avatar: user?.profile?.avatarId || '🏎️', carId: userCarId, rank: 1 },
    ...activeOpponents.map(opp => ({
      name: opp.nickname,
      isYou: false,
      progress: opp.progress,
      avatar: opp.avatar || '🏎️',
      carId: (opp.carId as CarModelId) || 'starter',
      rank: 2
    }))
  ].sort((a, b) => b.progress - a.progress);

  const userRank = allRacers.findIndex(r => r.isYou) + 1;

  return (
    <div className="screen-page live-race-screen" onClick={() => inputRef.current?.focus()}>
      <div className="content-wrapper race-canvas-wrapper">
        
        {/* TOP PASSAGE & RACE BAR */}
        <div className="race-top-card card">
          <div className="passage-header-row">
            <div className="lap-counter-pill">
              <span>Position: #{userRank} / {allRacers.length}</span>
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

          {/* Floating Player Rankings Panel (Right Side) */}
          <div className="floating-standings-card">
            {allRacers.map((racer, idx) => (
              <div 
                key={racer.name} 
                className={`standing-row ${racer.isYou ? 'standing-you' : ''}`}
              >
                <span className="standing-rank">#{idx + 1}</span>
                <span className="standing-avatar">{racer.avatar}</span>
                <span className="standing-name">{racer.name}</span>
                {racer.isYou && <span className="standing-wpm">{wpm} WPM</span>}
              </div>
            ))}
          </div>

          {/* Dynamic 2D Lane Overlay with Animated Cars */}
          <div className="lanes-overlay-container">
            {/* Lane 1: Player Car */}
            <div className="lane-strip">
              <div 
                className="lane-car-mover"
                style={{ left: `${Math.min(88, Math.max(4, userProgress))}%` }}
              >
                <div className="car-indicator-tag you">{userNickname}</div>
                <SvgCar id={userCarId} size={135} animatedNitro={userProgress > 5} />
              </div>
            </div>

            {/* Opponent Lanes */}
            {activeOpponents.slice(0, 3).map((opp, idx) => (
              <div key={opp.socketId || idx} className="lane-strip">
                <div 
                  className="lane-car-mover"
                  style={{ left: `${Math.min(88, Math.max(4, opp.progress))}%` }}
                >
                  <div className="car-indicator-tag">{opp.nickname}</div>
                  <SvgCar id={(opp.carId as CarModelId) || 'golden'} size={135} animatedNitro={opp.progress > 5} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM HUD OVERLAY */}
        <div className="race-bottom-hud card card-dark">
          <div className="hud-left-stats">
            <div className="hud-trophy-icon">
              <Trophy size={28} className="text-gold" />
            </div>
            <div className="hud-metric-block">
              <div className="hud-wpm-text">
                <span className="hud-wpm-num">{wpm}</span>
                <span className="hud-wpm-unit">WPM</span>
              </div>
              <div className="hud-sub-label">Current Net Velocity</div>
            </div>

            <div className="hud-divider" />

            <div className="hud-metric-block">
              <div className="hud-acc-text text-green">{accuracy}%</div>
              <div className="hud-sub-label">Keystroke Accuracy</div>
            </div>

            <div className="hud-divider" />

            <div className="hud-metric-block">
              <div className="hud-progress-text text-orange">{Math.round(userProgress)}%</div>
              <div className="hud-sub-label">Highway Progress</div>
            </div>
          </div>

          <div className="hud-right-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{soundEnabled ? 'Engine SFX On' : 'Muted'}</span>
            </button>

            <button 
              className="btn btn-outline btn-sm"
              onClick={() => onNavigate('screen-16')}
            >
              <span>Finish Test (Screen 16)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
