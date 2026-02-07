'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Trophy, Clock, Target, Zap, Star, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PerformanceRecord } from '@/types';

interface LessonCompleteProps {
    record: PerformanceRecord;
    stars: number;
    isPersonalBest: boolean;
    onRestart: () => void;
    onNext: () => void;
    onHome: () => void;
}

export function LessonComplete({
    record,
    stars,
    isPersonalBest,
    onRestart,
    onNext,
    onHome,
}: LessonCompleteProps) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="w-full max-w-md mx-4 p-8 bg-card rounded-2xl border shadow-2xl"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <motion.div
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                    </motion.div>
                    <h2 className="text-2xl font-bold">Lesson Complete!</h2>
                    {isPersonalBest && (
                        <motion.p
                            className="text-green-500 font-medium mt-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            🎉 New Personal Best!
                        </motion.p>
                    )}
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3].map((starNum) => (
                        <motion.div
                            key={starNum}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{
                                opacity: starNum <= stars ? 1 : 0.3,
                                scale: 1,
                                rotate: 0
                            }}
                            transition={{ delay: 0.2 * starNum, type: 'spring' }}
                        >
                            <Star
                                className={cn(
                                    'w-12 h-12',
                                    starNum <= stars
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-muted-foreground'
                                )}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <StatItem
                        icon={<Zap className="w-5 h-5 text-blue-400" />}
                        label="Speed"
                        value={`${record.wpm} WPM`}
                    />
                    <StatItem
                        icon={<Target className="w-5 h-5 text-green-400" />}
                        label="Accuracy"
                        value={`${record.accuracy}%`}
                    />
                    <StatItem
                        icon={<Clock className="w-5 h-5 text-purple-400" />}
                        label="Time"
                        value={formatTime(record.duration)}
                    />
                    <StatItem
                        icon={<span className="text-orange-400">🔥</span>}
                        label="Max Combo"
                        value={`${record.maxCombo}`}
                    />
                </div>

                {/* Score */}
                <div className="text-center mb-8">
                    <div className="text-sm text-muted-foreground">Total Score</div>
                    <motion.div
                        className="text-4xl font-bold text-primary"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.8 }}
                    >
                        {record.score.toLocaleString()}
                    </motion.div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button onClick={onNext} className="w-full" size="lg">
                        Next Lesson
                    </Button>
                    <div className="flex gap-3">
                        <Button onClick={onRestart} variant="outline" className="flex-1">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                        <Button onClick={onHome} variant="outline" className="flex-1">
                            Home
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

interface StatItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function StatItem({ icon, label, value }: StatItemProps) {
    return (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            {icon}
            <div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-semibold">{value}</div>
            </div>
        </div>
    );
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}
