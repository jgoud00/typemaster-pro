/**
 * Markov Chain Generator
 * 
 * Generates procedural text based on a corpus of input text.
 * Uses a bigram (or n-gram) model to predict the next word based on the current state.
 */

export class MarkovChain {
    private chain: Map<string, string[]>;
    private starts: string[];
    private order: number;

    constructor(order: number = 2) {
        this.chain = new Map();
        this.starts = [];
        this.order = order;
    }

    /**
     * Train the model with a corpus of text.
     * @param text The input text to learn from.
     */
    train(text: string): void {
        // Clean and split text into words, keeping punctuation attached for natural flow
        const words = text.match(/\b[\w']+\b|[.,!?;]/g) || [];

        if (words.length < this.order) return;

        for (let i = 0; i < words.length - this.order; i++) {
            const state = words.slice(i, i + this.order).join(' ');
            const next = words[i + this.order];

            if (i === 0 || /^[A-Z]/.test(words[i])) { // Heuristic for sentence starts
                this.starts.push(state);
            }

            if (!this.chain.has(state)) {
                this.chain.set(state, []);
            }
            this.chain.get(state)?.push(next);
        }
    }

    /**
     * Generate a sentence of approximately the given length.
     * @param minLength Minimum number of words.
     * @returns A generated string.
     */
    generate(minLength: number = 10): string {
        if (this.starts.length === 0) return "The quick brown fox jumps over the lazy dog.";

        let current = this.getRandomElement(this.starts);
        const output: string[] = current.split(' ');

        while (output.length < minLength || !/[.!?]$/.test(output[output.length - 1])) {
            const options = this.chain.get(current);

            if (!options || options.length === 0) {
                break; // Dead end
            }

            const next = this.getRandomElement(options);
            output.push(next);

            // Advance state
            const nextStateWords = output.slice(-this.order);
            current = nextStateWords.join(' ');

            // Safety break to prevent infinite loops
            if (output.length > minLength * 3) break;
        }

        return this.formatOutput(output);
    }

    private getRandomElement<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private formatOutput(words: string[]): string {
        // Simple join that fixes punctuation spacing
        return words.join(' ')
            .replace(/\s+([.,!?;])/g, '$1'); // Remove space before punctuation
    }
}
