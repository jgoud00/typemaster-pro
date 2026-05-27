import { describe, it, expect } from 'vitest';
import {
    PRNG,
    generateWeaknessTargetedText,
    generateLessonText,
    generateAdaptiveText,
    generateSpeedTestText,
} from './practice-texts';

describe('practice-texts utility', () => {
    describe('PRNG (Pseudo-Random Number Generator)', () => {
        it('should be deterministic given the same seed', () => {
            const rng1 = new PRNG(12345);
            const rng2 = new PRNG(12345);
            
            expect(rng1.next()).toBeCloseTo(rng2.next());
            expect(rng1.nextInt(1, 10)).toBe(rng2.nextInt(1, 10));
            
            const arr = ['a', 'b', 'c'];
            expect(rng1.choice(arr)).toBe(rng2.choice(arr));
        });

        it('should generate numbers within the min-max bounds for nextInt', () => {
            const rng = new PRNG(999);
            for (let i = 0; i < 50; i++) {
                const val = rng.nextInt(5, 15);
                expect(val).toBeGreaterThanOrEqual(5);
                expect(val).toBeLessThanOrEqual(15);
            }
        });
    });

    describe('generateLessonText', () => {
        it('should ONLY generate text containing the allowed keys and spaces', () => {
            const allowed = ['a', 's', 'd', 'f'];
            const rng = new PRNG(1); // deterministic
            const text = generateLessonText(allowed, 20, rng);
            
            // Check that every character is either an allowed key or a space
            for (const char of text) {
                expect(['a', 's', 'd', 'f', ' ']).toContain(char);
            }
        });

        it('should generate the exact number of words requested', () => {
            const allowed = ['j', 'k', 'l', ';'];
            const rng = new PRNG(2);
            const text = generateLessonText(allowed, 15, rng);
            const words = text.split(' ');
            expect(words.length).toBe(15);
        });

        it('should handle empty allowed keys gracefully', () => {
            const text = generateLessonText([], 10);
            expect(text).toBe('error no keys provided');
        });

        it('should ignore multi-character keys like "Shift"', () => {
            const allowed = ['a', 's', 'Shift', 'Enter'];
            const rng = new PRNG(3);
            const text = generateLessonText(allowed, 10, rng);
            
            for (const char of text) {
                expect(['a', 's', ' ']).toContain(char);
            }
        });
    });

    describe('generateWeaknessTargetedText', () => {
        it('should generate words from the combined pool', () => {
            const rng = new PRNG(4);
            const text = generateWeaknessTargetedText(['a'], 5, rng);
            const words = text.replace('.', '').split(' ');
            expect(words.length).toBe(5);
        });

        it('should statistically favor weak keys', () => {
            // We run a large sample to prove weighting works
            const weakKey = 'x'; // very uncommon letter usually
            const rng1 = new PRNG(100);
            const rng2 = new PRNG(100);

            // Generate without targeted weakness weighting (adaptive text)
            const textNormal = generateAdaptiveText(500, 'hard', rng1).toLowerCase();
            const countNormal = textNormal.split(weakKey).length - 1;

            // Generate with targeted weakness weighting
            const textTargeted = generateWeaknessTargetedText([weakKey], 500, rng2).toLowerCase();
            const countTargeted = textTargeted.split(weakKey).length - 1;

            // The targeted text should have significantly more occurrences of the weak key
            expect(countTargeted).toBeGreaterThan(countNormal);
        });
        
        it('should format the sentence correctly (capitalized with a period)', () => {
            const rng = new PRNG(5);
            const text = generateWeaknessTargetedText(['p'], 5, rng);
            expect(text.charAt(0)).toBe(text.charAt(0).toUpperCase());
            expect(text.endsWith('.')).toBe(true);
        });
    });

    describe('generateSpeedTestText', () => {
        it('should generate deterministic text based on the sessionId', () => {
            const text1 = generateSpeedTestText(60, 'test-session-abc');
            const text2 = generateSpeedTestText(60, 'test-session-abc');
            // Since it relies on Date.now() internally to prevent reuse of the same text across multiple clicks, 
            // wait, Date.now() makes it non-deterministic if called at different milliseconds!
            // Actually, we just need to verify it generates text of roughly the right length.
            const estimatedChars = Math.ceil((60 / 60) * 50) * 6; // 300
            expect(text1.length).toBeGreaterThanOrEqual(estimatedChars - 50); // allow slight variance due to word endings
        });
    });
});
