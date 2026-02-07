// Curated practice texts for various modes

export const commonWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
];

export const quotes = [
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Stay hungry, stay foolish.",
    "Life is what happens when you're busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "The only impossible journey is the one you never begin.",
    "In the middle of difficulty lies opportunity.",
    "What you get by achieving your goals is not as important as what you become.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your time is limited, don't waste it living someone else's life.",
    "The way to get started is to quit talking and begin doing.",
    "Don't be afraid to give up the good to go for the great.",
];

export const programmingSnippets = [
    "function greet(name) { return `Hello, ${name}!`; }",
    "const sum = (a, b) => a + b;",
    "if (condition) { doSomething(); } else { doOther(); }",
    "for (let i = 0; i < array.length; i++) { console.log(array[i]); }",
    "const user = { name: 'John', age: 30, city: 'New York' };",
    "async function fetchData() { const response = await fetch(url); return response.json(); }",
    "try { riskyOperation(); } catch (error) { handleError(error); }",
    "const [first, ...rest] = array;",
    "export default function Component({ props }) { return <div>{props.children}</div>; }",
    "useState, useEffect, useCallback, useMemo, useRef",
];

export const paragraphs = [
    "Touch typing is the ability to use muscle memory to find keys without looking at the keyboard. The fingers rest on the home row keys and reach for other keys from there. This skill dramatically increases typing speed and reduces errors.",

    "Programming requires not just knowledge of syntax, but also the ability to think logically and solve problems systematically. Good code is readable, maintainable, and efficient. Always write code as if the person who will maintain it is a violent psychopath who knows where you live.",

    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice. It helps develop muscle memory for all keys on the keyboard.",

    "Learning to type efficiently is one of the most valuable skills in the modern digital age. Whether you are writing emails, creating documents, or coding software, the ability to type quickly and accurately saves countless hours over a lifetime.",
];

// Generate random text from common words
export function generateRandomText(wordCount: number): string {
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
        words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
    }
    // Capitalize first word and add period at end
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
}

// Get random quote
export function getRandomQuote(): string {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Get random programming snippet
export function getRandomSnippet(): string {
    return programmingSnippets[Math.floor(Math.random() * programmingSnippets.length)];
}

// Get random paragraph
export function getRandomParagraph(): string {
    return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

// Generate text for speed test based on duration
export function generateSpeedTestText(durationSeconds: number): string {
    // Estimate ~40 WPM average, 5 chars per word
    const estimatedWords = Math.ceil((durationSeconds / 60) * 50); // 50 WPM max
    const estimatedChars = estimatedWords * 6;

    let text = '';
    while (text.length < estimatedChars) {
        if (Math.random() > 0.3) {
            text += getRandomQuote() + ' ';
        } else {
            text += generateRandomText(20) + ' ';
        }
    }

    return text.trim();
}
