import mitt from 'mitt';
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
    'TYPING_COMPLETED': { wpm: number; accuracy: number; totalErrors: number; valid?: boolean };
    'COMBO_ACHIEVED': { combo: number };
    'COMBO_BROKEN': { lastCombo: number };
};

const _bus = typeof window !== 'undefined' ? mitt<TypingEvents>() : null;

export const typingBus = {
    on: (type: any, handler: any) => {
        if (typeof window === 'undefined') return;
        _bus?.on(type, handler);
    },
    off: (type: any, handler: any) => {
        if (typeof window === 'undefined') return;
        _bus?.off(type, handler);
    },
    emit: (type: any, event?: any) => {
        if (typeof window === 'undefined') return;
        _bus?.emit(type, event);
    },
    all: _bus?.all || new Map()
} as unknown as ReturnType<typeof mitt<TypingEvents>>;
