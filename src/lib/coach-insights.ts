'use client';

/**
 * AI Coach Insights
 * 
 * Generates personalized tips and insights based on typing analysis.
 * Uses rule-based logic to provide actionable feedback.
 */

import { WeaknessReport } from './weakness-predictor';
import { NgramReport } from './ngram-analyzer';

export interface Insight {
    id: string;
    type: 'tip' | 'encouragement' | 'warning' | 'milestone';
    title: string;
    message: string;
    icon: string;
    priority: number; // 1-10, higher = more important
}

export interface CoachBriefing {
    greeting: string;
    todaysFocus: string[];
    insights: Insight[];
    motivationalQuote: string;
}

// Time-based greeting
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 6) return "🌙 Burning the midnight oil?";
    if (hour < 12) return "☀️ Good morning!";
    if (hour < 17) return "🌤️ Good afternoon!";
    if (hour < 21) return "🌆 Good evening!";
    return "🌙 Late night practice session?";
}

// Motivational quotes for typists
const QUOTES = [
    "Speed is nothing without accuracy. – Unknown",
    "Practice doesn't make perfect. Perfect practice makes perfect. – Vince Lombardi",
    "The key to success is consistency. Keep typing!",
    "Small improvements every day lead to stunning results.",
    "Your fingers are getting faster with every keystroke!",
    "Muscle memory is built one character at a time.",
    "The best typists aren't born, they're made through practice.",
    "Focus on progress, not perfection.",
];

/**
 * Generate insights based on current performance and weaknesses
 */
export function generateInsights(
    weaknessReport: WeaknessReport,
    ngramReport: NgramReport,
    stats: {
        recentWpm: number;
        recentAccuracy: number;
        totalPracticeTime: number; // in minutes
        streakDays: number;
        improvementTrend: 'improving' | 'stable' | 'declining';
    }
): Insight[] {
    const insights: Insight[] = [];

    // Speed vs Accuracy balance
    if (stats.recentWpm > 50 && stats.recentAccuracy < 92) {
        insights.push({
            id: 'slow-down',
            type: 'tip',
            title: 'Slow Down to Speed Up',
            message: `Your speed (${stats.recentWpm} WPM) is great, but accuracy (${stats.recentAccuracy}%) could improve. Try reducing speed by 10% to build better muscle memory.`,
            icon: '🎯',
            priority: 8,
        });
    }

    if (stats.recentAccuracy > 98 && stats.recentWpm < 40) {
        insights.push({
            id: 'speed-up',
            type: 'tip',
            title: 'Push Your Speed',
            message: `Amazing accuracy! You're ready to type faster. Try pushing beyond your comfort zone.`,
            icon: '🚀',
            priority: 6,
        });
    }

    // Same-finger bigrams
    if (weaknessReport.patterns.sameFingerBigrams.length >= 3) {
        const examples = weaknessReport.patterns.sameFingerBigrams.slice(0, 3).join(', ');
        insights.push({
            id: 'same-finger',
            type: 'tip',
            title: 'Same-Finger Transitions',
            message: `Combinations like "${examples}" use the same finger consecutively. Practice these transitions slowly to build fluency.`,
            icon: '👆',
            priority: 7,
        });
    }

    // Row jump issues
    if (weaknessReport.patterns.rowJumpBigrams.length >= 2) {
        const examples = weaknessReport.patterns.rowJumpBigrams.slice(0, 3).join(', ');
        insights.push({
            id: 'row-jumps',
            type: 'tip',
            title: 'Row Jump Practice',
            message: `You're hesitating on row jumps like "${examples}". Focus on keeping your wrists steady while your fingers reach.`,
            icon: '⬆️',
            priority: 6,
        });
    }

    // Weak keys
    if (weaknessReport.weakKeys.length > 0) {
        const keys = weaknessReport.weakKeys.slice(0, 4).join(', ');
        insights.push({
            id: 'weak-keys',
            type: 'warning',
            title: 'Keys Needing Attention',
            message: `Focus on these keys today: ${keys}. They have higher error rates than your average.`,
            icon: '🎹',
            priority: 9,
        });
    }

    // Streak encouragement
    if (stats.streakDays >= 3 && stats.streakDays < 7) {
        insights.push({
            id: 'streak-building',
            type: 'encouragement',
            title: 'Streak Building!',
            message: `${stats.streakDays} days in a row! Keep it up to reach a week-long streak.`,
            icon: '🔥',
            priority: 5,
        });
    } else if (stats.streakDays >= 7) {
        insights.push({
            id: 'streak-strong',
            type: 'milestone',
            title: 'Incredible Consistency!',
            message: `${stats.streakDays} day streak! Your dedication is paying off.`,
            icon: '⭐',
            priority: 4,
        });
    }

    // Practice time
    if (stats.totalPracticeTime > 60) {
        insights.push({
            id: 'practice-time',
            type: 'milestone',
            title: 'Hour Milestone',
            message: `You've practiced for over ${Math.floor(stats.totalPracticeTime / 60)} hours total. That's serious dedication!`,
            icon: '⏱️',
            priority: 3,
        });
    }

    // Improvement trend
    if (stats.improvementTrend === 'improving') {
        insights.push({
            id: 'improving',
            type: 'encouragement',
            title: 'You\'re Improving!',
            message: 'Your recent sessions show measurable improvement. Keep up the great work!',
            icon: '📈',
            priority: 5,
        });
    } else if (stats.improvementTrend === 'declining') {
        insights.push({
            id: 'fatigue-warning',
            type: 'warning',
            title: 'Consider a Break',
            message: 'Your recent performance has dipped. Sometimes a short break helps reset your focus.',
            icon: '☕',
            priority: 7,
        });
    }

    // Slow bigrams
    if (ngramReport.slowestBigrams.length > 0) {
        const avgTime = ngramReport.averageBigramTime;
        const slowest = ngramReport.slowestBigrams[0];
        if (slowest.avgTime > avgTime * 2) {
            insights.push({
                id: 'slow-bigram',
                type: 'tip',
                title: 'Transition to Practice',
                message: `The transition "${slowest.ngram}" takes you ${Math.round(slowest.avgTime)}ms - twice your average. Try drilling this combination.`,
                icon: '🐢',
                priority: 6,
            });
        }
    }

    // Sort by priority
    insights.sort((a, b) => b.priority - a.priority);

    return insights.slice(0, 5); // Return top 5
}

