'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { typingBus } from '@/lib/events/typing-bus';
import { useWeaknessDetectorWorker } from '@/hooks/use-weakness-detector-worker';
import { cn } from '@/lib/utils';

// --- Types & Constants ---

type Finger = 
    | 'left-pinky' | 'left-ring' | 'left-middle' | 'left-index' | 'thumb'
    | 'right-index' | 'right-middle' | 'right-ring' | 'right-pinky';

const FINGER_COLORS: Record<Finger, string> = {
    'left-pinky': '#fb7185',   // rose-400
    'left-ring': '#fb923c',    // orange-400
    'left-middle': '#facc15',  // yellow-400
    'left-index': '#4ade80',   // green-400
    'thumb': '#60a5fa',        // blue-400
    'right-index': '#2dd4bf',  // teal-400
    'right-middle': '#818cf8', // indigo-400
    'right-ring': '#c084fc',   // purple-400
    'right-pinky': '#f472b6',  // pink-400
};

const KEY_TO_FINGER: Record<string, Finger> = {
    '~': 'left-pinky', '1': 'left-pinky', 'Q': 'left-pinky', 'A': 'left-pinky', 'Z': 'left-pinky',
    '2': 'left-ring', 'W': 'left-ring', 'S': 'left-ring', 'X': 'left-ring',
    '3': 'left-middle', 'E': 'left-middle', 'D': 'left-middle', 'C': 'left-middle',
    '4': 'left-index', '5': 'left-index', 'R': 'left-index', 'F': 'left-index', 'V': 'left-index', 'T': 'left-index', 'G': 'left-index', 'B': 'left-index',
    ' ': 'thumb',
    '6': 'right-index', '7': 'right-index', 'Y': 'right-index', 'H': 'right-index', 'N': 'right-index', 'U': 'right-index', 'J': 'right-index', 'M': 'right-index',
    '8': 'right-middle', 'I': 'right-middle', 'K': 'right-middle', ',': 'right-middle',
    '9': 'right-ring', 'O': 'right-ring', 'L': 'right-ring', '.': 'right-ring',
    '0': 'right-pinky', '-': 'right-pinky', '=': 'right-pinky', 'P': 'right-pinky', ';': 'right-pinky', '/': 'right-pinky', '\\': 'right-pinky', ']': 'right-pinky', '[': 'right-pinky', "'": 'right-pinky'
};

const ROWS = [
    ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
];

// Layout geometry constants
const KEY_SIZE = 40;
const KEY_GAP = 5;
const ROW_OFFSETS = [0, 20, 30, 45]; // Staggering

// --- Components ---

interface KeyProps {
    char: string;
    x: number;
    y: number;
    width?: number;
    fatigue: number; // 0 to 1
    isActive: boolean;
}

const Key = memo(({ char, x, y, width = KEY_SIZE, fatigue, isActive }: KeyProps) => {
    const finger = KEY_TO_FINGER[char.toUpperCase()] || 'thumb';
    const baseColor = FINGER_COLORS[finger];

    // Fatigue levels per requirements
    // 0-30%: base color (low opacity)
    // 30-60%: medium shade
    // 60-100%: bright/warning shade
    const opacity = fatigue < 0.3 ? 0.2 : fatigue < 0.6 ? 0.6 : 1.0;
    
    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Key Background */}
            <rect
                width={width}
                height={KEY_SIZE}
                rx={6}
                fill={baseColor}
                fillOpacity={opacity}
                className="transition-all duration-300"
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth={1}
            />
            
            {/* Active Glow/Pulse */}
            <AnimatePresence>
                {isActive && (
                    <motion.rect
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 0.6, scale: 1.1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        width={width}
                        height={KEY_SIZE}
                        rx={6}
                        fill={baseColor}
                        className="pointer-events-none"
                        style={{ transformOrigin: 'center' }}
                    />
                )}
            </AnimatePresence>

            {/* Label */}
            <text
                x={width / 2}
                y={KEY_SIZE / 2 + 5}
                textAnchor="middle"
                className="text-[10px] font-bold fill-foreground select-none"
                style={{ pointerEvents: 'none' }}
            >
                {char === ' ' ? 'SPACE' : char}
            </text>
        </g>
    );
});

