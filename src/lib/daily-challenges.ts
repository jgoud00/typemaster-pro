'use client';

// Daily Challenge Types and Generator
// Challenges are seeded by date so all users get the same challenges

export type ChallengeType = 'speed' | 'accuracy' | 'combo' | 'endurance' | 'perfect';

export interface DailyChallenge {
    id: string;
    type: ChallengeType;
    title: string;
    description: string;
    icon: string;
    target: number;
    reward: number;
    difficulty: 'easy' | 'medium' | 'hard';
}

interface ChallengeTemplate {
    type: ChallengeType;
    title: string;
    description: string;
    icon: string;
    targets: { easy: number; medium: number; hard: number };
    rewards: { easy: number; medium: number; hard: number };
}

const challengeTemplates: ChallengeTemplate[] = [
    {
        type: 'speed',
        title: 'Speed Demon',
        description: 'Reach {target} WPM in a single session',
        icon: '⚡',
        targets: { easy: 30, medium: 50, hard: 70 },
        rewards: { easy: 50, medium: 100, hard: 200 },
    },
    {
        type: 'accuracy',
        title: 'Sharpshooter',
        description: 'Complete a lesson with {target}% accuracy',
        icon: '🎯',
        targets: { easy: 90, medium: 95, hard: 98 },
        rewards: { easy: 50, medium: 100, hard: 200 },
    },
    {
        type: 'combo',
        title: 'Combo Master',
        description: 'Achieve a {target}-combo streak',
        icon: '🔥',
        targets: { easy: 15, medium: 30, hard: 50 },
        rewards: { easy: 75, medium: 150, hard: 300 },
    },
    {
        type: 'endurance',
        title: 'Marathon',
        description: 'Type for {target} minutes today',
        icon: '⏱️',
        targets: { easy: 5, medium: 15, hard: 30 },
        rewards: { easy: 50, medium: 100, hard: 200 },
    },
    {
        type: 'perfect',
        title: 'Perfectionist',
        description: 'Complete {target} lessons with 100% accuracy',
        icon: '💎',
        targets: { easy: 1, medium: 3, hard: 5 },
        rewards: { easy: 100, medium: 250, hard: 500 },
    },
];

// Seeded random number generator
function seededRandom(seed: number): () => number {
    return () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };
}

// Get date seed (same for everyone on the same day)
function getDateSeed(): number {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// Generate daily challenges
export function getDailyChallenges(): DailyChallenge[] {
    const seed = getDateSeed();
    const random = seededRandom(seed);

    const challenges: DailyChallenge[] = [];
    const usedTypes = new Set<ChallengeType>();

    // Select 3 different challenge types
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

    for (let i = 0; i < 3; i++) {
        // Pick a random template not yet used
        let template: ChallengeTemplate;
        do {
            const index = Math.floor(random() * challengeTemplates.length);
            template = challengeTemplates[index];
        } while (usedTypes.has(template.type));
        usedTypes.add(template.type);

        const difficulty = difficulties[i];
        const target = template.targets[difficulty];
        const reward = template.rewards[difficulty];

        challenges.push({
            id: `${seed}-${template.type}`,
            type: template.type,
            title: template.title,
            description: template.description.replace('{target}', target.toString()),
            icon: template.icon,
            target,
            reward,
            difficulty,
        });
    }

    return challenges;
}

// Check if a challenge is completed
export function checkChallengeCompletion(
    challenge: DailyChallenge,
    stats: {
        maxWpm: number;
        maxAccuracy: number;
        maxCombo: number;
        totalMinutes: number;
        perfectLessons: number;
    }
): boolean {
    switch (challenge.type) {
        case 'speed':
            return stats.maxWpm >= challenge.target;
        case 'accuracy':
            return stats.maxAccuracy >= challenge.target;
        case 'combo':
            return stats.maxCombo >= challenge.target;
        case 'endurance':
            return stats.totalMinutes >= challenge.target;
        case 'perfect':
            return stats.perfectLessons >= challenge.target;
        default:
            return false;
    }
}

// Get time until next challenge refresh
export function getTimeUntilReset(): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = tomorrow.getTime() - now.getTime();

    return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
}
