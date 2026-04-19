import { useProgressStore } from '@/stores/progress-store';
import { useAnalyticsStore } from '@/stores/analytics-store';

export function generateWeeklySummary(): string {
    const progress = useProgressStore.getState().progress;
    const analytics = useAnalyticsStore.getState();

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    const recentRecords = progress.records?.filter(r => r.timestamp >= oneWeekAgo) || [];
    const sessions = recentRecords.length;
    const keystrokes = recentRecords.reduce((acc, r) => acc + (r.wpm * 5), 0);
    
    const bigrams = Object.entries(analytics.bigramStats || {}).map(([key, stat]) => ({
        key,
        accuracy: stat.totalAttempts > 0 ? ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100 : 100,
        attempts: stat.totalAttempts
    })).filter(b => b.key.length === 2 && b.attempts > 5);
    
    bigrams.sort((a, b) => a.accuracy - b.accuracy);
    const weakest = bigrams.length > 0 ? bigrams[0] : { key: 'N/A', accuracy: 0 };
    const strongest = bigrams.length > 0 ? bigrams[bigrams.length - 1] : { key: 'N/A', accuracy: 100 };

    const sortedChronological = [...recentRecords].sort((a, b) => a.timestamp - b.timestamp);
    let diffStr = "Your WPM remained relatively stable.";
    
    if (sortedChronological.length >= 2) {
        const startWpm = sortedChronological[0].wpm;
        const endWpm = sortedChronological[sortedChronological.length - 1].wpm;
        if (endWpm > startWpm) {
            const pct = Math.round(((endWpm - startWpm) / startWpm) * 100);
            diffStr = `Your WPM improved from ${startWpm} to ${endWpm} (+${pct}%).`;
        } else if (endWpm < startWpm) {
            diffStr = `Your WPM varied from ${startWpm} to ${endWpm} this week.`;
        }
    }

    if (sessions === 0) {
        return "No typing sessions tracked over the last 7 days. Return to the practice flow to gather new statistics and generate your next AI-tailored summary.";
    }

    return `This week you typed ${Math.round(keystrokes).toLocaleString()} keystrokes across ${sessions} sessions. ` +
           `Your weakest bigram was '${weakest.key}' at ${Math.round(weakest.accuracy)}% accuracy — focus here next week. ` +
           `${diffStr} Strongest confirmed improvement zone: the '${strongest.key}' combination.`;
}
