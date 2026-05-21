'use client';

import { cn } from '@/lib/utils';
import { memo, useState, useEffect } from 'react';
import { useTypingStore } from '@/stores/typing-store';

// Module-scope selectors — stable references, never recreated per render.
const selectStartTime = (s: ReturnType<typeof useTypingStore.getState>) => s.state.startTime;
const selectIsComplete = (s: ReturnType<typeof useTypingStore.getState>) => s.state.isComplete;
const selectIsPaused = (s: ReturnType<typeof useTypingStore.getState>) => s.state.isPaused;

export const TypingStats = memo(function TypingStats({
    remainingTime,
    className,
}: {
    readonly remainingTime?: number | null;
    readonly className?: string;
}) {
    // Primitive selectors — re-renders only when these values change.
    const startTime = useTypingStore(selectStartTime);
    const isComplete = useTypingStore(selectIsComplete);
    const isPaused = useTypingStore(selectIsPaused);

    // Polled via interval — zero reactive subscriptions during typing.
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const active = !!startTime && !isComplete && !isPaused;
        if (!active) return;

        // Immediate read on activation — no separate eager-set path.
        const tick = () => {
            const s = useTypingStore.getState();
            setWpm(s.getWpm());
            setAccuracy(s.getAccuracy());
            setElapsedTime(s.getElapsedTime());
        };
        tick();
        const id = setInterval(tick, 500);
        return () => clearInterval(id);
    }, [startTime, isComplete, isPaused]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const displayWpm = wpm > 0 ? wpm : 0;
    const displayAcc = `${accuracy}%`;
    const displayTime = formatTime(remainingTime ?? elapsedTime);

    return (
        <div className={cn('flex justify-center items-center gap-12 mb-8 font-mono text-3xl tabular-nums text-(--color-content-muted)', className)}>
            <div className="flex items-baseline gap-2">
                <span data-testid="timer" className="text-(--color-content-primary) font-bold">{displayTime}</span>
                <span className="text-xs uppercase tracking-widest opacity-40">time</span>
            </div>

            <div className="flex items-baseline gap-2">
                <span data-testid="wpm" className="text-(--color-content-primary) font-bold">{displayWpm}</span>
                <span className="text-xs opacity-40 uppercase tracking-widest">wpm</span>
            </div>

            <div className="flex items-baseline gap-2">
                <span data-testid="accuracy" className="text-(--color-content-primary) font-bold">{displayAcc}</span>
                <span className="text-xs opacity-40 uppercase tracking-widest">acc</span>
            </div>
        </div>
    );
});
