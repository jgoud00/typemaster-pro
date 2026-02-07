'use client';

/**
 * N-gram Analyzer
 * 
 * Tracks typing performance at the character-pair (bigram) and 
 * character-triplet (trigram) level to identify problematic transitions.
 */

export interface NgramStats {
    ngram: string;           // The character sequence (e.g., "th", "ing")
    attempts: number;        // Total times this ngram was typed
    errors: number;          // Times an error occurred in this sequence
    totalTime: number;       // Cumulative time for this ngram (ms)
    avgTime: number;         // Average time between chars (ms)
    errorRate: number;       // errors / attempts (0-1)
    lastTyped: number;       // Timestamp of last occurrence
}

export interface NgramAnalysis {
    bigrams: Map<string, NgramStats>;
    trigrams: Map<string, NgramStats>;
}

export interface NgramReport {
    slowestBigrams: NgramStats[];
    errorProneBigrams: NgramStats[];
    slowestTrigrams: NgramStats[];
    errorProneTrigrams: NgramStats[];
    averageBigramTime: number;
    averageTrigramTime: number;
}

// Storage key for persistence
const NGRAM_STORAGE_KEY = 'typing-ngram-analysis';

class NgramAnalyzer {
    private bigrams: Map<string, NgramStats> = new Map();
    private trigrams: Map<string, NgramStats> = new Map();

    // Tracking current sequence
    private recentChars: { char: string; time: number; correct: boolean }[] = [];

    constructor() {
        this.load();
    }

    /**
     * Record a keystroke for ngram analysis
     */
    recordKeystroke(char: string, timestamp: number, isCorrect: boolean): void {
        // Add to recent chars buffer
        this.recentChars.push({ char: char.toLowerCase(), time: timestamp, correct: isCorrect });

        // Keep only last 4 chars for trigram analysis
        if (this.recentChars.length > 4) {
            this.recentChars.shift();
        }

        // Analyze bigrams (need at least 2 chars)
        if (this.recentChars.length >= 2) {
            const prev = this.recentChars[this.recentChars.length - 2];
            const curr = this.recentChars[this.recentChars.length - 1];
            const bigram = prev.char + curr.char;
            const timeDiff = curr.time - prev.time;
            const hasError = !prev.correct || !curr.correct;

            this.updateNgram(this.bigrams, bigram, timeDiff, hasError);
        }

        // Analyze trigrams (need at least 3 chars)
        if (this.recentChars.length >= 3) {
            const c1 = this.recentChars[this.recentChars.length - 3];
            const c2 = this.recentChars[this.recentChars.length - 2];
            const c3 = this.recentChars[this.recentChars.length - 1];
            const trigram = c1.char + c2.char + c3.char;
            const timeDiff = c3.time - c1.time;
            const hasError = !c1.correct || !c2.correct || !c3.correct;

            this.updateNgram(this.trigrams, trigram, timeDiff, hasError);
        }
    }

    /**
     * Update stats for an ngram
     */
    private updateNgram(
        map: Map<string, NgramStats>,
        ngram: string,
        timeDiff: number,
        hasError: boolean
    ): void {
        // Skip if invalid timing (negative or > 5 seconds suggests pause)
        if (timeDiff < 0 || timeDiff > 5000) return;

        // Skip if contains special chars
        if (!/^[a-z]+$/.test(ngram)) return;

        const existing = map.get(ngram);

        if (existing) {
            const newAttempts = existing.attempts + 1;
            const newErrors = existing.errors + (hasError ? 1 : 0);
            const newTotalTime = existing.totalTime + timeDiff;

            map.set(ngram, {
                ngram,
                attempts: newAttempts,
                errors: newErrors,
                totalTime: newTotalTime,
                avgTime: newTotalTime / newAttempts,
                errorRate: newErrors / newAttempts,
                lastTyped: Date.now(),
            });
        } else {
            map.set(ngram, {
                ngram,
                attempts: 1,
                errors: hasError ? 1 : 0,
                totalTime: timeDiff,
                avgTime: timeDiff,
                errorRate: hasError ? 1 : 0,
                lastTyped: Date.now(),
            });
        }
    }

