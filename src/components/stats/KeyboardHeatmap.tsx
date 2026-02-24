'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAnalyticsStore } from '@/stores/analytics-store';

interface KeyConfig {
    label: string;
    value?: string; // The character key for stats
    width?: number; // relative units, default 1
    type?: 'modifier' | 'character';
}

const KEYBOARD_LAYOUT: KeyConfig[][] = [
    [
        { label: '`', value: '`' }, { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' },
        { label: '4', value: '4' }, { label: '5', value: '5' }, { label: '6', value: '6' }, { label: '7', value: '7' },
        { label: '8', value: '8' }, { label: '9', value: '9' }, { label: '0', value: '0' }, { label: '-', value: '-' },
        { label: '=', value: '=' }, { label: 'Backspace', width: 2, type: 'modifier' }
    ],
    [
        { label: 'Tab', width: 1.5, type: 'modifier' }, { label: 'Q', value: 'q' }, { label: 'W', value: 'w' },
        { label: 'E', value: 'e' }, { label: 'R', value: 'r' }, { label: 'T', value: 't' }, { label: 'Y', value: 'y' },
        { label: 'U', value: 'u' }, { label: 'I', value: 'i' }, { label: 'O', value: 'o' }, { label: 'P', value: 'p' },
        { label: '[', value: '[' }, { label: ']', value: ']' }, { label: '\\', value: '\\', width: 1.5 }
    ],
    [
        { label: 'Caps', width: 1.8, type: 'modifier' }, { label: 'A', value: 'a' }, { label: 'S', value: 's' },
        { label: 'D', value: 'd' }, { label: 'F', value: 'f' }, { label: 'G', value: 'g' }, { label: 'H', value: 'h' },
        { label: 'J', value: 'j' }, { label: 'K', value: 'k' }, { label: 'L', value: 'l' }, { label: ';', value: ';' },
        { label: "'", value: "'" }, { label: 'Enter', width: 2.2, type: 'modifier' }
    ],
    [
        { label: 'Shift', width: 2.4, type: 'modifier' }, { label: 'Z', value: 'z' }, { label: 'X', value: 'x' },
        { label: 'C', value: 'c' }, { label: 'V', value: 'v' }, { label: 'B', value: 'b' }, { label: 'N', value: 'n' },
        { label: 'M', value: 'm' }, { label: ',', value: ',' }, { label: '.', value: '.' }, { label: '/', value: '/' },
        { label: 'Shift', width: 2.4, type: 'modifier' }
    ],
    [
        { label: 'Space', value: ' ', width: 6.5, type: 'character' } // Space is central
    ]
];

export function KeyboardHeatmap() {
    const { keyStats } = useAnalyticsStore();
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    const getKeyStats = (key: string) => {
        // Determine the stat lookup key (stats are usually lowercase)
        const lookup = key === ' ' ? 'space' : key.toLowerCase();

        // Check for both original and fallback
        const stat = keyStats[key] || keyStats[lookup];

        if (!stat || stat.totalAttempts < 5) return null;

        const accuracy = ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100;
        return {
            presses: stat.totalAttempts,
            errors: stat.errors,
            accuracy: Math.round(accuracy * 10) / 10,
            hesitation: Math.round(stat.averageSpeed),
        };
    };

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 97) return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]';
        if (accuracy >= 92) return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
        if (accuracy >= 85) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
        if (accuracy >= 70) return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
        return 'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]';
    };

    return (
        <div className="flex flex-col gap-2 select-none perspective-[1000px]">
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 justify-center">
                    {row.map((keyConfig, keyIndex) => {
                        const stats = keyConfig.value ? getKeyStats(keyConfig.value) : null;
                        const accuracy = stats?.accuracy ?? null;

                        // Base styles
                        const styles = "h-12 flex items-center justify-center rounded-lg border border-b-4 transition-all duration-200 text-sm font-medium";

                        // Width style
                        const widthStyle = keyConfig.width ? { width: `${keyConfig.width * 3}rem` } : { width: '3rem' };

                        // Color style
                        let colorClass = "bg-muted/30 border-muted-foreground/20 text-muted-foreground/50"; // Default unused/modifier

                        if (keyConfig.type !== 'modifier' && accuracy !== null) {
                            colorClass = getAccuracyColor(accuracy);
                        } else if (keyConfig.type === 'modifier') {
                            colorClass = "bg-muted/50 border-white/5 text-muted-foreground/30 text-xs";
                        }

                        return (
                            <motion.div
                                key={`${rowIndex}-${keyIndex}`}
                                className={cn(styles, colorClass, "relative")}
                                style={widthStyle}
                                whileHover={{ y: 2, borderBottomWidth: '2px', scale: 0.98 }}
                                onMouseEnter={() => keyConfig.value && setHoveredKey(keyConfig.value)}
                                onMouseLeave={() => setHoveredKey(null)}
                            >
                                {keyConfig.label}

                                {/* Tooltip */}
                                <AnimatePresence>
                                    {hoveredKey === keyConfig.value && stats && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute -top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                                        >
                                            <div className="bg-popover/95 backdrop-blur-xl text-popover-foreground text-xs p-3 rounded-xl border shadow-2xl min-w-[120px]">
                                                <div className="font-bold text-base mb-1 text-center border-b border-white/10 pb-1">
                                                    {keyConfig.label}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between gap-3">
                                                        <span className="text-muted-foreground">Acc:</span>
                                                        <span className={cn(
                                                            "font-bold",
                                                            stats.accuracy >= 95 ? "text-emerald-400" :
                                                                stats.accuracy < 80 ? "text-red-400" : "text-yellow-400"
                                                        )}>{stats.accuracy}%</span>
                                                    </div>
                                                    <div className="flex justify-between gap-3">
                                                        <span className="text-muted-foreground">Count:</span>
                                                        <span>{stats.presses}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Arrow */}
                                            <div className="w-3 h-3 bg-popover/95 backdrop-blur-xl border-r border-b rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
