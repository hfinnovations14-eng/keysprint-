import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Trophy, Volume2, VolumeX, Eye, Flag, Zap, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SvgCar, CarModelId } from '../../components/common/SvgCar';
import { useRace } from '../../context/RaceContext';
import { useAuth } from '../../context/AuthContext';
import { recordKeystroke } from '../../services/telemetryService';
import { computeTypingState } from '../../services/typingEngine';
import { TRACKS_DATA } from '../../data/carsData';

interface Screen13LiveRaceProps {
  onNavigate: (screenId: string) => void;
  passageText?: string;
}

export const Screen13LiveRace: React.FC<Screen13LiveRaceProps> = ({ 
  onNavigate,
  passageText: propPassageText
}: Screen13LiveRaceProps) => {
  const { user } = useAuth();
  const { passageText: racePassage, players, sendProgress, submitFinalRace, roomMeta } = useRace();
  
  const currentTrack = TRACKS_DATA.find(t => t.id === roomMeta?.trackId) || TRACKS_DATA[0];
  const activePassage = propPassageText || racePassage || "The quick brown fox jumps over the lazy dog while sports cars thunder down the championship asphalt highway at breakneck velocity.";

  const [typedInput, setTypedInput] = useState('');
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isFocused, setIsFocused] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const raceStartTimeRef = useRef<number>(Date.now());

  // Focus input on mount & reset start time
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

  // Global keydown capture: if user types anywhere on screen, focus the input
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Tab' || e.key === 'Escape') return;

      if (document.activeElement !== inputRef.current && (e.key.length === 1 || e.key === 'Backspace')) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const equippedItem = user?.inventory?.find(i => i.isEquipped);
  const userCarId: CarModelId = (equippedItem?.itemId as CarModelId) || 'blaze';
  const userNickname = user?.profile?.nickname || 'You';

  // Compute live character-by-character typing state
  const typingState = computeTypingState(
    activePassage,
    typedInput,
    totalKeystrokes,
    correctKeystrokes,
    elapsedSeconds
  );

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const isOpponent = (p: (typeof players)[0]) => {
    if (p.socketId === 'local_you') return false;
    if (user?.id && p.userId === user.id) return false;
    return true;
  };

  // Check if finished
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinishing) return;
    const val = e.target.value;

    let newTotal = totalKeystrokes;
    let newCorrect = correctKeystrokes;

    if (val.length > typedInput.length) {
      // Keystroke typed
      const charIndex = val.length - 1;
      const typedChar = val[charIndex];
      const expectedChar = activePassage[charIndex] || '';
      const isMatch = typedChar === expectedChar;

      newTotal += 1;
      setTotalKeystrokes(newTotal);

      if (isMatch) {
        newCorrect += 1;
        setCorrectKeystrokes(newCorrect);
      }

      if (expectedChar) {
        recordKeystroke(expectedChar, !isMatch);
      }
    } else if (val.length < typedInput.length) {
      // Backspace: naturally update text
    }

    setTypedInput(val);

    // Compute next state for socket emission
    const nextState = computeTypingState(
      activePassage,
      val,
      newTotal,
      newCorrect,
      elapsedSeconds
    );

    sendProgress(nextState.progressPercent, nextState.wpm, nextState.accuracy);

    // Check if finished
    if (nextState.isComplete && !isFinishing) {
      setIsFinishing(true);

      const fasterOpponents = players.filter(p => isOpponent(p) && p.finished).length;
      const finalPlace = fasterOpponents + 1;

      try {
        await submitFinalRace({
          wpm: nextState.wpm,
          accuracy: nextState.accuracy,
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
  };

  const userProgress = typingState.progressPercent;

  // Separate user and opponents
  const opponentRacers = players.filter(isOpponent);
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

  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`;

  return (
    <div className="screen-page live-race-screen" onClick={focusInput}>
      <div className="content-wrapper race-canvas-wrapper">
        
        {/* TOP PASSAGE & RACE BAR */}
        <div className="race-top-card card">
          {/* Status Bar */}
          <div className="race-status-bar">
            <div className="flex-center gap-2">
              <div className="lap-counter-pill">
                <span>Position: #{userRank} / {allRacers.length}</span>
              </div>
              <span className="badge badge-blue flex-center gap-1" title={currentTrack.description}>
                <span>🏁</span>
                <span>{currentTrack.name}</span>
              </span>
              <span className="badge badge-orange font-mono font-bold">
                {typingState.wpm} WPM
              </span>
              <span className="badge badge-green font-mono font-bold">
                {typingState.accuracy}% ACC
              </span>
            </div>

            <div className="flex-center gap-2">
              {typingState.hasError && (
                <div className="typo-warning-pill animate-pulse">
                  <AlertTriangle size={13} />
                  <span>Backspace to fix typo</span>
                </div>
              )}
              <div className="race-timer-pill">
                <span className="timer-icon">⏱️</span>
                <span className="timer-digits">{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* DEDICATED, SPACIOUS TYPING ARENA */}
          <div 
            className={`race-passage-card ${isFocused ? 'focused' : ''} ${typingState.hasError ? 'has-error' : ''}`}
            onClick={focusInput}
          >
            {!isFocused && (
              <div className="typing-focus-reminder">
                Click here or start typing to resume
              </div>
            )}

            {/* Character-by-Character Flow */}
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
              value={typedInput}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Type race passage"
            />
          </div>
        </div>

        {/* 3D CARTOON MULTI-LANE TRACK SCENE */}
        <div 
          className="race-track-viewport"
          style={{
            borderColor: currentTrack.accentColor ? `${currentTrack.accentColor}66` : undefined
          }}
        >
          <img 
            src="/assets/race_track.jpg" 
            alt={`${currentTrack.name} multi-lane asphalt racing highway`} 
            className="race-track-bg-img"
          />
          <div 
            className="track-atmosphere-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: currentTrack.bgGradient,
              opacity: 0.14,
              pointerEvents: 'none',
              mixBlendMode: 'color'
            }}
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
                {racer.isYou && <span className="standing-wpm">{typingState.wpm} WPM</span>}
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
                <span className="hud-wpm-num">{typingState.wpm}</span>
                <span className="hud-wpm-unit">WPM</span>
              </div>
              <div className="hud-sub-label">Current Net Velocity</div>
            </div>

            <div className="hud-divider" />

            <div className="hud-metric-block">
              <div className="hud-acc-text text-green">{typingState.accuracy}%</div>
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
