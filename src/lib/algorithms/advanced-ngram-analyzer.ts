/**
 * Advanced N-gram Analysis System
 * 
 * Analyzes bigrams and trigrams with:
 * - English frequency tables for difficulty weighting
 * - Predictive error modeling
 * - All character types (letters, numbers, punctuation)
 * - No error propagation between n-grams
 */

export interface NgramData {
    ngram: string;
    frequency: number;         // User's observed frequency
    avgSpeed: number;          // Average typing speed (ms between keys)
    errorRate: number;         // Error rate for this n-gram
    expectedFrequency: number; // Expected frequency in English
    difficulty: number;        // 0-100 difficulty score
    lastSeen: number;          // Timestamp
}

export interface NgramReport {
    slowest: NgramData[];
    errorProne: NgramData[];
    mostDifficult: NgramData[];
    predictions: Map<string, number>;  // char -> probability of error
}

// Top English bigram frequencies (%)
const BIGRAM_FREQUENCIES: Record<string, number> = {
    'th': 3.56, 'he': 3.07, 'in': 2.43, 'er': 2.05, 'an': 1.99,
    're': 1.85, 'on': 1.76, 'at': 1.49, 'en': 1.45, 'nd': 1.35,
    'ti': 1.34, 'es': 1.34, 'or': 1.28, 'te': 1.20, 'of': 1.17,
    'ed': 1.17, 'is': 1.13, 'it': 1.12, 'al': 1.09, 'ar': 1.07,
    'st': 1.05, 'to': 1.05, 'nt': 1.04, 'ng': 0.98, 'se': 0.93,
    'ha': 0.93, 'as': 0.87, 'ou': 0.87, 'io': 0.83, 'le': 0.83,
    've': 0.83, 'co': 0.79, 'me': 0.79, 'de': 0.76, 'hi': 0.76,
    'ri': 0.73, 'ro': 0.73, 'ic': 0.70, 'ne': 0.69, 'ea': 0.69,
    'ra': 0.69, 'ce': 0.65, 'li': 0.62, 'ch': 0.60, 'll': 0.58,
    'be': 0.58, 'ma': 0.57, 'si': 0.55, 'om': 0.55, 'ur': 0.54,
};

// Top English trigram frequencies (%)
const TRIGRAM_FREQUENCIES: Record<string, number> = {
    'the': 3.51, 'and': 1.59, 'ing': 1.15, 'ion': 1.05, 'tio': 1.04,
    'ent': 0.97, 'ati': 0.93, 'for': 0.93, 'her': 0.89, 'ter': 0.88,
    'hat': 0.87, 'tha': 0.87, 'ere': 0.86, 'ate': 0.80, 'his': 0.80,
    'con': 0.77, 'res': 0.75, 'ver': 0.75, 'all': 0.74, 'ons': 0.72,
    'nce': 0.71, 'men': 0.70, 'ith': 0.69, 'ted': 0.69, 'ers': 0.68,
    'pro': 0.67, 'thi': 0.66, 'wit': 0.65, 'are': 0.65, 'ess': 0.64,
};

export class AdvancedNgramAnalyzer {
    private bigramData = new Map<string, NgramData>();
    private trigramData = new Map<string, NgramData>();
    private charBuffer: string[] = [];
    private timestampBuffer: number[] = [];
    private correctnessBuffer: boolean[] = [];

    private readonly STORAGE_KEY = 'advanced-ngram-data';

    constructor() {
        this.load();
    }

    /**
     * Record a keystroke (handles all character types)
     */
    record(char: string, isCorrect: boolean, timestamp: number): void {
        // Update buffers
        this.charBuffer.push(char.toLowerCase());
        this.timestampBuffer.push(timestamp);
        this.correctnessBuffer.push(isCorrect);

        // Keep last 4 characters
        if (this.charBuffer.length > 4) {
            this.charBuffer.shift();
            this.timestampBuffer.shift();
            this.correctnessBuffer.shift();
        }

        // Analyze bigrams (need at least 2 chars)
        if (this.charBuffer.length >= 2) {
            this.updateBigram();
        }

        // Analyze trigrams (need at least 3 chars)
        if (this.charBuffer.length >= 3) {
            this.updateTrigram();
        }

