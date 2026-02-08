/**
 * DIAGNOSTIC ANALYZER
 * 
 * Analyzes typing test results to generate insights about:
 * - Speed and accuracy
 * - Error patterns (adjacent keys, same-finger, weak-hand)
 * - Rhythm consistency (bursty vs steady)
 * - Backspace dependence
 */

import { DiagnosticResult } from '@/stores/diagnostic-store';

interface KeystrokeData {
    key: string;
    expectedKey: string;
    correct: boolean;
    timestamp: number;
    isBackspace: boolean;
}

interface FingerMap {
    [key: string]: {
        finger: string;
        hand: 'left' | 'right';
    };
}

// QWERTY finger mapping
const FINGER_MAP: FingerMap = {
    // Left hand
    'q': { finger: 'pinky', hand: 'left' },
    'a': { finger: 'pinky', hand: 'left' },
    'z': { finger: 'pinky', hand: 'left' },
    'w': { finger: 'ring', hand: 'left' },
    's': { finger: 'ring', hand: 'left' },
    'x': { finger: 'ring', hand: 'left' },
    'e': { finger: 'middle', hand: 'left' },
    'd': { finger: 'middle', hand: 'left' },
    'c': { finger: 'middle', hand: 'left' },
    'r': { finger: 'index', hand: 'left' },
    'f': { finger: 'index', hand: 'left' },
    'v': { finger: 'index', hand: 'left' },
    't': { finger: 'index', hand: 'left' },
    'g': { finger: 'index', hand: 'left' },
    'b': { finger: 'index', hand: 'left' },

    // Right hand
    'y': { finger: 'index', hand: 'right' },
    'h': { finger: 'index', hand: 'right' },
    'n': { finger: 'index', hand: 'right' },
    'u': { finger: 'index', hand: 'right' },
    'j': { finger: 'index', hand: 'right' },
    'm': { finger: 'index', hand: 'right' },
    'i': { finger: 'middle', hand: 'right' },
    'k': { finger: 'middle', hand: 'right' },
    ',': { finger: 'middle', hand: 'right' },
    'o': { finger: 'ring', hand: 'right' },
    'l': { finger: 'ring', hand: 'right' },
    '.': { finger: 'ring', hand: 'right' },
    'p': { finger: 'pinky', hand: 'right' },
    ';': { finger: 'pinky', hand: 'right' },
    '/': { finger: 'pinky', hand: 'right' },
};

// Adjacent key pairs (for detecting adjacent key errors)
const ADJACENT_PAIRS: string[][] = [
    ['q', 'w'], ['w', 'e'], ['e', 'r'], ['r', 't'], ['t', 'y'], ['y', 'u'], ['u', 'i'], ['i', 'o'], ['o', 'p'],
    ['a', 's'], ['s', 'd'], ['d', 'f'], ['f', 'g'], ['g', 'h'], ['h', 'j'], ['j', 'k'], ['k', 'l'],
    ['z', 'x'], ['x', 'c'], ['c', 'v'], ['v', 'b'], ['b', 'n'], ['n', 'm'],
    ['q', 'a'], ['a', 'z'], ['w', 's'], ['s', 'x'], ['e', 'd'], ['d', 'c'], ['r', 'f'], ['f', 'v'],
    ['t', 'g'], ['g', 'b'], ['y', 'h'], ['h', 'n'], ['u', 'j'], ['j', 'm'], ['i', 'k'], ['o', 'l'],
];

export class DiagnosticAnalyzer {
    /**
     * Analyze keystroke data from diagnostic test
     */
    analyze(keystrokes: KeystrokeData[], durationMs: number): DiagnosticResult {
        const totalKeystrokes = keystrokes.filter(k => !k.isBackspace).length;
        const correctKeystrokes = keystrokes.filter(k => k.correct && !k.isBackspace).length;
        const errors = totalKeystrokes - correctKeystrokes;
        const backspaceCount = keystrokes.filter(k => k.isBackspace).length;

        // Calculate WPM (standard: 5 characters = 1 word)
        const durationMinutes = durationMs / 60000;
        const wpm = Math.round((correctKeystrokes / 5) / durationMinutes);

        // Calculate accuracy
        const accuracy = totalKeystrokes > 0
            ? (correctKeystrokes / totalKeystrokes) * 100
            : 0;

        // Analyze error types
        const errorAnalysis = this.analyzeErrors(keystrokes);

        // Analyze rhythm
        const rhythmAnalysis = this.analyzeRhythm(keystrokes);

        // Analyze per-key performance
        const keyPerformance = this.analyzeKeyPerformance(keystrokes);

        // Identify weak keys (accuracy < 80% with minimum 3 attempts)
        const weakKeys = this.identifyWeakKeys(keyPerformance);

        // Identify weak fingers
        const weakFingers = this.identifyWeakFingers(keystrokes);

        return {
            wpm,
            accuracy,
            totalKeystrokes,
            correctKeystrokes,
            errors,
            adjacentKeyErrors: errorAnalysis.adjacentKeyErrors,
            sameFingerErrors: errorAnalysis.sameFingerErrors,
            weakHandErrors: errorAnalysis.weakHandErrors,
            averageLatency: rhythmAnalysis.averageLatency,
            latencyVariance: rhythmAnalysis.latencyVariance,
            burstiness: rhythmAnalysis.burstiness,
            backspaceCount,
            backspaceDependence: totalKeystrokes > 0 ? backspaceCount / totalKeystrokes : 0,
            keyPerformance,
            weakKeys,
            weakFingers,
            completedAt: Date.now(),
        };
    }

