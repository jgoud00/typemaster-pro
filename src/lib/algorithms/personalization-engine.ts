/**
 * Personalization Engine
 * 
 * Creates a unique learning experience for each user based on:
 * - Detected learning style
 * - Performance patterns
 * - Goals and preferences
 * - Available practice time
 */

import { adaptiveCurriculum, type AdaptiveLesson } from './adaptive-curriculum';
import { type Pattern } from './pattern-recognition';
import { type WeaknessResult } from './bayesian-weakness-detector';

export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type PracticePreference = 'short' | 'medium' | 'long';
export type MotivationType = 'achievement' | 'mastery' | 'social';

export interface UserProfile {
    learningStyle: LearningStyle;
    practicePreference: PracticePreference;
    motivationType: MotivationType;
    difficultyPreference: 'gradual' | 'challenging';
    goals: {
        targetWPM: number;
        targetAccuracy: number;
        dailyMinutes: number;
        weeklyDays: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface DailyPracticeSession {
    time: string;
    duration: number;
    lesson: AdaptiveLesson;
    focusArea: string;
}

export interface DailyPlan {
    sessions: DailyPracticeSession[];
    totalMinutes: number;
    expectedProgress: string;
    motivationalMessage: string;
    patterns: Pattern[];
}

const STORAGE_KEY = 'user-profile';

export class PersonalizationEngine {
    private profile: UserProfile;

    constructor() {
        this.profile = this.load() || this.createDefaultProfile();
    }

    /**
     * Create default profile for new users
     */
    private createDefaultProfile(): UserProfile {
        return {
            learningStyle: 'kinesthetic',
            practicePreference: 'short',
            motivationType: 'mastery',
            difficultyPreference: 'gradual',
            goals: {
                targetWPM: 60,
                targetAccuracy: 95,
                dailyMinutes: 15,
                weeklyDays: 5,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    /**
     * Detect learning style from user behavior
     */
    detectLearningStyle(settings: {
        showVirtualKeyboard: boolean;
        soundEnabled: boolean;
        showHints: boolean;
        practiceFrequency: number; // sessions per week
    }): LearningStyle {
        // Visual learners prefer visual feedback
        if (settings.showVirtualKeyboard && !settings.soundEnabled) {
            return 'visual';
        }

        // Auditory learners prefer sound feedback
        if (settings.soundEnabled && !settings.showVirtualKeyboard) {
            return 'auditory';
        }

        // Kinesthetic learners practice frequently
        if (settings.practiceFrequency > 5) {
            return 'kinesthetic';
        }

        // Reading learners prefer hints and instructions
        if (settings.showHints) {
            return 'reading';
        }

        return 'kinesthetic'; // Default
    }

    /**
     * Update profile with detected learning style
     */
    updateLearningStyle(style: LearningStyle): void {
        this.profile.learningStyle = style;
        this.profile.updatedAt = new Date();
        this.save();
    }

    /**
     * Update goals
     */
    updateGoals(goals: Partial<UserProfile['goals']>): void {
        this.profile.goals = { ...this.profile.goals, ...goals };
        this.profile.updatedAt = new Date();
        this.save();
    }

    /**
     * Get current profile
     */
    getProfile(): UserProfile {
        return { ...this.profile };
    }

    /**
     * Generate personalized daily practice plan
     */
    generateDailyPlan(
        weaknessAnalysis: WeaknessResult[],
        currentWPM: number,
        patterns: Pattern[]
    ): DailyPlan {
        const availableMinutes = this.profile.goals.dailyMinutes;
        const sessions: DailyPracticeSession[] = [];

        if (this.profile.practicePreference === 'short') {
            // 2-3 short sessions
            const sessionCount = availableMinutes > 20 ? 3 : 2;
            const sessionDuration = Math.floor(availableMinutes / sessionCount);

            const times = ['Morning', 'Afternoon', 'Evening'];
            for (let i = 0; i < sessionCount; i++) {
                const lesson = adaptiveCurriculum.generateNextLesson(weaknessAnalysis);
                const customized = this.customizeLesson(lesson);

                sessions.push({
                    time: times[i],
                    duration: sessionDuration,
                    lesson: customized,
                    focusArea: customized.focusKeys.join(', ') || 'General',
                });
            }
        } else if (this.profile.practicePreference === 'medium') {
            // 2 medium sessions
            const sessionDuration = Math.floor(availableMinutes / 2);

            for (let i = 0; i < 2; i++) {
                const lesson = adaptiveCurriculum.generateNextLesson(weaknessAnalysis);
                const customized = this.customizeLesson(lesson);

                sessions.push({
                    time: i === 0 ? 'First session' : 'Second session',
                    duration: sessionDuration,
                    lesson: customized,
                    focusArea: customized.focusKeys.join(', ') || 'General',
                });
            }
        } else {
            // 1 long session
            const lesson = adaptiveCurriculum.generateNextLesson(weaknessAnalysis);
            const customized = this.customizeLesson(lesson);

            sessions.push({
                time: 'Your best time',
                duration: availableMinutes,
                lesson: customized,
                focusArea: customized.focusKeys.join(', ') || 'Comprehensive',
            });
        }

        return {
            sessions,
            totalMinutes: availableMinutes,
            expectedProgress: this.calculateExpectedProgress(currentWPM),
            motivationalMessage: this.generateMotivation(currentWPM),
            patterns: patterns.slice(0, 2),
        };
    }

    /**
     * Customize lesson based on learning style
     */
    private customizeLesson(lesson: AdaptiveLesson): AdaptiveLesson {
        const customized = { ...lesson, exercises: [...lesson.exercises] };

        switch (this.profile.learningStyle) {
            case 'visual':
                customized.exercises.forEach(ex => {
                    ex.hints = [
                        'Watch the virtual keyboard',
                        'Visualize finger positions',
                        ...ex.hints,
                    ];
                });
                break;

            case 'auditory':
                customized.exercises.forEach(ex => {
                    ex.hints = [
                        'Listen to your typing rhythm',
                        'Use metronome mode for timing',
                        ...ex.hints,
                    ];
                });
                break;

            case 'kinesthetic':
                // Double exercises for more practice
                if (customized.exercises.length < 6) {
                    customized.exercises = [
                        ...customized.exercises,
                        ...customized.exercises.slice(0, 2),
                    ];
                }
                customized.exercises.forEach(ex => {
                    ex.hints = [
                        'Focus on muscle memory',
                        'Repeat until it feels natural',
                        ...ex.hints,
                    ];
                });
                break;

            case 'reading':
                customized.exercises.forEach(ex => {
                    ex.hints = [
                        'Read the text ahead before typing',
                        'Understand the pattern first',
                        ...ex.hints,
                    ];
                });
                break;
        }

        // Adjust difficulty based on preference
        if (this.profile.difficultyPreference === 'challenging') {
            customized.difficulty = Math.min(100, customized.difficulty + 10);
            customized.exercises.forEach(ex => {
                ex.targetWPM = Math.round(ex.targetWPM * 1.1);
            });
        }

        return customized;
    }

    /**
     * Calculate expected progress toward goal
     */
    private calculateExpectedProgress(currentWPM: number): string {
        const { targetWPM, dailyMinutes, weeklyDays } = this.profile.goals;

        if (currentWPM >= targetWPM) {
            return `🎉 You've reached your goal of ${targetWPM} WPM! Set a new target to keep improving.`;
        }

        const wpmGap = targetWPM - currentWPM;

        // Estimate 1 WPM per 2 hours of total practice
        const hoursPerWPM = 2;
        const weeklyMinutes = dailyMinutes * weeklyDays;
        const weeksNeeded = Math.ceil((wpmGap * hoursPerWPM * 60) / weeklyMinutes);

        if (weeksNeeded <= 4) {
            return `At your current pace, you'll reach ${targetWPM} WPM in about ${weeksNeeded} week${weeksNeeded > 1 ? 's' : ''}!`;
        } else {
            return `To reach ${targetWPM} WPM in 4 weeks, consider practicing ${Math.round(dailyMinutes * 1.5)} minutes daily.`;
        }
    }

    /**
     * Generate motivational message based on motivation type
     */
    private generateMotivation(currentWPM: number): string {
        const messages = {
            achievement: [
                `You're at ${currentWPM} WPM! Every session brings you closer to your goal! 🏆`,
                `Great progress! Keep pushing to unlock new achievements! 🌟`,
                `${currentWPM} WPM and climbing! You're on fire! 🔥`,
            ],
            mastery: [
                `Focus on the journey, not just the destination. Quality practice makes perfect! 🎯`,
                `Each keystroke builds mastery. Stay mindful and present! 🧘`,
                `Skill is built one practice at a time. You're becoming an expert! 📚`,
            ],
            social: [
                `Your friends would be impressed by ${currentWPM} WPM! Keep it up! 👏`,
                `Challenge a friend to beat your score! Competition makes us better! 🤝`,
                `You're in the top tier of typists! Share your progress! 📣`,
            ],
        };

        const options = messages[this.profile.motivationType];
        return options[Math.floor(Math.random() * options.length)];
    }

    /**
     * Get personalized recommendations
     */
    getRecommendations(patterns: Pattern[]): string[] {
        const recommendations: string[] = [];

        // Add pattern-based recommendations
        patterns.forEach(pattern => {
            recommendations.push(pattern.actionable);
        });

        // Add learning-style-specific tips
        switch (this.profile.learningStyle) {
            case 'visual':
                recommendations.push('Enable the virtual keyboard for visual finger position feedback');
                break;
            case 'auditory':
                recommendations.push('Try the metronome mode to build consistent rhythm');
                break;
            case 'kinesthetic':
                recommendations.push('Practice daily, even just 10 minutes, to build muscle memory');
                break;
            case 'reading':
                recommendations.push('Read lesson descriptions and hints carefully before starting');
                break;
        }

        return recommendations.slice(0, 5);
    }

    /**
     * Save profile to localStorage
     */
    save(): void {
        try {
            if (typeof window === 'undefined') return;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
        } catch (e) {
            console.warn('Failed to save user profile:', e);
        }
    }

    /**
     * Load profile from localStorage
     */
    private load(): UserProfile | null {
        try {
            if (typeof window === 'undefined') return null;
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const profile = JSON.parse(saved);
                profile.createdAt = new Date(profile.createdAt);
                profile.updatedAt = new Date(profile.updatedAt);
                return profile;
            }
        } catch (e) {
            console.warn('Failed to load user profile:', e);
        }
        return null;
    }

    /**
     * Reset profile to defaults
     */
    reset(): void {
        this.profile = this.createDefaultProfile();
        this.save();
    }
}

// Singleton export
export const personalizationEngine = new PersonalizationEngine();
