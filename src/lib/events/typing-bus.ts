// src/lib/events/typing-bus.ts
import mitt from 'mitt';

export type KeystrokeContext = {
    key: string;
    expectedChar: string;
    isCorrect: boolean;
    timestamp: number;
    delayFromLastKey: number;
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
    'TYPING_COMPLETED': { wpm: number; accuracy: number; totalErrors: number };
    'COMBO_ACHIEVED': { combo: number };
    'COMBO_BROKEN': void;
};

export const typingBus = mitt<TypingEvents>();
