'use client';

import { useAnalyticsStore } from '@/stores/analytics-store';

/**
 * Adaptive Lesson Generator
 * 
 * Generates personalized practice content based on user's weak keys
 * and implements basic spaced repetition scheduling.
 */

export interface AdaptiveLesson {
    title: string;
    description: string;
    exercises: string[];
    focusKeys: string[];
    difficulty: 'easy' | 'medium' | 'hard';
}

// Common words organized by the letters they emphasize
const WORD_BANK: Record<string, string[]> = {
    'a': ['apple', 'amazing', 'always', 'away', 'about', 'again', 'area', 'also', 'after', 'ability'],
    'b': ['book', 'best', 'bring', 'before', 'between', 'build', 'both', 'back', 'begin', 'better'],
    'c': ['can', 'come', 'could', 'call', 'change', 'company', 'case', 'create', 'clear', 'center'],
    'd': ['day', 'did', 'down', 'different', 'during', 'development', 'design', 'decided', 'doing', 'done'],
    'e': ['every', 'even', 'ever', 'example', 'experience', 'expect', 'effect', 'else', 'enter', 'end'],
    'f': ['for', 'from', 'find', 'first', 'feel', 'fact', 'few', 'focus', 'follow', 'form'],
    'g': ['go', 'get', 'give', 'good', 'great', 'going', 'group', 'grow', 'game', 'general'],
    'h': ['have', 'how', 'here', 'help', 'home', 'high', 'however', 'history', 'hand', 'happen'],
    'i': ['in', 'it', 'into', 'if', 'include', 'important', 'idea', 'issue', 'interest', 'information'],
    'j': ['just', 'job', 'join', 'jump', 'judge', 'journey', 'justice', 'junior', 'jacket', 'joyful'],
    'k': ['know', 'keep', 'kind', 'key', 'knowledge', 'known', 'kick', 'kids', 'kitchen', 'king'],
    'l': ['like', 'long', 'look', 'last', 'life', 'little', 'learn', 'leave', 'level', 'local'],
    'm': ['make', 'more', 'most', 'many', 'may', 'much', 'member', 'money', 'move', 'moment'],
    'n': ['new', 'now', 'not', 'need', 'never', 'number', 'next', 'name', 'national', 'night'],
    'o': ['of', 'or', 'other', 'only', 'over', 'our', 'order', 'open', 'offer', 'often'],
    'p': ['people', 'part', 'place', 'point', 'program', 'possible', 'problem', 'provide', 'public', 'put'],
    'q': ['question', 'quick', 'quite', 'quality', 'quarter', 'quiet', 'quote', 'queen', 'quest', 'quiz'],
    'r': ['right', 'really', 'run', 'require', 'research', 'result', 'reason', 'report', 'read', 'room'],
    's': ['so', 'say', 'some', 'same', 'seem', 'state', 'start', 'still', 'show', 'system'],
    't': ['the', 'to', 'that', 'they', 'this', 'time', 'think', 'then', 'take', 'through'],
    'u': ['up', 'use', 'under', 'understand', 'until', 'upon', 'used', 'usually', 'unit', 'us'],
    'v': ['very', 'view', 'value', 'various', 'video', 'voice', 'version', 'visit', 'vote', 'via'],
    'w': ['with', 'will', 'what', 'work', 'way', 'want', 'well', 'while', 'would', 'write'],
    'x': ['example', 'expect', 'experience', 'explain', 'express', 'next', 'text', 'box', 'extra', 'exactly'],
    'y': ['you', 'year', 'your', 'yet', 'yes', 'young', 'yourself', 'yesterday', 'yellow', 'yield'],
    'z': ['zero', 'zone', 'zip', 'zoom', 'zigzag', 'zest', 'zenith', 'zealous', 'plaza', 'fizz'],
};

// Finger drills for specific keys
const FINGER_DRILLS: Record<string, string[]> = {
    'left-pinky': ['qa', 'az', 'aq', 'za', 'qaz'],
    'left-ring': ['ws', 'sx', 'sw', 'xs', 'wsx'],
    'left-middle': ['ed', 'dc', 'de', 'cd', 'edc'],
    'left-index': ['rf', 'ft', 'tg', 'gb', 'rfv', 'tgb'],
    'right-index': ['yh', 'uj', 'hj', 'nj', 'yhn', 'ujm'],
    'right-middle': ['ik', 'km', 'ki', 'mk', 'ikm'],
    'right-ring': ['ol', 'l.', 'lo', '.l', 'ol.'],
    'right-pinky': ['p;', ';/', 'p/', '/;', 'p;/'],
};

export class AdaptiveLessonGenerator {
    /**
     * Generates a personalized lesson based on user's weak keys
     */
    static generateWeaknessLesson(): AdaptiveLesson {
        const analytics = useAnalyticsStore.getState();
        const weakKeys = this.identifyWeakKeys(analytics.keyStats);

        if (weakKeys.length === 0) {
            return this.generateReviewLesson();
        }

        const exercises = this.generateTargetedExercises(weakKeys);

        return {
            title: `Focus: ${weakKeys.slice(0, 3).join(', ').toUpperCase()}`,
            description: `Practice these challenging keys: ${weakKeys.join(', ')}`,
            exercises,
            focusKeys: weakKeys,
            difficulty: this.calculateDifficulty(weakKeys, analytics.keyStats),
        };
    }