    /**
     * Reset the current sequence (e.g., on lesson start)
     */
    resetSequence(): void {
        this.recentChars = [];
    }

    /**
     * Get analysis report
     */
    getReport(minAttempts: number = 5): NgramReport {
        const bigramList = Array.from(this.bigrams.values())
            .filter(s => s.attempts >= minAttempts);
        const trigramList = Array.from(this.trigrams.values())
            .filter(s => s.attempts >= minAttempts);

        // Sort for slowest
        const slowestBigrams = [...bigramList]
            .sort((a, b) => b.avgTime - a.avgTime)
            .slice(0, 10);

        const slowestTrigrams = [...trigramList]
            .sort((a, b) => b.avgTime - a.avgTime)
            .slice(0, 10);

        // Sort for most error-prone
        const errorProneBigrams = [...bigramList]
            .filter(s => s.errorRate > 0)
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 10);

        const errorProneTrigrams = [...trigramList]
            .filter(s => s.errorRate > 0)
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 10);

        // Calculate averages
        const avgBigramTime = bigramList.length > 0
            ? bigramList.reduce((sum, s) => sum + s.avgTime, 0) / bigramList.length
            : 0;

        const avgTrigramTime = trigramList.length > 0
            ? trigramList.reduce((sum, s) => sum + s.avgTime, 0) / trigramList.length
            : 0;

        return {
            slowestBigrams,
            errorProneBigrams,
            slowestTrigrams,
            errorProneTrigrams,
            averageBigramTime: avgBigramTime,
            averageTrigramTime: avgTrigramTime,
        };
    }

    /**
     * Get raw stats for a specific ngram
     */
    getBigramStats(bigram: string): NgramStats | undefined {
        return this.bigrams.get(bigram.toLowerCase());
    }

    getTrigramStats(trigram: string): NgramStats | undefined {
        return this.trigrams.get(trigram.toLowerCase());
    }

    /**
     * Get all bigrams sorted by error rate
     */
    getProblematicBigrams(minAttempts: number = 3): NgramStats[] {
        return Array.from(this.bigrams.values())
            .filter(s => s.attempts >= minAttempts && s.errorRate > 0.1)
            .sort((a, b) => b.errorRate - a.errorRate);
    }

    /**
     * Get all bigrams that are significantly slower than average
     */
    getSlowBigrams(minAttempts: number = 3): NgramStats[] {
        const report = this.getReport(minAttempts);
        const threshold = report.averageBigramTime * 1.5; // 50% slower than average

        return Array.from(this.bigrams.values())
            .filter(s => s.attempts >= minAttempts && s.avgTime > threshold)
            .sort((a, b) => b.avgTime - a.avgTime);
    }

    /**
     * Persist to localStorage
     */
    save(): void {
        if (typeof localStorage === 'undefined') return;

        const data = {
            bigrams: Array.from(this.bigrams.entries()),
            trigrams: Array.from(this.trigrams.entries()),
        };

        localStorage.setItem(NGRAM_STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * Load from localStorage
     */
    private load(): void {
        if (typeof localStorage === 'undefined') return;

        try {
            const saved = localStorage.getItem(NGRAM_STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.bigrams = new Map(data.bigrams || []);
                this.trigrams = new Map(data.trigrams || []);
            }
        } catch {
            // Start fresh on error
            this.bigrams = new Map();
            this.trigrams = new Map();
        }
    }

    /**
     * Clear all stored data
     */
    clear(): void {
        this.bigrams = new Map();
        this.trigrams = new Map();
        this.recentChars = [];
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(NGRAM_STORAGE_KEY);
        }
    }

    /**
     * Get total unique ngrams tracked
     */
    getStats(): { bigramCount: number; trigramCount: number; totalAttempts: number } {
        const bigramAttempts = Array.from(this.bigrams.values())
            .reduce((sum, s) => sum + s.attempts, 0);
        const trigramAttempts = Array.from(this.trigrams.values())
            .reduce((sum, s) => sum + s.attempts, 0);

        return {
            bigramCount: this.bigrams.size,
            trigramCount: this.trigrams.size,
            totalAttempts: bigramAttempts + trigramAttempts,
        };
    }
}

// Singleton instance
export const ngramAnalyzer = new NgramAnalyzer();
