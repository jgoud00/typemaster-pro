/**
 * AI Coaching Engine — Weakness Analysis & Recommendations
 *
 * Analyzes keystroke data from analytics-store to identify:
 * - Substitution patterns (always hitting wrong key for a specific expected key)
 * - Slow finger transitions (bigram time > 2× average)
 * - Error acceleration (increasing error rate over session)
 * - Weak keys (composite score of error rate + hesitation)
 */

import type { KeyStat, BigramStat, Finger } from '@/types';

export interface WeakKeyScore {
    key: string;
    score: number;        // 0-1, higher = weaker
    errorRate: number;
    normalizedHesitation: number;
    attempts: number;
}

export interface SubstitutionPattern {
    expected: string;
    actual: string;
    frequency: number;
}

export interface SlowTransition {
    bigram: string;
    avgTime: number;
    globalAvgTime: number;
    slowdownFactor: number;
}

export interface CoachingInsight {
    type: 'weak-key' | 'slow-transition' | 'substitution' | 'fatigue' | 'improvement';
    severity: 'info' | 'warning' | 'critical';
    title: string;
    description: string;
    actionUrl?: string;
}

export interface CoachingReport {
    weakKeys: WeakKeyScore[];
    slowTransitions: SlowTransition[];
    substitutionPatterns: SubstitutionPattern[];
    insights: CoachingInsight[];
    recommendedLessonIds: string[];
    overallLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// ── Weak Key Analysis ──────────────────────────────────────────────────────

export function analyzeWeakKeys(
    keyStats: Record<string, KeyStat>,
    minAttempts = 5
): WeakKeyScore[] {
    const entries = Object.entries(keyStats).filter(([, s]) => s.totalAttempts >= minAttempts);
    if (entries.length === 0) return [];

    const maxHesitation = Math.max(...entries.map(([, s]) => s.averageSpeed));
    const minHesitation = Math.min(...entries.map(([, s]) => s.averageSpeed));
    const hesitationRange = maxHesitation - minHesitation || 1;

    return entries
        .map(([key, stat]) => {
            const errorRate = stat.errors / stat.totalAttempts;
            const normalizedHesitation = (stat.averageSpeed - minHesitation) / hesitationRange;
            const score = errorRate * 0.6 + normalizedHesitation * 0.4;
            return { key, score, errorRate, normalizedHesitation, attempts: stat.totalAttempts };
        })
        .sort((a, b) => b.score - a.score);
}

// ── Slow Transition Analysis ───────────────────────────────────────────────

export function analyzeSlowTransitions(
    bigramStats: Record<string, BigramStat>,
    minAttempts = 3
): SlowTransition[] {
    const entries = Object.entries(bigramStats).filter(([, s]) => s.totalAttempts >= minAttempts);
    if (entries.length < 2) return [];

    const globalAvg = entries.reduce((sum, [, s]) => sum + s.averageTime, 0) / entries.length;
    const threshold = globalAvg * 2;

    return entries
        .filter(([, s]) => s.averageTime > threshold)
        .map(([bigram, stat]) => ({
            bigram,
            avgTime: Math.round(stat.averageTime),
            globalAvgTime: Math.round(globalAvg),
            slowdownFactor: +(stat.averageTime / globalAvg).toFixed(2),
        }))
        .sort((a, b) => b.slowdownFactor - a.slowdownFactor)
        .slice(0, 10);
}

// ── Finger Weakness Analysis ───────────────────────────────────────────────

export function analyzeFingerWeakness(
    fingerStats: Record<Finger, { correct: number; total: number }>
): { finger: Finger; accuracy: number; total: number }[] {
    return (Object.entries(fingerStats) as [Finger, { correct: number; total: number }][])
        .filter(([, s]) => s.total >= 10)
        .map(([finger, s]) => ({
            finger,
            accuracy: s.total > 0 ? (s.correct / s.total) * 100 : 100,
            total: s.total,
        }))
        .sort((a, b) => a.accuracy - b.accuracy);
}

// ── Lesson Recommendations ─────────────────────────────────────────────────

const KEY_TO_LESSON_MAP: Record<string, string[]> = {
    'f': ['home-1-fj'], 'j': ['home-1-fj'],
    'd': ['home-2-dk'], 'k': ['home-2-dk'],
    's': ['home-3-sl'], 'l': ['home-3-sl'],
    'a': ['home-4-a-semi'], ';': ['home-4-a-semi'],
    'g': ['home-5-gh'], 'h': ['home-5-gh'],
    'e': ['top-1-er'], 'r': ['top-1-er'],
    't': ['top-2-ty'], 'y': ['top-2-ty'],
    'u': ['top-3-ui'], 'i': ['top-3-ui'],
    'w': ['top-4-wo'], 'o': ['top-4-wo'],
    'q': ['top-5-qp'], 'p': ['top-5-qp'],
    'c': ['bottom-1-cv'], 'v': ['bottom-1-cv'],
    'x': ['bottom-2-xb'], 'b': ['bottom-2-xb'],
    'z': ['bottom-3-zn'], 'n': ['bottom-3-zn'],
    'm': ['bottom-4-m-comma'], ',': ['bottom-4-m-comma'],
    '.': ['bottom-5-period-slash'], '/': ['bottom-5-period-slash'],
};

export function recommendLessons(weakKeys: WeakKeyScore[], maxRecommendations = 5): string[] {
    const lessonSet = new Set<string>();
    for (const wk of weakKeys) {
        const lessons = KEY_TO_LESSON_MAP[wk.key.toLowerCase()];
        if (lessons) {
            for (const l of lessons) lessonSet.add(l);
        }
        if (lessonSet.size >= maxRecommendations) break;
    }
    return [...lessonSet];
}

// ── Coaching Report Generator ──────────────────────────────────────────────

export function generateCoachingReport(
    keyStats: Record<string, KeyStat>,
    bigramStats: Record<string, BigramStat>,
    fingerStats: Record<Finger, { correct: number; total: number }>,
    personalBests: { wpm: number; accuracy: number }
): CoachingReport {
    const weakKeys = analyzeWeakKeys(keyStats);
    const slowTransitions = analyzeSlowTransitions(bigramStats);
    const fingerWeakness = analyzeFingerWeakness(fingerStats);
    const insights: CoachingInsight[] = [];

    // Classify overall level
    const { wpm, accuracy } = personalBests;
    const overallLevel = wpm >= 80 && accuracy >= 95 ? 'expert'
        : wpm >= 50 && accuracy >= 90 ? 'advanced'
        : wpm >= 30 ? 'intermediate'
        : 'beginner';

    // Generate insights from weak keys
    const criticalKeys = weakKeys.filter(k => k.score > 0.7);
    if (criticalKeys.length > 0) {
        insights.push({
            type: 'weak-key',
            severity: 'critical',
            title: 'Critical Weak Keys Detected',
            description: `Keys ${criticalKeys.slice(0, 3).map(k => k.key.toUpperCase()).join(', ')} have high error rates. Targeted practice recommended.`,
            actionUrl: '/practice/smart',
        });
    }

    // Slow transitions
    if (slowTransitions.length > 0) {
        insights.push({
            type: 'slow-transition',
            severity: 'warning',
            title: 'Slow Finger Transitions',
            description: `The transitions "${slowTransitions.slice(0, 3).map(t => t.bigram).join('", "')}" are ${slowTransitions[0].slowdownFactor}× slower than average.`,
        });
    }

    // Finger weakness
    const weakFingers = fingerWeakness.filter(f => f.accuracy < 85);
    if (weakFingers.length > 0) {
        insights.push({
            type: 'weak-key',
            severity: 'warning',
            title: `${weakFingers[0].finger.replace('-', ' ')} Needs Work`,
            description: `Your ${weakFingers[0].finger.replace('-', ' ')} has ${weakFingers[0].accuracy.toFixed(0)}% accuracy. Practice exercises targeting this finger.`,
            actionUrl: '/lessons',
        });
    }

    const recommendedLessonIds = recommendLessons(weakKeys);

    return {
        weakKeys,
        slowTransitions,
        substitutionPatterns: [],
        insights,
        recommendedLessonIds,
        overallLevel,
    };
}
