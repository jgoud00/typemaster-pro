/**
 * Warm-up Routine Generator
 * 
 * Creates personalized 2-minute warm-up routines that target
 * the user's current weakest patterns.
 */

import { ultimateWeaknessDetector } from './ultimate-weakness-detector';

export interface WarmupExercise {
    id: string;
    type: 'home_row' | 'weak_keys' | 'finger_stretch' | 'speed_burst' | 'accuracy_focus';
    text: string;
    duration: number; // seconds
    targetKeys: string[];
    instructions: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface WarmupRoutine {
    totalDuration: number; // seconds (target: 120)
    exercises: WarmupExercise[];
    focusAreas: string[];
    generatedAt: Date;
}

class WarmupGenerator {
    /**
     * Generate a personalized warm-up routine
     */
    generateRoutine(): WarmupRoutine {
        const exercises: WarmupExercise[] = [];
        let remainingTime = 120; // 2 minutes

        // 1. Always start with home row warm-up (20 seconds)
        exercises.push(this.createHomeRowExercise());
        remainingTime -= 20;

        // 2. Get weak keys from the detector
        const weakKeys = this.getWeakKeys();

        // 3. Add finger stretch exercise (15 seconds)
        exercises.push(this.createFingerStretchExercise());
        remainingTime -= 15;

        // 4. Add weak key exercises (40 seconds total)
        if (weakKeys.length > 0) {
            exercises.push(this.createWeakKeyExercise(weakKeys.slice(0, 3)));
            remainingTime -= 20;

            if (weakKeys.length > 3) {
                exercises.push(this.createWeakKeyExercise(weakKeys.slice(3, 6)));
                remainingTime -= 20;
            }
        }

        // 5. Add speed burst exercise (25 seconds)
        exercises.push(this.createSpeedBurstExercise());
        remainingTime -= 25;

        // 6. Add accuracy focus exercise with remaining time
        exercises.push(this.createAccuracyFocusExercise(Math.max(20, remainingTime)));

        return {
            totalDuration: 120,
            exercises,
            focusAreas: weakKeys.slice(0, 5),
            generatedAt: new Date(),
        };
    }

    /**
     * Get weak keys from the ultimate weakness detector
     */
    private getWeakKeys(): string[] {
        try {
            const analysis = ultimateWeaknessDetector.analyzeAll();
            return analysis
                .filter(a => a.weaknessScore > 40)
                .sort((a, b) => b.weaknessScore - a.weaknessScore)
                .slice(0, 8)
                .map(a => a.key);
        } catch {
            // Fallback if no data
            return ['q', 'p', 'z', 'x'];
        }
    }

    /**
     * Home row warm-up exercise
     */
    private createHomeRowExercise(): WarmupExercise {
        const homeRowTexts = [
            'asdf jkl; asdf jkl; asdf jkl; fdsa ;lkj fdsa ;lkj',
            'aaa sss ddd fff jjj kkk lll ;;; fds jkl asd ;lk',
            'fjfj dkdk slsl a;a; fjdk slal fjdk slal fdjk sala',
            'salads flask jalas falls daskal jakal flasks salads',
        ];

        return {
            id: 'warmup-home-row',
            type: 'home_row',
            text: homeRowTexts[Math.floor(Math.random() * homeRowTexts.length)],
            duration: 20,
            targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
            instructions: 'Start with home row keys. Keep your fingers on ASDF and JKL;.',
            difficulty: 'easy',
        };
    }

    /**
     * Finger stretch exercise (all rows)
     */
    private createFingerStretchExercise(): WarmupExercise {
        const texts = [
            'qa qa ws ws ed ed rf rf uj uj ik ik ol ol p; p;',
            'az az sx sx dc dc fv fv jm jm k, k, l. l. ;/ ;/',
            'qaz wsx edc rfv tgb yhn ujm ik, ol. p;/',
        ];

        return {
            id: 'warmup-finger-stretch',
            type: 'finger_stretch',
            text: texts[Math.floor(Math.random() * texts.length)],
            duration: 15,
            targetKeys: ['q', 'a', 'z', 'p', ';', '/'],
            instructions: 'Stretch to all rows. Focus on smooth vertical movements.',
            difficulty: 'medium',
        };
    }

    /**
     * Exercise targeting specific weak keys
     */
    private createWeakKeyExercise(weakKeys: string[]): WarmupExercise {
        // Generate text that focuses on weak keys
        const words = this.generateWeakKeyWords(weakKeys);

        return {
            id: `warmup-weak-${weakKeys.join('')}`,
            type: 'weak_keys',
            text: words.join(' '),
            duration: 20,
            targetKeys: weakKeys,
            instructions: `Focus on: ${weakKeys.map(k => k.toUpperCase()).join(', ')}. These are your problem areas.`,
            difficulty: 'medium',
        };
    }

