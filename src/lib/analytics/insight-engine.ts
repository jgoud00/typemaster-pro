/**
 * Insight Engine — Advanced analytics & predictions
 *
 * Transforms raw session data into actionable insights:
 * - WPM trend via linear regression
 * - Consistency score (coefficient of variation)
 * - Anomaly detection (z-score based)
 * - Progress predictions
 */

import type { PerformanceRecord } from '@/types';

export interface TrendAnalysis {
    slope: number;           // WPM change per session
    intercept: number;
    rSquared: number;        // Goodness of fit (0-1)
    direction: 'improving' | 'declining' | 'stable';
    rate: string;            // Human-readable: "+2.3 WPM/session"
}

export interface ConsistencyScore {
    score: number;           // 0-100, higher = more consistent
    standardDeviation: number;
    coefficientOfVariation: number;
}

export interface Anomaly {
    recordId: string;
    wpm: number;
    zScore: number;
    type: 'spike' | 'dip';
    timestamp: number;
}

export interface ProgressPrediction {
    targetWpm: number;
    estimatedSessionsToReach: number;
    estimatedDate: Date | null;
    confidence: 'high' | 'medium' | 'low';
}

export interface SessionComparison {
    currentWpm: number;
    averageWpm7d: number;
    deltaWpm: number;
    currentAccuracy: number;
    averageAccuracy7d: number;
    deltaAccuracy: number;
    percentileRank: number;  // Within user's own sessions
}

// ── Linear Regression ─────────────────────────────────────────────────────

function linearRegression(ys: number[]): { slope: number; intercept: number; rSquared: number } {
    const n = ys.length;
    if (n < 2) return { slope: 0, intercept: ys[0] ?? 0, rSquared: 0 };

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += ys[i];
        sumXY += i * ys[i];
        sumXX += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared
    const yMean = sumY / n;
    let ssTot = 0, ssRes = 0;
    for (let i = 0; i < n; i++) {
        ssTot += (ys[i] - yMean) ** 2;
        ssRes += (ys[i] - (slope * i + intercept)) ** 2;
    }
    const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

    return { slope, intercept, rSquared };
}

// ── Public API ────────────────────────────────────────────────────────────

export function analyzeWpmTrend(records: PerformanceRecord[], minRecords = 5): TrendAnalysis | null {
    const valid = records.filter(r => r.wpm > 0 && r.valid !== false).slice(-50);
    if (valid.length < minRecords) return null;

    const wpms = valid.map(r => r.wpm);
    const { slope, intercept, rSquared } = linearRegression(wpms);

    const direction: TrendAnalysis['direction'] =
        slope > 0.5 ? 'improving' : slope < -0.5 ? 'declining' : 'stable';

    return {
        slope: +slope.toFixed(3),
        intercept: +intercept.toFixed(1),
        rSquared: +rSquared.toFixed(3),
        direction,
        rate: `${slope >= 0 ? '+' : ''}${slope.toFixed(1)} WPM/session`,
    };
}

export function calculateConsistency(records: PerformanceRecord[], minRecords = 5): ConsistencyScore | null {
    const valid = records.filter(r => r.wpm > 0).slice(-30);
    if (valid.length < minRecords) return null;

    const wpms = valid.map(r => r.wpm);
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    const variance = wpms.reduce((a, b) => a + (b - mean) ** 2, 0) / wpms.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 0;

    // Score: lower CV = higher consistency. CV of 0 = 100, CV of 0.3+ = ~0
    const score = Math.max(0, Math.min(100, Math.round(100 * (1 - coefficientOfVariation / 0.3))));

    return {
        score,
        standardDeviation: +standardDeviation.toFixed(1),
        coefficientOfVariation: +coefficientOfVariation.toFixed(3),
    };
}

export function detectAnomalies(records: PerformanceRecord[], threshold = 2): Anomaly[] {
    const valid = records.filter(r => r.wpm > 0);
    if (valid.length < 10) return [];

    const wpms = valid.map(r => r.wpm);
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    const stdDev = Math.sqrt(wpms.reduce((a, b) => a + (b - mean) ** 2, 0) / wpms.length);

    if (stdDev === 0) return [];

    return valid
        .map(r => {
            const zScore = (r.wpm - mean) / stdDev;
            if (Math.abs(zScore) >= threshold) {
                return {
                    recordId: r.id,
                    wpm: r.wpm,
                    zScore: +zScore.toFixed(2),
                    type: (zScore > 0 ? 'spike' : 'dip') as 'spike' | 'dip',
                    timestamp: r.timestamp,
                };
            }
            return null;
        })
        .filter((a): a is Anomaly => a !== null);
}

export function predictProgress(
    records: PerformanceRecord[],
    targetWpm: number,
    sessionsPerWeek = 5
): ProgressPrediction | null {
    const trend = analyzeWpmTrend(records);
    if (!trend || trend.slope <= 0) {
        return {
            targetWpm,
            estimatedSessionsToReach: -1,
            estimatedDate: null,
            confidence: 'low',
        };
    }

    const valid = records.filter(r => r.wpm > 0);
    const currentAvgWpm = valid.length > 0
        ? valid.slice(-5).reduce((a, r) => a + r.wpm, 0) / Math.min(5, valid.length)
        : 0;

    if (currentAvgWpm >= targetWpm) {
        return { targetWpm, estimatedSessionsToReach: 0, estimatedDate: new Date(), confidence: 'high' };
    }

    const sessionsNeeded = Math.ceil((targetWpm - currentAvgWpm) / trend.slope);
    const weeksNeeded = sessionsNeeded / sessionsPerWeek;
    const estimatedDate = new Date(Date.now() + weeksNeeded * 7 * 24 * 60 * 60 * 1000);

    const confidence = trend.rSquared > 0.7 ? 'high' : trend.rSquared > 0.4 ? 'medium' : 'low';

    return {
        targetWpm,
        estimatedSessionsToReach: sessionsNeeded,
        estimatedDate,
        confidence,
    };
}

export function compareSession(
    currentWpm: number,
    currentAccuracy: number,
    records: PerformanceRecord[]
): SessionComparison {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentRecords = records.filter(r => r.timestamp > sevenDaysAgo && r.wpm > 0);

    const averageWpm7d = recentRecords.length > 0
        ? recentRecords.reduce((a, r) => a + r.wpm, 0) / recentRecords.length
        : currentWpm;

    const averageAccuracy7d = recentRecords.length > 0
        ? recentRecords.reduce((a, r) => a + r.accuracy, 0) / recentRecords.length
        : currentAccuracy;

    // Percentile rank within user's own sessions
    const allWpms = records.filter(r => r.wpm > 0).map(r => r.wpm).sort((a, b) => a - b);
    const rank = allWpms.filter(w => w < currentWpm).length;
    const percentileRank = allWpms.length > 0 ? Math.round((rank / allWpms.length) * 100) : 50;

    return {
        currentWpm,
        averageWpm7d: +averageWpm7d.toFixed(1),
        deltaWpm: +(currentWpm - averageWpm7d).toFixed(1),
        currentAccuracy,
        averageAccuracy7d: +averageAccuracy7d.toFixed(1),
        deltaAccuracy: +(currentAccuracy - averageAccuracy7d).toFixed(1),
        percentileRank,
    };
}
