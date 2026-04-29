'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame, Target, Clock, Zap } from 'lucide-react';
import { levenshteinDistance } from '@/lib/algorithms/levenshtein';
import { memo, useMemo, useState, useEffect } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';

export const TypingStats = memo(function TypingStats({
    targetWpm,
    expectedText,
    typedText,
    remainingTime,
    flowScore,
    className,
}: {
    readonly targetWpm?: number;
    readonly expectedText?: string;
    readonly typedText?: string;
    readonly remainingTime?: number | null;
    readonly flowScore?: number;
    readonly className?: string;
}) {
    const { getWpm, getAccuracy, getElapsedTime } = useTypingStore();
    const { game } = useGameStore();

    const wpm = getWpm();
    const accuracy = getAccuracy();
    const elapsedTime = getElapsedTime();
    const combo = game.combo;
    const multiplier = game.multiplier;

    // Force re-render every second to update timer display
    const startTime = useTypingStore(s => s.state.startTime);
    const isComplete = useTypingStore(s => s.state.isComplete);
    const isPaused = useTypingStore(s => s.state.isPaused);
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        if (!startTime || isComplete || isPaused) return;
        const interval = setInterval(() => forceUpdate(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, [startTime, isComplete, isPaused]);

    // Calculate Detailed Errors
    const errorBreakdown = useMemo(() => {
        if (!expectedText || !typedText) return { substitutions: 0, insertions: 0, deletions: 0 };
        const result = levenshteinDistance(typedText, expectedText.slice(0, typedText.length)); // Compare what was typed vs expected up to that point
        return result.breakdown;
    }, [expectedText, typedText]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const displayWpm = wpm > 0 ? wpm : '--';
    const displayAcc = wpm > 0 ? `${accuracy}%` : '--%';
    const displayTime = formatTime(remainingTime ?? elapsedTime);

    return (
        <div className={cn('flex flex-wrap justify-center items-center gap-8 mb-4 font-mono text-2xl transition-opacity duration-300 tabular-nums', className)}>
            {/* Time / Pace */}
            <div className="flex items-center gap-2">
                <span className="text-primary font-bold">{displayTime}</span>
            </div>

            {/* WPM */}
            <div className="text-muted-foreground flex items-baseline gap-2">
                <motion.span 
                    key={wpm} 
                    initial={{ opacity: 0.5, y: -2 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn('font-bold', getWpmColor(wpm))}
                >
                    {displayWpm}
                </motion.span>
                <span className="text-xs opacity-40 uppercase tracking-widest">wpm</span>
            </div>

            {/* Accuracy */}
            <div className="text-muted-foreground flex items-baseline gap-2">
                <motion.span 
                    key={accuracy} 
                    initial={{ opacity: 0.5, y: -2 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn('font-bold', getAccuracyColor(accuracy))}
                >
                    {displayAcc}
                </motion.span>
                <span className="text-xs opacity-40 uppercase tracking-widest">acc</span>
            </div>

            {/* Flow Score */}
            {flowScore !== undefined && flowScore > 0 && (
                <div className="text-muted-foreground flex items-baseline gap-2">
                    <motion.span 
                        key={flowScore}
                        initial={{ opacity: 0.5, y: -2 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className={cn('font-bold', 
                            flowScore >= 80 ? 'text-primary' : 
                            flowScore >= 60 ? 'text-secondary' : 'text-orange-400'
                        )}
                    >
                        {flowScore}
                    </motion.span>
                    <span className="text-xs opacity-40 uppercase tracking-widest">flow</span>
                </div>
            )}

            {/* Target Pace */}
            {targetWpm && (
                <div className="text-muted-foreground flex items-baseline gap-2 text-sm">
                    <span className={wpm >= targetWpm ? 'text-green-400' : 'text-red-400'}>
                        {wpm >= targetWpm ? '+' : ''}{Math.round(wpm - targetWpm)}
                    </span>
                    <span className="opacity-50">pace</span>
                </div>
            )}
            
            {/* Combo */}
            {combo >= 10 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-baseline gap-2 text-orange-400"
                >
                    <Flame className="w-5 h-5 animate-pulse" />
                    <span className="font-bold">{combo}</span>
                    {multiplier > 1 && <span className="text-sm">×{multiplier}</span>}
                </motion.div>
            )}
        </div>
    );
});

interface StatCardProps {
    readonly icon: React.ReactNode;
    readonly label: string;
    readonly value: string | number;
    readonly color: string;
    readonly testId?: string;
}

function StatCard({ icon, label, value, color, testId }: StatCardProps) {
    const finalTestId = testId || label.toLowerCase();
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-white/3 rounded-lg border border-white/10 backdrop-blur-xl shadow-lg">
            <div className={cn('p-2 rounded-lg bg-background/50 backdrop-blur', color)}>
                {icon}
            </div>
            <div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className={cn('text-xl font-bold', color)} data-testid={finalTestId}>{value}</div>
            </div>
        </div>
    );
}


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