    /**
     * Generate words containing specific weak keys
     */
    private generateWeakKeyWords(keys: string[]): string[] {
        const wordsByKey: Record<string, string[]> = {
            'q': ['quick', 'queen', 'quiet', 'quest', 'quote', 'equal', 'squad'],
            'w': ['word', 'work', 'wait', 'walk', 'want', 'wave', 'warm', 'watch'],
            'e': ['each', 'easy', 'even', 'ever', 'every', 'exact', 'excel'],
            'r': ['read', 'real', 'rest', 'ring', 'road', 'rock', 'room', 'rule'],
            't': ['take', 'talk', 'tell', 'test', 'that', 'them', 'then', 'time'],
            'y': ['year', 'yeah', 'your', 'yell', 'yoga', 'youth', 'yield'],
            'u': ['upon', 'used', 'user', 'unit', 'until', 'urban', 'usual'],
            'i': ['idea', 'into', 'item', 'image', 'impact', 'input', 'inner'],
            'o': ['once', 'only', 'open', 'over', 'order', 'other', 'outer'],
            'p': ['page', 'park', 'part', 'pass', 'past', 'path', 'plan', 'play'],
            'a': ['able', 'about', 'above', 'after', 'again', 'also', 'always'],
            's': ['said', 'same', 'save', 'seem', 'self', 'send', 'show', 'side'],
            'd': ['data', 'date', 'deal', 'deep', 'disk', 'does', 'done', 'down'],
            'f': ['face', 'fact', 'fail', 'fall', 'fast', 'feel', 'file', 'find'],
            'g': ['game', 'gave', 'give', 'glad', 'goal', 'goes', 'good', 'grow'],
            'h': ['had', 'half', 'hand', 'hard', 'have', 'head', 'hear', 'help'],
            'j': ['job', 'join', 'jump', 'just', 'major', 'object', 'project'],
            'k': ['keep', 'kept', 'kick', 'kind', 'king', 'know', 'like', 'look'],
            'l': ['last', 'late', 'lead', 'left', 'less', 'life', 'like', 'line'],
            'z': ['zero', 'zone', 'zoom', 'zeal', 'maze', 'size', 'prize', 'freeze'],
            'x': ['text', 'next', 'exit', 'exam', 'exact', 'excel', 'extra', 'fixed'],
            'c': ['call', 'came', 'care', 'case', 'city', 'come', 'copy', 'could'],
            'v': ['very', 'view', 'vast', 'vote', 'value', 'visit', 'voice', 'video'],
            'b': ['back', 'base', 'been', 'best', 'both', 'bring', 'build', 'busy'],
            'n': ['name', 'need', 'never', 'next', 'nice', 'none', 'note', 'nothing'],
            'm': ['made', 'main', 'make', 'many', 'more', 'most', 'move', 'much'],
        };

        const selectedWords: string[] = [];

        for (const key of keys) {
            const words = wordsByKey[key.toLowerCase()] || [];
            // Pick 2-3 random words for each key
            const shuffled = words.sort(() => Math.random() - 0.5);
            selectedWords.push(...shuffled.slice(0, 3));
        }

        // Shuffle and limit
        return selectedWords.sort(() => Math.random() - 0.5).slice(0, 12);
    }

    /**
     * Speed burst exercise (type as fast as possible)
     */
    private createSpeedBurstExercise(): WarmupExercise {
        const texts = [
            'the quick brown fox jumps over the lazy dog',
            'pack my box with five dozen liquor jugs',
            'how vexingly quick daft zebras jump',
            'the five boxing wizards jump quickly',
        ];

        return {
            id: 'warmup-speed-burst',
            type: 'speed_burst',
            text: texts[Math.floor(Math.random() * texts.length)],
            duration: 25,
            targetKeys: [],
            instructions: 'Speed burst! Type as fast as you can while maintaining reasonable accuracy.',
            difficulty: 'hard',
        };
    }

    /**
     * Accuracy focus exercise (slow and precise)
     */
    private createAccuracyFocusExercise(duration: number): WarmupExercise {
        const texts = [
            'practice makes perfect; patience brings progress; precision prevents problems',
            'slow and steady wins the race; focus on form not speed; accuracy first always',
            'breathe deeply and relax; let your fingers flow; trust your muscle memory',
        ];

        return {
            id: 'warmup-accuracy-focus',
            type: 'accuracy_focus',
            text: texts[Math.floor(Math.random() * texts.length)],
            duration,
            targetKeys: [],
            instructions: 'Accuracy focus. Slow down and aim for 100% accuracy. Speed will come naturally.',
            difficulty: 'easy',
        };
    }
}

export const warmupGenerator = new WarmupGenerator();
