import type { KeyStat } from '@/types';
import { enLocale } from './locales/en';
import { PRNG } from './practice-texts';

export const LETTER_ORDER = 'enitrlsauodchmfpbgvwyxkqjz';
export const INITIAL_LETTERS = 6;
export const MASTERY_ATTEMPTS = 20;
export const MASTERY_ACCURACY = 95;
export const TARGET_WPM = 30;

export function assessAdaptiveKeys(stats: Record<string, KeyStat>, unlockedCount = INITIAL_LETTERS) {
  const count = Math.max(INITIAL_LETTERS, Math.min(LETTER_ORDER.length, Math.floor(unlockedCount)));
  const keys = [...LETTER_ORDER.slice(0, count)].map(key => {
    const stat = stats[key];
    const attempts = stat?.totalAttempts || 0;
    const accuracy = attempts ? Math.max(0, 100 * (1 - stat.errors / attempts)) : 0;
    const speed = stat?.averageSpeed || 0;
    const wpm = speed > 0 ? 12000 / speed : 0;
    const mastered = attempts >= MASTERY_ATTEMPTS && accuracy >= MASTERY_ACCURACY && wpm >= TARGET_WPM;
    const confidence = Math.min(1, attempts / MASTERY_ATTEMPTS);
    const readiness = confidence * Math.min(1, accuracy / MASTERY_ACCURACY) * Math.min(1, wpm / TARGET_WPM);
    return {key, attempts, accuracy, wpm, mastered, readiness};
  });
  const nextCount = keys.every(key => key.mastered) ? Math.min(LETTER_ORDER.length, count + 1) : count;
  const focusKey = nextCount > count ? LETTER_ORDER[count] : [...keys].sort((a,b) => a.readiness - b.readiness)[0].key;
  return {keys, unlockedCount: nextCount, letters: LETTER_ORDER.slice(0, nextCount), focusKey};
}

const starterWords = ['in','it','let','lit','line','lint','little','net','nine','rent','ten','tent','tint','tire','tree','entire','enter','inlet','inner','letter','linen','reel','rein','retire','tier','tilt','tin','title','trite','still','sit','list','rest','test'];

export function generateProgressiveText(letters: string, focusKey: string, wordCount = 40, rng = new PRNG()): string {
  const allowed = new Set([...letters.toLowerCase()].filter(key => /^[a-z]$/.test(key)));
  if (!allowed.size || wordCount <= 0) return '';
  const pool = [...new Set([...starterWords, ...enLocale.commonWords, ...enLocale.advancedWords])].filter(word => /^[a-z]+$/.test(word) && [...word].every(key => allowed.has(key)));
  const focusPool = pool.filter(word => word.includes(focusKey));
  const fallback = () => {
    const keys = [...allowed];
    const vowels = keys.filter(key => 'aeiou'.includes(key));
    return [allowed.has(focusKey) ? focusKey : rng.choice(keys), rng.choice(vowels.length ? vowels : keys), rng.choice(keys)].join('');
  };
  const words: string[] = [];
  for (let i=0;i<Math.min(500, Math.floor(wordCount));i++) {
    const candidates = (i % 5 < 3 ? focusPool : pool).filter(word => word !== words.at(-1));
    words.push(candidates.length ? rng.choice(candidates) : fallback());
  }
  return words.join(' ');
}
