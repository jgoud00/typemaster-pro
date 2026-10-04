'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { TypingState, KeystrokeEvent, Finger } from '@/types';
import { getKeyData } from '@/lib/keyboard-data';
import type { LayoutName } from '@/lib/keyboard-layouts';

// ─── Ring Buffer (O(1) push, no shift cost) ──────────────────────────────────
const RING_CAPACITY = 1000;

class RingBuffer<T> {
    private buf: (T | undefined)[];
    private head = 0;
    private _length = 0;
    private capacity: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.buf = new Array(capacity);
    }

    push(item: T): void {
        this.buf[(this.head + this._length) % this.capacity] = item;
        if (this._length < this.capacity) {
            this._length++;
        } else {
            this.head = (this.head + 1) % this.capacity;
        }
    }

    get length(): number { return this._length; }

    toArray(): T[] {
        const result: T[] = [];
        for (let i = 0; i < this._length; i++) {
            result.push(this.buf[(this.head + i) % this.capacity] as T);
        }
        return result;
    }

    slice(start: number, end?: number): T[] {
        const s = Math.max(0, start < 0 ? this._length + start : start);
        const e = end === undefined ? this._length : Math.min(this._length, end < 0 ? this._length + end : end);
        const result: T[] = [];
        for (let i = s; i < e; i++) {
            result.push(this.buf[(this.head + i) % this.capacity] as T);
        }
        return result;
    }

    clear(): void {
        this.head = 0;
        this._length = 0;
    }
}

// ─── Keystroke buffer (outside reactive state — no re-renders) ───────────────
const _keystrokeBuffer = new RingBuffer<KeystrokeEvent>(RING_CAPACITY);

export function getKeystrokeBuffer(): KeystrokeEvent[] {
    return _keystrokeBuffer.toArray();
}

export function getKeystrokeBufferSlice(start: number, end?: number): KeystrokeEvent[] {
    return _keystrokeBuffer.slice(start, end);
}

function clearKeystrokeBuffer() {
    _keystrokeBuffer.clear();
}

function pushKeystroke(event: KeystrokeEvent) {
    _keystrokeBuffer.push(event);
}

// ─── Error index Set (outside reactive state) ─────────────────────────────────
const _errorSet = new Set<number>();

function clearErrorSet() {
    _errorSet.clear();
}

// ─── High-resolution timing ──────────────────────────────────────────────────
// Use performance.now() for sub-millisecond precision where available
// (Removed hrTimestamp as it was never called)