Key.displayName = 'HandOverlayKey';

export function HandOverlay() {
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [fatigueData, setFatigueData] = useState<Record<string, number>>({});
    const { analyzeAllKeys } = useWeaknessDetectorWorker();

    // Listen to keystrokes
    useEffect(() => {
        const handler = (data: { key: string }) => {
            const key = data.key.toUpperCase();
            setActiveKey(key);
            setTimeout(() => setActiveKey(prev => prev === key ? null : prev), 150);
        };

        typingBus.on('KEYSTROKE_REGISTERED', handler);
        return () => typingBus.off('KEYSTROKE_REGISTERED', handler);
    }, []);

    // Fetch fatigue data periodically
    useEffect(() => {
        const fetchFatigue = async () => {
            try {
                const results = (await analyzeAllKeys()) || [];
                const mapped: Record<string, number> = {};
                results.forEach(r => {
                    mapped[r.key.toUpperCase()] = r.fingerLoad || 0;
                });
                setFatigueData(mapped);
            } catch (err) {
                console.error('Failed to fetch fatigue data:', err);
            }
        };

        fetchFatigue();
        const interval = setInterval(fetchFatigue, 2000);
        return () => clearInterval(interval);
    }, [analyzeAllKeys]);

    const keyboardLayout = useMemo(() => {
        let totalWidth = 0;
        const renderedRows = ROWS.map((chars, rowIndex) => {
            const offset = ROW_OFFSETS[rowIndex];
            return chars.map((char, colIndex) => {
                const x = offset + colIndex * (KEY_SIZE + KEY_GAP);
                const y = rowIndex * (KEY_SIZE + KEY_GAP);
                totalWidth = Math.max(totalWidth, x + KEY_SIZE);
                return (
                    <Key
                        key={`${rowIndex}-${colIndex}`}
                        char={char}
                        x={x}
                        y={y}
                        fatigue={fatigueData[char.toUpperCase()] || 0}
                        isActive={activeKey === char.toUpperCase()}
                    />
                );
            });
        });

        // Add Spacebar
        const spaceWidth = KEY_SIZE * 6;
        const spaceX = (totalWidth - spaceWidth) / 2;
        const spaceY = ROWS.length * (KEY_SIZE + KEY_GAP);
        
        renderedRows.push([
            <Key
                key="space"
                char=" "
                x={spaceX}
                y={spaceY}
                width={spaceWidth}
                fatigue={fatigueData[' '] || 0}
                isActive={activeKey === ' '}
            />
        ]);

        return { renderedRows, totalWidth, totalHeight: (ROWS.length + 1) * (KEY_SIZE + KEY_GAP) };
    }, [fatigueData, activeKey]);

    return (
        <div className="flex flex-col items-center gap-4 py-8 bg-black/20 rounded-3xl border border-white/5 backdrop-blur-md">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-6 py-1 bg-white/5 rounded-full border border-white/10">
                Finger Fatigue Awareness
            </div>
            
            <svg
                width={keyboardLayout.totalWidth + 20}
                height={keyboardLayout.totalHeight + 10}
                viewBox={`0 0 ${keyboardLayout.totalWidth + 20} ${keyboardLayout.totalHeight + 10}`}
                className="overflow-visible px-2"
            >
                {keyboardLayout.renderedRows}
            </svg>
            
            {/* Legend */}
            <div className="flex gap-6 mt-4 opacity-70">
                <LegendItem color={FINGER_COLORS['left-pinky']} label="Pinkies" />
                <LegendItem color={FINGER_COLORS['left-index']} label="Index" />
                <LegendItem color={FINGER_COLORS['thumb']} label="Thumbs" />
                <div className="h-4 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded bg-white/20" />
                        <div className="w-3 h-3 rounded bg-white/60" />
                        <div className="w-3 h-3 rounded bg-white" />
                    </div>
                    <span>Fatigue Level</span>
                </div>
            </div>
        </div>
    );
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {label}
        </div>
    );
}
