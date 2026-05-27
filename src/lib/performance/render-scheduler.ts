/**
 * Render Scheduler — Priority-based update batching
 *
 * Categorizes UI updates by priority to prevent keystroke latency:
 * - P0 (immediate): Keystroke visual feedback (<4ms budget)
 * - P1 (debounced): Stats display updates (100ms)
 * - P2 (deferred): Analytics / ML (500ms)
 * - P3 (idle): Persistence, sync (requestIdleCallback)
 */

type Priority = 0 | 1 | 2 | 3;
type Task = () => void;

interface ScheduledTask {
    task: Task;
    priority: Priority;
    scheduledAt: number;
}

// P1: 100ms debounce per key
const p1Timers = new Map<string, ReturnType<typeof setTimeout>>();

// P2: 500ms debounce per key
const p2Timers = new Map<string, ReturnType<typeof setTimeout>>();

// P3: idle callback queue
const p3Queue: Task[] = [];
let p3Scheduled = false;

/**
 * Schedule a P0 task — executes synchronously.
 * Use for: keystroke rendering, caret movement.
 */
export function scheduleImmediate(task: Task): void {
    task();
}

/**
 * Schedule a P1 task — debounced at 100ms per key.
 * Use for: WPM/accuracy display, combo counter.
 */
export function scheduleDebounced(key: string, task: Task, delayMs = 100): void {
    const existing = p1Timers.get(key);
    if (existing) clearTimeout(existing);
    p1Timers.set(key, setTimeout(() => {
        p1Timers.delete(key);
        task();
    }, delayMs));
}

/**
 * Schedule a P2 task — deferred at 500ms per key.
 * Use for: analytics recording, ML worker invocations, ngram analysis.
 */
export function scheduleDeferred(key: string, task: Task, delayMs = 500): void {
    const existing = p2Timers.get(key);
    if (existing) clearTimeout(existing);
    p2Timers.set(key, setTimeout(() => {
        p2Timers.delete(key);
        task();
    }, delayMs));
}

/**
 * Schedule a P3 task — runs during idle time.
 * Use for: IndexedDB writes, sync, cleanup.
 */
export function scheduleIdle(task: Task): void {
    p3Queue.push(task);
    if (p3Scheduled) return;
    p3Scheduled = true;

    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback((deadline) => {
            p3Scheduled = false;
            while (p3Queue.length > 0 && deadline.timeRemaining() > 2) {
                const t = p3Queue.shift();
                if (t) t();
            }
            // Re-schedule if tasks remain
            if (p3Queue.length > 0) scheduleIdle(() => {});
        });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
            p3Scheduled = false;
            const batch = p3Queue.splice(0, 5);
            for (const t of batch) t();
            if (p3Queue.length > 0) scheduleIdle(() => {});
        }, 50);
    }
}

/**
 * Cancel all pending tasks (for cleanup/reset).
 */
export function cancelAll(): void {
    for (const timer of p1Timers.values()) clearTimeout(timer);
    for (const timer of p2Timers.values()) clearTimeout(timer);
    p1Timers.clear();
    p2Timers.clear();
    p3Queue.length = 0;
    p3Scheduled = false;
}
