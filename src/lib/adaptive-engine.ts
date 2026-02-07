'use client';

/**
 * Adaptive Difficulty Engine
 * 
 * Dynamically adjusts lesson content and difficulty based on user performance.
 * Generates personalized exercises targeting weak areas while maintaining engagement.
 */

import { generateWeaknessFocusedText, analyzeWeaknesses, WeaknessReport } from './weakness-predictor';
import { ngramAnalyzer } from './ngram-analyzer';

export interface MasteryScore {
    key: string;
    score: number;        // 0-100, higher = more mastered
    attempts: number;
    lastPracticed: number;
    trend: 'improving' | 'stable' | 'declining';
}

export interface DifficultyLevel {
    level: number;        // 1-10
    name: string;
    description: string;
    targetWpm: number;
    targetAccuracy: number;
    exerciseLength: number; // characters
}

export interface AdaptiveExercise {
    text: string;
    focusKeys: string[];
    difficulty: DifficultyLevel;
    reason: string;
}

// Difficulty presets
const DIFFICULTY_LEVELS: DifficultyLevel[] = [
    { level: 1, name: 'Beginner', description: 'Home row basics', targetWpm: 15, targetAccuracy: 85, exerciseLength: 50 },
    { level: 2, name: 'Novice', description: 'Building foundation', targetWpm: 20, targetAccuracy: 88, exerciseLength: 75 },
    { level: 3, name: 'Elementary', description: 'Expanding reach', targetWpm: 25, targetAccuracy: 90, exerciseLength: 100 },
    { level: 4, name: 'Intermediate', description: 'Full keyboard', targetWpm: 30, targetAccuracy: 90, exerciseLength: 120 },
    { level: 5, name: 'Competent', description: 'Building speed', targetWpm: 40, targetAccuracy: 92, exerciseLength: 150 },
    { level: 6, name: 'Proficient', description: 'Consistent typing', targetWpm: 50, targetAccuracy: 93, exerciseLength: 180 },
    { level: 7, name: 'Advanced', description: 'Above average', targetWpm: 60, targetAccuracy: 95, exerciseLength: 200 },
    { level: 8, name: 'Expert', description: 'High performance', targetWpm: 75, targetAccuracy: 96, exerciseLength: 250 },
    { level: 9, name: 'Master', description: 'Elite typist', targetWpm: 90, targetAccuracy: 97, exerciseLength: 300 },
    { level: 10, name: 'Grandmaster', description: 'Top tier', targetWpm: 110, targetAccuracy: 98, exerciseLength: 350 },
];

