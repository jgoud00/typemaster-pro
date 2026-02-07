'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { keyboardLayout, fingerColors } from '@/lib/keyboard-data';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { KeyData } from '@/types';

interface VirtualKeyboardProps {
    activeKey: string | null;
    showHeatmap?: boolean;
    className?: string;
}

export function VirtualKeyboard({ activeKey, showHeatmap = false, className }: VirtualKeyboardProps) {
    const { getKeyAccuracy } = useAnalyticsStore();

    return (
        <div className={cn('flex flex-col gap-1.5 p-4 rounded-xl bg-card/50 backdrop-blur', className)}>
            {keyboardLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1.5">
                    {row.map((keyData, keyIndex) => (
                        <Key
                            key={`${rowIndex}-${keyIndex}`}
                            keyData={keyData}
                            isActive={isKeyActive(keyData, activeKey)}
                            showHeatmap={showHeatmap}
                            accuracy={showHeatmap ? getKeyAccuracy(keyData.key) : 100}
                        />
                    ))}
                </div>
            ))}

            {/* Finger guide legend */}
            <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs">
                {Object.entries(fingerColors).slice(0, 8).map(([finger, colors]) => (
                    <div
                        key={finger}
                        className={cn('flex items-center gap-1 px-2 py-0.5 rounded', colors.bg)}
                    >
                        <div className={cn('w-2 h-2 rounded-full', colors.border, 'border-2')} />
                        <span className={colors.text}>{formatFingerName(finger)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface KeyProps {
    keyData: KeyData;
    isActive: boolean;
    showHeatmap: boolean;
    accuracy: number;
}

function Key({ keyData, isActive, showHeatmap, accuracy }: KeyProps) {
    const { key, shiftKey, finger, width = 1 } = keyData;
    const colors = fingerColors[finger];

    // Width calculation (base width is 48px)
    const widthClass = width === 1 ? 'w-12' : `w-[${width * 48 + (width - 1) * 6}px]`;
    const widthStyle = width !== 1 ? { width: `${width * 48 + (width - 1) * 6}px` } : undefined;

    // Get display label
    const displayLabel = getDisplayLabel(key);

    // Heatmap color based on accuracy
    const heatmapColor = showHeatmap ? getHeatmapColor(accuracy) : null;

    return (
        <motion.div
            className={cn(
                'relative h-12 rounded-lg border-2 flex flex-col items-center justify-center',
                'transition-all duration-150 cursor-default select-none',
                width === 1 && 'w-12',
                // Base styling
                !isActive && !heatmapColor && [colors.bg, colors.border],
                // Active state
                isActive && 'ring-2 ring-offset-2 ring-offset-background scale-110 z-10',
                isActive && colors.border,
                isActive && 'bg-linear-to-b from-white/20 to-transparent',
                // Heatmap override
                heatmapColor,
            )}
            style={widthStyle}
            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
            {/* Shift character */}
            {shiftKey && (
                <span className="text-[10px] text-muted-foreground/70 leading-none">
                    {shiftKey}
                </span>
            )}

            {/* Main character */}
            <span className={cn(
                'font-medium leading-none',
                displayLabel.length > 1 ? 'text-[10px]' : 'text-sm',
                isActive ? 'text-foreground' : colors.text,
            )}>
                {displayLabel}
            </span>

            {/* Active indicator glow */}
            {isActive && (
                <motion.div
                    className={cn('absolute inset-0 rounded-lg', colors.bg)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
}

function isKeyActive(keyData: KeyData, activeKey: string | null): boolean {
    if (!activeKey) return false;
    return keyData.key === activeKey || keyData.shiftKey === activeKey;
}

function getDisplayLabel(key: string): string {
    const specialKeys: Record<string, string> = {
        ' ': 'Space',
        'Backspace': '⌫',
        'Tab': 'Tab',
        'CapsLock': 'Caps',
        'Enter': 'Enter',
        'Shift': 'Shift',
        'Ctrl': 'Ctrl',
        'Alt': 'Alt',
        'Win': '⊞',
        'Menu': '☰',
    };
    return specialKeys[key] ?? key.toUpperCase();
}

function formatFingerName(finger: string): string {
    return finger
        .replace('left-', 'L ')
        .replace('right-', 'R ')
        .replace('pinky', 'Pinky')
        .replace('ring', 'Ring')
        .replace('middle', 'Mid')
        .replace('index', 'Index');
}

function getHeatmapColor(accuracy: number): string | null {
    if (accuracy >= 95) return 'bg-green-500/20 border-green-500';
    if (accuracy >= 85) return 'bg-yellow-500/20 border-yellow-500';
    if (accuracy >= 70) return 'bg-orange-500/20 border-orange-500';
    return 'bg-red-500/20 border-red-500';
}
