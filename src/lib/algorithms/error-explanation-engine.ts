/**
 * Error Explanation Engine
 * 
 * Analyzes typing errors and provides human-readable explanations
 * for WHY the error occurred, not just WHAT went wrong.
 */

// Keyboard layout for adjacency detection
const QWERTY_ROWS = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

// Finger assignments for each key
const FINGER_MAP: Record<string, { hand: 'left' | 'right'; finger: string }> = {
    // Left hand
    '`': { hand: 'left', finger: 'pinky' }, '1': { hand: 'left', finger: 'pinky' },
    'q': { hand: 'left', finger: 'pinky' }, 'a': { hand: 'left', finger: 'pinky' },
    'z': { hand: 'left', finger: 'pinky' },
    '2': { hand: 'left', finger: 'ring' }, 'w': { hand: 'left', finger: 'ring' },
    's': { hand: 'left', finger: 'ring' }, 'x': { hand: 'left', finger: 'ring' },
    '3': { hand: 'left', finger: 'middle' }, 'e': { hand: 'left', finger: 'middle' },
    'd': { hand: 'left', finger: 'middle' }, 'c': { hand: 'left', finger: 'middle' },
    '4': { hand: 'left', finger: 'index' }, 'r': { hand: 'left', finger: 'index' },
    'f': { hand: 'left', finger: 'index' }, 'v': { hand: 'left', finger: 'index' },
    '5': { hand: 'left', finger: 'index' }, 't': { hand: 'left', finger: 'index' },
    'g': { hand: 'left', finger: 'index' }, 'b': { hand: 'left', finger: 'index' },
    // Right hand
    '6': { hand: 'right', finger: 'index' }, 'y': { hand: 'right', finger: 'index' },
    'h': { hand: 'right', finger: 'index' }, 'n': { hand: 'right', finger: 'index' },
    '7': { hand: 'right', finger: 'index' }, 'u': { hand: 'right', finger: 'index' },
    'j': { hand: 'right', finger: 'index' }, 'm': { hand: 'right', finger: 'index' },
    '8': { hand: 'right', finger: 'middle' }, 'i': { hand: 'right', finger: 'middle' },
    'k': { hand: 'right', finger: 'middle' }, ',': { hand: 'right', finger: 'middle' },
    '9': { hand: 'right', finger: 'ring' }, 'o': { hand: 'right', finger: 'ring' },
    'l': { hand: 'right', finger: 'ring' }, '.': { hand: 'right', finger: 'ring' },
    '0': { hand: 'right', finger: 'pinky' }, 'p': { hand: 'right', finger: 'pinky' },
    ';': { hand: 'right', finger: 'pinky' }, '/': { hand: 'right', finger: 'pinky' },
    '-': { hand: 'right', finger: 'pinky' }, '[': { hand: 'right', finger: 'pinky' },
    "'": { hand: 'right', finger: 'pinky' }, ']': { hand: 'right', finger: 'pinky' },
    '=': { hand: 'right', finger: 'pinky' }, '\\': { hand: 'right', finger: 'pinky' },
};

// Common transpositions
const COMMON_TRANSPOSITIONS = [
    { wrong: 'teh', correct: 'the' },
    { wrong: 'hte', correct: 'the' },
    { wrong: 'adn', correct: 'and' },
    { wrong: 'nad', correct: 'and' },
    { wrong: 'taht', correct: 'that' },
    { wrong: 'thta', correct: 'that' },
    { wrong: 'wiht', correct: 'with' },
    { wrong: 'whit', correct: 'with' },
    { wrong: 'form', correct: 'from' },
    { wrong: 'fomr', correct: 'from' },
    { wrong: 'yuo', correct: 'you' },
    { wrong: 'oyu', correct: 'you' },
    { wrong: 'jsut', correct: 'just' },
    { wrong: 'waht', correct: 'what' },
    { wrong: 'hvae', correct: 'have' },
    { wrong: 'ahve', correct: 'have' },
];

export interface ErrorExplanation {
    type: 'adjacent' | 'transposition' | 'fatigue' | 'timing' | 'same_finger' | 'unknown';
    title: string;
    explanation: string;
    suggestion: string;
    icon: string;
    severity: 'low' | 'medium' | 'high';
}

export interface ErrorContext {
    expected: string;
    actual: string;
    previousChars: string;
    recentErrors: number; // Errors in last 10 keystrokes
    timeSinceLastError: number; // ms
    currentWpm: number;
    sessionDuration: number; // minutes
}

class ErrorExplanationEngine {
    private errorHistory: Array<{ timestamp: number; expected: string; actual: string }> = [];

    /**
     * Record an error for pattern detection
     */
    recordError(expected: string, actual: string): void {
        this.errorHistory.push({
            timestamp: Date.now(),
            expected,
            actual,
        });

        // Keep only last 50 errors
        if (this.errorHistory.length > 50) {
            this.errorHistory.shift();
        }
    }

