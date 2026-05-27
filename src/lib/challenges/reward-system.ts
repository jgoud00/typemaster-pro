/**
 * Reward System — XP, levels, and streak multipliers
 *
 * Balanced progression with anti-exploit protections:
 * - Streak multiplier: 1 + (dailyStreak × 0.1), capped at 2.5×
 * - Diminishing returns after 5th session/day
 * - Anti-exploit: cap max XP per hour, minimum session length
 */

export interface XPResult {
    baseXP: number;
    streakMultiplier: number;
    difficultyMultiplier: number;
    accuracyPenalty: number;
    diminishingFactor: number;
    totalXP: number;
    breakdown: string[];
}

export interface LevelInfo {
    level: number;
    currentXP: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    progressPercent: number;
    title: string;
}

// ── XP Calculation ────────────────────────────────────────────────────────

const BASE_XP_PER_SESSION = 25;
const BASE_XP_PER_CORRECT_CHAR = 0.5;
const MAX_XP_PER_HOUR = 500;
const MIN_SESSION_SECONDS = 10;
const MAX_STREAK_MULTIPLIER = 2.5;
const DIMINISHING_THRESHOLD = 5;     // sessions per day

export function calculateSessionXP(
    params: {
        correctChars: number;
        accuracy: number;
        wpm: number;
        durationSeconds: number;
        difficulty: 'easy' | 'medium' | 'hard';
        dailyStreak: number;
        sessionsToday: number;
    }
): XPResult {
    const breakdown: string[] = [];

    // Anti-exploit: minimum session length
    if (params.durationSeconds < MIN_SESSION_SECONDS) {
        return {
            baseXP: 0, streakMultiplier: 1, difficultyMultiplier: 1,
            accuracyPenalty: 1, diminishingFactor: 1, totalXP: 0,
            breakdown: ['Session too short (minimum 10s)'],
        };
    }

    // Base XP
    const charXP = Math.floor(params.correctChars * BASE_XP_PER_CORRECT_CHAR);
    const baseXP = BASE_XP_PER_SESSION + charXP;
    breakdown.push(`Base: ${BASE_XP_PER_SESSION} + ${charXP} (chars)`);

    // Streak multiplier: 1 + (streak × 0.1), capped at 2.5×
    const streakMultiplier = Math.min(MAX_STREAK_MULTIPLIER, 1 + params.dailyStreak * 0.1);
    breakdown.push(`Streak: ×${streakMultiplier.toFixed(1)} (${params.dailyStreak}-day streak)`);

    // Difficulty multiplier
    const difficultyMultiplier =
        params.difficulty === 'hard' ? 1.5 :
        params.difficulty === 'medium' ? 1.0 : 0.8;
    breakdown.push(`Difficulty: ×${difficultyMultiplier}`);

    // Accuracy penalty: below 80% accuracy = XP reduction
    const accuracyPenalty = params.accuracy >= 80
        ? 1.0
        : Math.max(0.3, params.accuracy / 100);
    if (accuracyPenalty < 1) {
        breakdown.push(`Accuracy penalty: ×${accuracyPenalty.toFixed(2)}`);
    }

    // Diminishing returns after 5th session/day
    const diminishingFactor = params.sessionsToday >= DIMINISHING_THRESHOLD
        ? Math.max(0.2, 1 - (params.sessionsToday - DIMINISHING_THRESHOLD) * 0.15)
        : 1.0;
    if (diminishingFactor < 1) {
        breakdown.push(`Diminishing: ×${diminishingFactor.toFixed(2)} (session #${params.sessionsToday + 1} today)`);
    }

    let totalXP = Math.round(
        baseXP * streakMultiplier * difficultyMultiplier * accuracyPenalty * diminishingFactor
    );

    // Anti-exploit: cap XP per hour
    totalXP = Math.min(MAX_XP_PER_HOUR, totalXP);

    return {
        baseXP,
        streakMultiplier,
        difficultyMultiplier,
        accuracyPenalty,
        diminishingFactor,
        totalXP,
        breakdown,
    };
}

// ── Level System ──────────────────────────────────────────────────────────

// XP required for level N: 100 × N²
function xpForLevel(level: number): number {
    return 100 * level * level;
}

function totalXpForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i <= level; i++) {
        total += xpForLevel(i);
    }
    return total;
}

const LEVEL_TITLES: Record<number, string> = {
    1: 'Novice',
    5: 'Apprentice',
    10: 'Journeyman',
    15: 'Skilled',
    20: 'Expert',
    25: 'Master',
    30: 'Grandmaster',
    40: 'Legend',
    50: 'Transcendent',
};

function getLevelTitle(level: number): string {
    const thresholds = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
    for (const t of thresholds) {
        if (level >= t) return LEVEL_TITLES[t];
    }
    return 'Novice';
}

export function getLevelInfo(totalXP: number): LevelInfo {
    let level = 1;
    let accumulated = 0;

    while (accumulated + xpForLevel(level) <= totalXP) {
        accumulated += xpForLevel(level);
        level++;
    }

    const xpInCurrentLevel = totalXP - accumulated;
    const xpNeeded = xpForLevel(level);

    return {
        level,
        currentXP: totalXP,
        xpForCurrentLevel: xpInCurrentLevel,
        xpForNextLevel: xpNeeded,
        progressPercent: Math.round((xpInCurrentLevel / xpNeeded) * 100),
        title: getLevelTitle(level),
    };
}
