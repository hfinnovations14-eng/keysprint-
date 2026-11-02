// Unit Tests for KeySprint Core Typing Engine
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWpm,
  calculateAccuracy,
  computeTypingState
} from './typingEngine.ts';

test('calculateWpm: computes standard 5-character words per minute', () => {
  // 50 characters in 60 seconds = 10 WPM
  assert.equal(calculateWpm(50, 60), 10);
  // 250 characters in 60 seconds = 50 WPM
  assert.equal(calculateWpm(250, 60), 50);
  // 0 characters or 0 seconds
  assert.equal(calculateWpm(0, 30), 0);
  assert.equal(calculateWpm(100, 0), 0);
});

test('calculateAccuracy: computes ratio of correct vs total keystrokes', () => {
  assert.equal(calculateAccuracy(100, 100), 100);
  assert.equal(calculateAccuracy(95, 100), 95);
  assert.equal(calculateAccuracy(0, 10), 0);
  assert.equal(calculateAccuracy(0, 0), 100);
});

test('computeTypingState: handles accurate partial typing without error', () => {
  const passage = 'The quick brown fox';
  const typed = 'The qui';
  const state = computeTypingState(passage, typed, 7, 7, 10);

  assert.equal(state.hasError, false);
  assert.equal(state.errorIndex, null);
  assert.equal(state.correctPrefixLength, 7);
  assert.equal(state.isComplete, false);
  assert.equal(state.accuracy, 100);

  // Check character diff
  assert.equal(state.diff[0].status, 'correct'); // 'T'
  assert.equal(state.diff[6].status, 'correct'); // 'i'
  assert.equal(state.diff[7].status, 'current'); // cursor at 'c'
  assert.equal(state.diff[8].status, 'upcoming'); // 'k'
});

test('computeTypingState: visibly flags mistyped characters as incorrect', () => {
  const passage = 'The quick';
  // User typed 'Tha' instead of 'The'
  const typed = 'Tha';
  const state = computeTypingState(passage, typed, 3, 2, 5);

  assert.equal(state.hasError, true);
  assert.equal(state.errorIndex, 2);
  assert.equal(state.correctPrefixLength, 2); // 'Th' is correct
  assert.equal(state.isComplete, false);

  assert.equal(state.diff[0].status, 'correct');   // 'T'
  assert.equal(state.diff[1].status, 'correct');   // 'h'
  assert.equal(state.diff[2].status, 'incorrect'); // expected 'e', typed 'a'
  assert.equal(state.diff[2].expected, 'e');
  assert.equal(state.diff[2].typed, 'a');
  assert.equal(state.diff[3].status, 'current');   // cursor after error
});

test('computeTypingState: recovers immediately when typo is backspaced', () => {
  const passage = 'Fast cars';
  // 1. With typo
  const stateWithTypo = computeTypingState(passage, 'Fasx', 4, 3, 4);
  assert.equal(stateWithTypo.hasError, true);
  assert.equal(stateWithTypo.errorIndex, 3);

  // 2. User presses Backspace to 'Fas'
  const stateRecovered = computeTypingState(passage, 'Fas', 5, 3, 5);
  assert.equal(stateRecovered.hasError, false);
  assert.equal(stateRecovered.errorIndex, null);
  assert.equal(stateRecovered.diff[3].status, 'current'); // cursor at 't'
});

test('computeTypingState: detects full passage completion accurately', () => {
  const passage = 'Sprint!';
  const typed = 'Sprint!';
  const state = computeTypingState(passage, typed, 7, 7, 5);

  assert.equal(state.hasError, false);
  assert.equal(state.isComplete, true);
  assert.equal(state.progressPercent, 100);
});
