'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';

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
        <div className={cn('flex justify-center items-center gap-12 mb-8 font-mono text-3xl tabular-nums text-gray-500', className)}>
            <div className="flex items-baseline gap-2">
                <span data-testid="timer" className="text-gray-200 font-bold">{displayTime}</span>
                <span className="text-xs uppercase tracking-widest opacity-40">time</span>
            </div>

            <div className="flex items-baseline gap-2">
                <span data-testid="wpm" className="text-gray-200 font-bold">{displayWpm}</span>
                <span className="text-xs opacity-40 uppercase tracking-widest">wpm</span>
            </div>

            <div className="flex items-baseline gap-2">
                <span data-testid="accuracy" className="text-gray-200 font-bold">{displayAcc}</span>
                <span className="text-xs opacity-40 uppercase tracking-widest">acc</span>
            </div>
        </div>
    );
});

interface ComboDisplayProps {
    readonly combo: number;
    readonly multiplier: number;
}

function ComboDisplay({ combo, multiplier }: ComboDisplayProps) {
    const isOnFire = combo >= 10;

    return (
        <div
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur',
                // CSS-only pulse on fire — runs on compositor, no JS RAF
                isOnFire
                    ? 'bg-linear-to-r from-orange-500/20 to-red-500/20 border-orange-500/50 animate-pulse'
                    : 'bg-card/50'
            )}
        >
            <div className={cn(
                'p-2 rounded-lg',
                isOnFire ? 'bg-orange-500/20 text-orange-400' : 'bg-background text-muted-foreground'
            )}>
                <Flame className="w-5 h-5" />
            </div>
            <div>
                <div className="text-xs text-muted-foreground">Combo</div>
                <div className="flex items-baseline gap-2">
                    <motion.span
                        key={combo}
                        className={cn(
                            'text-xl font-bold',
                            isOnFire ? 'text-orange-400' : 'text-foreground'
                        )}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                    >
                        {combo}
                    </motion.span>
                    {multiplier > 1 && (
                        <span className="text-sm font-medium text-yellow-400">
                            ×{multiplier}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function getWpmColor(wpm: number): string {
    if (wpm >= 60) return 'text-green-400';
    if (wpm >= 40) return 'text-yellow-400';
    if (wpm >= 20) return 'text-orange-400';
    return 'text-muted-foreground';
}

function getAccuracyColor(accuracy: number): string {
    if (accuracy >= 95) return 'text-green-400';
    if (accuracy >= 85) return 'text-yellow-400';
    if (accuracy >= 70) return 'text-orange-400';
    return 'text-red-400';
}