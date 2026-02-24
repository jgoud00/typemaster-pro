/**
 * Bayesian Weakness Detection System
 * 
 * Uses statistical modeling with Beta distributions to identify weak keys.
 * Provides confidence intervals and adapts to individual users.
 * Implements temporal decay so recent errors matter more.
 */

interface KeyAttempt {
    timestamp: number;
    isCorrect: boolean;
    latencyMs?: number;
}

interface KeyPerformance {
    key: string;
    attempts: KeyAttempt[];
    // Computed/Cached values
    total: number;
    correct: number;
    peakAccuracy?: number; // OPTIMIZATION: Track peak performance
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
    // Internal state
    private keyStats = new Map<string, KeyPerformance>();
    private readonly STORAGE_KEY = 'vibecode_bayesian_weakness_v2';
    private saveTimeout: NodeJS.Timeout | null = null;

    // Beta distribution prior parameters (uninformative prior)
    private readonly priorAlpha = 2;
    private readonly priorBeta = 2;

    // Temporal decay: half-life of 7 days
    private readonly decayHalfLifeMs = 7 * 24 * 60 * 60 * 1000;

    // Minimum attempts before considering a key
    private readonly minAttempts = 5;

    // Max history per key to prevent unlimited growth
    private readonly maxHistoryLimit = 1000;

    constructor() {
        if (typeof window !== 'undefined') {
            this.hydrate();
        }
    }

    /**
     * Record a new keystroke
     */
    public recordKeystroke(key: string, isCorrect: boolean, latencyMs?: number): void {
        const normalizedKey = key.toLowerCase();

        let stats = this.keyStats.get(normalizedKey);
        if (!stats) {
            stats = {
                key: normalizedKey,
                attempts: [],
                total: 0,
                correct: 0
            };
            this.keyStats.set(normalizedKey, stats);
        }

        // Add new attempt
        stats.attempts.push({
            timestamp: Date.now(),
            isCorrect,
            latencyMs
        });

        // Update aggregates
        stats.total++;
        if (isCorrect) stats.correct++;

        // Track Peak Accuracy (Running average of last 50)
        if (stats.total > 20) {
            const currentAcc = stats.correct / stats.total;
            if (!stats.peakAccuracy || currentAcc > stats.peakAccuracy) {
                stats.peakAccuracy = currentAcc;
            }
        }

        // Prune history if too large
        if (stats.attempts.length > this.maxHistoryLimit) {
            const removed = stats.attempts.shift();
            if (removed) {
                stats.total--;
                if (removed.isCorrect) stats.correct--;
            }
        }

        // console.log('Internal Stats after record:', Array.from(this.keyStats.entries()));
        this.persist();
    }

    /**
     * Analyze a single key using Bayesian inference
     */
    public analyzeKey(key: string, userBaseline: number = 0.85): WeaknessResult | null {
        const stats = this.keyStats.get(key.toLowerCase());
        if (!stats || stats.attempts.length < this.minAttempts) {
            return null;
        }

        // Apply temporal decay weighting
        const weighted = this.applyTemporalDecay(stats);

        // Update Beta distribution with weighted observations
        const posterior = this.computePosterior(weighted.correct, weighted.total);

        // Calculate 95% confidence interval
        const ci = this.confidenceInterval(posterior.alpha, posterior.beta, 0.95);

        // Key is weak if upper CI bound is below baseline - 10%
        const weaknessThreshold = userBaseline - 0.10;
        const isWeak = ci.upper < weaknessThreshold;

        // Calculate practice priority
        const priority = this.calculatePriority(posterior.mean, posterior.confidence, isWeak);

        // Detect trend from timestamps
        const trend = this.detectTrend(stats);

        // Schedule next review using SM-2 algorithm
        const nextReview = this.scheduleReview(posterior.mean, stats.total);

        return {
            key: stats.key,
            estimatedAccuracy: posterior.mean,
            confidence: posterior.confidence,
            isWeak,
            priority,
            recentTrend: trend,
            nextReviewDate: nextReview,
        };
    }

