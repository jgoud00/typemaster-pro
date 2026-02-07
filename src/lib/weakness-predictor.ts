'use client';

/**
 * Weakness Predictor
 * 
 * Analyzes typing patterns to identify and predict problem areas
 * using finger conflict detection, row jump analysis, and other heuristics.
 */

import { ngramAnalyzer, NgramStats } from './ngram-analyzer';

// Keyboard layout mapping for finger analysis
const FINGER_MAP: Record<string, number> = {
    // Left hand: pinky=0, ring=1, middle=2, index=3,4
    'q': 0, 'a': 0, 'z': 0, '1': 0,
    'w': 1, 's': 1, 'x': 1, '2': 1,
    'e': 2, 'd': 2, 'c': 2, '3': 2,
    'r': 3, 'f': 3, 'v': 3, '4': 3, 't': 4, 'g': 4, 'b': 4, '5': 4,
    // Right hand: index=5,6, middle=7, ring=8, pinky=9
    'y': 5, 'h': 5, 'n': 5, '6': 5, 'u': 6, 'j': 6, 'm': 6, '7': 6,
    'i': 7, 'k': 7, ',': 7, '8': 7,
    'o': 8, 'l': 8, '.': 8, '9': 8,
    'p': 9, ';': 9, '/': 9, '0': 9, '[': 9, ']': 9, "'": 9,
};

// Row mapping: 0=number, 1=top, 2=home, 3=bottom
const ROW_MAP: Record<string, number> = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '0': 0,
    'q': 1, 'w': 1, 'e': 1, 'r': 1, 't': 1, 'y': 1, 'u': 1, 'i': 1, 'o': 1, 'p': 1,
    'a': 2, 's': 2, 'd': 2, 'f': 2, 'g': 2, 'h': 2, 'j': 2, 'k': 2, 'l': 2, ';': 2,
    'z': 3, 'x': 3, 'c': 3, 'v': 3, 'b': 3, 'n': 3, 'm': 3, ',': 3, '.': 3, '/': 3,
};

// Hand mapping: 0=left, 1=right
const HAND_MAP: Record<string, number> = {
    'q': 0, 'w': 0, 'e': 0, 'r': 0, 't': 0, 'a': 0, 's': 0, 'd': 0, 'f': 0, 'g': 0,
    'z': 0, 'x': 0, 'c': 0, 'v': 0, 'b': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
    'y': 1, 'u': 1, 'i': 1, 'o': 1, 'p': 1, 'h': 1, 'j': 1, 'k': 1, 'l': 1, ';': 1,
    'n': 1, 'm': 1, ',': 1, '.': 1, '/': 1, '6': 1, '7': 1, '8': 1, '9': 1, '0': 1,
};

export interface WeaknessReport {
    weakKeys: string[];
    weakBigrams: string[];
    suggestedFocus: string[];
    patterns: {
        sameFingerBigrams: string[];      // Consecutive keys with same finger
        rowJumpBigrams: string[];          // Keys span 2+ rows
        sameHandBigrams: string[];         // Both keys on same hand (not necessarily bad)
    };
    insights: string[];
    severity: 'low' | 'medium' | 'high';
}

export interface PerKeyStats {
    key: string;
    attempts: number;
    errors: number;
    errorRate: number;
    avgTime: number;
}

/**
 * Detect if two characters use the same finger
 */
export function isSameFingerBigram(a: string, b: string): boolean {
    const fingerA = FINGER_MAP[a.toLowerCase()];
    const fingerB = FINGER_MAP[b.toLowerCase()];
    return fingerA !== undefined && fingerB !== undefined && fingerA === fingerB;
}

/**
 * Detect if two characters span multiple rows
 */
export function isRowJumpBigram(a: string, b: string): boolean {
    const rowA = ROW_MAP[a.toLowerCase()];
    const rowB = ROW_MAP[b.toLowerCase()];
    if (rowA === undefined || rowB === undefined) return false;
    return Math.abs(rowA - rowB) >= 2; // 2 or more rows apart
}

/**
 * Detect if two characters are on the same hand
 */
export function isSameHandBigram(a: string, b: string): boolean {
    const handA = HAND_MAP[a.toLowerCase()];
    const handB = HAND_MAP[b.toLowerCase()];
    return handA !== undefined && handB !== undefined && handA === handB;
}

