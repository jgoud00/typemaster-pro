'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface WeaknessOverlayProps {
    text: string;
    currentIndex: number;
    errorProbabilities: Map<string, number>; // key -> P(error)
    className?: string;
}

/**
 * Weakness Overlay Component
 * 
 * Overlays colored underlines on text to show predicted error probability.
 * 🟢 <30% - easy
 * 🟡 30-60% - medium
 * 🔴 >60% - hard (warning)
 */
export function WeaknessOverlay({
    text,
    currentIndex,
    errorProbabilities,
    className,
}: WeaknessOverlayProps) {
    // Calculate difficulty for each upcoming character
    const difficulties = useMemo(() => {
        const result: Array<{ char: string; probability: number; level: 'easy' | 'medium' | 'hard' }> = [];

        for (let i = currentIndex; i < Math.min(currentIndex + 30, text.length); i++) {
            const char = text[i].toLowerCase();
            const probability = errorProbabilities.get(char) || 0;

            let level: 'easy' | 'medium' | 'hard';
            if (probability < 0.3) {
                level = 'easy';
            } else if (probability < 0.6) {
                level = 'medium';
            } else {
                level = 'hard';
            }

            result.push({ char, probability, level });
        }

        return result;
    }, [text, currentIndex, errorProbabilities]);

    // Find the next hard character
    const nextHardIndex = difficulties.findIndex(d => d.level === 'hard');
    const nextHardChar = nextHardIndex >= 0 ? difficulties[nextHardIndex] : null;

    if (!nextHardChar || nextHardIndex > 10) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "absolute bottom-full left-0 mb-2 px-3 py-2 rounded-lg",
                "bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-sm",
                "text-sm shadow-lg",
                className
            )}
        >
            <div className="flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span>
                <span>
                    Difficult key ahead: <strong className="font-mono">{nextHardChar.char.toUpperCase()}</strong>
                </span>
                <span className="text-muted-foreground">
                    ({(nextHardChar.probability * 100).toFixed(0)}% error probability)
                </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                Slow down slightly for better accuracy
            </p>
        </motion.div>
    );
}

/**
 * Inline character difficulty indicator
 * Shows colored underlines based on error probability
 */
interface CharacterDifficultyProps {
    probability: number;
    isNextChar: boolean;
}

export function CharacterDifficultyIndicator({ probability, isNextChar }: CharacterDifficultyProps) {
    if (probability < 0.3) return null;

    const isHard = probability >= 0.6;
    const isMedium = probability >= 0.3 && probability < 0.6;

    return (
        <span
            className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5 rounded-full",
                isMedium && "bg-yellow-400/60",
                isHard && "bg-red-400/80",
                isNextChar && isHard && "animate-pulse h-1",
            )}
        />
    );
}

/**
 * Get color class for probability level
 */
export function getDifficultyColor(probability: number): string {
    if (probability >= 0.6) return 'text-red-500';
    if (probability >= 0.3) return 'text-yellow-500';
    return 'text-green-500';
}

/**
 * Get background color class for probability level
 */
export function getDifficultyBgColor(probability: number): string {
    if (probability >= 0.6) return 'bg-red-500/20';
    if (probability >= 0.3) return 'bg-yellow-500/20';
    return 'bg-green-500/20';
}
