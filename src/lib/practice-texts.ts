// Curated practice texts for various modes, vastly expanded to prevent repetition.
import { useSettingsStore } from '@/stores/settings-store';
import { enLocale } from './locales/en';
import { esLocale } from './locales/es';

function getLocale() {
    if (typeof window !== 'undefined') {
        const state = useSettingsStore.getState();
        if (state?.settings?.language === 'es') {
            return esLocale;
        }
    }
    return enLocale;
}

// --- Helper Generators ---

// A simple determininstic pseudo-random number generator to support seed tracking
export class PRNG {
    private seed: number;

    constructor(seed?: number) {
        this.seed = seed ?? Math.floor(Math.random() * 2147483647);
    }

    // Returns a float between 0 and 1
    next(): number {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    choice<T>(array: T[]): T {
        return array[Math.floor(this.next() * array.length)];
    }

    shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
}

// Global instance for unseeded general calls, initialized with random seed
let globalPrng = new PRNG();

// Generate text emphasizing specific weak keys
export function generateWeaknessTargetedText(weakKeys: string[], wordCount: number, prng: PRNG = globalPrng): string {
    const words: string[] = [];
    
    // Combine word banks
    const locale = getLocale();
    const pool = [...locale.commonWords, ...locale.advancedWords];
    
    // Create a heavily weighted pool where words containing weak keys appear more often
    const weightedPool: string[] = [];
    
    pool.forEach(word => {
        // Base weight is 1
        let weight = 1;
        const lowerWord = word.toLowerCase();
        
        // Add weight for each weak key present
        weakKeys.forEach(key => {
            if (lowerWord.includes(key.toLowerCase())) {
                // If it's a weak key, make this word 5x more likely to be picked per occurrence
                weight += 5 * (lowerWord.split(key.toLowerCase()).length - 1);
            }
        });
        
        for (let i = 0; i < weight; i++) {
            weightedPool.push(word);
        }
    });

    for (let i = 0; i < wordCount; i++) {
        words.push(prng.choice(weightedPool));
    }
    
    // Format
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
}

export function generateAdaptiveText(wordCount: number, difficulty: 'easy' | 'medium' | 'hard', prng: PRNG = globalPrng): string {
    const words: string[] = [];
    const { commonWords, advancedWords, shortSentences } = getLocale();
    const pool = difficulty === 'easy' ? commonWords : 
                 difficulty === 'medium' ? [...commonWords, ...advancedWords] : 
                 [...advancedWords, ...shortSentences];
    for (let i = 0; i < wordCount; i++) words.push(prng.choice(pool));
    return words.join(' ');
}

export function generateRandomText(wordCount: number, prng: PRNG = globalPrng): string {
    const text = generateAdaptiveText(wordCount, 'medium', prng);
    return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

export function getRandomQuote(prng: PRNG = globalPrng): string {
    return prng.choice(getLocale().quotes);
}

export function getRandomSnippet(prng: PRNG = globalPrng): string {
    return prng.choice(getLocale().programmingSnippets);
}

export function getRandomParagraph(prng: PRNG = globalPrng): string {
    return prng.choice(getLocale().paragraphs);
}

export function getRandomShortSentence(prng: PRNG = globalPrng): string {
    return prng.choice(getLocale().shortSentences);
}

// Speed tests should use guaranteed non-repeating chunks where possible
export function generateSpeedTestText(durationSeconds: number, sessionId: string): string {
    // Generate a crude numeric seed from a string
    let numericalSeed = 0;
    for(let i = 0; i < sessionId.length; i++) {
        numericalSeed = (numericalSeed * 31 + sessionId.charCodeAt(i)) % 2147483647;
    }
    
    const prng = new PRNG(numericalSeed + Date.now()); // Date.now ensures fresh pool per click

    const estimatedWords = Math.ceil((durationSeconds / 60) * 50);
    const estimatedChars = estimatedWords * 6;

    let text = '';
    
    // We want paragraphs or quotes rather than random word salad for a true speed test
    while (text.length < estimatedChars) {
        const rand = prng.next();
        if (rand > 0.6) {
            text += getRandomQuote(prng) + ' ';
        } else if (rand > 0.3) {
            text += getRandomParagraph(prng) + ' ';
        } else {
            text += getRandomShortSentence(prng) + ' ';
        }
    }

    return text.trim();
}
