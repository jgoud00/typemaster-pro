/**
 * Analytics Recording Facade
 *
 * Thin boundary between the event system (typing-listeners) and the
 * analytics internals (analytics-store + ML worker). Listeners call
 * this single function instead of reaching into store internals.
 */
import { useAnalyticsStore } from '@/stores/analytics-store';
import { getMLProxy } from '@/workers/ml-worker-instance';
import type { KeystrokeContext } from '@/lib/events/typing-bus';

export function recordTypingKeystroke(ctx: KeystrokeContext): void {
    const proxy = getMLProxy();
    useAnalyticsStore.getState().recordKeystroke(
        {
            key: ctx.key,
            expected: ctx.expectedChar,
            isCorrect: ctx.isCorrect,
            timestamp: ctx.timestamp,
            hesitationMs: ctx.delayFromLastKey,
            finger: ctx.finger,
            previousKey: ctx.previousKey,
        },
        { wpm: ctx.wpm, accuracy: ctx.accuracy },
        proxy ?? null,
    );
}
