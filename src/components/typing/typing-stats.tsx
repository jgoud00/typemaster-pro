'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Flame, Target, Clock, Zap } from 'lucide-react';

interface TypingStatsProps {
    readonly wpm: number;
    readonly accuracy: number;
    readonly combo: number;
    readonly multiplier: number;
    readonly elapsedTime: number;
    readonly remainingTime?: number | null;
    readonly className?: string;
}

export function TypingStats({
    wpm,
    accuracy,
    combo,
    multiplier,
    elapsedTime,
    remainingTime,
    className,
}: TypingStatsProps) {
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

            {/* Combo */}
            <ComboDisplay combo={combo} multiplier={multiplier} />

            {/* Time */}
            <StatCard
                icon={<Clock className="w-5 h-5" />}
                label={remainingTime !== null ? 'Remaining' : 'Time'}
                value={formatTime(remainingTime ?? elapsedTime)}
                color="text-blue-400"
            />
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
        <div className="flex items-center gap-3 px-4 py-3 bg-card/50 rounded-lg border backdrop-blur">
            <div className={cn('p-2 rounded-lg bg-background', color)}>
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
