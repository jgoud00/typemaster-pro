import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChallengeType = 'speed' | 'accuracy' | 'endurance' | 'streak';

export interface Challenge {
    id: string;
    title: string;
    description: string;
    type: ChallengeType;
    target: number;
    current: number;
    reward: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isCompleted: boolean;
}

interface ChallengeStore {
    challenges: Challenge[];
    lastResetDate: string;

    // Actions
    updateProgress: (type: ChallengeType, value: number) => void;
    checkWeeklyReset: () => void;
    generateWeeklyChallenges: () => void;
}

const DEFAULT_CHALLENGES: Challenge[] = [
    {
        id: 'speed-demon',
        title: '⚡ Speed Demon',
        description: 'Achieve 60 WPM or higher in any test',
        type: 'speed',
        target: 60,
        current: 0,
        reward: '200 XP + Speed Badge',
        difficulty: 'medium',
        isCompleted: false,
    },
    {
        id: 'perfect-streak',
        title: '🎯 Sensitivity Training',
        description: 'Complete 5 lessons with 98%+ accuracy',
        type: 'accuracy',
        target: 5,
        current: 0,
        reward: '300 XP + Precision Badge',
        difficulty: 'hard',
        isCompleted: false,
    },
    {
        id: 'endurance-master',
        title: '🏃 Marathon Typer',
        description: 'Type for 30 minutes total this week',
        type: 'endurance',
        target: 30, // minutes
        current: 0,
        reward: '150 XP + Endurance Badge',
        difficulty: 'easy',
        isCompleted: false,
    }
];

export const useChallengeStore = create<ChallengeStore>()(
    persist(
        (set, get) => ({
            challenges: DEFAULT_CHALLENGES,
            lastResetDate: new Date().toISOString(),

            updateProgress: (type, value) => {
                set(state => {
                    const newChallenges = state.challenges.map(challenge => {
                        if (challenge.isCompleted) return challenge;
                        if (challenge.type !== type) return challenge;

                        let newCurrent = challenge.current;

                        // Logic varies by type
                        if (type === 'speed') {
                            // For speed, we only update if the new value is higher (best score)
                            // OR if the target is 'cumulative' (which isn't the case for 'Achieve X WPM')
                            // Ideally, 'speed' challenge is "Hit X WPM once".
                            // So if value >= target, we mark complete.
                            if (value >= challenge.target) {
                                newCurrent = challenge.target;
                            } else {
                                // Keep best recorded speed if it's a high-score challenge
                                newCurrent = Math.max(challenge.current, value);
                            }
                        } else if (type === 'accuracy') {
                            // Accuracy challenge: "Complete 5 lessons with 98%+"
                            // Value passed here would be 1 (increment) if criteria met
                            newCurrent = Math.min(challenge.current + value, challenge.target);
                        } else {
                            // Accumulators (endurance, etc.)
                            newCurrent = Math.min(challenge.current + value, challenge.target);
                        }

                        return {
                            ...challenge,
                            current: newCurrent,
                            isCompleted: newCurrent >= challenge.target
                        };
                    });

                    return { challenges: newChallenges };
                });
            },

            generateWeeklyChallenges: () => {
                // In a real app, this would randomize challenges
                // For now, reset to defaults
                set({
                    challenges: DEFAULT_CHALLENGES.map(c => ({
                        ...c,
                        current: 0,
                        isCompleted: false
                    })),
                    lastResetDate: new Date().toISOString()
                });
            },

            checkWeeklyReset: () => {
                const { lastResetDate } = get();
                const last = new Date(lastResetDate);
                const now = new Date();

                // Reset if it's been more than 7 days
                const diffTime = Math.abs(now.getTime() - last.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 7) {
                    get().generateWeeklyChallenges();
                }
            }
        }),
        {
            name: 'challenge-store',
        }
    )
);
