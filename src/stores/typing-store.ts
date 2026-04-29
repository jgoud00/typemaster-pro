'use client';

import { create } from 'zustand';
import { TypingState, KeystrokeEvent, Finger } from '@/types';
import { getKeyData } from '@/lib/keyboard-data';
import { useSettingsStore } from './settings-store';

// Performance maximization: Limit history to constant size
const MAX_KEYSTROKES_BUFFER = 1000;

interface TypingStore {
    state: TypingState;
    activeKey: string | null;
    lastKeystrokeTime: number | null;

    // Performance counters (O(1) tracking instead of array iteration)
    correctCount: number;
    totalCount: number;

    // Actions
    setText: (text: string) => void;
    handleKeystroke: (key: string) => KeystrokeEvent | null;
    reset: () => void;
    pause: () => void;
    resume: () => void;
    setRiskLevel: (level: number) => void;

    // Computed
    getWpm: () => number;
    getAccuracy: () => number;
    getElapsedTime: () => number;
    getProgress: () => number;
}

const initialState: TypingState = {
    text: '',
    currentIndex: 0,
    startTime: null,
    endTime: null,
    errorIndices: [],
    keystrokes: [],
    isComplete: false,
    isPaused: false,
    pausedMs: 0,
    pauseStart: null,
    riskLevel: 0,
};

export const useTypingStore = create<TypingStore>((set, get) => ({
    state: initialState,
    activeKey: null,
    lastKeystrokeTime: null,

    // Initialize counters
    correctCount: 0,
    totalCount: 0,

    setText: (text: string) => {
        set({
            state: { ...initialState, text },
            activeKey: text.length > 0 ? text[0] : null,
            lastKeystrokeTime: null,
            correctCount: 0,
            totalCount: 0,
        });
    },

    setRiskLevel: (level: number) => {
        set((s) => ({
            state: { ...s.state, riskLevel: level }
        }));
    },

    handleKeystroke: (key: string): KeystrokeEvent | null => {
        const { state, lastKeystrokeTime, correctCount, totalCount } = get();

        if (state.isComplete || state.isPaused || state.text.length === 0) {
            return null;
        }

        const now = Date.now();
        const expected = state.text[state.currentIndex];
        const isCorrect = key === expected;
        const previousKey = state.currentIndex > 0 ? state.text[state.currentIndex - 1] : null;

        // Calculate hesitation (time since last keystroke or start)
        const hesitationMs = lastKeystrokeTime
            ? now - lastKeystrokeTime
            : (state.startTime ? now - state.startTime : 0);

        // Get finger for the expected key based on active layout
        const layoutName = useSettingsStore.getState().settings.keyboardLayout;
        const keyData = getKeyData(expected, layoutName);
        const finger: Finger = keyData?.finger ?? 'right-index';

        const keystroke: KeystrokeEvent = {
            key,
            expected,
            timestamp: now,
            isCorrect,
            hesitationMs,
            finger,
            previousKey,
        };

        // Calculate new index (only advance on correct keystroke)
        const newIndex = isCorrect ? state.currentIndex + 1 : state.currentIndex;
        const isComplete = newIndex >= state.text.length;

        const newKeystrokes = [...state.keystrokes, keystroke];
        if (newKeystrokes.length > MAX_KEYSTROKES_BUFFER) {
            newKeystrokes.shift();
        }

        set({
            state: {
                ...state,
                currentIndex: newIndex,
                startTime: state.startTime ?? now,
                endTime: isComplete ? now : null,
                errorIndices: isCorrect ? state.errorIndices
                    : state.errorIndices.includes(state.currentIndex)
                        ? state.errorIndices
                        : [...state.errorIndices, state.currentIndex],
                keystrokes: newKeystrokes,
                isComplete,
            },
            activeKey: isComplete ? null : state.text[newIndex],
            lastKeystrokeTime: now,
            // Update counters (O(1) operation)
            correctCount: isCorrect ? correctCount + 1 : correctCount,
            totalCount: totalCount + 1,
        });

        return keystroke;
    },

    reset: () => {
        const { state } = get();
        set({
            state: { ...initialState, text: state.text },
            activeKey: state.text.length > 0 ? state.text[0] : null,
            lastKeystrokeTime: null,
            correctCount: 0,
            totalCount: 0,
        });
    },

    pause: () => {
        set(s => {
            if (s.state.isPaused) return s; // idempotent: already paused
            return { state: { ...s.state, isPaused: true, pauseStart: Date.now() } };
        });
    },

    resume: () => {
        set(s => {
            if (!s.state.isPaused) return s; // idempotent: not paused
            return {
                state: {
                    ...s.state,
                    isPaused: false,
                    pausedMs: s.state.pausedMs + (Date.now() - (s.state.pauseStart || Date.now())),
                    pauseStart: null,
                }
            };
        });
    },

    getWpm: () => {
        const { state, correctCount } = get();
        if (!state.startTime) return 0;

        const endTime = state.endTime ?? Date.now();
        const activePause = state.pauseStart ? (Date.now() - state.pauseStart) : 0;
        const elapsedSeconds = Math.max(0, (endTime - state.startTime - state.pausedMs - activePause)) / 1000;

        // Guard: Minimum time and characters to prevent spikes
        if (elapsedSeconds < 1 || correctCount < 3) return 0;

        return Math.round((correctCount / 5) / (elapsedSeconds / 60));
    },

    getAccuracy: () => {
        const { correctCount, totalCount } = get();
        if (totalCount === 0) return 100;

        // Use counters instead of array filter (O(1) vs O(n))
        return Math.round((correctCount / totalCount) * 100);
    },

    getElapsedTime: () => {
        const { state } = get();
        if (!state.startTime) return 0;

        const endTime = state.endTime ?? Date.now();
        const activePause = state.pauseStart ? (Date.now() - state.pauseStart) : 0;
        return Math.max(0, Math.floor((endTime - state.startTime - state.pausedMs - activePause) / 1000));
    },

    getProgress: () => {
        const { state } = get();
        if (state.text.length === 0) return 0;
        return (state.currentIndex / state.text.length) * 100;
    },
}));
