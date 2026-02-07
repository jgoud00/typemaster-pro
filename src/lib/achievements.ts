'use client';

import { UserProgress, GameState } from '@/types';

// Achievement categories
export type AchievementCategory =
    | 'quick-win'
    | 'milestone'
    | 'speed'
    | 'accuracy'
    | 'streak'
    | 'secret';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: AchievementCategory;
    points: number;
    hidden?: boolean; // For secret achievements
}

export interface AchievementCondition {
    achievementId: string;
    check: (progress: UserProgress, game: GameState, event?: AchievementEvent) => boolean;
}

export type AchievementEvent =
    | { type: 'lesson_complete'; wpm: number; accuracy: number; lessonId: string }
    | { type: 'combo_reached'; combo: number }
    | { type: 'session_end'; wpm: number; accuracy: number; duration: number }
    | { type: 'daily_login' }
    | { type: 'keystroke'; totalKeystrokes: number };

// ============= Achievement Definitions =============

export const achievements: Achievement[] = [
    // Quick Wins (Easy to unlock, encourages early engagement)
    {
        id: 'first-steps',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '👶',
        category: 'quick-win',
        points: 10,
    },
    {
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Type 100 characters correctly',
        icon: '✨',
        category: 'quick-win',
        points: 10,
    },
    {
        id: 'hot-streak',
        title: 'Hot Streak',
        description: 'Get a 10-combo streak',
        icon: '🔥',
        category: 'quick-win',
        points: 15,
    },
    {
        id: 'warming-up',
        title: 'Warming Up',
        description: 'Reach 20 WPM in a lesson',
        icon: '🌡️',
        category: 'quick-win',
        points: 15,
    },
    {
        id: 'accurate-start',
        title: 'Accurate Start',
        description: 'Complete a lesson with 90%+ accuracy',
        icon: '🎯',
        category: 'quick-win',
        points: 15,
    },

    // Speed Achievements
    {
        id: 'speed-demon-40',
        title: 'Speed Demon',
        description: 'Reach 40 WPM',
        icon: '⚡',
        category: 'speed',
        points: 25,
    },
    {
        id: 'swift-fingers-60',
        title: 'Swift Fingers',
        description: 'Reach 60 WPM',
        icon: '💨',
        category: 'speed',
        points: 50,
    },
    {
        id: 'lightning-fast-80',
        title: 'Lightning Fast',
        description: 'Reach 80 WPM',
        icon: '⚡',
        category: 'speed',
        points: 100,
    },
    {
        id: 'supersonic-100',
        title: 'Supersonic',
        description: 'Reach 100 WPM',
        icon: '🚀',
        category: 'speed',
        points: 200,
    },
    {
        id: 'untouchable-120',
        title: 'Untouchable',
        description: 'Reach 120 WPM',
        icon: '👑',
        category: 'speed',
        points: 500,
    },

    // Accuracy Achievements
    {
        id: 'sharpshooter',
        title: 'Sharpshooter',
        description: 'Complete a lesson with 95%+ accuracy',
        icon: '🎯',
        category: 'accuracy',
        points: 30,
    },
    {
        id: 'precision-master',
        title: 'Precision Master',
        description: 'Complete a lesson with 98%+ accuracy',
        icon: '💎',
        category: 'accuracy',
        points: 75,
    },
    {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Complete a lesson with 100% accuracy',
        icon: '🏆',
        category: 'accuracy',
        points: 150,
    },

    // Milestone Achievements
    {
        id: 'dedicated-5',
        title: 'Dedicated',
        description: 'Complete 5 lessons',
        icon: '📚',
        category: 'milestone',
        points: 25,
    },
    {
        id: 'committed-25',
        title: 'Committed',
        description: 'Complete 25 lessons',
        icon: '📖',
        category: 'milestone',
        points: 75,
    },
    {
        id: 'scholar-50',
        title: 'Scholar',
        description: 'Complete 50 lessons',
        icon: '🎓',
        category: 'milestone',
        points: 150,
    },
    {
        id: 'master-100',
        title: 'Master Typist',
        description: 'Complete 100 lessons',
        icon: '👨‍🎓',
        category: 'milestone',
        points: 300,
    },
    {
        id: 'keystroke-1k',
        title: 'Thousand Fingers',
        description: 'Type 1,000 keystrokes',
        icon: '⌨️',
        category: 'milestone',
        points: 20,
    },
    {
        id: 'keystroke-10k',
        title: 'Ten Thousand',
        description: 'Type 10,000 keystrokes',
        icon: '🔢',
        category: 'milestone',
        points: 50,
    },
    {
        id: 'keystroke-100k',
        title: 'Keyboard Warrior',
        description: 'Type 100,000 keystrokes',
        icon: '⚔️',
        category: 'milestone',
        points: 200,
    },

    // Streak Achievements
    {
        id: 'streak-3',
        title: 'On a Roll',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        category: 'streak',
        points: 30,
    },
    {
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '📅',
        category: 'streak',
        points: 75,
    },
    {
        id: 'streak-30',
        title: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        icon: '🗓️',
        category: 'streak',
        points: 300,
    },

    // Combo Achievements
    {
        id: 'combo-25',
        title: 'Combo King',
        description: 'Reach a 25-combo streak',
        icon: '👊',
        category: 'streak',
        points: 40,
    },
    {
        id: 'combo-50',
        title: 'Combo Master',
        description: 'Reach a 50-combo streak',
        icon: '💪',
        category: 'streak',
        points: 80,
    },
    {
        id: 'combo-100',
        title: 'Unstoppable',
        description: 'Reach a 100-combo streak',
        icon: '🌟',
        category: 'streak',
        points: 200,
    },

    // Secret Achievements
    {
        id: 'night-owl',
        title: 'Night Owl',
        description: 'Practice between midnight and 5am',
        icon: '🦉',
        category: 'secret',
        points: 50,
        hidden: true,
    },
    {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Practice before 6am',
        icon: '🐦',
        category: 'secret',
        points: 50,
        hidden: true,
    },
    {
        id: 'speed-accuracy',
        title: 'The Complete Package',
        description: 'Get 80+ WPM with 98%+ accuracy in one session',
        icon: '🏅',
        category: 'secret',
        points: 250,
        hidden: true,
    },

    // Curriculum Achievements (Module Completion)
    {
        id: 'home-row-complete',
        title: 'Home Row Master',
        description: 'Complete all 20 home row lessons',
        icon: '🏠',
        category: 'milestone',
        points: 200,
    },
    {
        id: 'top-row-complete',
        title: 'Top Row Expert',
        description: 'Complete all 15 top row lessons',
        icon: '⬆️',
        category: 'milestone',
        points: 150,
    },
    {
        id: 'bottom-row-complete',
        title: 'Bottom Row Pro',
        description: 'Complete all 12 bottom row lessons',
        icon: '⬇️',
        category: 'milestone',
        points: 120,
    },
    {
        id: 'numbers-complete',
        title: 'Number Ninja',
        description: 'Complete all 8 number lessons',
        icon: '🔢',
        category: 'milestone',
        points: 100,
    },
    {
        id: 'symbols-complete',
        title: 'Symbol Sage',
        description: 'Complete all 8 symbol lessons',
        icon: '💎',
        category: 'milestone',
        points: 100,
    },
    {
        id: 'advanced-complete',
        title: 'Typing Legend',
        description: 'Complete all 10 advanced lessons',
        icon: '🚀',
        category: 'milestone',
        points: 300,
    },
    {
        id: 'all-complete',
        title: 'Ultimate TypeMaster',
        description: 'Complete all 73 lessons!',
        icon: '👑',
        category: 'milestone',
        points: 1000,
    },
];

