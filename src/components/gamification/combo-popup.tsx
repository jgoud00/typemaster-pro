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
    transition: { type: 'spring', stiffness: 450, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.85, y: -16, filter: 'blur(4px)', transition: { duration: 0.2 } },
};

const popVariants: Variants = {
  animate: {
    scale: [1, 1.18, 1],
    transition: { duration: 0.28, ease: 'easeOut' },
  },
};

// Color config per combo level
const levelConfigs = [
  { text: 'text-muted-foreground', glow: '', badge: 'border-zinc-700/50 bg-zinc-900/40' },
  {
    text: 'text-primary',
    glow: 'drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]',
    badge: 'border-primary/30 bg-amber-950/30 shadow-[0_0_24px_rgba(245,158,11,0.15)]',
  },
  {
    text: 'text-purple-400',
    glow: 'drop-shadow-[0_0_10px_rgba(192,132,252,0.7)]',
    badge: 'border-purple-500/30 bg-purple-950/30 shadow-[0_0_24px_rgba(139,92,246,0.15)]',
  },
  {
    text: 'text-orange-400',
    glow: 'drop-shadow-[0_0_10px_rgba(251,146,60,0.7)]',
    badge: 'border-orange-500/30 bg-orange-950/30 shadow-[0_0_24px_rgba(249,115,22,0.15)]',
  },
  {
    text: 'text-rose-400',
    glow: 'drop-shadow-[0_0_14px_rgba(251,113,133,0.9)]',
    badge: 'border-rose-500/30 bg-rose-950/30 shadow-[0_0_32px_rgba(239,68,68,0.2)]',
  },
];

export function ComboPopup() {
  const combo = useGameStore((s) => s.game.combo);
  const level = useGameStore((s) => s.getComboLevel());
  const [popTrigger, setPopTrigger] = useState(0);

  useEffect(() => {
    if (combo > 0 && combo % 10 === 0) {
      setPopTrigger((prev) => prev + 1);
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
          className="fixed top-20 right-6 pointer-events-none z-40 select-none"
        >
          <div className="flex items-center gap-2 bg-card border border-primary/30 px-3.5 py-1.5 rounded-full shadow-lg">
            <motion.span
              key={popTrigger}
              variants={popVariants}
              animate="animate"
              className="text-base font-black font-mono text-primary"
            >
              {combo}x
            </motion.span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Combo
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const breakVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.9, y: -8, transition: { duration: 0.2 } },
};

export function StreakBreakPopup() {
  const [broken, setBroken] = useState<{ show: boolean; combo: number }>({ show: false, combo: 0 });

  useEffect(() => {
    const handleBreak = (payload: { lastCombo: number }) => {
      if (payload && payload.lastCombo >= 10) {
        setBroken({ show: true, combo: payload.lastCombo });
        setTimeout(() => setBroken({ show: false, combo: 0 }), 1800);
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
          className="fixed top-20 right-6 pointer-events-none z-40 select-none"
        >
          <div className="flex items-center gap-2 bg-card border border-red-500/30 px-3.5 py-1.5 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span className="text-xs font-semibold text-red-400">
              Streak lost ({broken.combo}x)
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
