'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { cn } from '@/lib/utils';

/**
 * VectorKeyboard — A reactive SVG keyboard heatmap that visualizes
 * character-level performance using accuracy and latency data.
 */

interface KeyPosition {
    key: string;
    label: string;
    x: number;
    y: number;
    w: number;
}

const KEY_SIZE = 40;
const GAP = 4;

const LAYOUT: KeyPosition[][] = [
    [
        { key: 'q', label: 'Q', x: 0, y: 0, w: 1 },
        { key: 'w', label: 'W', x: 1, y: 0, w: 1 },
        { key: 'e', label: 'E', x: 2, y: 0, w: 1 },
        { key: 'r', label: 'R', x: 3, y: 0, w: 1 },
        { key: 't', label: 'T', x: 4, y: 0, w: 1 },
        { key: 'y', label: 'Y', x: 5, y: 0, w: 1 },
        { key: 'u', label: 'U', x: 6, y: 0, w: 1 },
        { key: 'i', label: 'I', x: 7, y: 0, w: 1 },
        { key: 'o', label: 'O', x: 8, y: 0, w: 1 },
        { key: 'p', label: 'P', x: 9, y: 0, w: 1 },
        { key: '[', label: '[', x: 10, y: 0, w: 1 },
        { key: ']', label: ']', x: 11, y: 0, w: 1 },
    ],
    [
        { key: 'a', label: 'A', x: 0.25, y: 1, w: 1 },
        { key: 's', label: 'S', x: 1.25, y: 1, w: 1 },
        { key: 'd', label: 'D', x: 2.25, y: 1, w: 1 },
        { key: 'f', label: 'F', x: 3.25, y: 1, w: 1 },
        { key: 'g', label: 'G', x: 4.25, y: 1, w: 1 },
        { key: 'h', label: 'H', x: 5.25, y: 1, w: 1 },
        { key: 'j', label: 'J', x: 6.25, y: 1, w: 1 },
        { key: 'k', label: 'K', x: 7.25, y: 1, w: 1 },
        { key: 'l', label: 'L', x: 8.25, y: 1, w: 1 },
        { key: ';', label: ';', x: 9.25, y: 1, w: 1 },
        { key: "'", label: "'", x: 10.25, y: 1, w: 1 },
    ],
    [
        { key: 'z', label: 'Z', x: 0.75, y: 2, w: 1 },
        { key: 'x', label: 'X', x: 1.75, y: 2, w: 1 },
        { key: 'c', label: 'C', x: 2.75, y: 2, w: 1 },
        { key: 'v', label: 'V', x: 3.75, y: 2, w: 1 },
        { key: 'b', label: 'B', x: 4.75, y: 2, w: 1 },
        { key: 'n', label: 'N', x: 5.75, y: 2, w: 1 },
        { key: 'm', label: 'M', x: 6.75, y: 2, w: 1 },
        { key: ',', label: ',', x: 7.75, y: 2, w: 1 },
        { key: '.', label: '.', x: 8.75, y: 2, w: 1 },
        { key: '/', label: '/', x: 9.75, y: 2, w: 1 },
    ]
];

export function VectorKeyboard() {
    const keyStats = useAnalyticsStore((s) => s.keyStats);
    const [hoveredKey, setHoveredKey] = React.useState<{
        key: string;
        x: number;
        y: number;
        stats: { acc: number; latency: number };
    } | null>(null);

    const getHeatmapColor = (key: string) => {
        const stat = keyStats[key];
        if (!stat || stat.totalAttempts === 0) return 'fill-white/5 stroke-white/10';
        
        const accuracy = ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100;
        
        if (accuracy >= 97) return 'fill-emerald-500/20 stroke-emerald-500/50';
        if (accuracy >= 92) return 'fill-green-500/20 stroke-green-500/50';
        if (accuracy >= 85) return 'fill-yellow-500/20 stroke-yellow-500/50';
        if (accuracy >= 75) return 'fill-orange-500/20 stroke-orange-500/50';
        return 'fill-red-500/20 stroke-red-500/50';
    };

    const handleMouseEnter = (k: KeyPosition, event: React.MouseEvent) => {
        const stat = keyStats[k.key];
        const acc = stat ? ((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100 : 100;
        const latency = stat ? stat.totalHesitation / stat.totalAttempts : 0;
        
        setHoveredKey({
            key: k.key,
            x: k.x * (KEY_SIZE + GAP),
            y: k.y * (KEY_SIZE + GAP),
            stats: { acc, latency }
        });
    };

    const viewWidth = 12 * (KEY_SIZE + GAP);
    const viewHeight = 3 * (KEY_SIZE + GAP);

    return (
        <div className="relative w-full max-w-3xl mx-auto p-4 bg-black/20 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-visible">
            <svg
                viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                className="w-full h-auto drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
            >
                {LAYOUT.flat().map((k) => (
                    <g
                        key={k.key}
                        onMouseEnter={(e) => handleMouseEnter(k, e)}
                        onMouseLeave={() => setHoveredKey(null)}
                        className="transition-all duration-300 cursor-help"
                    >
                        <rect
                            x={k.x * (KEY_SIZE + GAP)}
                            y={k.y * (KEY_SIZE + GAP)}
                            width={k.w * KEY_SIZE}
                            height={KEY_SIZE}
                            rx={8}
                            className={cn(
                                'transition-colors duration-500',
                                getHeatmapColor(k.key),
                                hoveredKey?.key === k.key && 'stroke-primary stroke-[2px]'
                            )}
                        />
                        <text
                            x={k.x * (KEY_SIZE + GAP) + (k.w * KEY_SIZE) / 2}
                            y={k.y * (KEY_SIZE + GAP) + KEY_SIZE / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className={cn(
                                'text-[12px] font-bold select-none transition-colors duration-300',
                                hoveredKey?.key === k.key ? 'fill-primary' : 'fill-white/40'
                            )}
                        >
                            {k.label}
                        </text>
                    </g>
                ))}
            </svg>

            <AnimatePresence>
                {hoveredKey && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute z-50 p-3 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl pointer-events-none min-w-32"
                        style={{
                            left: hoveredKey.x + 20,
                            top: hoveredKey.y - 50
                        }}
                    >
                        <div className="text-xs font-bold text-white mb-1 uppercase tracking-widest opacity-60">
                            Key: {hoveredKey.key.toUpperCase()}
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between gap-4">
                                <span className="text-[10px] text-muted-foreground">Accuracy</span>
                                <span className={cn(
                                    "text-xs font-mono font-bold",
                                    hoveredKey.stats.acc >= 90 ? "text-emerald-400" : "text-yellow-400"
                                )}>
                                    {hoveredKey.stats.acc.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-[10px] text-muted-foreground">Latency</span>
                                <span className="text-xs font-mono font-bold text-blue-400">
                                    {Math.round(hoveredKey.stats.latency)}ms
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
