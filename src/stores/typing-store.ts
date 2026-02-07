'use client';

import { create } from 'zustand';
import { TypingState, KeystrokeEvent, Finger } from '@/types';
import { getKeyData } from '@/lib/keyboard-data';

interface TypingStore {
    state: TypingState;
    activeKey: string | null;
    lastKeystrokeTime: number | null;

    // Actions
    setText: (text: string) => void;
    handleKeystroke: (key: string) => KeystrokeEvent | null;
    reset: () => void;
    pause: () => void;
    resume: () => void;

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
};

export const useTypingStore = create<TypingStore>((set, get) => ({
    state: initialState,
    activeKey: null,
    lastKeystrokeTime: null,

    setText: (text: string) => {
        set({
            state: { ...initialState, text },
            activeKey: text.length > 0 ? text[0] : null,
            lastKeystrokeTime: null,
        });
    },

    handleKeystroke: (key: string): KeystrokeEvent | null => {
        const { state, lastKeystrokeTime } = get();

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

        set({
            state: {
                ...state,
                currentIndex: newIndex,
                startTime: state.startTime ?? now,
                endTime: isComplete ? now : null,
                errorIndices: isCorrect ? state.errorIndices : [...state.errorIndices, state.currentIndex],
                keystrokes: [...state.keystrokes, keystroke],
                isComplete,
            },
            activeKey: isComplete ? null : state.text[newIndex],
            lastKeystrokeTime: now,
        });

        return keystroke;
    },

    reset: () => {
        const { state } = get();
        set({
            state: { ...initialState, text: state.text },
            activeKey: state.text.length > 0 ? state.text[0] : null,
            lastKeystrokeTime: null,
        });
    },

    pause: () => {
        set(s => ({ state: { ...s.state, isPaused: true } }));
    },

    resume: () => {
        set(s => ({ state: { ...s.state, isPaused: false } }));
    },

    getWpm: () => {
        const { state } = get();
        if (!state.startTime) return 0;

        const endTime = state.endTime ?? Date.now();
        const elapsedMinutes = (endTime - state.startTime) / 60000;
        if (elapsedMinutes < 0.05) return 0; // Avoid division issues

        const correctChars = state.keystrokes.filter(k => k.isCorrect).length;
        const words = correctChars / 5;

        return Math.round(words / elapsedMinutes);
    },

    getAccuracy: () => {
        const { state } = get();
        if (state.keystrokes.length === 0) return 100;

        const correctCount = state.keystrokes.filter(k => k.isCorrect).length;
        return Math.round((correctCount / state.keystrokes.length) * 100);
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
