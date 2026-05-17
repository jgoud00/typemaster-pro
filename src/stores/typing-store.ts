'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { TypingState, KeystrokeEvent, Finger } from '@/types';
import { getKeyData } from '@/lib/keyboard-data';
import type { LayoutName } from '@/lib/keyboard-layouts';

// ─── Keystroke buffer (outside reactive state — no re-renders) ───────────────
const MAX_KEYSTROKES_BUFFER = 1000;
const _keystrokeBuffer: KeystrokeEvent[] = [];

export function getKeystrokeBuffer(): KeystrokeEvent[] {
    return _keystrokeBuffer;
}

function clearKeystrokeBuffer() {
    _keystrokeBuffer.length = 0;
}

function pushKeystroke(event: KeystrokeEvent) {
    if (_keystrokeBuffer.length >= MAX_KEYSTROKES_BUFFER) {
        _keystrokeBuffer.shift();
    }
    _keystrokeBuffer.push(event);
}

// ─── Error index Set (outside reactive state) ─────────────────────────────────
// Mirrors errorIndices for O(1) membership test, eliminating the O(n)
// .includes() scan and [...spread] allocation on every incorrect keystroke.
const _errorSet = new Set<number>();

function clearErrorSet() {
    _errorSet.clear();
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface TypingStore {
    state: TypingState;
    activeKey: string | null;
    lastKeystrokeTime: number | null;

    // O(1) counters — avoids scanning errorIndices/keystrokes arrays
    correctCount: number;
    totalCount: number;

    // Actions
    setText: (text: string) => void;
    handleKeystroke: (key: string, layoutName?: LayoutName) => KeystrokeEvent | null;
    reset: () => void;
    pause: () => void;
    resume: () => void;

    // Computed — call via useTypingStore.getState().getWpm() inside intervals,
    // or via useTypingStore(s => s.getWpm()) as a selector (see usage guide below)
    getWpm: () => number;
    getAccuracy: () => number;
    getElapsedTime: () => number;
    getProgress: () => number;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: TypingState = {
    text: '',
    currentIndex: 0,
    startTime: null,
    endTime: null,
    errorIndices: [],
    keystrokes: [],   // kept in TypingState for type-compat; always empty array
    isComplete: false,
    isPaused: false,
    pausedMs: 0,
    pauseStart: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────
// subscribeWithSelector middleware enables granular subscriptions:
//   useTypingStore(s => s.state.currentIndex)  → re-renders only when index changes
//   useTypingStore.subscribe(s => s.activeKey, cb)  → imperative subscription

export const useTypingStore = create<TypingStore>()(
    subscribeWithSelector((set, get) => ({
        state: initialState,
        activeKey: null,
        lastKeystrokeTime: null,
        correctCount: 0,
        totalCount: 0,

        // ── setText ──────────────────────────────────────────────────────────
        setText: (text: string) => {
            clearKeystrokeBuffer();
            clearErrorSet();
            set({
                state: { ...initialState, text },
                activeKey: text.length > 0 ? text[0] : null,
                lastKeystrokeTime: null,
                correctCount: 0,
                totalCount: 0,
            });
        },

        // ── handleKeystroke ──────────────────────────────────────────────────
        // FIX: keystrokes pushed to external buffer, not into state.
        // This eliminates the [...state.keystrokes, keystroke] allocation that
        // previously forced a new `state` object reference on every keypress.
        handleKeystroke: (key: string, layoutName?: LayoutName): KeystrokeEvent | null => {
            const { state, lastKeystrokeTime, correctCount, totalCount } = get();

            if (state.isComplete || state.isPaused || state.text.length === 0) {
                return null;
            }

            const now = Date.now();
            const expected = state.text[state.currentIndex];
            const isCorrect = key === expected;
            const previousKey = state.currentIndex > 0
                ? state.text[state.currentIndex - 1]
                : null;

            const hesitationMs = lastKeystrokeTime
                ? now - lastKeystrokeTime
                : state.startTime
                    ? now - state.startTime
                    : 0;

            const keyData = getKeyData(expected, layoutName ?? 'qwerty');
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

            // Push to external buffer — zero reactive cost
            pushKeystroke(keystroke);

            const newIndex = isCorrect ? state.currentIndex + 1 : state.currentIndex;
            const isComplete = newIndex >= state.text.length;

            // O(1) Set lookup — no array scan, no spread allocation on error.
            let newErrorIndices = state.errorIndices;
            if (!isCorrect && !_errorSet.has(state.currentIndex)) {
                _errorSet.add(state.currentIndex);
                newErrorIndices = [...state.errorIndices, state.currentIndex];
            }

            set({
                state: {
                    ...state,
                    currentIndex: newIndex,
                    startTime: state.startTime ?? now,
                    endTime: isComplete ? now : null,
                    errorIndices: newErrorIndices,
                    keystrokes: [],   // always empty; real buffer is _keystrokeBuffer
                    isComplete,
                },
                activeKey: isComplete ? null : state.text[newIndex],
                lastKeystrokeTime: now,
                correctCount: isCorrect ? correctCount + 1 : correctCount,
                totalCount: totalCount + 1,
            });

            return keystroke;
        },

        // ── reset ────────────────────────────────────────────────────────────
        reset: () => {
            const { state } = get();
            clearKeystrokeBuffer();
            clearErrorSet();
            set({
                state: { ...initialState, text: state.text },
                activeKey: state.text.length > 0 ? state.text[0] : null,
                lastKeystrokeTime: null,
                correctCount: 0,
                totalCount: 0,
            });
        },

        // ── pause / resume ───────────────────────────────────────────────────
        pause: () => {
            set(s => {
                if (s.state.isPaused) return s;
                return { state: { ...s.state, isPaused: true, pauseStart: Date.now() } };
            });
        },

        resume: () => {
            set(s => {
                if (!s.state.isPaused) return s;
                return {
                    state: {
                        ...s.state,
                        isPaused: false,
                        pausedMs: s.state.pausedMs + (Date.now() - (s.state.pauseStart || Date.now())),
                        pauseStart: null,
                    },
                };
            });
        },

        // ── computed ─────────────────────────────────────────────────────────
        // NOTE on usage:
        //   ❌ const wpm = useTypingStore(s => s.getWpm())
        //      Re-evaluates on every state change; Date.now() inside makes value
        //      unstable between keystrokes.
        //
        //   ✅ Poll via interval (recommended for live display):
        //      useEffect(() => {
        //        const id = setInterval(() =>
        //          setWpm(useTypingStore.getState().getWpm()), 500);
        //        return () => clearInterval(id);
        //      }, []);
        //
        //   ✅ One-shot read at completion:
        //      const record = useTypingStore.getState().getWpm();

        getWpm: () => {
            const { state, correctCount } = get();
            if (!state.startTime) return 0;

            const endTime = state.endTime ?? Date.now();
            const activePause = state.pauseStart ? (Date.now() - state.pauseStart) : 0;
            const elapsedSeconds = Math.max(
                0,
                (endTime - state.startTime - state.pausedMs - activePause)
            ) / 1000;

            if (elapsedSeconds < 1 || correctCount < 3) return 0;
            return Math.round((correctCount / 5) / (elapsedSeconds / 60));
        },

        getAccuracy: () => {
            const { correctCount, totalCount } = get();
            if (totalCount === 0) return 100;
            return Math.round((correctCount / totalCount) * 100);
        },

        getElapsedTime: () => {
            const { state } = get();
            if (!state.startTime) return 0;

            const endTime = state.endTime ?? Date.now();
            const activePause = state.pauseStart ? (Date.now() - state.pauseStart) : 0;
            return Math.max(
                0,
                Math.floor((endTime - state.startTime - state.pausedMs - activePause) / 1000)
            );
        },

        getProgress: () => {
            const { state } = get();
            if (state.text.length === 0) return 0;
            return (state.currentIndex / state.text.length) * 100;
        },
    }))
);

// ─── Granular selector hooks (use these in components) ───────────────────────
// Each hook only re-renders when its specific slice changes.

export const useCurrentIndex = () =>
    useTypingStore(s => s.state.currentIndex);

export const useIsComplete = () =>
    useTypingStore(s => s.state.isComplete);

export const useIsPaused = () =>
    useTypingStore(s => s.state.isPaused);

export const useActiveKey = () =>
    useTypingStore(s => s.activeKey);

export const useErrorIndices = () =>
    useTypingStore(s => s.state.errorIndices);

export const useTypingText = () =>
    useTypingStore(s => s.state.text);

export const useHasStarted = () =>
    useTypingStore(s => s.state.startTime !== null);