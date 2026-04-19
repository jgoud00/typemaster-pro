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

import { errorExplanationEngine } from './error-explanation-engine';
import { getKeyData } from '../keyboard-data';
import { LayoutName } from '../keyboard-layouts';

export class DiagnosticAnalyzer {
    /**
     * Analyze keystroke data from diagnostic test
     */
    analyze(keystrokes: KeystrokeData[], durationMs: number, layoutName: LayoutName = 'qwerty'): DiagnosticResult {
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
        const errorAnalysis = this.analyzeErrors(keystrokes, layoutName);

        // Analyze rhythm
        const rhythmAnalysis = this.analyzeRhythm(keystrokes);

        // Analyze per-key performance
        const keyPerformance = this.analyzeKeyPerformance(keystrokes);

        // Identify weak keys (accuracy < 80% with minimum 3 attempts)
        const weakKeys = this.identifyWeakKeys(keyPerformance);

        // Identify weak fingers
        const weakFingers = this.identifyWeakFingers(keystrokes, layoutName);

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

    private analyzeErrors(keystrokes: KeystrokeData[], layoutName: LayoutName) {
        let adjacentKeyErrors = 0;
        let sameFingerErrors = 0;
        const weakHandErrors = { left: 0, right: 0 };

        for (let i = 0; i < keystrokes.length; i++) {
            const ks = keystrokes[i];
            if (ks.correct || ks.isBackspace) continue;

            const expected = ks.expectedKey.toLowerCase();
            const actual = ks.key.toLowerCase();

            // Check if adjacent key error
            if (errorExplanationEngine.areAdjacent(expected, actual, layoutName)) {
                adjacentKeyErrors++;
            }

            // Check hand for error
            const fingerInfo = getKeyData(expected, layoutName)?.finger;
            if (fingerInfo?.includes('left')) {
                weakHandErrors.left++;
            } else if (fingerInfo?.includes('right')) {
                weakHandErrors.right++;
            }

            // Check same-finger error (consecutive keys with same finger)
            if (i > 0) {
                const prevExpected = keystrokes[i - 1].expectedKey.toLowerCase();
                const prevFinger = getKeyData(prevExpected, layoutName)?.finger;
                const currFinger = getKeyData(expected, layoutName)?.finger;

                if (prevFinger && currFinger && prevFinger === currFinger) {
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

    private analyzeKeyPerformance(keystrokes: KeystrokeData[]): Record<string, { correct: number; errors: number; avgLatency: number }> {
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

        // Convert to Record for JSON serialization
        const keyPerformance: Record<string, { correct: number; errors: number; avgLatency: number }> = {};

        keyData.forEach((data, key) => {
            const avgLatency = data.latencies.length > 0
                ? data.latencies.reduce((a, b) => a + b, 0) / data.latencies.length
                : 0;

            keyPerformance[key] = {
                correct: data.correct,
                errors: data.errors,
                avgLatency,
            };
        });

        return keyPerformance;
    }

    private identifyWeakKeys(keyPerformance: Record<string, { correct: number; errors: number; avgLatency: number }>) {
        const weakKeys: string[] = [];

        for (const [key, data] of Object.entries(keyPerformance)) {
            const total = data.correct + data.errors;
            if (total >= 3) { // Minimum attempts
                const accuracy = data.correct / total;
                if (accuracy < 0.8) {
                    weakKeys.push(key);
                }
            }
        }

        // Sort by worst performance
        weakKeys.sort((a, b) => {
            const aData = keyPerformance[a];
            const bData = keyPerformance[b];
            const aAcc = aData.correct / (aData.correct + aData.errors);
            const bAcc = bData.correct / (bData.correct + bData.errors);
            return aAcc - bAcc;
        });

        return weakKeys;
    }

    private identifyWeakFingers(keystrokes: KeystrokeData[], layoutName: LayoutName) {
        const fingerErrors = new Map<string, { correct: number; errors: number }>();

        for (const ks of keystrokes) {
            if (ks.isBackspace) continue;

            const fingerKey = getKeyData(ks.expectedKey.toLowerCase(), layoutName)?.finger;
            if (!fingerKey) continue;

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