/**
 * Get today's focus areas
 */
export function getTodaysFocus(weaknessReport: WeaknessReport): string[] {
    const focus: string[] = [];

    if (weaknessReport.weakKeys.length > 0) {
        focus.push(`Practice keys: ${weaknessReport.weakKeys.slice(0, 3).join(', ')}`);
    }

    if (weaknessReport.weakBigrams.length > 0) {
        focus.push(`Work on transitions: ${weaknessReport.weakBigrams.slice(0, 3).join(', ')}`);
    }

    if (weaknessReport.patterns.sameFingerBigrams.length > 0) {
        focus.push('Same-finger combinations need attention');
    }

    if (focus.length === 0) {
        focus.push('Keep practicing to maintain your skills!');
    }

    return focus;
}

/**
 * Generate a complete daily briefing
 */
export function generateDailyBriefing(
    weaknessReport: WeaknessReport,
    ngramReport: NgramReport,
    stats: {
        recentWpm: number;
        recentAccuracy: number;
        totalPracticeTime: number;
        streakDays: number;
        improvementTrend: 'improving' | 'stable' | 'declining';
    }
): CoachBriefing {
    return {
        greeting: getGreeting(),
        todaysFocus: getTodaysFocus(weaknessReport),
        insights: generateInsights(weaknessReport, ngramReport, stats),
        motivationalQuote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
    };
}

/**
 * Get a single top tip for quick display
 */
export function getQuickTip(weaknessReport: WeaknessReport): string {
    if (weaknessReport.weakKeys.length > 0) {
        return `Focus on the "${weaknessReport.weakKeys[0]}" key - it needs practice.`;
    }
    if (weaknessReport.weakBigrams.length > 0) {
        return `Practice the "${weaknessReport.weakBigrams[0]}" transition.`;
    }
    if (weaknessReport.patterns.sameFingerBigrams.length > 0) {
        return `Work on same-finger transitions like "${weaknessReport.patterns.sameFingerBigrams[0]}".`;
    }
    return 'Keep practicing to build speed and accuracy!';
}
