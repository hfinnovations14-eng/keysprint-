// KeySprint Core Typing Engine & Character Diff Service

export type CharStatus = 'correct' | 'incorrect' | 'current' | 'upcoming';

export interface CharDiff {
  index: number;
  expected: string;
  typed?: string;
  status: CharStatus;
}

export interface TypingEngineState {
  diff: CharDiff[];
  correctPrefixLength: number;
  hasError: boolean;
  errorIndex: number | null;
  progressPercent: number;
  isComplete: boolean;
  accuracy: number;
  wpm: number;
}

/**
 * Calculates net WPM from characters typed and elapsed time.
 * Standard typing metric: 5 characters = 1 word.
 */
export const calculateWpm = (correctChars: number, elapsedSeconds: number): number => {
  if (correctChars <= 0 || elapsedSeconds <= 0) return 0;
  const elapsedMinutes = Math.max(0.01, elapsedSeconds / 60);
  return Math.max(0, Math.round((correctChars / 5) / elapsedMinutes));
};

/**
 * Calculates typing accuracy percentage from correct and total keystrokes.
 */
export const calculateAccuracy = (correctKeystrokes: number, totalKeystrokes: number): number => {
  if (totalKeystrokes <= 0) return 100;
  const ratio = (correctKeystrokes / totalKeystrokes) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio)));
};

/**
 * Computes character-by-character diff and typing engine state.
 */
export const computeTypingState = (
  activePassage: string,
  typedInput: string,
  totalKeystrokes: number,
  correctKeystrokes: number,
  elapsedSeconds: number
): TypingEngineState => {
  const passageLen = activePassage.length;
  const typedLen = typedInput.length;

  // Find first mismatched character
  let firstMismatch: number | null = null;
  for (let i = 0; i < typedLen; i++) {
    if (i >= passageLen || typedInput[i] !== activePassage[i]) {
      firstMismatch = i;
      break;
    }
  }

  const hasError = firstMismatch !== null;
  const errorIndex = firstMismatch;
  const correctPrefixLength = firstMismatch !== null ? firstMismatch : Math.min(typedLen, passageLen);

  // Generate character diff segments
  const maxLen = Math.max(passageLen, typedLen);
  const diff: CharDiff[] = [];

  for (let i = 0; i < maxLen; i++) {
    const expected = i < passageLen ? activePassage[i] : '';
    const typed = i < typedLen ? typedInput[i] : undefined;

    let status: CharStatus = 'upcoming';

    if (i < typedLen) {
      if (i < passageLen && typed === expected) {
        status = 'correct';
      } else {
        status = 'incorrect';
      }
    } else if (i === typedLen) {
      status = 'current';
    } else {
      status = 'upcoming';
    }

    diff.push({
      index: i,
      expected: expected || (typed || ''),
      typed,
      status
    });
  }

  const progressPercent = passageLen > 0
    ? Math.min(100, Math.round((correctPrefixLength / passageLen) * 100))
    : 0;

  const isComplete = !hasError && typedLen >= passageLen && passageLen > 0;
  const wpm = calculateWpm(correctPrefixLength, elapsedSeconds);
  const accuracy = calculateAccuracy(correctKeystrokes, totalKeystrokes);

  return {
    diff,
    correctPrefixLength,
    hasError,
    errorIndex,
    progressPercent,
    isComplete,
    accuracy,
    wpm
  };
};
