'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { COMBO_THRESHOLDS } from '@/types';
import { Flame, Star, Zap } from 'lucide-react';

interface ComboPopupProps {
    combo: number;
    show: boolean;
    level: number;
}

export function ComboPopup({ combo, show, level }: ComboPopupProps) {
    if (!show || level === 0) return null;

    const messages = [
        { level: 1, text: 'Nice!', icon: Zap },
        { level: 2, text: 'Great!', icon: Star },
        { level: 3, text: 'Amazing!', icon: Flame },
        { level: 4, text: 'UNSTOPPABLE!', icon: Flame },
    ];

    const config = messages[Math.min(level - 1, messages.length - 1)];
    const Icon = config.icon;

    const colors = [
        'from-yellow-400 to-orange-500',
        'from-green-400 to-emerald-500',
        'from-blue-400 to-cyan-500',
        'from-purple-400 to-pink-500',
    ];

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, y: -50 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                    <div className={cn(
                        'flex flex-col items-center gap-2 px-8 py-4 rounded-2xl',
                        'bg-linear-to-r shadow-2xl',
                        colors[level - 1],
                    )}>
                        <motion.div
                            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                        </motion.div>
                        <motion.span
                            className="text-2xl font-black text-white drop-shadow-lg"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.3 }}
                        >
                            {config.text}
                        </motion.span>
                        <span className="text-lg font-bold text-white/80">
                            {combo} Combo × {getMultiplier(level)}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function getMultiplier(level: number): string {
    const multipliers = [
        COMBO_THRESHOLDS.LEVEL_1.multiplier,
        COMBO_THRESHOLDS.LEVEL_2.multiplier,
        COMBO_THRESHOLDS.LEVEL_3.multiplier,
        COMBO_THRESHOLDS.LEVEL_4.multiplier,
    ];
    return `${multipliers[level - 1]}`;
}

interface StreakBreakPopupProps {
    show: boolean;
    lastCombo: number;
}

export function StreakBreakPopup({ show, lastCombo }: StreakBreakPopupProps) {
    if (!show || lastCombo < 10) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed top-20 right-8 z-50"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                >
                    <div className="px-4 py-2 bg-red-500/90 rounded-lg text-white font-medium shadow-lg">
                        Streak lost: {lastCombo} combo
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
