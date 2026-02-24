'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame, Target, Clock, Zap } from 'lucide-react';
import { levenshteinDistance } from '@/lib/algorithms/levenshtein';
import { useMemo } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';

export function TypingStats({
    targetWpm,
    expectedText,
    typedText,
    remainingTime,
    className,
}: {
    readonly targetWpm?: number;
    readonly expectedText?: string;
    readonly typedText?: string;
    readonly remainingTime?: number | null;
    readonly className?: string;
}) {
    const { getWpm, getAccuracy, getElapsedTime } = useTypingStore();
    const { game } = useGameStore();

    const wpm = getWpm();
    const accuracy = getAccuracy();
    const elapsedTime = getElapsedTime();
    const combo = game.combo;
    const multiplier = game.multiplier;

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

    return (
        <div className={cn('flex flex-wrap justify-center gap-4', className)}>
            {/* WPM */}
            <StatCard
                icon={<Zap className="w-5 h-5" />}
                label="WPM"
                value={wpm}
                color={getWpmColor(wpm)}
            />

            {/* Accuracy */}
            <StatCard
                icon={<Target className="w-5 h-5" />}
                label="Accuracy"
                value={`${accuracy}%`}
                color={getAccuracyColor(accuracy)}
            />

            {/* Pace (if target set) */}
            {targetWpm && (
                <StatCard
                    icon={<Clock className="w-5 h-5" />}
                    label="Pace"
                    value={`${wpm >= targetWpm ? '+' : ''}${Math.round(wpm - targetWpm)}`}
                    color={wpm >= targetWpm ? 'text-green-400' : 'text-red-400'}
                />
            )}

            {/* Combo */}
            <ComboDisplay combo={combo} multiplier={multiplier} />

            {/* Time */}
            <StatCard
                icon={<Clock className="w-5 h-5" />}
                label={remainingTime !== null && remainingTime !== undefined ? 'Remaining' : 'Time'}
                value={formatTime(remainingTime ?? elapsedTime)}
                color="text-blue-400"
            />

            {/* Error Breakdown */}
            {(expectedText && typedText) && (
                <div className="w-full flex justify-center gap-4 mt-2 text-xs text-muted-foreground bg-white/5 rounded-lg p-2 border border-white/5">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        Sub: {errorBreakdown.substitutions}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500/50" />
                        Miss: {errorBreakdown.deletions}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500/50" />
                        Extra: {errorBreakdown.insertions}
                    </span>
                    <span className="ml-2 opacity-50">
                        (Edit Dist: {levenshteinDistance(typedText, expectedText.slice(0, typedText.length)).distance})
                    </span>
                </div>
            )}
        </div>
    );
}

interface StatCardProps {
    readonly icon: React.ReactNode;
    readonly label: string;
    readonly value: string | number;
    readonly color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-white/3 rounded-lg border border-white/10 backdrop-blur-xl shadow-lg">
            <div className={cn('p-2 rounded-lg bg-background/50 backdrop-blur', color)}>
                {icon}
            </div>
            <div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className={cn('text-xl font-bold', color)}>{value}</div>
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
