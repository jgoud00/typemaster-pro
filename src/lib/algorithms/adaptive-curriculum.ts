/**
 * Adaptive Curriculum System
 * 
 * Generates personalized lessons based on:
 * - Current skill level per key
 * - Zone of Proximal Development (ZPD) theory
 * - Learning rate estimation
 * - Spaced repetition scheduling
 */

import { weaknessDetector, type WeaknessResult } from './bayesian-weakness-detector';

export interface Skill {
    key: string;
    level: number;          // 0-100 mastery
    confidence: number;     // 0-1 certainty
    learningRate: number;   // Improvement per practice
    lastPracticed: Date;
}

export interface Exercise {
    text: string;
    targetWPM: number;
    targetAccuracy: number;
    hints: string[];
}

export interface AdaptiveLesson {
    id: string;
    title: string;
    description: string;
    difficulty: number;       // 0-100
    exercises: Exercise[];
    focusKeys: string[];
    estimatedDuration: number; // minutes
    expectedImprovement: number;
}

// Word bank organized by difficulty and key coverage
const WORD_BANK = {
    easy: [
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
        'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    ],
    medium: [
        'about', 'which', 'their', 'there', 'would', 'these', 'other', 'words',
        'could', 'write', 'first', 'water', 'after', 'where', 'right', 'think',
    ],
    hard: [
        'through', 'different', 'between', 'sentence', 'question', 'experience',
        'knowledge', 'important', 'necessary', 'government', 'understand', 'development',
    ],
};

// Pangrams for comprehensive practice
const PANGRAMS = [
    'The quick brown fox jumps over the lazy dog.',
    'Pack my box with five dozen liquor jugs.',
    'How vexingly quick daft zebras jump!',
    'The five boxing wizards jump quickly.',
    'Sphinx of black quartz, judge my vow.',
];

export class AdaptiveCurriculum {
    private skills = new Map<string, Skill>();
    private userLevel = 50; // 0-100 overall

    /**
     * Generate the next optimal lesson for the user
     */
    generateNextLesson(weaknessAnalysis: WeaknessResult[]): AdaptiveLesson {
        this.updateSkills(weaknessAnalysis);
        this.userLevel = this.calculateOverallLevel();

        // Find keys in Zone of Proximal Development
        const zpdKeys = this.identifyZPDKeys();

        // If no ZPD keys, focus on weakest keys
        const targetKeys = zpdKeys.length > 0 ? zpdKeys : this.getWeakestKeys(3);

        // Calculate optimal difficulty
        const difficulty = this.calculateOptimalDifficulty();

        // Generate exercises
        const exercises = this.generateExercises(targetKeys, difficulty);

        // Predict improvement
        const expectedImprovement = this.predictImprovement(targetKeys);

        return {
            id: `adaptive-${Date.now()}`,
            title: this.generateTitle(targetKeys),
            description: this.generateDescription(targetKeys, difficulty),
            difficulty,
            exercises,
            focusKeys: targetKeys,
            estimatedDuration: 10,
            expectedImprovement,
        };
    }

    /**
     * Update skill estimates from weakness analysis
     */
    private updateSkills(analysis: WeaknessResult[]): void {
        analysis.forEach(result => {
            let skill = this.skills.get(result.key);

            if (!skill) {
                skill = {
                    key: result.key,
                    level: 50,
                    confidence: 0.5,
                    learningRate: 0.1,
                    lastPracticed: new Date(0),
                };
                this.skills.set(result.key, skill);
            }

            // Update from Bayesian analysis
            skill.level = result.estimatedAccuracy * 100;
            skill.confidence = result.confidence;

            // Adjust learning rate based on trend
            if (result.recentTrend === 'improving') {
                skill.learningRate = Math.min(0.5, skill.learningRate * 1.2);
            } else if (result.recentTrend === 'declining') {
                skill.learningRate = Math.max(0.05, skill.learningRate * 0.8);
            }
        });
    }

    /**
     * Calculate overall skill level (weighted average)
     */
    private calculateOverallLevel(): number {
        if (this.skills.size === 0) return 50;

        let totalWeighted = 0;
        let totalWeight = 0;

        this.skills.forEach(skill => {
            totalWeighted += skill.level * skill.confidence;
            totalWeight += skill.confidence;
        });

        return totalWeight > 0 ? totalWeighted / totalWeight : 50;
    }

    /**
     * Identify keys in Zone of Proximal Development
     * Keys that are challenging but achievable (15-25 points below user level)
     */
    private identifyZPDKeys(): string[] {
        const zpdLower = this.userLevel - 25;
        const zpdUpper = this.userLevel - 10;
        const zpdKeys: Array<{ key: string; potential: number }> = [];

        this.skills.forEach((skill, key) => {
            if (skill.level >= zpdLower && skill.level <= zpdUpper) {
                // Potential = learning rate * room for improvement
                const potential = skill.learningRate * (100 - skill.level);
                zpdKeys.push({ key, potential });
            }
        });

        // Sort by potential and take top 3
        return zpdKeys
            .sort((a, b) => b.potential - a.potential)
            .slice(0, 3)
            .map(k => k.key);
    }

    /**
     * Get weakest keys by level
     */
    private getWeakestKeys(count: number): string[] {
        return Array.from(this.skills.entries())
            .sort((a, b) => a[1].level - b[1].level)
            .slice(0, count)
            .map(([key]) => key);
    }

    /**
     * Calculate optimal difficulty (slightly above current level)
     */
    private calculateOptimalDifficulty(): number {
        // Optimal: current level + 10-15 points
        return Math.min(100, this.userLevel + 12);
    }

    /**
     * Generate exercises for target keys
     */
    private generateExercises(keys: string[], difficulty: number): Exercise[] {
        const exercises: Exercise[] = [];
        const targetWPM = this.calculateTargetWPM(difficulty);

        // Exercise 1: Key isolation (warmup)
        exercises.push({
            text: this.generateIsolationDrill(keys),
            targetWPM: Math.round(targetWPM * 0.7),
            targetAccuracy: 95,
            hints: [
                'Focus on accuracy first',
                'Keep fingers on home row',
                'Relax your hands',
            ],
        });

        // Exercise 2: Bigram practice
        exercises.push({
            text: this.generateBigramDrill(keys),
            targetWPM: Math.round(targetWPM * 0.85),
            targetAccuracy: 93,
            hints: [
                'Practice smooth transitions',
                'Build muscle memory',
            ],
        });

        // Exercise 3: Word practice
        exercises.push({
            text: this.generateWordDrill(keys, difficulty),
            targetWPM: Math.round(targetWPM * 0.95),
            targetAccuracy: 90,
            hints: [
                'Read ahead to anticipate',
                'Type in word bursts',
            ],
        });

        // Exercise 4: Sentence practice
        exercises.push({
            text: this.generateSentenceDrill(keys),
            targetWPM: targetWPM,
            targetAccuracy: 88,
            hints: [
                'Maintain steady rhythm',
                'Don\'t pause at spaces',
            ],
        });

        return exercises;
    }

    /**
     * Calculate target WPM based on difficulty
     */
    private calculateTargetWPM(difficulty: number): number {
        // Map 0-100 difficulty to 25-85 WPM
        return Math.round(25 + (difficulty / 100) * 60);
    }

    /**
     * Generate key isolation drill (e.g., "fff jjj fff")
     */
    private generateIsolationDrill(keys: string[]): string {
        const drills = keys.map(key => {
            const triple = `${key}${key}${key}`;
            return `${triple} ${key} ${triple}`;
        });
        return drills.join(' ').repeat(3).trim();
    }

    /**
     * Generate bigram drill
     */
    private generateBigramDrill(keys: string[]): string {
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const bigrams: string[] = [];

        keys.forEach(key => {
            vowels.forEach(v => {
                bigrams.push(`${key}${v}`);
                bigrams.push(`${v}${key}`);
            });
        });

        // Shuffle and join
        return this.shuffle(bigrams).slice(0, 20).join(' ');
    }

    /**
     * Generate word drill containing target keys
     */
    private generateWordDrill(keys: string[], difficulty: number): string {
        const wordList = difficulty < 40 ? WORD_BANK.easy :
            difficulty < 70 ? WORD_BANK.medium :
                WORD_BANK.hard;

        const filteredWords = wordList.filter(word =>
            keys.some(k => word.includes(k.toLowerCase()))
        );

        const words = filteredWords.length > 0 ? filteredWords : wordList;
        const result: string[] = [];

        for (let i = 0; i < 25; i++) {
            result.push(words[Math.floor(Math.random() * words.length)]);
        }

        return result.join(' ');
    }

    /**
     * Generate sentence drill
     */
    private generateSentenceDrill(keys: string[]): string {
        // Select pangrams that contain target keys
        const relevant = PANGRAMS.filter(p =>
            keys.some(k => p.toLowerCase().includes(k.toLowerCase()))
        );

        return (relevant.length > 0 ? relevant : PANGRAMS)
            .slice(0, 3)
            .join(' ');
    }

    /**
     * Predict expected WPM improvement
     */
    private predictImprovement(keys: string[]): number {
        let avgLearningRate = 0;
        let count = 0;

        keys.forEach(key => {
            const skill = this.skills.get(key);
            if (skill) {
                avgLearningRate += skill.learningRate;
                count++;
            }
        });

        if (count === 0) return 1;
        avgLearningRate /= count;

        // Predict 1-3 WPM improvement based on learning rate
        return Math.round(1 + avgLearningRate * 5);
    }

    /**
     * Generate lesson title
     */
    private generateTitle(keys: string[]): string {
        if (keys.length === 0) return 'General Practice';
        return `Focus: ${keys.slice(0, 3).join(', ').toUpperCase()}`;
    }

    /**
     * Generate lesson description
     */
    private generateDescription(keys: string[], difficulty: number): string {
        const level = difficulty < 35 ? 'Beginner' :
            difficulty < 55 ? 'Intermediate' :
                difficulty < 75 ? 'Advanced' : 'Expert';

        if (keys.length === 0) {
            return 'Comprehensive practice session to maintain your skills.';
        }

        return `${level} practice focusing on ${keys.join(', ')}. ` +
            `Calibrated to your current skill level for optimal learning.`;
    }

    /**
     * Generate multi-lesson curriculum
     */
    generateCurriculum(
        weaknessAnalysis: WeaknessResult[],
        lessonCount = 5
    ): AdaptiveLesson[] {
        const lessons: AdaptiveLesson[] = [];

        for (let i = 0; i < lessonCount; i++) {
            const lesson = this.generateNextLesson(weaknessAnalysis);
            lessons.push(lesson);

            // Simulate improvement for planning
            lesson.focusKeys.forEach(key => {
                const skill = this.skills.get(key);
                if (skill) {
                    skill.level = Math.min(100, skill.level + skill.learningRate * 8);
                }
            });
        }

        return lessons;
    }

    /**
     * Fisher-Yates shuffle
     */
    private shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}

// Singleton export
export const adaptiveCurriculum = new AdaptiveCurriculum();
