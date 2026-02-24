'use client';

import { create } from 'zustand';
import { TypingState, KeystrokeEvent, Finger } from '@/types';
import { getKeyData } from '@/lib/keyboard-data';

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

        // Get finger for the expected key
        const keyData = getKeyData(expected);
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

        // Performance fix: Use circular buffer - drop oldest if over limit
        // This prevents O(n) memory growth in long sessions
        let newKeystrokes: KeystrokeEvent[];
        if (state.keystrokes.length >= MAX_KEYSTROKES_BUFFER) {
            // Drop oldest 100 entries when buffer is full (amortized O(1))
            newKeystrokes = [...state.keystrokes.slice(100), keystroke];
        } else {
            newKeystrokes = [...state.keystrokes, keystroke];
        }

        set({
            state: {
                ...state,
                currentIndex: newIndex,
                startTime: state.startTime ?? now,
                endTime: isComplete ? now : null,
                errorIndices: isCorrect ? state.errorIndices : [...state.errorIndices, state.currentIndex],
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
        set(s => ({ state: { ...s.state, isPaused: true } }));
    },

    resume: () => {
        set(s => ({ state: { ...s.state, isPaused: false } }));
    },

    getWpm: () => {
        const { state, correctCount } = get();
        if (!state.startTime) return 0;

        const endTime = state.endTime ?? Date.now();
        const elapsedSeconds = (endTime - state.startTime) / 1000;

        // Guard: Minimum time and characters to prevent spikes
        if (elapsedSeconds < 2 || correctCount < 5) return 0;

        const elapsedMinutes = elapsedSeconds / 60;
        // Use counter instead of array filter (O(1) vs O(n))
        const words = correctCount / 5;

        return Math.round(words / elapsedMinutes);
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
        return Math.floor((endTime - state.startTime) / 1000);
    },

    getProgress: () => {
        const { state } = get();
        if (state.text.length === 0) return 0;
        return (state.currentIndex / state.text.length) * 100;
    },
}));