    /**
     * Analyze all keys and return sorted by priority
     */
    public analyzeAllKeys(): WeaknessResult[] {
        const results: WeaknessResult[] = [];

        // Calculate user baseline from all keys
        let totalCorrect = 0;
        let totalAttempts = 0;

        this.keyStats.forEach(stats => {
            totalCorrect += stats.correct;
            totalAttempts += stats.total;
        });

        const userBaseline = totalAttempts > 0 ? totalCorrect / totalAttempts : 0.85;

        // Analyze each key
        this.keyStats.forEach((stats, key) => {
            const result = this.analyzeKey(key, userBaseline);
            if (result) {
                results.push(result);
            }
        });

        // Sort by priority (highest first)
        return results.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Apply exponential decay to weight recent keystrokes more heavily
     * OPTIMIZATION: Memory Floor
     * Prevents "Temporal Amnesia" by ensuring we never forget more than 80% of peak mastery.
     */
    private applyTemporalDecay(stats: KeyPerformance): { correct: number; total: number } {
        if (stats.attempts.length === 0) {
            return { correct: 0, total: 0 };
        }

        const now = Date.now();
        let weightedCorrect = 0;
        let weightedTotal = 0;
        const peakAccuracy = stats.peakAccuracy || 0;

        stats.attempts.forEach(attempt => {
            const age = now - attempt.timestamp;
            // Decay formula: weight = e^(-t/half_life * ln(2))
            const weight = Math.exp(-age * Math.LN2 / this.decayHalfLifeMs);

            weightedTotal += weight;
            if (attempt.isCorrect) {
                weightedCorrect += weight;
            }
        });

        // MEMORY FLOOR LOGIC
        // If user had high peak accuracy, inject a "ghost" weight to represent long-term memory
        if (peakAccuracy > 0.9) {
            const floorWeight = 2.0; // Equivalent to ~2 recent attempts
            weightedTotal += floorWeight;
            weightedCorrect += floorWeight * peakAccuracy;
        }

        return { correct: weightedCorrect, total: weightedTotal };
    }

    /**
     * Compute posterior Beta distribution parameters
     */
    private computePosterior(successes: number, total: number) {
        // Add prior (Laplace smoothing equivalent via Beta parameters)
        const alpha = this.priorAlpha + successes;
        const beta = this.priorBeta + (total - successes);

        // Posterior mean = alpha / (alpha + beta)
        const mean = alpha / (alpha + beta);

        // Posterior variance
        const variance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));

        // Confidence: inverse of coefficient of variation (simplified)
        // Higher N -> lower variance -> higher confidence
        const confidence = Math.min(1, 1 - Math.sqrt(variance) / mean);

        return { alpha, beta, mean, variance, confidence };
    }

    /**
     * Calculate confidence interval using Beta quantile approximation
     */
    private confidenceInterval(alpha: number, beta: number, level: number) {
        const tail = (1 - level) / 2;

        const mean = alpha / (alpha + beta);
        const variance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
        const stdDev = Math.sqrt(variance);

        // Approximate z-score for the given level
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

        // Coefficients for approximation
        const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
        const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
        const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
        const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];

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
        // Higher priority = lower accuracy + higher confidence (we are sure you are bad at this)
        const accuracyScore = (1 - accuracy) * 60;
        const confidenceScore = confidence * 40;
        return Math.round(Math.min(100, accuracyScore + confidenceScore));
    }

    /**
     * Detect learning trend from recent vs older performance
     */
    private detectTrend(stats: KeyPerformance): 'improving' | 'declining' | 'stable' {
        if (stats.attempts.length < 10) return 'stable';

        const midPoint = Math.floor(stats.attempts.length / 2);

        // Split attempts into older and newer halves
        const older = stats.attempts.slice(0, midPoint);
        const newer = stats.attempts.slice(midPoint);

        const calcAccuracy = (attempts: KeyAttempt[]) => {
            if (attempts.length === 0) return 0;
            const correct = attempts.filter(a => a.isCorrect).length;
            return correct / attempts.length;
        };

        const olderAccuracy = calcAccuracy(older);
        const newerAccuracy = calcAccuracy(newer);
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
     * Get keys due for review
     */
    public getDueForReview(results: WeaknessResult[]): string[] {
        const now = new Date();
        return results
            .filter(r => r.nextReviewDate <= now)
            .map(r => r.key);
    }

    // Persistence
    private persist(): void {
        try {
            // Check for test environment where window might be undefined but localStorage is mocked
            if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;

            // Debounce save to avoid main thread jank during typing
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = setTimeout(() => {
                try {
                    const data = Array.from(this.keyStats.entries());
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
                    this.saveTimeout = null;
                } catch (e) {
                    console.error('Failed to save weakness data', e);
                }
            }, 2000); // 2 second delay

        } catch (e) {
            console.error('Failed to schedule save', e);
        }
    }

    private hydrate(): void {
        try {
            if (typeof window === 'undefined' && typeof localStorage === 'undefined') return;

            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                this.keyStats = new Map(data);

                // Validate data structure (basic check)
                const first = this.keyStats.values().next().value;
                if (first && !Array.isArray(first.attempts)) {
                    console.warn('Invalid legacy weakness data detected. Resetting.');
                    this.keyStats.clear();
                    this.persist();
                }
            }
        } catch (e) {
            console.error('Failed to load weakness data', e);
        }
    }

    // Debug/Admin
    public reset(): void {
        this.keyStats.clear();
        this.persist();
    }
}

// Singleton export
export const weaknessDetector = new BayesianWeaknessDetector();
