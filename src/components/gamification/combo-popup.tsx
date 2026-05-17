'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useGameStore } from '@/stores/game-store';
import { typingBus } from '@/lib/events/typing-bus';

const comboVariants: Variants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        transition: { type: 'spring', stiffness: 500, damping: 25 } 
    },
    exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.2 } }
};

const popVariants: Variants = {
    animate: { 
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
    }
};

const levelColors = [
    'text-gray-400',
    'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]',
    'text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]',
    'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]',
    'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]'
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

    return (
        <AnimatePresence>
            {combo >= 10 && (
                <motion.div
                    key="combo-overlay"
                    variants={comboVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute top-8 right-12 pointer-events-none flex flex-col items-end z-50 select-none"
                >
                    <motion.div 
                        key={popTrigger}
                        variants={popVariants}
                        animate="animate"
                        className={`text-5xl font-black italic tracking-tighter ${levelColors[level] || levelColors[0]}`}
                    >
                        {combo}x
                    </motion.div>
                    <div className={`text-sm font-bold uppercase tracking-widest ${levelColors[level] || levelColors[0]} opacity-80`}>
                        Combo Streak
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const breakVariants: Variants = {
    initial: { opacity: 0, scale: 1.5, rotate: -10, y: -50 },
    animate: { opacity: 1, scale: 1, rotate: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 15 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } }
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
                    <div className="text-4xl font-black italic text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">
                        Combo Broken!
                    </div>
                    <div className="text-xl font-bold text-red-400 mt-2 opacity-90">
                        Lost {broken.combo}x streak
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
