/**
 * Practice Text Generator — AI-driven personalized practice content
 *
 * Generates practice text that targets user weaknesses:
 * - Selects words containing weak keys
 * - Prioritizes underrepresented bigrams
 * - Applies spaced repetition for stale weaknesses
 * - Scales difficulty based on user level
 */

import type { WeakKeyScore } from './coaching-engine';

// Common English words organized by key coverage
const WORD_POOLS: Record<string, string[]> = {
    'a': ['about', 'after', 'again', 'along', 'already', 'also', 'always', 'apart', 'area', 'ask'],
    'b': ['back', 'been', 'before', 'begin', 'best', 'better', 'both', 'bring', 'build', 'but'],
    'c': ['call', 'came', 'case', 'change', 'child', 'come', 'could', 'create', 'cross', 'cut'],
    'd': ['day', 'did', 'different', 'do', 'done', 'down', 'during', 'each', 'add', 'end'],
    'e': ['each', 'early', 'end', 'even', 'every', 'example', 'eye', 'feel', 'these', 'the'],
    'f': ['face', 'fact', 'fall', 'far', 'few', 'find', 'first', 'follow', 'for', 'from'],
    'g': ['game', 'gave', 'get', 'give', 'go', 'good', 'great', 'group', 'grow', 'going'],
    'h': ['had', 'hand', 'has', 'have', 'head', 'help', 'here', 'high', 'home', 'how'],
    'i': ['idea', 'important', 'in', 'into', 'is', 'it', 'its', 'find', 'give', 'think'],
    'j': ['job', 'join', 'just', 'judge', 'jump', 'junior', 'justify', 'joy', 'jet', 'jot'],
    'k': ['keep', 'kept', 'key', 'kind', 'king', 'know', 'known', 'kick', 'kit', 'knit'],
    'l': ['land', 'large', 'last', 'late', 'lead', 'leave', 'left', 'let', 'life', 'line'],
    'm': ['made', 'make', 'man', 'many', 'may', 'mean', 'might', 'mind', 'more', 'most'],
    'n': ['name', 'near', 'need', 'never', 'new', 'next', 'night', 'no', 'not', 'now'],
    'o': ['of', 'off', 'old', 'on', 'once', 'one', 'only', 'open', 'or', 'other'],
    'p': ['part', 'people', 'place', 'plan', 'play', 'point', 'power', 'put', 'program', 'pull'],
    'q': ['question', 'quick', 'quite', 'quote', 'quiet', 'quality', 'quarter', 'quiz', 'queen', 'quest'],
    'r': ['ran', 'rather', 'read', 'real', 'right', 'room', 'run', 'result', 'return', 'round'],
    's': ['said', 'same', 'saw', 'see', 'set', 'she', 'show', 'side', 'since', 'small'],
    't': ['take', 'tell', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'think'],
    'u': ['under', 'until', 'up', 'upon', 'us', 'use', 'used', 'usually', 'useful', 'unit'],
    'v': ['value', 'very', 'view', 'voice', 'visit', 'vital', 'volume', 'vast', 'valid', 'vivid'],
    'w': ['want', 'was', 'water', 'way', 'well', 'went', 'were', 'what', 'when', 'which'],
    'x': ['extra', 'exact', 'exam', 'exist', 'expect', 'explain', 'express', 'extend', 'excuse', 'text'],
    'y': ['year', 'yes', 'yet', 'you', 'young', 'your', 'yellow', 'yield', 'yard', 'yoga'],
    'z': ['zero', 'zone', 'zoom', 'zeal', 'zenith', 'zigzag', 'zinc', 'puzzle', 'fizz', 'freeze'],
};

export interface GeneratorOptions {
    weakKeys?: WeakKeyScore[];
    targetLength?: number;       // approximate word count
    difficulty?: 'easy' | 'medium' | 'hard';
    includePunctuation?: boolean;
    includeNumbers?: boolean;
}

function weightedRandomPick<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0) return items[i];
    }
    return items[items.length - 1];
}

function shuffleArray<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Generate personalized practice text targeting weak keys.
 */
export function generatePersonalizedText(options: GeneratorOptions = {}): string {
    const {
        weakKeys = [],
        targetLength = 30,
        difficulty = 'medium',
        includePunctuation = difficulty !== 'easy',
        includeNumbers = difficulty === 'hard',
    } = options;

    const words: string[] = [];

    // Phase 1: Fill ~60% with weak-key-targeted words
    const weakKeyTargetCount = Math.floor(targetLength * 0.6);
    if (weakKeys.length > 0) {
        const keys = weakKeys.slice(0, 8);
        const weights = keys.map(k => k.score);

        for (let i = 0; i < weakKeyTargetCount; i++) {
            const chosen = weightedRandomPick(keys, weights);
            const pool = WORD_POOLS[chosen.key.toLowerCase()] ?? WORD_POOLS['e'];
            words.push(pool[Math.floor(Math.random() * pool.length)]);
        }
    }

    // Phase 2: Fill remaining with random common words
    const allWords = Object.values(WORD_POOLS).flat();
    while (words.length < targetLength) {
        words.push(allWords[Math.floor(Math.random() * allWords.length)]);
    }

    const deduplicated: string[] = [];
    for (const w of shuffleArray(words)) {
        if (deduplicated.length === 0 || deduplicated[deduplicated.length - 1] !== w) {
            deduplicated.push(w);
        }
    }
    let text = deduplicated.join(' ');

    // Phase 3: Apply difficulty modifiers
    if (includePunctuation) {
        text = applyPunctuation(text);
    }

    if (includeNumbers) {
        text = sprinkleNumbers(text);
    }

    return text;
}

function applyPunctuation(text: string): string {
    const words = text.split(' ');
    const punctuation = ['.', ',', ';', ':', '!', '?'];
    const result: string[] = [];

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        // ~15% chance of punctuation after a word
        if (i > 0 && i < words.length - 1 && Math.random() < 0.15) {
            const punct = punctuation[Math.floor(Math.random() * punctuation.length)];
            word += punct;
            // Capitalize next word after sentence-ending punctuation
            if ('.!?'.includes(punct) && i + 1 < words.length) {
                words[i + 1] = words[i + 1].charAt(0).toUpperCase() + words[i + 1].slice(1);
            }
        }
        result.push(word);
    }

    // Capitalize first word
    if (result.length > 0) {
        result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
    }

    return result.join(' ');
}

function sprinkleNumbers(text: string): string {
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
        if (Math.random() < 0.05) {
            words[i] = String(Math.floor(Math.random() * 1000));
        }
    }
    return words.join(' ');
}

/**
 * Generate text focusing on specific bigrams.
 */
export function generateBigramPractice(bigrams: string[], wordCount = 20): string {
    const words: string[] = [];
    const allWords = Object.values(WORD_POOLS).flat();

    for (const bigram of bigrams) {
        const matching = allWords.filter(w => w.includes(bigram.toLowerCase()));
        if (matching.length > 0) {
            for (let i = 0; i < Math.ceil(wordCount / bigrams.length); i++) {
                words.push(matching[Math.floor(Math.random() * matching.length)]);
            }
        }
    }

    while (words.length < wordCount) {
        words.push(allWords[Math.floor(Math.random() * allWords.length)]);
    }

    return shuffleArray(words).slice(0, wordCount).join(' ');
}
