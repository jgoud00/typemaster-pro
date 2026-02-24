/**
 * Statistical Analysis Utilities
 * 
 * Provides functions for calculating mean, median, standard deviation,
 * and other statistical metrics to analyze typing performance consistency.
 */

export const mean = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
};

export const median = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
};

export const standardDeviation = (numbers: number[]): number => {
    if (numbers.length === 0) return 0;
    const avg = mean(numbers);
    const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
    const avgSquareDiff = mean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
};

export const percentile = (numbers: number[], value: number): number => {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const index = sorted.findIndex(n => n >= value);
    if (index === -1) return 100;
    return (index / sorted.length) * 100;
};

export const consistencyScore = (wpmHistory: number[]): string => {
    if (wpmHistory.length < 5) return 'Not enough data';
    const cv = standardDeviation(wpmHistory) / mean(wpmHistory);

    if (cv < 0.1) return 'Machine-like';
    if (cv < 0.2) return 'Very Consistent';
    if (cv < 0.3) return 'Consistent';
    if (cv < 0.4) return 'Variable';
    return 'Erratic';
};
