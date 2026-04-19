/**
 * Error Explanation Engine
 * 
 * Analyzes typing errors and provides human-readable explanations
 * for WHY the error occurred, not just WHAT went wrong.
 */

import { getLayout, LayoutName } from '../keyboard-layouts';
import { getKeyData } from '../keyboard-data';

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
    layoutName?: LayoutName; // active layout
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
        const { expected, actual, previousChars, recentErrors, sessionDuration, currentWpm, layoutName = 'qwerty' } = context;

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
        if (this.areAdjacent(expected.toLowerCase(), actual.toLowerCase(), layoutName)) {
            const fingerInfo = getKeyData(expected.toLowerCase(), layoutName)?.finger;
            const hand = fingerInfo?.includes('left') ? 'left' : 'right';
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
        if (this.areSameFinger(expected.toLowerCase(), actual.toLowerCase(), layoutName)) {
            const fingerInfo = getKeyData(expected.toLowerCase(), layoutName)?.finger;
            return {
                type: 'same_finger',
                title: 'Same Finger Confusion',
                explanation: `Both "${expected}" and "${actual}" use the ${fingerInfo || 'same'} finger.`,
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
    public areAdjacent(key1: string, key2: string, layoutName: LayoutName = 'qwerty'): boolean {
        const layout = getLayout(layoutName);
        const rows = layout.rows.map(row => row.map(k => k.key.toLowerCase()));
        
        for (let row = 0; row < rows.length; row++) {
            const rowKeys = rows[row];
            const idx1 = rowKeys.indexOf(key1);
            const idx2 = rowKeys.indexOf(key2);

            // Same row, adjacent columns
            if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) === 1) {
                return true;
            }

            // Check adjacent rows
            if (idx1 !== -1 && row < rows.length - 1) {
                const nextRow = rows[row + 1];
                const nextIdx = nextRow.indexOf(key2);
                if (nextIdx !== -1 && Math.abs(idx1 - nextIdx) <= 1) {
                    return true;
                }
            }
            if (idx1 !== -1 && row > 0) {
                const prevRow = rows[row - 1];
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
    private areSameFinger(key1: string, key2: string, layoutName: LayoutName = 'qwerty'): boolean {
        const finger1 = getKeyData(key1, layoutName)?.finger;
        const finger2 = getKeyData(key2, layoutName)?.finger;
        return !!finger1 && !!finger2 && finger1 === finger2;
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
