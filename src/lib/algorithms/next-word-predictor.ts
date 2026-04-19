import { useAnalyticsStore } from '@/stores/analytics-store';

export function predictNextChars(context: string, topN: number = 3): string[] {
    if (!context) return [];
    
    const state = useAnalyticsStore.getState();
    const trigramStats = state.trigramStats || {};
    const bigramStats = state.bigramStats || {};

    const candidates = new Map<string, { totalWeight: number, count: number }>();

    // 1. Check Trigrams (highest confidence)
    if (context.length >= 2) {
        const lastTwo = context.slice(-2);
        for (const [key, stat] of Object.entries(trigramStats)) {
            if (key.startsWith(lastTwo)) {
                const nextChar = key[2];
                const errorProb = stat.errors / stat.totalAttempts;
                if (stat.totalAttempts >= 2 && errorProb > 0.1) {
                    candidates.set(nextChar, { 
                        totalWeight: errorProb * 2, // Double weight for trigrams
                        count: 1 
                    });
                }
            }
        }
    }

    // 2. Check Bigrams (fallback)
    const lastOne = context.slice(-1);
    for (const [key, stat] of Object.entries(bigramStats)) {
        if (key.startsWith(lastOne)) {
            const nextChar = key[1];
            const errorProb = stat.errors / stat.totalAttempts;
            if (stat.totalAttempts >= 3 && errorProb > 0.1) {
                const existing = candidates.get(nextChar);
                if (existing) {
                    existing.totalWeight += errorProb;
                    existing.count++;
                } else {
                    candidates.set(nextChar, { totalWeight: errorProb, count: 1 });
                }
            }
        }
    }

    return Array.from(candidates.entries())
        .map(([char, data]) => ({ char, score: data.totalWeight / data.count }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topN)
        .map(c => c.char);
}