/**
 * Get finger name for display
 */
export function getFingerName(finger: number): string {
    const names = [
        'left pinky', 'left ring', 'left middle', 'left index (inner)', 'left index',
        'right index', 'right index (inner)', 'right middle', 'right ring', 'right pinky'
    ];
    return names[finger] || 'unknown';
}

/**
 * Analyze weaknesses and generate a report
 */
export function analyzeWeaknesses(
    perKeyErrors: Map<string, { attempts: number; errors: number }>,
    minAttempts: number = 5
): WeaknessReport {
    const report: WeaknessReport = {
        weakKeys: [],
        weakBigrams: [],
        suggestedFocus: [],
        patterns: {
            sameFingerBigrams: [],
            rowJumpBigrams: [],
            sameHandBigrams: [],
        },
        insights: [],
        severity: 'low',
    };

    // Analyze per-key weaknesses
    const weakKeyList: PerKeyStats[] = [];
    perKeyErrors.forEach((stats, key) => {
        if (stats.attempts >= minAttempts) {
            const errorRate = stats.errors / stats.attempts;
            if (errorRate > 0.1) { // More than 10% error rate
                weakKeyList.push({
                    key,
                    attempts: stats.attempts,
                    errors: stats.errors,
                    errorRate,
                    avgTime: 0, // Would need timing data
                });
            }
        }
    });

    // Sort by error rate
    weakKeyList.sort((a, b) => b.errorRate - a.errorRate);
    report.weakKeys = weakKeyList.slice(0, 5).map(k => k.key);

    // Get ngram analysis
    const ngramReport = ngramAnalyzer.getReport(minAttempts);

    // Find problematic bigrams
    report.weakBigrams = ngramReport.errorProneBigrams
        .filter(b => b.errorRate > 0.15)
        .slice(0, 10)
        .map(b => b.ngram);

    // Analyze patterns in problematic bigrams
    ngramReport.errorProneBigrams.forEach(stats => {
        const [a, b] = stats.ngram.split('');
        if (a && b) {
            if (isSameFingerBigram(a, b)) {
                report.patterns.sameFingerBigrams.push(stats.ngram);
            }
            if (isRowJumpBigram(a, b)) {
                report.patterns.rowJumpBigrams.push(stats.ngram);
            }
            if (isSameHandBigram(a, b)) {
                report.patterns.sameHandBigrams.push(stats.ngram);
            }
        }
    });

    // Also check slow bigrams for patterns
    ngramReport.slowestBigrams.forEach(stats => {
        const [a, b] = stats.ngram.split('');
        if (a && b && isSameFingerBigram(a, b) &&
            !report.patterns.sameFingerBigrams.includes(stats.ngram)) {
            report.patterns.sameFingerBigrams.push(stats.ngram);
        }
    });

    // Generate insights based on patterns
    if (report.patterns.sameFingerBigrams.length > 3) {
        report.insights.push(
            `Same-finger transitions are slowing you down. Focus on: ${report.patterns.sameFingerBigrams.slice(0, 3).join(', ')}`
        );
    }

    if (report.patterns.rowJumpBigrams.length > 2) {
        report.insights.push(
            `Row jumps need practice. Work on reaching between rows for: ${report.patterns.rowJumpBigrams.slice(0, 3).join(', ')}`
        );
    }

    // Check for finger-specific weaknesses
    const fingerErrors: Record<number, number> = {};
    weakKeyList.forEach(k => {
        const finger = FINGER_MAP[k.key];
        if (finger !== undefined) {
            fingerErrors[finger] = (fingerErrors[finger] || 0) + k.errors;
        }
    });

    const weakestFinger = Object.entries(fingerErrors)
        .sort(([, a], [, b]) => b - a)[0];
    if (weakestFinger && weakestFinger[1] > 5) {
        report.insights.push(
            `Your ${getFingerName(parseInt(weakestFinger[0]))} needs extra practice.`
        );
    }

    // Create suggested focus list (unique keys to practice)
    const focusSet = new Set<string>();
    report.weakKeys.forEach(k => focusSet.add(k));
    report.weakBigrams.forEach(b => {
        b.split('').forEach(c => focusSet.add(c));
    });
    report.suggestedFocus = Array.from(focusSet).slice(0, 8);

    // Determine severity
    const weaknessScore =
        report.weakKeys.length * 2 +
        report.weakBigrams.length +
        report.patterns.sameFingerBigrams.length;

    if (weaknessScore > 15) {
        report.severity = 'high';
    } else if (weaknessScore > 7) {
        report.severity = 'medium';
    } else {
        report.severity = 'low';
    }

    return report;
}

