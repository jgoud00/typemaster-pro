import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DiagnosticResult {
    // Core metrics
    wpm: number;
    accuracy: number;
    totalKeystrokes: number;
    correctKeystrokes: number;
    errors: number;

    // Error analysis
    adjacentKeyErrors: number;      // e.g., hitting 'r' instead of 't'
    sameFingerErrors: number;       // consecutive keys with same finger
    weakHandErrors: { left: number; right: number };

    // Rhythm analysis
    averageLatency: number;         // ms between keystrokes
    latencyVariance: number;        // consistency (lower = steadier)
    burstiness: number;             // 0-1 (0 = steady, 1 = very bursty)

    // Backspace analysis
    backspaceCount: number;
    backspaceDependence: number;    // ratio of backspaces to keystrokes

    // Per-key performance
    keyPerformance: Map<string, { correct: number; errors: number; avgLatency: number }>;

    // Weak areas identified
    weakKeys: string[];
    weakFingers: string[];

    // Timestamp
    completedAt: number;
}

export interface Interpretation {
    type: 'strength' | 'weakness' | 'insight';
    title: string;
    description: string;
    severity?: 'low' | 'medium' | 'high';
}

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    path: string;           // URL to recommended practice
    priority: number;       // 1 = highest
    category: 'lesson' | 'practice' | 'mode';
}

export type UserLevel = 'beginner' | 'intermediate' | 'fast-sloppy' | 'advanced';

interface DiagnosticState {
    hasTakenDiagnostic: boolean;
    diagnosticResult: DiagnosticResult | null;
    userLevel: UserLevel | null;
    interpretations: Interpretation[];
    recommendations: Recommendation[];

    // Actions
    setDiagnosticResult: (result: DiagnosticResult) => void;
    resetDiagnostic: () => void;
}

const defaultState = {
    hasTakenDiagnostic: false,
    diagnosticResult: null,
    userLevel: null,
    interpretations: [],
    recommendations: [],
};

export const useDiagnosticStore = create<DiagnosticState>()(
    persist(
        (set) => ({
            ...defaultState,

            setDiagnosticResult: (result: DiagnosticResult) => {
                const userLevel = classifyUserLevel(result);
                const interpretations = generateInterpretations(result);
                const recommendations = generateRecommendations(result, userLevel);

                set({
                    hasTakenDiagnostic: true,
                    diagnosticResult: result,
                    userLevel,
                    interpretations,
                    recommendations,
                });
            },

            resetDiagnostic: () => set(defaultState),
        }),
        {
            name: 'typemaster-diagnostic',
            partialize: (state) => ({
                hasTakenDiagnostic: state.hasTakenDiagnostic,
                diagnosticResult: state.diagnosticResult,
                userLevel: state.userLevel,
                interpretations: state.interpretations,
                recommendations: state.recommendations,
            }),
        }
    )
);

// Classification logic
function classifyUserLevel(result: DiagnosticResult): UserLevel {
    const { wpm, accuracy } = result;

    if (wpm < 25 && accuracy < 85) {
        return 'beginner';
    }

    if (wpm > 45 && accuracy < 90) {
        return 'fast-sloppy';
    }

    if (wpm > 45 && accuracy >= 90) {
        return 'advanced';
    }

    return 'intermediate';
}

