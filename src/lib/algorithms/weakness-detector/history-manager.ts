/**
 * History Manager
 * 
 * Manages historical data for the weakness detector.
 * Handles pruning, sliding windows, and temporal aggregation.
 */

export interface HistoryEntry<T> {
    timestamp: number;
    value: T;
}

export interface HistoryConfig {
    maxSize: number;
    pruneStrategy: 'oldest' | 'decay';
}

export class HistoryManager<T = number> {
    private entries: HistoryEntry<T>[] = [];
    private config: HistoryConfig;

    constructor(config: Partial<HistoryConfig> = {}) {
        this.config = {
            maxSize: 1000,
            pruneStrategy: 'oldest',
            ...config,
        };
    }

    /**
     * Add entry and auto-prune if needed
     */
    add(value: T, timestamp = Date.now()): void {
        this.entries.push({ timestamp, value });
        this.pruneIfNeeded();
    }

    /**
     * Get entries within a time window
     */
    getWindow(windowMs: number): HistoryEntry<T>[] {
        const cutoff = Date.now() - windowMs;
        return this.entries.filter(e => e.timestamp >= cutoff);
    }

    /**
     * Get the last N entries
     */
    getLast(n: number): HistoryEntry<T>[] {
        return this.entries.slice(-n);
    }

    /**
     * Get all entries
     */
    getAll(): readonly HistoryEntry<T>[] {
        return this.entries;
    }

    /**
     * Get entry count
     */
    get length(): number {
        return this.entries.length;
    }

    /**
     * Clear all entries
     */
    clear(): void {
        this.entries = [];
    }

    /**
     * Prune entries in-place (memory efficient)
     */
    private pruneIfNeeded(): void {
        const excess = this.entries.length - this.config.maxSize;
        if (excess > 0) {
            // In-place removal from beginning
            this.entries.splice(0, excess);
        }
    }

    /**
     * Aggregate values using a sliding window
     */
    aggregate<R>(
        windowMs: number,
        aggregator: (values: T[]) => R
    ): R | null {
        const entries = this.getWindow(windowMs);
        if (entries.length === 0) return null;
        return aggregator(entries.map(e => e.value));
    }

    /**
     * Calculate exponential weighted moving average
     */
    ewma(alpha: number = 0.3): number | null {
        if (this.entries.length === 0) return null;

        let result = 0;
        let isFirst = true;

        for (const entry of this.entries) {
            const value = entry.value as unknown as number;
            if (isFirst) {
                result = value;
                isFirst = false;
            } else {
                result = alpha * value + (1 - alpha) * result;
            }
        }

        return result;
    }

    /**
     * Serialize for localStorage
     */
    serialize(): HistoryEntry<T>[] {
        return [...this.entries];
    }

    /**
     * Deserialize from localStorage
     */
    deserialize(data: HistoryEntry<T>[]): void {
        this.entries = data;
        this.pruneIfNeeded();
    }
}

/**
 * Factory for creating typed history managers
 */
export function createHistoryManager<T = number>(
    config?: Partial<HistoryConfig>
): HistoryManager<T> {
    return new HistoryManager<T>(config);
}

/**
 * Specialized history for boolean success/failure
 */
export class SuccessHistory extends HistoryManager<boolean> {
    getSuccessRate(): number {
        const all = this.getAll();
        if (all.length === 0) return 0;
        const successes = all.filter(e => e.value).length;
        return successes / all.length;
    }

    getRecentSuccessRate(n: number): number {
        const last = this.getLast(n);
        if (last.length === 0) return 0;
        const successes = last.filter(e => e.value).length;
        return successes / last.length;
    }
}

/**
 * Specialized history for numeric speeds
 */
export class SpeedHistory extends HistoryManager<number> {
    getMean(): number | null {
        const all = this.getAll();
        if (all.length === 0) return null;
        const sum = all.reduce((acc, e) => acc + e.value, 0);
        return sum / all.length;
    }

    getStdDev(): number | null {
        const all = this.getAll();
        if (all.length < 2) return null;

        const mean = this.getMean()!;
        const squaredDiffs = all.map(e => Math.pow(e.value - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / all.length;
        return Math.sqrt(avgSquaredDiff);
    }

    getPercentile(p: number): number | null {
        const all = this.getAll();
        if (all.length === 0) return null;

        const sorted = [...all].sort((a, b) => a.value - b.value);
        const index = Math.floor((p / 100) * sorted.length);
        return sorted[Math.min(index, sorted.length - 1)].value;
    }
}
