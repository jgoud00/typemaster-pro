/**
 * Fatigue Detector — Real-time fatigue analysis
 *
 * Monitors sliding windows of keystroke data to detect:
 * - Error rate acceleration
 * - Hesitation time increase
 * - WPM decline
 *
 * Provides fatigue score (0-1) and break recommendations.
 */

export interface FatigueSnapshot {
    score: number;              // 0-1, higher = more fatigued
    errorTrend: number;         // positive = increasing errors
    hesitationTrend: number;    // positive = slowing down
    wpmTrend: number;           // negative = slowing down
    shouldBreak: boolean;
    minutesActive: number;
    recommendation: string;
}

interface DataPoint {
    timestamp: number;
    isCorrect: boolean;
    hesitationMs: number;
    wpm?: number;
}

const WINDOW_SIZE = 20;
const FATIGUE_THRESHOLD = 0.6;
const OPTIMAL_SESSION_MINUTES = 25;  // Pomodoro-inspired

export class FatigueDetector {
    private dataPoints: DataPoint[] = [];
    private sessionStart: number = 0;

    start(): void {
        this.sessionStart = Date.now();
        this.dataPoints = [];
    }

    addDataPoint(point: DataPoint): void {
        this.dataPoints.push(point);
        // Keep last 200 points for trend analysis
        if (this.dataPoints.length > 200) {
            this.dataPoints.shift();
        }
    }

    getSnapshot(): FatigueSnapshot {
        const minutesActive = (Date.now() - this.sessionStart) / 60_000;

        if (this.dataPoints.length < WINDOW_SIZE * 2) {
            return {
                score: 0,
                errorTrend: 0,
                hesitationTrend: 0,
                wpmTrend: 0,
                shouldBreak: false,
                minutesActive,
                recommendation: 'Keep typing! Building baseline data.',
            };
        }

        const recent = this.dataPoints.slice(-WINDOW_SIZE);
        const previous = this.dataPoints.slice(-WINDOW_SIZE * 2, -WINDOW_SIZE);

        // Error rate trend
        const recentErrorRate = recent.filter(p => !p.isCorrect).length / recent.length;
        const previousErrorRate = previous.filter(p => !p.isCorrect).length / previous.length;
        const errorTrend = recentErrorRate - previousErrorRate;

        // Hesitation trend
        const recentHesAvg = recent.reduce((s, p) => s + p.hesitationMs, 0) / recent.length;
        const previousHesAvg = previous.reduce((s, p) => s + p.hesitationMs, 0) / previous.length;
        const hesitationTrend = previousHesAvg > 0 ? (recentHesAvg - previousHesAvg) / previousHesAvg : 0;

        // WPM trend (if available)
        const recentWpms = recent.filter(p => p.wpm !== undefined).map(p => p.wpm!);
        const previousWpms = previous.filter(p => p.wpm !== undefined).map(p => p.wpm!);
        let wpmTrend = 0;
        if (recentWpms.length > 0 && previousWpms.length > 0) {
            const recentAvg = recentWpms.reduce((a, b) => a + b, 0) / recentWpms.length;
            const previousAvg = previousWpms.reduce((a, b) => a + b, 0) / previousWpms.length;
            wpmTrend = previousAvg > 0 ? (recentAvg - previousAvg) / previousAvg : 0;
        }

        // Composite fatigue score using sigmoid curve
        const rawFatigue =
            Math.max(0, errorTrend) * 3 +            // Error acceleration
            Math.max(0, hesitationTrend) * 2 +        // Slowing down
            Math.max(0, -wpmTrend) * 2 +              // WPM declining
            (minutesActive / OPTIMAL_SESSION_MINUTES) * 0.3;  // Time factor

        const score = 1 / (1 + Math.exp(-3 * (rawFatigue - 0.5)));
        const shouldBreak = score > FATIGUE_THRESHOLD;

        let recommendation: string;
        if (score > 0.8) {
            recommendation = 'You seem fatigued. Take a 5-minute break to reset.';
        } else if (score > FATIGUE_THRESHOLD) {
            recommendation = 'Your performance is declining. Consider a short break.';
        } else if (minutesActive > OPTIMAL_SESSION_MINUTES) {
            recommendation = `You've been typing for ${Math.round(minutesActive)} minutes. A break would help maintain performance.`;
        } else if (score > 0.3) {
            recommendation = 'Slight fatigue detected. You\'re still performing well.';
        } else {
            recommendation = 'You\'re in great shape! Keep going.';
        }

        return {
            score: +score.toFixed(3),
            errorTrend: +errorTrend.toFixed(4),
            hesitationTrend: +hesitationTrend.toFixed(4),
            wpmTrend: +wpmTrend.toFixed(4),
            shouldBreak,
            minutesActive: +minutesActive.toFixed(1),
            recommendation,
        };
    }

    /**
     * Estimate optimal session duration based on historical fatigue patterns.
     */
    getOptimalSessionMinutes(): number {
        if (this.dataPoints.length < 50) return OPTIMAL_SESSION_MINUTES;

        // Find the point where error rate starts consistently increasing
        const windowSize = 10;
        let bestMinutes = OPTIMAL_SESSION_MINUTES;

        for (let i = windowSize; i < this.dataPoints.length - windowSize; i++) {
            const before = this.dataPoints.slice(i - windowSize, i);
            const after = this.dataPoints.slice(i, i + windowSize);
            const beforeErrors = before.filter(p => !p.isCorrect).length / before.length;
            const afterErrors = after.filter(p => !p.isCorrect).length / after.length;

            if (afterErrors > beforeErrors + 0.1) {
                const minutesAtPoint = (this.dataPoints[i].timestamp - this.sessionStart) / 60_000;
                bestMinutes = Math.max(10, Math.min(60, minutesAtPoint));
                break;
            }
        }

        return Math.round(bestMinutes);
    }

    reset(): void {
        this.dataPoints = [];
        this.sessionStart = Date.now();
    }
}

export const fatigueDetector = new FatigueDetector();