/**
 * Get keys to practice based on current weaknesses
 */
export function getSuggestedPracticeKeys(
    perKeyErrors: Map<string, { attempts: number; errors: number }>
): string[] {
    const report = analyzeWeaknesses(perKeyErrors);
    return report.suggestedFocus;
}

/**
 * Generate practice text focusing on weak keys
 */
export function generateWeaknessFocusedText(
    weakKeys: string[],
    length: number = 100
): string {
    if (weakKeys.length === 0) return '';

    // Common words containing each weak key
    const wordsByKey: Record<string, string[]> = {
        'a': ['and', 'about', 'after', 'again', 'against', 'are', 'at', 'all'],
        'b': ['be', 'been', 'before', 'but', 'by', 'back', 'because', 'both'],
        'c': ['can', 'come', 'could', 'case', 'each', 'such', 'much', 'which'],
        'd': ['did', 'do', 'down', 'and', 'day', 'find', 'good', 'made'],
        'e': ['the', 'be', 'we', 'me', 'even', 'here', 'there', 'when'],
        'f': ['for', 'from', 'find', 'first', 'after', 'before', 'off', 'if'],
        'g': ['get', 'go', 'good', 'going', 'give', 'great', 'big', 'long'],
        'h': ['he', 'his', 'have', 'has', 'her', 'how', 'here', 'she'],
        'i': ['in', 'it', 'is', 'if', 'into', 'with', 'this', 'will'],
        'j': ['just', 'job', 'join', 'major', 'project', 'subject', 'object'],
        'k': ['know', 'keep', 'kind', 'like', 'work', 'make', 'back', 'look'],
        'l': ['like', 'look', 'little', 'long', 'will', 'well', 'all', 'also'],
        'm': ['me', 'my', 'more', 'make', 'many', 'may', 'some', 'time'],
        'n': ['new', 'now', 'no', 'not', 'one', 'on', 'when', 'than'],
        'o': ['of', 'on', 'one', 'or', 'over', 'own', 'into', 'also'],
        'p': ['people', 'part', 'place', 'point', 'up', 'help', 'keep', 'up'],
        'q': ['question', 'quick', 'quite', 'quality', 'quote', 'require'],
        'r': ['or', 'are', 'for', 'her', 'more', 'from', 'great', 'work'],
        's': ['so', 'some', 'she', 'see', 'say', 'same', 'side', 'set'],
        't': ['the', 'to', 'that', 'this', 'than', 'time', 'take', 'two'],
        'u': ['up', 'us', 'use', 'you', 'your', 'under', 'upon', 'must'],
        'v': ['very', 'over', 'even', 'ever', 'have', 'give', 'every', 'never'],
        'w': ['we', 'with', 'would', 'will', 'way', 'well', 'work', 'when'],
        'x': ['next', 'example', 'exact', 'extra', 'text', 'box', 'six', 'fix'],
        'y': ['you', 'your', 'yes', 'year', 'they', 'may', 'way', 'say'],
        'z': ['zero', 'zone', 'size', 'realize', 'organize', 'amazing', 'frozen'],
    };

    // Collect words for weak keys
    const words: string[] = [];
    weakKeys.forEach(key => {
        const keyWords = wordsByKey[key.toLowerCase()];
        if (keyWords) {
            words.push(...keyWords);
        }
    });

    if (words.length === 0) return '';

    // Build text by randomly selecting words
    let text = '';
    let wordCount = 0;
    while (text.length < length) {
        const word = words[Math.floor(Math.random() * words.length)];
        text += (text ? ' ' : '') + word;
        wordCount++;
        if (wordCount > 50) break; // Safety limit
    }

    return text;
}