// Epoch-relative timestamp for storage/sync (Date.now() based)
function epochTimestamp(): number {
    return Date.now();
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface TypingStore {
    state: TypingState;
    activeKey: string | null;
    lastKeystrokeTime: number | null;

    // O(1) counters
    correctCount: number;
    totalCount: number;
    errorMode: 'stop' | 'advance';
    setErrorMode: (mode: 'stop' | 'advance') => void;
    finish: (endTime?: number) => void;

    // Actions
    setText: (text: string) => void;
    handleKeystroke: (key: string, layoutName?: LayoutName) => KeystrokeEvent | null;
    handleBackspace: () => boolean;
    reset: () => void;
    pause: () => void;
    resume: () => void;

    // Computed
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
    isComplete: false,
    isPaused: false,
    pausedMs: 0,
    pauseStart: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTypingStore = create<TypingStore>()(
    subscribeWithSelector((set, get) => ({
        state: initialState,
        activeKey: null,
        lastKeystrokeTime: null,
        correctCount: 0,
        totalCount: 0,
        errorMode: 'stop',
        setErrorMode: (errorMode) => set({ errorMode }),
        finish: (endTime = epochTimestamp()) => {
            const { state } = get();
            if (state.isComplete) return;
            set({ state: { ...state, isComplete: true, endTime, pausedMs: state.pausedMs + (state.pauseStart !== null ? endTime - state.pauseStart : 0), pauseStart: null, isPaused: false }, activeKey: null });
        },

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

        handleKeystroke: (key: string, layoutName?: LayoutName): KeystrokeEvent | null => {
            const { state, lastKeystrokeTime, correctCount, totalCount } = get();

            if (state.isComplete || state.isPaused || state.text.length === 0 || key.length !== 1) {
                return null;
            }

            const now = epochTimestamp();
            const expected = state.text[state.currentIndex];
            const isCorrect = key === expected;
            const previousKey = state.currentIndex > 0
                ? state.text[state.currentIndex - 1]
                : null;

            const hesitationMs = lastKeystrokeTime !== null
                ? now - lastKeystrokeTime
                : state.startTime !== null
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

            pushKeystroke(keystroke);

            const newIndex = isCorrect || get().errorMode === 'advance' ? state.currentIndex + 1 : state.currentIndex;
            const isComplete = newIndex >= state.text.length;

            let newErrorIndices = state.errorIndices;
            if (isCorrect && _errorSet.delete(state.currentIndex)) {
                newErrorIndices = state.errorIndices.filter(index => index !== state.currentIndex);
            }
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
                    isComplete,
                },
                activeKey: isComplete ? null : state.text[newIndex],
                lastKeystrokeTime: now,
                correctCount: isCorrect ? correctCount + 1 : correctCount,
                totalCount: totalCount + 1,
            });

            return keystroke;
        },

        // ── handleBackspace ──────────────────────────────────────────────────
        // Monkeytype-style: moves currentIndex back by 1 (only for already-typed chars).
        // Does NOT undo errors or change accuracy counts — it simply lets the user re-type.
        handleBackspace: (): boolean => {
            const { state } = get();
            if (state.isComplete || state.isPaused || state.currentIndex === 0 || state.startTime === null) {
                return false;
            }

            const newIndex = state.currentIndex - 1;
            set({
                state: {
                    ...state,
                    currentIndex: newIndex,
                    isComplete: false,
                    endTime: null,
                },
                activeKey: state.text[newIndex],
            });
            return true;
        },

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

        pause: () => {
            set(s => {
                if (s.state.isPaused || s.state.isComplete || s.state.startTime === null) return s;
                return { state: { ...s.state, isPaused: true, pauseStart: epochTimestamp() } };
            });
        },

        resume: () => {
            set(s => {
                if (!s.state.isPaused) return s;
                return {
                    lastKeystrokeTime: epochTimestamp(),
                    state: {
                        ...s.state,
                        isPaused: false,
                        pausedMs: s.state.pausedMs + (epochTimestamp() - (s.state.pauseStart ?? epochTimestamp())),
                        pauseStart: null,
                    },
                };
            });
        },

        getWpm: () => {
            const { state } = get();
            if (state.startTime === null) return 0;

            const now = epochTimestamp();
            const endTime = state.endTime ?? now;
            const activePause = state.pauseStart !== null ? (now - state.pauseStart) : 0;
            const elapsedSeconds = Math.max(
                0,
                (endTime - state.startTime - state.pausedMs - activePause)
            ) / 1000;

            const netCharacters = state.currentIndex - state.errorIndices.filter(index => index < state.currentIndex).length;
            if (elapsedSeconds < 1 || netCharacters < 3) return 0;
            return Math.round((netCharacters / 5) / (elapsedSeconds / 60));
        },

        getAccuracy: () => {
            const { correctCount, totalCount } = get();
            if (totalCount === 0) return 100;
            return Math.round((correctCount / totalCount) * 100);
        },

        getElapsedTime: () => {
            const { state } = get();
            if (state.startTime === null) return 0;

            const now = epochTimestamp();
            const endTime = state.endTime ?? now;
            const activePause = state.pauseStart !== null ? (now - state.pauseStart) : 0;
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

// ─── Granular selector hooks ─────────────────────────────────────────────────

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