        // Auto-save periodically
        if (Math.random() < 0.01) {
            this.save();
        }
    }

    /**
     * Update bigram statistics
     */
    private updateBigram(): void {
        const len = this.charBuffer.length;
        const bigram = this.charBuffer[len - 2] + this.charBuffer[len - 1];
        const timing = this.timestampBuffer[len - 1] - this.timestampBuffer[len - 2];
        const correct = this.correctnessBuffer[len - 1]; // Only check last char

        let data = this.bigramData.get(bigram);
        if (!data) {
            data = {
                ngram: bigram,
                frequency: 0,
                avgSpeed: 0,
                errorRate: 0,
                expectedFrequency: BIGRAM_FREQUENCIES[bigram] || 0.1,
                difficulty: 50,
                lastSeen: 0,
            };
            this.bigramData.set(bigram, data);
        }

        // Running average update
        const n = data.frequency;
        data.frequency++;
        data.avgSpeed = (data.avgSpeed * n + timing) / (n + 1);
        data.errorRate = (data.errorRate * n + (correct ? 0 : 1)) / (n + 1);
        data.lastSeen = Date.now();
        data.difficulty = this.calculateDifficulty(data);
    }

    /**
     * Update trigram statistics
     */
    private updateTrigram(): void {
        const len = this.charBuffer.length;
        const trigram = this.charBuffer[len - 3] + this.charBuffer[len - 2] + this.charBuffer[len - 1];
        const timing = this.timestampBuffer[len - 1] - this.timestampBuffer[len - 3];
        const correct = this.correctnessBuffer[len - 1];

        let data = this.trigramData.get(trigram);
        if (!data) {
            data = {
                ngram: trigram,
                frequency: 0,
                avgSpeed: 0,
                errorRate: 0,
                expectedFrequency: TRIGRAM_FREQUENCIES[trigram] || 0.05,
                difficulty: 50,
                lastSeen: 0,
            };
            this.trigramData.set(trigram, data);
        }

        const n = data.frequency;
        data.frequency++;
        data.avgSpeed = (data.avgSpeed * n + timing) / (n + 1);
        data.errorRate = (data.errorRate * n + (correct ? 0 : 1)) / (n + 1);
        data.lastSeen = Date.now();
        data.difficulty = this.calculateDifficulty(data);
    }

    /**
     * Calculate difficulty score (0-100)
     */
    private calculateDifficulty(data: NgramData): number {
        // Error rate contributes most (0-50)
        const errorScore = data.errorRate * 50;

        // Speed relative to baseline 150ms (0-30)
        const speedScore = Math.min(30, Math.max(0, (data.avgSpeed - 100) / 10));

        // Rarity bonus (rare ngrams are harder) (0-20)
        const rarityScore = Math.max(0, 20 - data.expectedFrequency * 10);

        return Math.min(100, Math.round(errorScore + speedScore + rarityScore));
    }

    /**
     * Get difficult n-grams sorted by difficulty
     */
    getDifficultNgrams(minDifficulty = 50, minFrequency = 3, limit = 15): NgramData[] {
        const difficult: NgramData[] = [];

        this.bigramData.forEach(data => {
            if (data.difficulty >= minDifficulty && data.frequency >= minFrequency) {
                difficult.push(data);
            }
        });

        this.trigramData.forEach(data => {
            if (data.difficulty >= minDifficulty && data.frequency >= minFrequency) {
                difficult.push(data);
            }
        });

        // Weight by expected frequency (common difficult ngrams matter more)
        return difficult
            .sort((a, b) => {
                const scoreA = a.difficulty * (1 + a.expectedFrequency);
                const scoreB = b.difficulty * (1 + b.expectedFrequency);
                return scoreB - scoreA;
            })
            .slice(0, limit);
    }

    /**
     * Predict error probability for each position in text
     */
    predictErrors(text: string): Map<number, number> {
        const predictions = new Map<number, number>();
        const lowerText = text.toLowerCase();

        for (let i = 1; i < lowerText.length; i++) {
            const bigram = lowerText.substring(i - 1, i + 1);
            const data = this.bigramData.get(bigram);

            if (data && data.frequency >= 3) {
                predictions.set(i, data.errorRate);
            } else {
                // Unknown bigram: estimate based on frequency
                const expectedFreq = BIGRAM_FREQUENCIES[bigram] || 0.1;
                predictions.set(i, Math.max(0.05, 0.3 - expectedFreq / 10));
            }
        }

        return predictions;
    }

