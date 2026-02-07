'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Achievement } from '@/lib/achievements';
import { useAchievementStore } from '@/stores/achievement-store';
import { useConfetti } from '@/hooks/use-confetti';

export function AchievementToast() {
    const { state, clearRecentUnlock } = useAchievementStore();
    const [visible, setVisible] = useState(false);
    const [achievement, setAchievement] = useState<Achievement | null>(null);
    const { fireConfetti } = useConfetti();

    useEffect(() => {
        if (state.recentUnlock) {
            setAchievement(state.recentUnlock);
            setVisible(true);
            fireConfetti({ particleCount: 50, spread: 60 });

            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => {
                    clearRecentUnlock();
                }, 500);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [state.recentUnlock, clearRecentUnlock, fireConfetti]);

    return (
        <AnimatePresence>
            {visible && achievement && (
                <motion.div
                    className="fixed top-4 right-4 z-50"
                    initial={{ opacity: 0, x: 100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                    <div className={cn(
                        'flex items-center gap-4 p-4 rounded-xl border shadow-2xl',
                        'bg-linear-to-r from-yellow-500/20 to-orange-500/20',
                        'border-yellow-500/50 backdrop-blur-lg'
                    )}>
                        {/* Icon */}
                        <motion.div
                            className="flex items-center justify-center w-14 h-14 rounded-xl bg-yellow-500/30"
                            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <span className="text-3xl">{achievement.icon}</span>
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs font-medium text-yellow-500 uppercase tracking-wide">
                                    Achievement Unlocked!
                                </span>
                            </div>
                            <h4 className="font-bold text-foreground">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                            <motion.div
                                className="text-2xl font-bold text-yellow-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.3 }}
                            >
                                +{achievement.points}
                            </motion.div>
                            <span className="text-xs text-muted-foreground">points</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