// Generate human-readable interpretations
function generateInterpretations(result: DiagnosticResult): Interpretation[] {
    const interpretations: Interpretation[] = [];

    // Speed interpretation
    if (result.wpm < 25) {
        interpretations.push({
            type: 'insight',
            title: 'Building Your Foundation',
            description: 'Your typing speed is developing. Focus on accuracy first — speed will follow naturally.',
        });
    } else if (result.wpm >= 25 && result.wpm < 45) {
        interpretations.push({
            type: 'strength',
            title: 'Solid Base Speed',
            description: `You're typing at ${result.wpm} WPM, which is a great foundation to build upon.`,
        });
    } else {
        interpretations.push({
            type: 'strength',
            title: 'Fast Typist',
            description: `Impressive! You're already typing at ${result.wpm} WPM.`,
        });
    }

    // Accuracy interpretation
    if (result.accuracy < 85) {
        interpretations.push({
            type: 'weakness',
            title: 'Accuracy Needs Work',
            description: 'You\'re making too many errors. Slow down and focus on hitting the right keys.',
            severity: 'high',
        });
    } else if (result.accuracy < 92) {
        interpretations.push({
            type: 'insight',
            title: 'Room for Improvement',
            description: `Your ${result.accuracy.toFixed(1)}% accuracy is decent, but aiming for 95%+ will significantly improve your flow.`,
        });
    } else {
        interpretations.push({
            type: 'strength',
            title: 'Accurate Typing',
            description: `Excellent accuracy at ${result.accuracy.toFixed(1)}%! You rarely need to correct mistakes.`,
        });
    }

    // Hand balance
    const leftErrors = result.weakHandErrors.left;
    const rightErrors = result.weakHandErrors.right;
    const handDiff = Math.abs(leftErrors - rightErrors);
    const totalHandErrors = leftErrors + rightErrors;

    if (totalHandErrors > 0 && handDiff / totalHandErrors > 0.3) {
        const weakerHand = leftErrors > rightErrors ? 'left' : 'right';
        interpretations.push({
            type: 'weakness',
            title: `${weakerHand === 'left' ? 'Left' : 'Right'} Hand Weakness`,
            description: `Your ${weakerHand} hand is significantly weaker. It's responsible for ${Math.round((weakerHand === 'left' ? leftErrors : rightErrors) / totalHandErrors * 100)}% of your errors.`,
            severity: 'medium',
        });
    }

    // Rhythm analysis
    if (result.burstiness > 0.6) {
        interpretations.push({
            type: 'weakness',
            title: 'Inconsistent Rhythm',
            description: 'You type in bursts rather than maintaining a steady pace. This leads to more errors during fast bursts.',
            severity: 'medium',
        });
    } else if (result.burstiness < 0.3) {
        interpretations.push({
            type: 'strength',
            title: 'Steady Rhythm',
            description: 'You maintain a consistent typing pace, which helps reduce errors.',
        });
    }

    // Backspace dependence
    if (result.backspaceDependence > 0.15) {
        interpretations.push({
            type: 'weakness',
            title: 'High Correction Rate',
            description: `You used backspace for ${Math.round(result.backspaceDependence * 100)}% of keystrokes. This significantly slows down your effective speed.`,
            severity: 'high',
        });
    }

    // Weak keys
    if (result.weakKeys.length > 0) {
        interpretations.push({
            type: 'insight',
            title: 'Specific Key Struggles',
            description: `You have trouble with these keys: ${result.weakKeys.slice(0, 5).join(', ').toUpperCase()}. Targeted practice will help.`,
        });
    }

    return interpretations;
}

// Generate personalized recommendations
function generateRecommendations(result: DiagnosticResult, level: UserLevel): Recommendation[] {
    const recommendations: Recommendation[] = [];

    switch (level) {
        case 'beginner':
            recommendations.push({
                id: 'finger-placement',
                title: 'Master Finger Placement',
                description: 'Start with home row basics to build proper muscle memory.',
                path: '/lessons/home-1-fj',
                priority: 1,
                category: 'lesson',
            });
            recommendations.push({
                id: 'slow-accuracy',
                title: 'Accuracy Drills',
                description: 'Practice typing slowly and accurately before building speed.',
                path: '/practice?mode=free',
                priority: 2,
                category: 'practice',
            });
            break;

        case 'intermediate':
            if (result.weakKeys.length > 0) {
                recommendations.push({
                    id: 'weak-keys',
                    title: 'Target Your Weak Keys',
                    description: `Focus on improving ${result.weakKeys.slice(0, 3).join(', ').toUpperCase()} keys.`,
                    path: '/practice/smart',
                    priority: 1,
                    category: 'practice',
                });
            }
            recommendations.push({
                id: 'common-words',
                title: 'Common Word Patterns',
                description: 'Practice frequently used letter combinations to build speed.',
                path: '/lessons',
                priority: 2,
                category: 'lesson',
            });
            break;

        case 'fast-sloppy':
            recommendations.push({
                id: 'rhythm-control',
                title: 'Rhythm & Precision Mode',
                description: 'Use metronome mode to build consistent, accurate typing.',
                path: '/practice/speed-training',
                priority: 1,
                category: 'mode',
            });
            if (result.backspaceDependence > 0.1) {
                recommendations.push({
                    id: 'no-backspace',
                    title: 'No-Backspace Challenge',
                    description: 'Train to type right the first time by disabling corrections.',
                    path: '/practice?mode=speed-test',
                    priority: 2,
                    category: 'practice',
                });
            }
            break;

        case 'advanced':
            recommendations.push({
                id: 'endurance',
                title: 'Endurance Training',
                description: 'Maintain your speed over long-form real text.',
                path: '/practice?mode=free',
                priority: 1,
                category: 'practice',
            });
            recommendations.push({
                id: 'challenges',
                title: 'Daily Challenges',
                description: 'Push your limits with timed challenges.',
                path: '/challenges',
                priority: 2,
                category: 'mode',
            });
            break;
    }

    // Add warmup for everyone except beginners
    if (level !== 'beginner') {
        recommendations.push({
            id: 'warmup',
            title: 'Daily Warmup',
            description: 'Start each session with a quick warmup routine.',
            path: '/practice/warmup',
            priority: 3,
            category: 'practice',
        });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
}