// Common practice words/phrases by difficulty
const PRACTICE_POOLS = {
    easy: [
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
        'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    ],
    medium: [
        'about', 'after', 'again', 'before', 'being', 'between', 'could', 'every',
        'first', 'found', 'great', 'however', 'little', 'might', 'never', 'other',
        'people', 'should', 'still', 'their', 'think', 'through', 'where', 'world',
    ],
    hard: [
        'accomplish', 'beautiful', 'circumstance', 'development', 'environment',
        'fundamental', 'government', 'hypothesis', 'immediately', 'jurisdiction',
        'knowledge', 'magnificent', 'notification', 'opportunity', 'perspective',
        'questionnaire', 'responsibility', 'sophisticated', 'technological', 'understanding',
    ],
};

/**
 * Calculate mastery score for a key based on recent performance
 * Uses exponential decay to weight recent attempts more heavily
 */
export function calculateMasteryScore(
    attempts: { timestamp: number; correct: boolean }[],
    now: number = Date.now()
): number {
    if (attempts.length === 0) return 50; // Neutral score for untested keys

    const decayHalfLife = 7 * 24 * 60 * 60 * 1000; // 7 days in ms
    let weightedCorrect = 0;
    let totalWeight = 0;

    attempts.forEach(attempt => {
        const age = now - attempt.timestamp;
        const weight = Math.pow(0.5, age / decayHalfLife); // Exponential decay
        totalWeight += weight;
        if (attempt.correct) {
            weightedCorrect += weight;
        }
    });

    if (totalWeight === 0) return 50;
    return Math.round((weightedCorrect / totalWeight) * 100);
}

/**
 * Determine appropriate difficulty level based on performance
 */
export function calculateDifficultyLevel(
    avgWpm: number,
    avgAccuracy: number
): DifficultyLevel {
    // Find the highest level where user meets both targets
    for (let i = DIFFICULTY_LEVELS.length - 1; i >= 0; i--) {
        const level = DIFFICULTY_LEVELS[i];
        if (avgWpm >= level.targetWpm && avgAccuracy >= level.targetAccuracy) {
            return level;
        }
    }
    return DIFFICULTY_LEVELS[0]; // Default to beginner
}

/**
 * Check if user should advance to next lesson/difficulty
 */
export function shouldAdvance(
    recentRecords: { wpm: number; accuracy: number }[],
    currentLevel: DifficultyLevel
): { shouldAdvance: boolean; reason: string } {
    if (recentRecords.length < 3) {
        return { shouldAdvance: false, reason: 'Complete more exercises first' };
    }

    const recentAvgWpm = recentRecords.reduce((sum, r) => sum + r.wpm, 0) / recentRecords.length;
    const recentAvgAcc = recentRecords.reduce((sum, r) => sum + r.accuracy, 0) / recentRecords.length;

    // Check if consistently exceeding targets
    const wpmMargin = recentAvgWpm - currentLevel.targetWpm;
    const accMargin = recentAvgAcc - currentLevel.targetAccuracy;

    if (wpmMargin >= 10 && accMargin >= 2) {
        return {
            shouldAdvance: true,
            reason: `You're exceeding targets by ${Math.round(wpmMargin)} WPM and ${accMargin.toFixed(1)}% accuracy!`
        };
    }

    if (wpmMargin >= 5 && accMargin >= 0) {
        return { shouldAdvance: false, reason: 'Close! A bit more practice at this level.' };
    }

    return { shouldAdvance: false, reason: 'Keep practicing to build consistency.' };
}

/**
 * Generate an adaptive exercise based on current weaknesses and performance
 */
export function generateAdaptiveExercise(
    weaknessReport: WeaknessReport,
    currentLevel: DifficultyLevel,
    masteredKeys: string[] = []
): AdaptiveExercise {
    const { weakKeys, weakBigrams, suggestedFocus } = weaknessReport;

    let text = '';
    let reason = '';
    let focusKeys = suggestedFocus;

    // Strategy: 80% weak keys, 20% mastered keys for reinforcement
    if (weakKeys.length > 0) {
        // Generate text focusing on weak keys
        text = generateWeaknessFocusedText(weakKeys, currentLevel.exerciseLength * 0.8);
        reason = `Targeting weak keys: ${weakKeys.slice(0, 3).join(', ')}`;

        // Add some mastered content for confidence/flow
        if (masteredKeys.length > 0) {
            const reinforcementText = generateWeaknessFocusedText(
                masteredKeys.slice(0, 3),
                currentLevel.exerciseLength * 0.2
            );
            text = text + ' ' + reinforcementText;
        }
        focusKeys = weakKeys;
    } else {
        // No specific weaknesses - generate general practice
        const pool = currentLevel.level <= 3 ? PRACTICE_POOLS.easy
            : currentLevel.level <= 6 ? PRACTICE_POOLS.medium
                : PRACTICE_POOLS.hard;

        const words: string[] = [];
        while (words.join(' ').length < currentLevel.exerciseLength) {
            words.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        text = words.join(' ');
        reason = 'General practice for skill maintenance';
        focusKeys = [];
    }

    return {
        text: text.trim(),
        focusKeys,
        difficulty: currentLevel,
        reason,
    };
}

/**
 * Generate a sequence of exercises for a practice session
 */
export function generatePracticeSession(
    perKeyErrors: Map<string, { attempts: number; errors: number }>,
    avgWpm: number,
    avgAccuracy: number,
    sessionLength: number = 5 // number of exercises
): AdaptiveExercise[] {
    const exercises: AdaptiveExercise[] = [];
    const level = calculateDifficultyLevel(avgWpm, avgAccuracy);
    const weaknessReport = analyzeWeaknesses(perKeyErrors);

    // Get mastered keys (low error rate)
    const masteredKeys: string[] = [];
    perKeyErrors.forEach((stats, key) => {
        if (stats.attempts >= 5 && (stats.errors / stats.attempts) < 0.05) {
            masteredKeys.push(key);
        }
    });

    for (let i = 0; i < sessionLength; i++) {
        // Vary the focus slightly for each exercise
        const shuffledWeak = [...weaknessReport.weakKeys].sort(() => Math.random() - 0.5);
        const variedReport = { ...weaknessReport, weakKeys: shuffledWeak };

        exercises.push(generateAdaptiveExercise(variedReport, level, masteredKeys));
    }

    return exercises;
}

/**
 * Get the current difficulty level info
 */
export function getDifficultyLevel(level: number): DifficultyLevel {
    return DIFFICULTY_LEVELS[Math.min(Math.max(level - 1, 0), DIFFICULTY_LEVELS.length - 1)];
}

/**
 * Get all difficulty levels
 */
export function getAllDifficultyLevels(): DifficultyLevel[] {
    return [...DIFFICULTY_LEVELS];
}
