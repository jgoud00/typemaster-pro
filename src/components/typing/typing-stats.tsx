'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';

export const TypingStats = memo(function TypingStats({
    remainingTime,
    className,
}: {
    readonly remainingTime?: number | null;
    readonly className?: string;
}) {
    // FIX: Replaced `useTypingStore()` (full store subscription — re-renders on every
    // keystroke) with granular selectors for the three fields needed to gate the interval.
    const startTime = useTypingStore(s => s.state.startTime);
    const isComplete = useTypingStore(s => s.state.isComplete);
    const isPaused = useTypingStore(s => s.state.isPaused);

    // FIX: Computed values (wpm, accuracy, elapsedTime) are read via getState() inside
    // a 500ms interval — zero reactive subscriptions, no per-keystroke re-renders.
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        // Snapshot once immediately when typing starts
        if (startTime && !isComplete && !isPaused) {
            const s = useTypingStore.getState();
            setWpm(s.getWpm());
            setAccuracy(s.getAccuracy());
            setElapsedTime(s.getElapsedTime());
        }

        if (!startTime || isComplete || isPaused) return;

        const interval = setInterval(() => {
            const s = useTypingStore.getState();
            setWpm(s.getWpm());
            setAccuracy(s.getAccuracy());
            setElapsedTime(s.getElapsedTime());
        }, 500);

        return () => clearInterval(interval);
    }, [startTime, isComplete, isPaused]);

    const game = useGameStore(s => s.game);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const displayWpm = wpm > 0 ? wpm : (startTime ? 0 : '--');  // eslint-disable-line @typescript-eslint/no-unused-vars -- used in JSX
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
        <motion.div
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur',
                isOnFire
                    ? 'bg-linear-to-r from-orange-500/20 to-red-500/20 border-orange-500/50'
                    : 'bg-card/50'
            )}
            animate={isOnFire ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
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
        </motion.div>
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