/**
 * Bayesian Weakness Detection System
 * 
 * Uses statistical modeling with Beta distributions to identify weak keys.
 * Provides confidence intervals and adapts to individual users.
 * Implements temporal decay so recent errors matter more.
 */

interface KeyPerformance {
    key: string;
    correct: number;
    total: number;
    timestamps: number[];
}

export interface WeaknessResult {
    key: string;
    estimatedAccuracy: number;    // Bayesian posterior mean
    confidence: number;           // 0-1, certainty of estimate
    isWeak: boolean;              // Below threshold with high confidence
    priority: number;             // 0-100, practice priority
    recentTrend: 'improving' | 'declining' | 'stable';
    nextReviewDate: Date;
}

export class BayesianWeaknessDetector {
    // Beta distribution prior parameters (uninformative prior)
    private readonly priorAlpha = 2;
    private readonly priorBeta = 2;

    // Temporal decay: half-life of 7 days
    private readonly decayHalfLifeMs = 7 * 24 * 60 * 60 * 1000;

    // Minimum attempts before considering a key
    private readonly minAttempts = 5;

    /**
     * Analyze a single key using Bayesian inference
     */
    analyzeKey(keyData: KeyPerformance, userBaseline: number): WeaknessResult {
        // Apply temporal decay weighting
        const weighted = this.applyTemporalDecay(keyData);

        // Update Beta distribution with weighted observations
        const posterior = this.computePosterior(weighted.correct, weighted.total);

        // Calculate 95% confidence interval
        const ci = this.confidenceInterval(posterior.alpha, posterior.beta, 0.95);

        // Key is weak if upper CI bound is below baseline - 10%
        const weaknessThreshold = userBaseline - 0.10;
        const isWeak = ci.upper < weaknessThreshold && keyData.total >= this.minAttempts;

        // Calculate practice priority
        const priority = this.calculatePriority(posterior.mean, posterior.confidence, isWeak);

        // Detect trend from timestamps
        const trend = this.detectTrend(keyData);

        // Schedule next review using SM-2 algorithm
        const nextReview = this.scheduleReview(posterior.mean, keyData.total);

        return {
            key: keyData.key,
            estimatedAccuracy: posterior.mean,
            confidence: posterior.confidence,
            isWeak,
            priority,
            recentTrend: trend,
            nextReviewDate: nextReview,
        };
    }

    /**
     * Apply exponential decay to weight recent keystrokes more heavily
     */
    private applyTemporalDecay(keyData: KeyPerformance): { correct: number; total: number } {
        if (keyData.timestamps.length === 0) {
            return { correct: keyData.correct, total: keyData.total };
        }

        const now = Date.now();
        let weightedCorrect = 0;
        let weightedTotal = 0;

        // Assume timestamps are ordered and first `correct` timestamps are successes
        keyData.timestamps.forEach((ts, idx) => {
            const age = now - ts;
            const weight = Math.exp(-age * Math.LN2 / this.decayHalfLifeMs);

            weightedTotal += weight;
            if (idx < keyData.correct) {
                weightedCorrect += weight;
            }
        });

        return { correct: weightedCorrect, total: weightedTotal };
    }

