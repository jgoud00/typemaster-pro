import {describe,it,expect} from 'vitest';
import {assessAdaptiveKeys,generateProgressiveText,INITIAL_LETTERS,LETTER_ORDER} from './adaptive-practice';
import {PRNG} from './practice-texts';

describe('adaptive practice', () => {
 it('starts with six letters and focuses an unmeasured letter', () => {
   const plan=assessAdaptiveKeys({});
   expect(plan.letters).toBe('enitrl');expect(plan.unlockedCount).toBe(INITIAL_LETTERS);expect(plan.focusKey).toBe('e');
 });
 it('requires both sufficient evidence and accuracy before unlocking a new letter', () => {
   const stats=Object.fromEntries([...LETTER_ORDER.slice(0,6)].map(key => [key,{totalAttempts:20,errors:0,averageSpeed:300,totalHesitation:6000}]));
   expect(assessAdaptiveKeys(stats).unlockedCount).toBe(7);
   expect(assessAdaptiveKeys(stats).focusKey).toBe('s');
   stats.e.totalAttempts=2;expect(assessAdaptiveKeys(stats).unlockedCount).toBe(6);
   stats.e.totalAttempts=20;stats.e.errors=2;expect(assessAdaptiveKeys(stats).unlockedCount).toBe(6);
   stats.e.errors=0;stats.e.averageSpeed=500;expect(assessAdaptiveKeys(stats).unlockedCount).toBe(6);
 });
 it('keeps previously unlocked letters available after a poorer session', () => {
   expect(assessAdaptiveKeys({},12).unlockedCount).toBe(12);
 });
 it('generates seeded practice with only unlocked letters and reliable focus coverage', () => {
   const text=generateProgressiveText('enitrl','r',40,new PRNG(42));
   expect(text).toBe(generateProgressiveText('enitrl','r',40,new PRNG(42)));
   expect(text.split(' ')).toHaveLength(40);
   expect([...text].every(key => 'enitrl '.includes(key))).toBe(true);
   expect(text.split(' ').filter(word => word.includes('r')).length).toBeGreaterThanOrEqual(24);
 });
 it('handles empty and restricted alphabets without hanging', () => {
   expect(generateProgressiveText('','x')).toBe('');
   expect(generateProgressiveText('q','q',4,new PRNG(1))).toBe('qqq qqq qqq qqq');
   expect(generateProgressiveText('enitrl','e',0)).toBe('');
 });
});