// ============= Achievement Conditions =============

export const achievementConditions: AchievementCondition[] = [
    // Quick Wins
    {
        achievementId: 'first-steps',
        check: (progress) => progress.completedLessons.length >= 1,
    },
    {
        achievementId: 'getting-started',
        check: (progress) => progress.totalKeystrokes >= 100,
    },
    {
        achievementId: 'hot-streak',
        check: (_, game) => game.maxCombo >= 10,
    },
    {
        achievementId: 'warming-up',
        check: (progress) => progress.personalBests.wpm >= 20,
    },
    {
        achievementId: 'accurate-start',
        check: (progress) => progress.personalBests.accuracy >= 90,
    },

    // Speed
    {
        achievementId: 'speed-demon-40',
        check: (progress) => progress.personalBests.wpm >= 40,
    },
    {
        achievementId: 'swift-fingers-60',
        check: (progress) => progress.personalBests.wpm >= 60,
    },
    {
        achievementId: 'lightning-fast-80',
        check: (progress) => progress.personalBests.wpm >= 80,
    },
    {
        achievementId: 'supersonic-100',
        check: (progress) => progress.personalBests.wpm >= 100,
    },
    {
        achievementId: 'untouchable-120',
        check: (progress) => progress.personalBests.wpm >= 120,
    },

    // Accuracy
    {
        achievementId: 'sharpshooter',
        check: (progress) => progress.personalBests.accuracy >= 95,
    },
    {
        achievementId: 'precision-master',
        check: (progress) => progress.personalBests.accuracy >= 98,
    },
    {
        achievementId: 'perfectionist',
        check: (progress) => progress.personalBests.accuracy >= 100,
    },

    // Milestones
    {
        achievementId: 'dedicated-5',
        check: (progress) => progress.completedLessons.length >= 5,
    },
    {
        achievementId: 'committed-25',
        check: (progress) => progress.completedLessons.length >= 25,
    },
    {
        achievementId: 'scholar-50',
        check: (progress) => progress.completedLessons.length >= 50,
    },
    {
        achievementId: 'master-100',
        check: (progress) => progress.completedLessons.length >= 100,
    },
    {
        achievementId: 'keystroke-1k',
        check: (progress) => progress.totalKeystrokes >= 1000,
    },
    {
        achievementId: 'keystroke-10k',
        check: (progress) => progress.totalKeystrokes >= 10000,
    },
    {
        achievementId: 'keystroke-100k',
        check: (progress) => progress.totalKeystrokes >= 100000,
    },

    // Streaks
    {
        achievementId: 'streak-3',
        check: (_, game) => game.dailyStreak >= 3,
    },
    {
        achievementId: 'streak-7',
        check: (_, game) => game.dailyStreak >= 7,
    },
    {
        achievementId: 'streak-30',
        check: (_, game) => game.dailyStreak >= 30,
    },

    // Combos
    {
        achievementId: 'combo-25',
        check: (progress) => progress.personalBests.combo >= 25,
    },
    {
        achievementId: 'combo-50',
        check: (progress) => progress.personalBests.combo >= 50,
    },
    {
        achievementId: 'combo-100',
        check: (progress) => progress.personalBests.combo >= 100,
    },

    // Secret
    {
        achievementId: 'night-owl',
        check: () => {
            const hour = new Date().getHours();
            return hour >= 0 && hour < 5;
        },
    },
    {
        achievementId: 'early-bird',
        check: () => {
            const hour = new Date().getHours();
            return hour >= 5 && hour < 6;
        },
    },
    {
        achievementId: 'speed-accuracy',
        check: (_, __, event) => {
            if (event?.type === 'session_end') {
                return event.wpm >= 80 && event.accuracy >= 98;
            }
            return false;
        },
    },

    // Curriculum Module Completion
    {
        achievementId: 'home-row-complete',
        check: (progress) => {
            // Home row lessons: home-1-f through home-20-master
            const homeRowLessons = Array.from({ length: 20 }, (_, i) => {
                const lessonIds = [
                    'home-1-f', 'home-2-j', 'home-3-fj', 'home-4-d', 'home-5-k',
                    'home-6-dk', 'home-7-fjdk', 'home-8-s', 'home-9-l', 'home-10-sl',
                    'home-11-a', 'home-12-semi', 'home-13-asemi', 'home-14-left', 'home-15-right',
                    'home-16-full', 'home-17-words', 'home-18-sentences', 'home-19-speed', 'home-20-master'
                ];
                return lessonIds[i];
            });
            return homeRowLessons.every(id => progress.completedLessons.includes(id));
        },
    },
    {
        achievementId: 'top-row-complete',
        check: (progress) => {
            const topRowLessons = [
                'top-21-g', 'top-22-h', 'top-23-gh', 'top-24-r', 'top-25-u',
                'top-26-ru', 'top-27-e', 'top-28-i', 'top-29-ei', 'top-30-t',
                'top-31-y', 'top-32-w', 'top-33-o', 'top-34-q', 'top-35-p'
            ];
            return topRowLessons.every(id => progress.completedLessons.includes(id));
        },
    },
    {
        achievementId: 'bottom-row-complete',
        check: (progress) => {
            const bottomRowLessons = [
                'bot-36-v', 'bot-37-m', 'bot-38-vm', 'bot-39-c', 'bot-40-n',
                'bot-41-cn', 'bot-42-x', 'bot-43-comma', 'bot-44-z', 'bot-45-period',
                'bot-46-b', 'bot-47-slash'
            ];
            return bottomRowLessons.every(id => progress.completedLessons.includes(id));
        },
    },
    {
        achievementId: 'numbers-complete',
        check: (progress) => {
            const numbersLessons = [
                'num-48-12', 'num-49-34', 'num-50-56', 'num-51-78',
                'num-52-90', 'num-53-review1', 'num-54-review2', 'num-55-master'
            ];
            return numbersLessons.every(id => progress.completedLessons.includes(id));
        },
    },
    {
        achievementId: 'symbols-complete',
        check: (progress) => {
            const symbolsLessons = [
                'sym-56-shift', 'sym-57-punct', 'sym-58-brackets', 'sym-59-quotes',
                'sym-60-math', 'sym-61-special', 'sym-62-advanced', 'sym-63-master'
            ];
            return symbolsLessons.every(id => progress.completedLessons.includes(id));
        },
    },
    {
        achievementId: 'advanced-complete',
        check: (progress) => {
            const advancedLessons = [
                'adv-64-common', 'adv-65-html', 'adv-66-js', 'adv-67-python',
                'adv-68-email', 'adv-69-creative', 'adv-70-speed60', 'adv-71-speed70',
                'adv-72-accuracy', 'adv-73-master'
            ];
            return advancedLessons.every(id => progress.completedLessons.includes(id));
        },
    },
    {
        achievementId: 'all-complete',
        check: (progress) => progress.completedLessons.length >= 73,
    },
];

// ============= Helper Functions =============

export function getAchievementById(id: string): Achievement | undefined {
    return achievements.find(a => a.id === id);
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return achievements.filter(a => a.category === category);
}

export function getTotalAchievementPoints(unlockedIds: string[]): number {
    return unlockedIds.reduce((total, id) => {
        const achievement = getAchievementById(id);
        return total + (achievement?.points ?? 0);
    }, 0);
}

export function getUnlockedCount(unlockedIds: string[]): { unlocked: number; total: number } {
    return {
        unlocked: unlockedIds.length,
        total: achievements.filter(a => !a.hidden).length,
    };
}
