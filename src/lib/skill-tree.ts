/**
 * Skill Tree Progression System
 * 
 * 3 paths: Speed Demon, Accuracy King, Endurance Pro
 * Each with 4 levels + Master node at the top
 */

export interface SkillNode {
    id: string;
    name: string;
    description: string;
    icon: string;
    path: 'speed' | 'accuracy' | 'endurance';
    level: number; // 1-4 (4 is master)
    requirement: {
        type: 'wpm' | 'accuracy' | 'streak' | 'time' | 'lessons';
        value: number;
        description: string;
    };
    reward: {
        type: 'badge' | 'title' | 'theme' | 'feature';
        value: string;
    };
    unlocked: boolean;
    progress: number; // 0-100
}

export interface SkillTree {
    masterNode: SkillNode;
    speedPath: SkillNode[];
    accuracyPath: SkillNode[];
    endurancePath: SkillNode[];
}

// Skill tree definition
const SKILL_TREE_DEFINITION: SkillNode[] = [
    // Speed Path
    {
        id: 'speed-1',
        name: 'Swift Fingers',
        description: 'Reach 40 WPM in any test',
        icon: '⚡',
        path: 'speed',
        level: 1,
        requirement: { type: 'wpm', value: 40, description: 'Reach 40 WPM' },
        reward: { type: 'badge', value: 'Swift Fingers Badge' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'speed-2',
        name: 'Quick Typist',
        description: 'Reach 60 WPM consistently',
        icon: '💨',
        path: 'speed',
        level: 2,
        requirement: { type: 'wpm', value: 60, description: 'Reach 60 WPM' },
        reward: { type: 'title', value: 'Quick Typist' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'speed-3',
        name: 'Speed Racer',
        description: 'Reach 80 WPM in a 1-minute test',
        icon: '🏎️',
        path: 'speed',
        level: 3,
        requirement: { type: 'wpm', value: 80, description: 'Reach 80 WPM' },
        reward: { type: 'theme', value: 'Racing Theme' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'speed-4',
        name: 'Speed Demon',
        description: 'Reach 100 WPM',
        icon: '👹',
        path: 'speed',
        level: 4,
        requirement: { type: 'wpm', value: 100, description: 'Reach 100 WPM' },
        reward: { type: 'title', value: 'Speed Demon' },
        unlocked: false,
        progress: 0,
    },

    // Accuracy Path
    {
        id: 'accuracy-1',
        name: 'Careful Typist',
        description: 'Complete a test with 90% accuracy',
        icon: '🎯',
        path: 'accuracy',
        level: 1,
        requirement: { type: 'accuracy', value: 90, description: '90% accuracy in a test' },
        reward: { type: 'badge', value: 'Careful Typist Badge' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'accuracy-2',
        name: 'Precision Player',
        description: 'Complete 5 tests with 95% accuracy',
        icon: '🔍',
        path: 'accuracy',
        level: 2,
        requirement: { type: 'accuracy', value: 95, description: '95% accuracy, 5 tests' },
        reward: { type: 'title', value: 'Precision Player' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'accuracy-3',
        name: 'Sharpshooter',
        description: 'Complete a 2-minute test with 98% accuracy',
        icon: '🎪',
        path: 'accuracy',
        level: 3,
        requirement: { type: 'accuracy', value: 98, description: '98% accuracy in 2-min test' },
        reward: { type: 'theme', value: 'Precision Theme' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'accuracy-4',
        name: 'Accuracy King',
        description: 'Complete a 5-minute test with 99% accuracy',
        icon: '👑',
        path: 'accuracy',
        level: 4,
        requirement: { type: 'accuracy', value: 99, description: '99% accuracy in 5-min test' },
        reward: { type: 'title', value: 'Accuracy King' },
        unlocked: false,
        progress: 0,
    },

    // Endurance Path
    {
        id: 'endurance-1',
        name: 'Getting Started',
        description: 'Practice for 15 minutes in one session',
        icon: '🌱',
        path: 'endurance',
        level: 1,
        requirement: { type: 'time', value: 15, description: '15 minutes in one session' },
        reward: { type: 'badge', value: 'Dedicated Badge' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'endurance-2',
        name: 'Daily Dedication',
        description: 'Maintain a 7-day practice streak',
        icon: '🔥',
        path: 'endurance',
        level: 2,
        requirement: { type: 'streak', value: 7, description: '7-day streak' },
        reward: { type: 'title', value: 'Dedicated Typist' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'endurance-3',
        name: 'Marathon Runner',
        description: 'Practice for 30 minutes in one session',
        icon: '🏃',
        path: 'endurance',
        level: 3,
        requirement: { type: 'time', value: 30, description: '30 minutes in one session' },
        reward: { type: 'theme', value: 'Marathon Theme' },
        unlocked: false,
        progress: 0,
    },
    {
        id: 'endurance-4',
        name: 'Endurance Pro',
        description: 'Maintain a 30-day practice streak',
        icon: '🏆',
        path: 'endurance',
        level: 4,
        requirement: { type: 'streak', value: 30, description: '30-day streak' },
        reward: { type: 'title', value: 'Endurance Pro' },
        unlocked: false,
        progress: 0,
    },

    // Master Node
    {
        id: 'master',
        name: 'Master Typist',
        description: 'Complete all three paths',
        icon: '🌟',
        path: 'speed', // Belongs to all paths
        level: 5,
        requirement: { type: 'lessons', value: 12, description: 'Complete all 12 skill nodes' },
        reward: { type: 'title', value: 'Master Typist' },
        unlocked: false,
        progress: 0,
    },
];

const STORAGE_KEY = 'typemaster-skill-tree';

class SkillTreeManager {
    private nodes: Map<string, SkillNode> = new Map();

    constructor() {
        this.load();
    }

    /**
     * Load skill tree from localStorage
     */
    private load(): void {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as SkillNode[];
                parsed.forEach(node => this.nodes.set(node.id, node));
            } else {
                this.reset();
            }
        } catch {
            this.reset();
        }
    }

    /**
     * Reset to default state
     */
    reset(): void {
        this.nodes.clear();
        SKILL_TREE_DEFINITION.forEach(node => {
            this.nodes.set(node.id, { ...node });
        });
        this.save();
    }

    /**
     * Save to localStorage
     */
    private save(): void {
        try {
            const nodes = Array.from(this.nodes.values());
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
        } catch {
            // Ignore save errors
        }
    }

    /**
     * Get the full skill tree structure
     */
    getTree(): SkillTree {
        const speedPath = [1, 2, 3, 4].map(level =>
            this.nodes.get(`speed-${level}`)!
        );
        const accuracyPath = [1, 2, 3, 4].map(level =>
            this.nodes.get(`accuracy-${level}`)!
        );
        const endurancePath = [1, 2, 3, 4].map(level =>
            this.nodes.get(`endurance-${level}`)!
        );
        const masterNode = this.nodes.get('master')!;

        return {
            masterNode,
            speedPath,
            accuracyPath,
            endurancePath,
        };
    }

    /**
     * Update progress based on user stats
     */
    updateProgress(stats: {
        bestWpm: number;
        bestAccuracy: number;
        currentStreak: number;
        sessionMinutes: number;
        completedLessons: number;
        testsAt95Plus: number;
    }): SkillNode[] {
        const newlyUnlocked: SkillNode[] = [];

        this.nodes.forEach((node, id) => {
            if (node.unlocked) return;

            let progress = 0;
            let shouldUnlock = false;

            switch (node.requirement.type) {
                case 'wpm':
                    progress = Math.min(100, (stats.bestWpm / node.requirement.value) * 100);
                    shouldUnlock = stats.bestWpm >= node.requirement.value;
                    break;
                case 'accuracy':
                    progress = Math.min(100, (stats.bestAccuracy / node.requirement.value) * 100);
                    shouldUnlock = stats.bestAccuracy >= node.requirement.value;
                    break;
                case 'streak':
                    progress = Math.min(100, (stats.currentStreak / node.requirement.value) * 100);
                    shouldUnlock = stats.currentStreak >= node.requirement.value;
                    break;
                case 'time':
                    progress = Math.min(100, (stats.sessionMinutes / node.requirement.value) * 100);
                    shouldUnlock = stats.sessionMinutes >= node.requirement.value;
                    break;
                case 'lessons':
                    const unlockedCount = Array.from(this.nodes.values())
                        .filter(n => n.unlocked && n.id !== 'master').length;
                    progress = Math.min(100, (unlockedCount / 12) * 100);
                    shouldUnlock = unlockedCount >= 12;
                    break;
            }

            // Check if previous level is unlocked (except for level 1)
            if (node.level > 1) {
                const prevNode = this.nodes.get(`${node.path}-${node.level - 1}`);
                if (prevNode && !prevNode.unlocked) {
                    shouldUnlock = false;
                }
            }

            // Update node
            node.progress = progress;
            if (shouldUnlock && !node.unlocked) {
                node.unlocked = true;
                newlyUnlocked.push(node);
            }

            this.nodes.set(id, node);
        });

        this.save();
        return newlyUnlocked;
    }

    /**
     * Get a specific node
     */
    getNode(id: string): SkillNode | undefined {
        return this.nodes.get(id);
    }

    /**
     * Get all unlocked nodes
     */
    getUnlockedNodes(): SkillNode[] {
        return Array.from(this.nodes.values()).filter(n => n.unlocked);
    }

    /**
     * Get next unlockable nodes
     */
    getNextUnlockable(): SkillNode[] {
        const unlockable: SkillNode[] = [];

        ['speed', 'accuracy', 'endurance'].forEach(path => {
            for (let level = 1; level <= 4; level++) {
                const node = this.nodes.get(`${path}-${level}`);
                if (!node) continue;

                if (!node.unlocked) {
                    // Check if previous is unlocked
                    if (level === 1 || this.nodes.get(`${path}-${level - 1}`)?.unlocked) {
                        unlockable.push(node);
                    }
                    break;
                }
            }
        });

        return unlockable;
    }
}

export const skillTreeManager = new SkillTreeManager();
