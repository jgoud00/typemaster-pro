'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useGameStore } from '@/stores/game-store';
import { typingBus } from '@/lib/events/typing-bus';

const comboVariants: Variants = {
    initial: { opacity: 0, scale: 0.7, y: 20, filter: 'blur(8px)' },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: { type: 'spring', stiffness: 450, damping: 22 }
    },
    exit: { opacity: 0, scale: 0.85, y: -16, filter: 'blur(4px)', transition: { duration: 0.2 } }
};

const popVariants: Variants = {
    animate: {
        scale: [1, 1.18, 1],
        transition: { duration: 0.28, ease: 'easeOut' }
    }
};

// Color config per combo level
const levelConfigs = [
    { text: 'text-zinc-400', glow: '', badge: 'border-zinc-700/50 bg-zinc-900/40' },
    { text: 'text-blue-400', glow: 'drop-shadow-[0_0_10px_rgba(96,165,250,0.7)]', badge: 'border-blue-500/30 bg-blue-950/30 shadow-[0_0_24px_rgba(59,130,246,0.15)]' },
    { text: 'text-purple-400', glow: 'drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]', badge: 'border-purple-500/30 bg-purple-950/30 shadow-[0_0_24px_rgba(139,92,246,0.15)]' },
    { text: 'text-orange-400', glow: 'drop-shadow-[0_0_10px_rgba(251,146,60,0.7)]', badge: 'border-orange-500/30 bg-orange-950/30 shadow-[0_0_24px_rgba(249,115,22,0.15)]' },
    { text: 'text-rose-400', glow: 'drop-shadow-[0_0_14px_rgba(251,113,133,0.9)]', badge: 'border-rose-500/30 bg-rose-950/30 shadow-[0_0_32px_rgba(239,68,68,0.2)]' },
];

export function ComboPopup() {
    const combo = useGameStore(s => s.game.combo);
    const level = useGameStore(s => s.getComboLevel());
    const [popTrigger, setPopTrigger] = useState(0);

    useEffect(() => {
        if (combo > 0 && combo % 10 === 0) {
            setPopTrigger(prev => prev + 1);
        }
    }, [combo]);

    const cfg = levelConfigs[Math.min(level, levelConfigs.length - 1)];

    return (
        <AnimatePresence>
            {combo >= 10 && (
                <motion.div
                    key="combo-overlay"
                    variants={comboVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`absolute top-8 right-8 pointer-events-none z-50 select-none`}
                >
                    <div className={`flex flex-col items-end backdrop-blur-xl rounded-2xl border px-4 py-3 ${cfg.badge}`}>
                        {/* Highlight line */}
                        <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-full" />

                        <motion.div
                            key={popTrigger}
                            variants={popVariants}
                            animate="animate"
                            className={`text-4xl font-black italic tracking-tighter ${cfg.text} ${cfg.glow}`}
                        >
                            {combo}x
                        </motion.div>
                        <div className={`text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5 ${cfg.text} opacity-75`}>
                            Combo
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const breakVariants: Variants = {
    initial: { opacity: 0, scale: 1.6, rotate: -8, y: -40, filter: 'blur(6px)' },
    animate: { opacity: 1, scale: 1, rotate: 0, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 280, damping: 18 } },
    exit: { opacity: 0, scale: 0.8, y: 40, filter: 'blur(4px)', transition: { duration: 0.3 } }
};

export function StreakBreakPopup() {
    const [broken, setBroken] = useState<{ show: boolean; combo: number }>({ show: false, combo: 0 });

    useEffect(() => {
        const handleBreak = (payload: { lastCombo: number }) => {
            if (payload && payload.lastCombo >= 10) {
                setBroken({ show: true, combo: payload.lastCombo });
                setTimeout(() => setBroken({ show: false, combo: 0 }), 2000);
            }
        };

        typingBus.on('COMBO_BROKEN', handleBreak);
        return () => {
            typingBus.off('COMBO_BROKEN', handleBreak);
        };
    }, []);

    return (
        <AnimatePresence>
            {broken.show && (
                <motion.div
                    key="streak-break"
                    variants={breakVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-50 select-none"
                >
                    <div className="relative px-6 py-4 rounded-2xl backdrop-blur-xl border border-red-500/25 bg-red-950/25 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                        <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-red-400/40 to-transparent rounded-full" />
                        <div className="text-3xl font-black italic text-red-400 drop-shadow-[0_0_16px_rgba(239,68,68,0.8)] text-center">
                            Combo Lost!
                        </div>
                        <div className="text-base font-bold text-red-500/70 mt-1 text-center">
                            {broken.combo}x streak gone
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
