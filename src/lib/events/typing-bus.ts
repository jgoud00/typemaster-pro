import mitt, { type Handler } from 'mitt';
import { Finger } from '@/types';

export type KeystrokeContext = {
    key: string;
    expectedChar: string;
    isCorrect: boolean;
    timestamp: number;
    delayFromLastKey: number;
    finger: Finger;
    previousKey: string | null;
    wpm: number;
    accuracy: number;
    textLength: number;
    currentIndex: number;
};

export type TypingEvents = {
    'KEYSTROKE_REGISTERED': KeystrokeContext;
    'TYPING_STARTED': void;
    'TYPING_PAUSED': { elapsedTime: number };
    'TYPING_RESUMED': { elapsedTime: number };
    'TYPING_COMPLETED': { wpm: number; accuracy: number; totalErrors: number; valid?: boolean; duration: number };
    'COMBO_ACHIEVED': { combo: number };
    'COMBO_BROKEN': { lastCombo: number };
};

const _bus = typeof window !== 'undefined' ? mitt<TypingEvents>() : null;

/**
 * Type-safe event bus wrapper.
 * SSR-safe: all operations are no-ops on the server.
 */
export const typingBus = {
    on<K extends keyof TypingEvents>(type: K, handler: Handler<TypingEvents[K]>): void {
        if (typeof window === 'undefined') return;
        _bus?.on(type, handler);
    },
    off<K extends keyof TypingEvents>(type: K, handler: Handler<TypingEvents[K]>): void {
        if (typeof window === 'undefined') return;
        _bus?.off(type, handler);
    },
    emit<K extends keyof TypingEvents>(type: K, ...args: TypingEvents[K] extends void ? [] : [TypingEvents[K]]): void {
        if (typeof window === 'undefined') return;
        // mitt expects (type, event?) — we spread to handle void events
        (_bus as ReturnType<typeof mitt<TypingEvents>>)?.emit(type, ...args as [TypingEvents[K]]);
    },
    all: _bus?.all ?? new Map(),
};
