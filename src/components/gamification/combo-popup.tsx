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
    // Visual effects disabled
    return null;
}

interface StreakBreakPopupProps {
    show: boolean;
    lastCombo: number;
}

export function StreakBreakPopup({ show, lastCombo }: StreakBreakPopupProps) {
    // Visual effects disabled
    return null;
}
