/**
 * Advanced Pattern Recognition System
 * 
 * Detects multiple types of performance patterns:
 * - Temporal patterns (time-of-day effects)
 * - Sequential patterns (error cascades)
 * - Fatigue patterns (performance decline)
 * - Learning plateaus (stagnation detection)
 * - Hand/finger imbalances
 */

export interface Pattern {
    type: 'temporal' | 'sequential' | 'fatigue' | 'plateau' | 'hand_imbalance';
    confidence: number;      // 0-1 how certain we are
    description: string;     // Human-readable explanation
    actionable: string;      // What user should do
    impact: number;          // 0-100 impact on performance
    data?: Record<string, unknown>; // Supporting data
}

interface SessionData {
    date: Date;
    wpm: number;
    accuracy: number;
    duration: number;        // minutes
    errors: number;
}

interface KeystrokeData {
    key: string;
    timestamp: number;
    correct: boolean;
}

// Hand mapping for detecting imbalances
const LEFT_HAND_KEYS = new Set([
    'q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g',
    'z', 'x', 'c', 'v', 'b', '1', '2', '3', '4', '5',
]);

export class PatternRecognizer {
    /**
     * Analyze all patterns from session and keystroke history
     */
    analyzePatterns(
        sessions: SessionData[],
        keystrokes: KeystrokeData[],
        keyAccuracies: Map<string, number>
    ): Pattern[] {
        const patterns: Pattern[] = [];

        // Run all pattern detectors
        const temporal = this.detectTemporalPatterns(sessions);
        const sequential = this.detectSequentialPatterns(keystrokes);
        const fatigue = this.detectFatiguePatterns(sessions, keystrokes);
        const plateau = this.detectPlateau(sessions);
        const handImbalance = this.detectHandImbalance(keyAccuracies);

        patterns.push(...temporal, ...sequential, ...fatigue, ...plateau, ...handImbalance);

        // Sort by impact (highest first)
        return patterns.sort((a, b) => b.impact - a.impact);
    }

    /**
     * Detect time-of-day performance variations
     */
    private detectTemporalPatterns(sessions: SessionData[]): Pattern[] {
        if (sessions.length < 10) return [];

        const patterns: Pattern[] = [];
        const hourlyStats = new Map<number, { wpm: number[]; accuracy: number[] }>();

        // Group by hour
        sessions.forEach(session => {
            const hour = session.date.getHours();
            if (!hourlyStats.has(hour)) {
                hourlyStats.set(hour, { wpm: [], accuracy: [] });
            }
            hourlyStats.get(hour)!.wpm.push(session.wpm);
            hourlyStats.get(hour)!.accuracy.push(session.accuracy);
        });

        // Find best and worst hours
        let bestHour = -1, worstHour = -1;
        let bestWPM = 0, worstWPM = Infinity;

        hourlyStats.forEach((data, hour) => {
            if (data.wpm.length >= 3) {
                const avg = data.wpm.reduce((a, b) => a + b, 0) / data.wpm.length;
                if (avg > bestWPM) { bestWPM = avg; bestHour = hour; }
                if (avg < worstWPM) { worstWPM = avg; worstHour = hour; }
            }
        });

        if (bestHour >= 0 && worstHour >= 0 && bestWPM - worstWPM > 8) {
            patterns.push({
                type: 'temporal',
                confidence: 0.75,
                description: `You type ${Math.round(bestWPM - worstWPM)} WPM faster at ${this.formatHour(bestHour)} than at ${this.formatHour(worstHour)}`,
                actionable: `Schedule important practice sessions around ${this.formatHour(bestHour)} for optimal performance`,
                impact: 65,
                data: { bestHour, worstHour, bestWPM, worstWPM },
            });
        }

        return patterns;
    }

    /**
     * Detect error cascades (one error leading to more)
     */
    private detectSequentialPatterns(keystrokes: KeystrokeData[]): Pattern[] {
        if (keystrokes.length < 50) return [];

        const patterns: Pattern[] = [];
        let cascadeErrors = 0;
        let totalErrors = 0;

        for (let i = 1; i < keystrokes.length; i++) {
            if (!keystrokes[i].correct) {
                totalErrors++;
                if (!keystrokes[i - 1].correct) {
                    cascadeErrors++;
                }
            }
        }

        if (totalErrors > 5) {
            const cascadeRate = cascadeErrors / totalErrors;

            if (cascadeRate > 0.25) {
                patterns.push({
                    type: 'sequential',
                    confidence: 0.85,
                    description: `${Math.round(cascadeRate * 100)}% of your errors trigger additional consecutive errors`,
                    actionable: 'After making a mistake, take a brief pause before continuing to break the error cascade',
                    impact: 75,
                    data: { cascadeRate, cascadeErrors, totalErrors },
                });
            }
        }

        return patterns;
    }

