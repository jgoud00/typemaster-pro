/**
 * Challenge Engine — Daily missions & weekly goals
 *
 * Generates personalized challenges based on user level and progress.
 * Adaptive milestones that grow with the user.
 */

export type ChallengeType = 'speed' | 'accuracy' | 'endurance' | 'combo' | 'consistency';
export type ChallengeStatus = 'active' | 'completed' | 'expired';

export interface Challenge {
    id: string;
    type: ChallengeType;
    title: string;
    description: string;
    target: number;
    current: number;
    status: ChallengeStatus;
    xpReward: number;
    createdAt: number;
    expiresAt: number;
}

export interface WeeklyGoal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
    completed: boolean;
}

interface UserLevel {
    wpm: number;
    accuracy: number;
    totalSessions: number;
}

// ── Challenge Generation ─────────────────────────────────────────────────

function generateDayId(): string {
    return new Date().toISOString().split('T')[0];
}

function seededRandom(seed: string): () => number {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    }
    return () => {
        h = (h * 1103515245 + 12345) | 0;
        return ((h >>> 16) & 0x7fff) / 0x7fff;
    };
}

export function generateDailyChallenges(user: UserLevel): Challenge[] {
    const dayId = generateDayId();
    const rng = seededRandom(dayId);
    const now = Date.now();
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    // Adaptive targets based on user level
    const wpmTarget = Math.max(20, Math.round(user.wpm * (0.95 + rng() * 0.15)));
    const accTarget = Math.min(100, Math.round(Math.max(85, user.accuracy * 0.98)));

    const pool: Challenge[] = [
        {
            id: `speed-${dayId}`,
            type: 'speed',
            title: 'Speed Demon',
            description: `Type at ${wpmTarget} WPM for at least 30 seconds`,
            target: wpmTarget,
            current: 0,
            status: 'active',
            xpReward: 50 + Math.floor(wpmTarget / 10) * 5,
            createdAt: now,
            expiresAt: endOfDay,
        },
        {
            id: `accuracy-${dayId}`,
            type: 'accuracy',
            title: 'Precision Strike',
            description: `Complete a passage with ≥${accTarget}% accuracy`,
            target: accTarget,
            current: 0,
            status: 'active',
            xpReward: 40,
            createdAt: now,
            expiresAt: endOfDay,
        },
        {
            id: `endurance-${dayId}`,
            type: 'endurance',
            title: 'Marathon Typer',
            description: 'Type for 5 minutes without stopping',
            target: 300,
            current: 0,
            status: 'active',
            xpReward: 60,
            createdAt: now,
            expiresAt: endOfDay,
        },
        {
            id: `combo-${dayId}`,
            type: 'combo',
            title: 'Combo King',
            description: `Achieve a ${Math.max(20, Math.floor(user.wpm * 0.6))}+ combo`,
            target: Math.max(20, Math.floor(user.wpm * 0.6)),
            current: 0,
            status: 'active',
            xpReward: 45,
            createdAt: now,
            expiresAt: endOfDay,
        },
        {
            id: `consistency-${dayId}`,
            type: 'consistency',
            title: 'Steady Hands',
            description: 'Complete 3 sessions with <5 WPM variance',
            target: 3,
            current: 0,
            status: 'active',
            xpReward: 55,
            createdAt: now,
            expiresAt: endOfDay,
        },
    ];

    // Select 3 using seeded random for deterministic daily selection
    return pool
        .sort(() => rng() - 0.5)
        .slice(0, 3);
}

export function generateWeeklyGoals(user: UserLevel): WeeklyGoal[] {
    const sessionsTarget = Math.max(10, Math.round(user.totalSessions > 50 ? 15 : 10));
    const keystrokesTarget = Math.max(5000, Math.round(user.wpm * 300));
    const practiceMinutes = Math.max(30, Math.round(user.totalSessions > 20 ? 60 : 30));

    return [
        {
            id: 'weekly-sessions',
            title: 'Practice Sessions',
            target: sessionsTarget,
            current: 0,
            unit: 'sessions',
            completed: false,
        },
        {
            id: 'weekly-keystrokes',
            title: 'Total Keystrokes',
            target: keystrokesTarget,
            current: 0,
            unit: 'keys',
            completed: false,
        },
        {
            id: 'weekly-time',
            title: 'Practice Time',
            target: practiceMinutes,
            current: 0,
            unit: 'minutes',
            completed: false,
        },
    ];
}

// ── Challenge Evaluation ──────────────────────────────────────────────────

export function evaluateChallenge(
    challenge: Challenge,
    sessionResult: { wpm: number; accuracy: number; duration: number; maxCombo: number }
): Challenge {
    if (challenge.status !== 'active') return challenge;
    if (Date.now() > challenge.expiresAt) return { ...challenge, status: 'expired' };

    let current = challenge.current;

    switch (challenge.type) {
        case 'speed':
            if (sessionResult.wpm >= challenge.target && sessionResult.duration >= 30) {
                current = challenge.target;
            }
            break;
        case 'accuracy':
            if (sessionResult.accuracy >= challenge.target) {
                current = challenge.target;
            }
            break;
        case 'endurance':
            current = Math.max(current, sessionResult.duration);
            break;
        case 'combo':
            current = Math.max(current, sessionResult.maxCombo);
            break;
        case 'consistency':
            current += 1;
            break;
    }

    const completed = current >= challenge.target;
    return {
        ...challenge,
        current,
        status: completed ? 'completed' : 'active',
    };
}
