import { UltimateWeaknessResult } from './types';

// Predefined corpus of common English words and sequences
const WORD_CORPUS = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'is', 'are', 'was', 'were', 'been', 'has', 'had', 'does', 'did', 'doing',
    'quickly', 'brown', 'fox', 'jumps', 'lazy', 'dog', 'always', 'never', 'sometimes', 'usually',
    'beautiful', 'morning', 'afternoon', 'night', 'water', 'fire', 'earth', 'wind', 'hello', 'world',
    'thought', 'through', 'where', 'much', 'before', 'line', 'right', 'too', 'mean', 'old',
    'any', 'same', 'tell', 'boy', 'follow', 'came', 'show', 'every', 'form', 'small',
    'set', 'put', 'end', 'does', 'another', 'well', 'large', 'must', 'big', 'even',
    'such', 'because', 'turn', 'here', 'why', 'ask', 'went', 'men', 'read', 'need'
];

/**
 * Generates natural English practice sentences targeting user specific vulnerabilities.
 * Weak bigrams (analyzed as low accuracy keys/substrings) appear substantially more
 * frequently than fully mastered keystrokes.
 */
export function generatePersonalizedLesson(weaknesses: UltimateWeaknessResult[] = []): string {
    const weakNgrams = new Set<string>();
    
    // Identify problematic keys/bigrams where accuracy < 0.8
    // Note: while weakness detector nominally tests single keys, 
    // we aggregate them into lookup ngrams.
    weaknesses.forEach(w => {
        if (w.accuracyEstimate < 0.8) {
            weakNgrams.add(w.key.toLowerCase());
        }
    });

    // Score corpus words. Words containing a weak bigram receive a 3x weight multiplier.
    const weightedWords = WORD_CORPUS.map(word => {
        let weight = 1;
        const lower = word.toLowerCase();
        
        let containsWeakness = false;
        for (const weak of weakNgrams) {
            if (lower.includes(weak)) {
                containsWeakness = true;
                break;
            }
        }
        
        if (containsWeakness) {
            weight = 3;
        }
        
        return { word, weight };
    });

    // Generate random 50-100 character sequence selecting iteratively
    let lessonText = '';
    const TARGET_LENGTH = 50 + Math.floor(Math.random() * 51); // 50 to 100 characters

    const totalWeight = weightedWords.reduce((sum, w) => sum + w.weight, 0);

    while (lessonText.length < TARGET_LENGTH) {
        let randomVal = Math.random() * totalWeight;
        let selectedWord = WORD_CORPUS[0];
        
        for (const w of weightedWords) {
            randomVal -= w.weight;
            if (randomVal <= 0) {
                selectedWord = w.word;
                break;
            }
        }
        
        lessonText += (lessonText.length > 0 ? ' ' : '') + selectedWord;
    }

    return lessonText;
}