    /**
     * Get comprehensive report
     */
    getReport(minAttempts = 5): NgramReport {
        const allNgrams: NgramData[] = [];

        this.bigramData.forEach(data => {
            if (data.frequency >= minAttempts) allNgrams.push(data);
        });

        this.trigramData.forEach(data => {
            if (data.frequency >= minAttempts) allNgrams.push(data);
        });

        return {
            slowest: [...allNgrams].sort((a, b) => b.avgSpeed - a.avgSpeed).slice(0, 10),
            errorProne: [...allNgrams].sort((a, b) => b.errorRate - a.errorRate).slice(0, 10),
            mostDifficult: [...allNgrams].sort((a, b) => b.difficulty - a.difficulty).slice(0, 10),
            predictions: new Map(),
        };
    }

    /**
     * Generate practice text focusing on difficult n-grams
     */
    generatePracticeText(length = 200): string {
        const difficult = this.getDifficultNgrams(40, 2, 10);
        if (difficult.length === 0) {
            return 'the quick brown fox jumps over the lazy dog'.repeat(5);
        }

        const targetNgrams = difficult.map(d => d.ngram);
        const words = this.getWordsContaining(targetNgrams);

        // Build practice text
        const result: string[] = [];
        let charCount = 0;

        while (charCount < length && words.length > 0) {
            const word = words[Math.floor(Math.random() * words.length)];
            result.push(word);
            charCount += word.length + 1;
        }

        return result.join(' ');
    }

    /**
     * Get words containing target n-grams
     */
    private getWordsContaining(ngrams: string[]): string[] {
        const wordBank = [
            'the', 'there', 'their', 'then', 'them', 'these', 'through', 'think',
            'and', 'another', 'answer', 'any', 'anything', 'hand', 'stand', 'understand',
            'for', 'from', 'form', 'former', 'before', 'therefore', 'information',
            'that', 'what', 'with', 'this', 'which', 'while', 'whether',
            'have', 'having', 'had', 'has', 'behave', 'behavior',
            'would', 'could', 'should', 'world', 'work', 'word', 'wonder',
            'about', 'out', 'without', 'throughout', 'outside', 'sounds',
            'been', 'between', 'see', 'seeing', 'seem', 'seen',
            'into', 'also', 'most', 'almost', 'post', 'cost', 'host',
            'time', 'times', 'sometime', 'prime', 'climb', 'crime',
            'just', 'adjust', 'justice', 'must', 'trust', 'rust',
            'know', 'knowledge', 'known', 'acknowledge', 'snow', 'show',
            'people', 'place', 'please', 'plan', 'play', 'player',
            'question', 'quick', 'quite', 'quiet', 'quote', 'quality',
            'experience', 'example', 'expect', 'explain', 'express', 'extra',
        ];

        if (ngrams.length === 0) return wordBank;

        return wordBank.filter(word =>
            ngrams.some(ng => word.includes(ng))
        );
    }

    /**
     * Reset sequence (call when starting new text)
     */
    resetSequence(): void {
        this.charBuffer = [];
        this.timestampBuffer = [];
        this.correctnessBuffer = [];
    }

    /**
     * Save to localStorage
     */
    save(): void {
        try {
            const data = {
                bigrams: Array.from(this.bigramData.entries()),
                trigrams: Array.from(this.trigramData.entries()),
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save ngram data:', e);
        }
    }

    /**
     * Load from localStorage
     */
    load(): void {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                this.bigramData = new Map(data.bigrams || []);
                this.trigramData = new Map(data.trigrams || []);
            }
        } catch (e) {
            console.warn('Failed to load ngram data:', e);
        }
    }

    /**
     * Clear all data
     */
    clear(): void {
        this.bigramData.clear();
        this.trigramData.clear();
        this.resetSequence();
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

// Singleton export
export const advancedNgramAnalyzer = new AdvancedNgramAnalyzer();