    /**
     * Detect fatigue patterns (performance degradation over time)
     */
    private detectFatiguePatterns(
        sessions: SessionData[],
        keystrokes: KeystrokeData[]
    ): Pattern[] {
        const patterns: Pattern[] = [];

        // Check within-session fatigue from keystrokes
        if (keystrokes.length >= 100) {
            const firstHalf = keystrokes.slice(0, Math.floor(keystrokes.length / 2));
            const secondHalf = keystrokes.slice(Math.floor(keystrokes.length / 2));

            const firstAccuracy = firstHalf.filter(k => k.correct).length / firstHalf.length;
            const secondAccuracy = secondHalf.filter(k => k.correct).length / secondHalf.length;

            const drop = firstAccuracy - secondAccuracy;

            if (drop > 0.08) {
                patterns.push({
                    type: 'fatigue',
                    confidence: 0.8,
                    description: `Your accuracy drops ${Math.round(drop * 100)}% from session start to end`,
                    actionable: 'Take 5-minute breaks every 15 minutes to maintain peak performance',
                    impact: 70,
                    data: { firstAccuracy, secondAccuracy, drop },
                });
            }
        }

        // Check long session fatigue
        const longSessions = sessions.filter(s => s.duration >= 20);
        if (longSessions.length >= 3) {
            const avgLongAccuracy = longSessions.reduce((sum, s) => sum + s.accuracy, 0) / longSessions.length;
            const shortSessions = sessions.filter(s => s.duration < 15 && s.duration >= 5);

            if (shortSessions.length >= 3) {
                const avgShortAccuracy = shortSessions.reduce((sum, s) => sum + s.accuracy, 0) / shortSessions.length;

                if (avgShortAccuracy - avgLongAccuracy > 5) {
                    patterns.push({
                        type: 'fatigue',
                        confidence: 0.7,
                        description: `Your accuracy is ${Math.round(avgShortAccuracy - avgLongAccuracy)}% lower in sessions over 20 minutes`,
                        actionable: 'Consider shorter, more frequent practice sessions',
                        impact: 60,
                    });
                }
            }
        }

        return patterns;
    }

    /**
     * Detect learning plateaus (no improvement over time)
     */
    private detectPlateau(sessions: SessionData[]): Pattern[] {
        if (sessions.length < 15) return [];

        const patterns: Pattern[] = [];

        // Get recent and older sessions
        const recent = sessions.slice(-7);
        const older = sessions.slice(-15, -7);

        if (older.length < 5) return patterns;

        const avgRecentWPM = recent.reduce((sum, s) => sum + s.wpm, 0) / recent.length;
        const avgOlderWPM = older.reduce((sum, s) => sum + s.wpm, 0) / older.length;

        const improvement = avgRecentWPM - avgOlderWPM;

        if (Math.abs(improvement) < 2) {
            patterns.push({
                type: 'plateau',
                confidence: 0.8,
                description: `You've plateaued at ~${Math.round(avgRecentWPM)} WPM for the past ${recent.length} sessions`,
                actionable: 'Try speed training exercises or focus specifically on your weakest keys to break through',
                impact: 70,
                data: { avgRecentWPM, avgOlderWPM, improvement },
            });
        } else if (improvement < -3) {
            patterns.push({
                type: 'plateau',
                confidence: 0.75,
                description: `Your WPM has declined by ${Math.abs(Math.round(improvement))} WPM recently`,
                actionable: 'Take a break, then do focused accuracy drills before speed work',
                impact: 65,
            });
        }

        return patterns;
    }

    /**
     * Detect left/right hand imbalance
     */
    private detectHandImbalance(keyAccuracies: Map<string, number>): Pattern[] {
        const patterns: Pattern[] = [];

        let leftTotal = 0, leftCount = 0;
        let rightTotal = 0, rightCount = 0;

        keyAccuracies.forEach((accuracy, key) => {
            if (LEFT_HAND_KEYS.has(key.toLowerCase())) {
                leftTotal += accuracy;
                leftCount++;
            } else if (key.length === 1) {
                rightTotal += accuracy;
                rightCount++;
            }
        });

        if (leftCount >= 5 && rightCount >= 5) {
            const leftAvg = leftTotal / leftCount;
            const rightAvg = rightTotal / rightCount;
            const diff = Math.abs(leftAvg - rightAvg);

            if (diff > 10) {
                const weaker = leftAvg < rightAvg ? 'left' : 'right';
                const stronger = weaker === 'left' ? 'right' : 'left';

                patterns.push({
                    type: 'hand_imbalance',
                    confidence: 0.85,
                    description: `Your ${weaker} hand is ${Math.round(diff)}% less accurate than your ${stronger} hand`,
                    actionable: `Practice ${weaker}-hand keys specifically to balance your typing`,
                    impact: 55,
                    data: { leftAvg, rightAvg, diff, weaker },
                });
            }
        }

        return patterns;
    }

    /**
     * Format hour for display
     */
    private formatHour(hour: number): string {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    }

    /**
     * Get top actionable insights
     */
    getTopInsights(
        sessions: SessionData[],
        keystrokes: KeystrokeData[],
        keyAccuracies: Map<string, number>,
        limit = 3
    ): Pattern[] {
        const allPatterns = this.analyzePatterns(sessions, keystrokes, keyAccuracies);
        return allPatterns.slice(0, limit);
    }
}

// Singleton export
export const patternRecognizer = new PatternRecognizer();