    /**
     * Generates a general review lesson when no weak keys exist
     */
    static generateReviewLesson(): AdaptiveLesson {
        const randomWords = Object.values(WORD_BANK)
            .flat()
            .sort(() => Math.random() - 0.5)
            .slice(0, 30);

        return {
            title: 'General Practice',
            description: 'Great job! No weak keys detected. Here\'s some general practice.',
            exercises: [randomWords.join(' ')],
            focusKeys: [],
            difficulty: 'medium',
        };
    }

    /**
     * Identifies keys with error rate > 15% and minimum 10 attempts
     */
    private static identifyWeakKeys(
        keyStats: Record<string, { totalAttempts: number; errors: number }>
    ): string[] {
        const weakKeys: Array<{ key: string; errorRate: number }> = [];

        Object.entries(keyStats).forEach(([key, stats]) => {
            if (stats.totalAttempts >= 10) {
                const errorRate = stats.errors / stats.totalAttempts;
                if (errorRate > 0.15) {
                    weakKeys.push({ key, errorRate });
                }
            }
        });

        // Sort by error rate (worst first), take top 5
        return weakKeys
            .sort((a, b) => b.errorRate - a.errorRate)
            .slice(0, 5)
            .map(k => k.key.toLowerCase());
    }

    /**
     * Generates exercises targeting specific weak keys
     */
    private static generateTargetedExercises(focusKeys: string[]): string[] {
        const exercises: string[] = [];

        // Exercise 1: Key isolation (repeat key patterns)
        const isolationDrill = focusKeys
            .map(key => `${key}${key}${key} ${key} ${key}${key}`)
            .join(' ');
        exercises.push(isolationDrill);

        // Exercise 2: Words containing focus keys
        const targetWords: string[] = [];
        focusKeys.forEach(key => {
            const words = WORD_BANK[key] || [];
            targetWords.push(...words.slice(0, 5));
        });
        if (targetWords.length > 0) {
            exercises.push(targetWords.sort(() => Math.random() - 0.5).join(' '));
        }

        // Exercise 3: Mixed sentence with focus keys
        const sentence = this.generateSentenceWithKeys(focusKeys);
        exercises.push(sentence);

        // Exercise 4: Bigram practice
        const bigrams = this.generateBigramDrills(focusKeys);
        exercises.push(bigrams);

        return exercises;
    }

    /**
     * Creates sentences emphasizing specific keys
     */
    private static generateSentenceWithKeys(keys: string[]): string {
        const sentences = [
            'The quick brown fox jumps over the lazy dog.',
            'Pack my box with five dozen liquor jugs.',
            'How vexingly quick daft zebras jump!',
            'The five boxing wizards jump quickly.',
            'Sphinx of black quartz, judge my vow.',
        ];

        // Pick sentences that contain the focus keys
        const relevant = sentences.filter(s =>
            keys.some(k => s.toLowerCase().includes(k))
        );

        return relevant.length > 0
            ? relevant[Math.floor(Math.random() * relevant.length)]
            : sentences[0];
    }

    /**
     * Generates bigram practice drills
     */
    private static generateBigramDrills(keys: string[]): string {
        const drills: string[] = [];

        keys.forEach(key => {
            // Generate common bigrams with this key
            const vowels = ['a', 'e', 'i', 'o', 'u'];
            vowels.forEach(v => {
                drills.push(`${key}${v}`);
                drills.push(`${v}${key}`);
            });
        });

        // Shuffle and join
        return drills
            .sort(() => Math.random() - 0.5)
            .slice(0, 20)
            .join(' ');
    }

    /**
     * Calculates difficulty based on error rates
     */
    private static calculateDifficulty(
        keys: string[],
        keyStats: Record<string, { totalAttempts: number; errors: number }>
    ): 'easy' | 'medium' | 'hard' {
        if (keys.length === 0) return 'easy';

        const avgErrorRate = keys.reduce((sum, key) => {
            const stats = keyStats[key];
            if (!stats) return sum;
            return sum + (stats.errors / stats.totalAttempts);
        }, 0) / keys.length;

        if (avgErrorRate > 0.3) return 'hard';
        if (avgErrorRate > 0.2) return 'medium';
        return 'easy';
    }

    /**
     * Gets finger-specific drills
     */
    static getFingerDrills(finger: string): string {
        const drills = FINGER_DRILLS[finger] || [];
        return drills.join(' ').repeat(5);
    }

    /**
     * Simple spaced repetition scheduler
     * Returns the next review date based on performance (1-5 scale)
     */
    static scheduleReview(performance: number): Date {
        // Performance: 1 = bad, 5 = perfect
        // Interval multiplier based on SuperMemo SM-2 algorithm (simplified)
        const baseInterval = 1; // day
        const easinessFactor = Math.max(1.3, 1.3 + (performance - 3) * 0.15);
        const interval = baseInterval * Math.pow(easinessFactor, performance);

        const reviewDate = new Date();
        reviewDate.setDate(reviewDate.getDate() + Math.round(interval));

        return reviewDate;
    }

    /**
     * Gets keys that are due for review based on spaced repetition
     */
    static getDueKeys(
        reviewSchedule: Map<string, { nextReviewDate: Date }>
    ): string[] {
        const now = new Date();
        const dueKeys: string[] = [];

        reviewSchedule.forEach((schedule, key) => {
            if (schedule.nextReviewDate <= now) {
                dueKeys.push(key);
            }
        });

        return dueKeys;
    }
}

/**
 * React hook for adaptive lessons
 */
export function useAdaptiveLesson() {
    const lesson = AdaptiveLessonGenerator.generateWeaknessLesson();

    return {
        lesson,
        hasWeakKeys: lesson.focusKeys.length > 0,
        regenerate: () => AdaptiveLessonGenerator.generateWeaknessLesson(),
    };
}
