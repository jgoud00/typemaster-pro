import type { DiagnosticResult, Interpretation, Recommendation, UserLevel } from '@/stores/diagnostic-store';

export function classifyUserLevel(result: DiagnosticResult): UserLevel {
    const { wpm, accuracy } = result;

    if (wpm < 25 && accuracy < 85) return 'beginner';
    if (wpm > 45 && accuracy < 90) return 'fast-sloppy';
    if (wpm > 45 && accuracy >= 90) return 'advanced';
    return 'intermediate';
}

function getSpeedInterpretation(wpm: number): Interpretation {
    if (wpm < 25) {
        return {
            type: 'insight',
            title: 'Building Your Foundation',
            description: 'Your typing speed is developing. Focus on accuracy first — speed will follow naturally.',
        };
    } else if (wpm < 45) {
        return {
            type: 'strength',
            title: 'Solid Base Speed',
            description: `You're typing at ${wpm} WPM, which is a great foundation to build upon.`,
        };
    }
    return {
        type: 'strength',
        title: 'Fast Typist',
        description: `Impressive! You're already typing at ${wpm} WPM.`,
    };
}

function getAccuracyInterpretation(accuracy: number): Interpretation {
    if (accuracy < 85) {
        return {
            type: 'weakness',
            title: 'Accuracy Needs Work',
            description: 'You\'re making too many errors. Slow down and focus on hitting the right keys.',
            severity: 'high',
        };
    } else if (accuracy < 92) {
        return {
            type: 'insight',
            title: 'Room for Improvement',
            description: `Your ${accuracy.toFixed(1)}% accuracy is decent, but aiming for 95%+ will significantly improve your flow.`,
        };
    }
    return {
        type: 'strength',
        title: 'Accurate Typing',
        description: `Excellent accuracy at ${accuracy.toFixed(1)}%! You rarely need to correct mistakes.`,
    };
}

function getHandBalanceInterpretation(leftErrors: number, rightErrors: number): Interpretation | null {
    const handDiff = Math.abs(leftErrors - rightErrors);
    const totalHandErrors = leftErrors + rightErrors;
    if (totalHandErrors > 0 && handDiff / totalHandErrors > 0.3) {
        const weakerHand = leftErrors > rightErrors ? 'left' : 'right';
        return {
            type: 'weakness',
            title: `${weakerHand === 'left' ? 'Left' : 'Right'} Hand Weakness`,
            description: `Your ${weakerHand} hand is significantly weaker. It's responsible for ${Math.round((weakerHand === 'left' ? leftErrors : rightErrors) / totalHandErrors * 100)}% of your errors.`,
            severity: 'medium',
        };
    }
    return null;
}

function getRhythmInterpretation(burstiness: number): Interpretation | null {
    if (burstiness > 0.6) {
        return {
            type: 'weakness',
            title: 'Inconsistent Rhythm',
            description: 'You type in bursts rather than maintaining a steady pace. This leads to more errors during fast bursts.',
            severity: 'medium',
        };
    } else if (burstiness < 0.3) {
        return {
            type: 'strength',
            title: 'Steady Rhythm',
            description: 'You maintain a consistent typing pace, which helps reduce errors.',
        };
    }
    return null;
}

export function generateInterpretations(result: DiagnosticResult): Interpretation[] {
    const interpretations: Interpretation[] = [];

    interpretations.push(getSpeedInterpretation(result.wpm));
    interpretations.push(getAccuracyInterpretation(result.accuracy));

    const handBal = getHandBalanceInterpretation(result.weakHandErrors.left, result.weakHandErrors.right);
    if (handBal) interpretations.push(handBal);

    const rhythm = getRhythmInterpretation(result.burstiness);
    if (rhythm) interpretations.push(rhythm);

    if (result.backspaceDependence > 0.15) {
        interpretations.push({
            type: 'weakness',
            title: 'High Correction Rate',
            description: `You used backspace for ${Math.round(result.backspaceDependence * 100)}% of keystrokes. This significantly slows down your effective speed.`,
            severity: 'high',
        });
    }

    if (result.weakKeys.length > 0) {
        interpretations.push({
            type: 'insight',
            title: 'Specific Key Struggles',
            description: `You have trouble with these keys: ${result.weakKeys.slice(0, 5).join(', ').toUpperCase()}. Targeted practice will help.`,
        });
    }

    return interpretations;
}

export function generateRecommendations(result: DiagnosticResult, level: UserLevel): Recommendation[] {
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