    /**
     * Analyze an error and return an explanation
     */
    analyzeError(context: ErrorContext): ErrorExplanation {
        const { expected, actual, previousChars, recentErrors, sessionDuration, currentWpm } = context;

        // Check for fatigue first (overrides other explanations)
        if (this.detectFatigue(recentErrors, sessionDuration)) {
            return {
                type: 'fatigue',
                title: 'Fatigue Detected',
                explanation: `You've made ${recentErrors} errors recently. Your fingers may be tired.`,
                suggestion: 'Consider taking a 2-minute break to rest your hands.',
                icon: '😴',
                severity: 'high',
            };
        }

        // Check for transposition
        const transposition = this.detectTransposition(previousChars + expected, previousChars + actual);
        if (transposition) {
            return {
                type: 'transposition',
                title: 'Letter Swap',
                explanation: `Classic transposition: "${transposition.wrong}" → "${transposition.correct}"`,
                suggestion: `Try thinking of "${transposition.correct.slice(0, 2)}" as a single unit.`,
                icon: '🔀',
                severity: 'medium',
            };
        }

        // Check for adjacent key
        if (this.areAdjacent(expected.toLowerCase(), actual.toLowerCase())) {
            const fingerInfo = FINGER_MAP[expected.toLowerCase()];
            const hand = fingerInfo?.hand || 'your';
            return {
                type: 'adjacent',
                title: 'Adjacent Key',
                explanation: `You hit "${actual.toUpperCase()}" instead of "${expected.toUpperCase()}" (next to each other).`,
                suggestion: `Slow down slightly on ${hand} hand movements.`,
                icon: '👆',
                severity: 'low',
            };
        }

        // Check for same-finger confusion
        if (this.areSameFinger(expected.toLowerCase(), actual.toLowerCase())) {
            const fingerInfo = FINGER_MAP[expected.toLowerCase()];
            return {
                type: 'same_finger',
                title: 'Same Finger Confusion',
                explanation: `Both "${expected}" and "${actual}" use the ${fingerInfo?.finger || 'same'} finger.`,
                suggestion: 'Practice distinguishing vertical movements on this finger.',
                icon: '☝️',
                severity: 'medium',
            };
        }

        // Check for timing issues (typing too fast)
        if (currentWpm > 80 && recentErrors >= 2) {
            return {
                type: 'timing',
                title: 'Speed Causing Errors',
                explanation: `At ${currentWpm} WPM with ${recentErrors} recent errors, you may be rushing.`,
                suggestion: 'Try reducing speed by 10-15% to improve accuracy.',
                icon: '⏱️',
                severity: 'medium',
            };
        }

        // Unknown/generic error
        return {
            type: 'unknown',
            title: 'Typing Error',
            explanation: `Expected "${expected}" but typed "${actual}".`,
            suggestion: 'Focus on the target key before pressing.',
            icon: '❌',
            severity: 'low',
        };
    }

    /**
     * Check if two keys are adjacent on the keyboard
     */
    private areAdjacent(key1: string, key2: string): boolean {
        for (let row = 0; row < QWERTY_ROWS.length; row++) {
            const rowKeys = QWERTY_ROWS[row];
            const idx1 = rowKeys.indexOf(key1);
            const idx2 = rowKeys.indexOf(key2);

            // Same row, adjacent columns
            if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) === 1) {
                return true;
            }

            // Check adjacent rows
            if (idx1 !== -1 && row < QWERTY_ROWS.length - 1) {
                const nextRow = QWERTY_ROWS[row + 1];
                const nextIdx = nextRow.indexOf(key2);
                if (nextIdx !== -1 && Math.abs(idx1 - nextIdx) <= 1) {
                    return true;
                }
            }
            if (idx1 !== -1 && row > 0) {
                const prevRow = QWERTY_ROWS[row - 1];
                const prevIdx = prevRow.indexOf(key2);
                if (prevIdx !== -1 && Math.abs(idx1 - prevIdx) <= 1) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Check if two keys use the same finger
     */
    private areSameFinger(key1: string, key2: string): boolean {
        const finger1 = FINGER_MAP[key1];
        const finger2 = FINGER_MAP[key2];
        return finger1 && finger2 && finger1.hand === finger2.hand && finger1.finger === finger2.finger;
    }

    /**
     * Detect transposition patterns
     */
    private detectTransposition(expected: string, actual: string): { wrong: string; correct: string } | null {
        const lowerExpected = expected.toLowerCase();
        const lowerActual = actual.toLowerCase();

        for (const trans of COMMON_TRANSPOSITIONS) {
            if (lowerActual.includes(trans.wrong) && lowerExpected.includes(trans.correct)) {
                return trans;
            }
        }

        // Generic transposition detection (swapped adjacent letters)
        if (expected.length >= 2 && actual.length >= 2) {
            const last2Expected = expected.slice(-2);
            const last2Actual = actual.slice(-2);
            if (last2Expected[0] === last2Actual[1] && last2Expected[1] === last2Actual[0]) {
                return { wrong: last2Actual, correct: last2Expected };
            }
        }

        return null;
    }

    /**
     * Detect fatigue patterns
     */
    private detectFatigue(recentErrors: number, sessionMinutes: number): boolean {
        // High error rate
        if (recentErrors >= 3) return true;

        // Long session with increasing errors
        if (sessionMinutes >= 20 && recentErrors >= 2) return true;

        // Check error acceleration (errors getting more frequent)
        const recentTimestamps = this.errorHistory.slice(-5).map(e => e.timestamp);
        if (recentTimestamps.length >= 3) {
            const intervals = [];
            for (let i = 1; i < recentTimestamps.length; i++) {
                intervals.push(recentTimestamps[i] - recentTimestamps[i - 1]);
            }
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            if (avgInterval < 3000) return true; // Errors within 3 seconds of each other
        }

        return false;
    }

    /**
     * Get error patterns over time
     */
    getErrorPatterns(): { type: string; count: number }[] {
        const patterns: Record<string, number> = {};

        for (let i = 0; i < this.errorHistory.length; i++) {
            const { expected, actual } = this.errorHistory[i];
            const explanation = this.analyzeError({
                expected,
                actual,
                previousChars: '',
                recentErrors: 0,
                timeSinceLastError: 0,
                currentWpm: 0,
                sessionDuration: 0,
            });
            patterns[explanation.type] = (patterns[explanation.type] || 0) + 1;
        }

        return Object.entries(patterns)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Clear error history
     */
    reset(): void {
        this.errorHistory = [];
    }
}

export const errorExplanationEngine = new ErrorExplanationEngine();