    private analyzeErrors(keystrokes: KeystrokeData[]) {
        let adjacentKeyErrors = 0;
        let sameFingerErrors = 0;
        const weakHandErrors = { left: 0, right: 0 };

        for (let i = 0; i < keystrokes.length; i++) {
            const ks = keystrokes[i];
            if (ks.correct || ks.isBackspace) continue;

            const expected = ks.expectedKey.toLowerCase();
            const actual = ks.key.toLowerCase();

            // Check if adjacent key error
            const isAdjacent = ADJACENT_PAIRS.some(pair =>
                (pair[0] === expected && pair[1] === actual) ||
                (pair[1] === expected && pair[0] === actual)
            );
            if (isAdjacent) adjacentKeyErrors++;

            // Check hand for error
            const fingerInfo = FINGER_MAP[expected];
            if (fingerInfo) {
                weakHandErrors[fingerInfo.hand]++;
            }

            // Check same-finger error (consecutive keys with same finger)
            if (i > 0) {
                const prevExpected = keystrokes[i - 1].expectedKey.toLowerCase();
                const prevFinger = FINGER_MAP[prevExpected];
                const currFinger = FINGER_MAP[expected];

                if (prevFinger && currFinger &&
                    prevFinger.finger === currFinger.finger &&
                    prevFinger.hand === currFinger.hand) {
                    sameFingerErrors++;
                }
            }
        }

        return { adjacentKeyErrors, sameFingerErrors, weakHandErrors };
    }

    private analyzeRhythm(keystrokes: KeystrokeData[]) {
        const latencies: number[] = [];

        for (let i = 1; i < keystrokes.length; i++) {
            if (!keystrokes[i].isBackspace && !keystrokes[i - 1].isBackspace) {
                const latency = keystrokes[i].timestamp - keystrokes[i - 1].timestamp;
                if (latency > 0 && latency < 2000) { // Filter outliers
                    latencies.push(latency);
                }
            }
        }

        if (latencies.length === 0) {
            return { averageLatency: 0, latencyVariance: 0, burstiness: 0.5 };
        }

        const averageLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

        // Calculate variance
        const squaredDiffs = latencies.map(l => Math.pow(l - averageLatency, 2));
        const latencyVariance = squaredDiffs.reduce((a, b) => a + b, 0) / latencies.length;

        // Calculate burstiness (coefficient of variation normalized to 0-1)
        const cv = Math.sqrt(latencyVariance) / averageLatency;
        const burstiness = Math.min(1, cv / 1.5); // Normalize: CV > 1.5 = max burstiness

        return { averageLatency, latencyVariance, burstiness };
    }

    private analyzeKeyPerformance(keystrokes: KeystrokeData[]) {
        const keyData = new Map<string, { correct: number; errors: number; latencies: number[] }>();

        for (let i = 0; i < keystrokes.length; i++) {
            const ks = keystrokes[i];
            if (ks.isBackspace) continue;

            const key = ks.expectedKey.toLowerCase();
            if (!keyData.has(key)) {
                keyData.set(key, { correct: 0, errors: 0, latencies: [] });
            }

            const data = keyData.get(key)!;
            if (ks.correct) {
                data.correct++;
            } else {
                data.errors++;
            }

            // Add latency
            if (i > 0 && !keystrokes[i - 1].isBackspace) {
                const latency = ks.timestamp - keystrokes[i - 1].timestamp;
                if (latency > 0 && latency < 2000) {
                    data.latencies.push(latency);
                }
            }
        }

        // Convert to final format
        const keyPerformance = new Map<string, { correct: number; errors: number; avgLatency: number }>();

        keyData.forEach((data, key) => {
            const avgLatency = data.latencies.length > 0
                ? data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length
                : 0;

            keyPerformance.set(key, {
                correct: data.correct,
                errors: data.errors,
                avgLatency,
            });
        });

        return keyPerformance;
    }

    private identifyWeakKeys(keyPerformance: Map<string, { correct: number; errors: number; avgLatency: number }>) {
        const weakKeys: string[] = [];

        keyPerformance.forEach((data, key) => {
            const total = data.correct + data.errors;
            if (total >= 3) { // Minimum attempts
                const accuracy = data.correct / total;
                if (accuracy < 0.8) {
                    weakKeys.push(key);
                }
            }
        });

        // Sort by worst performance
        weakKeys.sort((a, b) => {
            const aData = keyPerformance.get(a)!;
            const bData = keyPerformance.get(b)!;
            const aAcc = aData.correct / (aData.correct + aData.errors);
            const bAcc = bData.correct / (bData.correct + bData.errors);
            return aAcc - bAcc;
        });

        return weakKeys;
    }

    private identifyWeakFingers(keystrokes: KeystrokeData[]) {
        const fingerErrors = new Map<string, { correct: number; errors: number }>();

        for (const ks of keystrokes) {
            if (ks.isBackspace) continue;

            const fingerInfo = FINGER_MAP[ks.expectedKey.toLowerCase()];
            if (!fingerInfo) continue;

            const fingerKey = `${fingerInfo.hand}-${fingerInfo.finger}`;

            if (!fingerErrors.has(fingerKey)) {
                fingerErrors.set(fingerKey, { correct: 0, errors: 0 });
            }

            const data = fingerErrors.get(fingerKey)!;
            if (ks.correct) {
                data.correct++;
            } else {
                data.errors++;
            }
        }

        const weakFingers: string[] = [];

        fingerErrors.forEach((data, finger) => {
            const total = data.correct + data.errors;
            if (total >= 5) {
                const accuracy = data.correct / total;
                if (accuracy < 0.85) {
                    weakFingers.push(finger);
                }
            }
        });

        return weakFingers;
    }
}

export const diagnosticAnalyzer = new DiagnosticAnalyzer();
