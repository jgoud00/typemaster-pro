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
    'COMBO_BROKEN': void;
};

export const typingBus = mitt<TypingEvents>();