    /**
     * Compute posterior Beta distribution parameters
     */
    private computePosterior(successes: number, total: number) {
        const failures = total - successes;
        const alpha = this.priorAlpha + successes;
        const beta = this.priorBeta + failures;

        // Posterior mean = alpha / (alpha + beta)
        const mean = alpha / (alpha + beta);

        // Posterior variance
        const variance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));

        // Confidence: inverse of coefficient of variation
        const confidence = Math.min(1, 1 - Math.sqrt(variance) / mean);

        return { alpha, beta, mean, variance, confidence };
    }

    /**
     * Calculate confidence interval using Beta quantile approximation
     */
    private confidenceInterval(alpha: number, beta: number, level: number) {
        const tail = (1 - level) / 2;

        // Normal approximation for Beta quantiles
        const mean = alpha / (alpha + beta);
        const variance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
        const stdDev = Math.sqrt(variance);

        const z = this.normalQuantile(1 - tail);

        return {
            lower: Math.max(0, mean - z * stdDev),
            upper: Math.min(1, mean + z * stdDev),
        };
    }

    /**
     * Standard normal quantile (Beasley-Springer-Moro approximation)
     */
    private normalQuantile(p: number): number {
        if (p <= 0) return -Infinity;
        if (p >= 1) return Infinity;

        const a = [
            -3.969683028665376e+01, 2.209460984245205e+02,
            -2.759285104469687e+02, 1.383577518672690e+02,
            -3.066479806614716e+01, 2.506628277459239e+00,
        ];
        const b = [
            -5.447609879822406e+01, 1.615858368580409e+02,
            -1.556989798598866e+02, 6.680131188771972e+01,
            -1.328068155288572e+01,
        ];
        const c = [
            -7.784894002430293e-03, -3.223964580411365e-01,
            -2.400758277161838e+00, -2.549732539343734e+00,
            4.374664141464968e+00, 2.938163982698783e+00,
        ];
        const d = [
            7.784695709041462e-03, 3.224671290700398e-01,
            2.445134137142996e+00, 3.754408661907416e+00,
        ];

        const pLow = 0.02425;
        const pHigh = 1 - pLow;

        let q: number;
        if (p < pLow) {
            q = Math.sqrt(-2 * Math.log(p));
            return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        } else if (p <= pHigh) {
            q = p - 0.5;
            const r = q * q;
            return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
        } else {
            q = Math.sqrt(-2 * Math.log(1 - p));
            return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        }
    }

    /**
     * Calculate practice priority (0-100)
     */
    private calculatePriority(accuracy: number, confidence: number, isWeak: boolean): number {
        if (!isWeak) return 0;

        // Higher priority = lower accuracy + higher confidence
        const accuracyScore = (1 - accuracy) * 60;
        const confidenceScore = confidence * 40;

        return Math.round(Math.min(100, accuracyScore + confidenceScore));
    }

    /**
     * Detect learning trend from recent vs older performance
     */
    private detectTrend(keyData: KeyPerformance): 'improving' | 'declining' | 'stable' {
        if (keyData.timestamps.length < 10) return 'stable';

        const midPoint = Math.floor(keyData.timestamps.length / 2);
        const now = Date.now();

        // Calculate weighted accuracy for older half vs newer half
        let olderCorrect = 0, olderTotal = 0;
        let newerCorrect = 0, newerTotal = 0;

        keyData.timestamps.forEach((ts, idx) => {
            const weight = Math.exp(-(now - ts) * Math.LN2 / this.decayHalfLifeMs);
            const isCorrect = idx < keyData.correct;

            if (idx < midPoint) {
                olderTotal += weight;
                if (isCorrect) olderCorrect += weight;
            } else {
                newerTotal += weight;
                if (isCorrect) newerCorrect += weight;
            }
        });

        const olderAccuracy = olderTotal > 0 ? olderCorrect / olderTotal : 0;
        const newerAccuracy = newerTotal > 0 ? newerCorrect / newerTotal : 0;
        const diff = newerAccuracy - olderAccuracy;

        if (diff > 0.1) return 'improving';
        if (diff < -0.1) return 'declining';
        return 'stable';
    }

    /**
     * Schedule next review using SM-2 spaced repetition
     */
    private scheduleReview(accuracy: number, totalAttempts: number): Date {
        // Convert accuracy to SM-2 grade (0-5)
        const grade = Math.round(accuracy * 5);

        // Easiness factor
        const ef = Math.max(1.3, 2.5 - 0.8 * (5 - grade) - 0.02 * (5 - grade) * (5 - grade));

        // Interval calculation
        let interval: number;
        if (grade < 3) {
            interval = 1; // Reset to 1 day
        } else {
            const repetitions = Math.floor(totalAttempts / 10);
            interval = Math.round(Math.pow(ef, repetitions));
        }

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + Math.min(interval, 30)); // Cap at 30 days

        return nextDate;
    }

    /**
     * Analyze all keys and return sorted by priority
     */
    analyzeAllKeys(
        keyStats: Map<string, KeyPerformance> | Record<string, KeyPerformance>
    ): WeaknessResult[] {
        const results: WeaknessResult[] = [];

        // Calculate user baseline from all keys
        let totalCorrect = 0;
        let totalAttempts = 0;

        const entries = keyStats instanceof Map
            ? Array.from(keyStats.entries())
            : Object.entries(keyStats);

        entries.forEach(([, stats]) => {
            totalCorrect += stats.correct;
            totalAttempts += stats.total;
        });

        const userBaseline = totalAttempts > 0 ? totalCorrect / totalAttempts : 0.85;

        // Analyze each key
        entries.forEach(([key, stats]) => {
            if (stats.total >= this.minAttempts) {
                const result = this.analyzeKey({ ...stats, key }, userBaseline);
                results.push(result);
            }
        });

        // Sort by priority (highest first)
        return results.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Get keys due for review based on spaced repetition schedule
     */
    getDueForReview(results: WeaknessResult[]): string[] {
        const now = new Date();
        return results
            .filter(r => r.nextReviewDate <= now)
            .map(r => r.key);
    }
}

// Singleton export
export const weaknessDetector = new BayesianWeaknessDetector();
