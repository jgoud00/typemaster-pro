'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { keyboardLayout as qwertyLayout, fingerColors } from '@/lib/keyboard-data';
import { getLayout, type KeyboardLayout } from '@/lib/keyboard-layouts';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useSettingsStore } from '@/stores/settings-store';
import { KeyData, Finger } from '@/types';
import { useTypingStore } from '@/stores/typing-store';

interface VirtualKeyboardProps {
    readonly showHeatmap?: boolean;
    readonly className?: string;
}

// Map keyboard-layouts finger format to keyboard-data finger format
function mapFinger(finger: 'pinky' | 'ring' | 'middle' | 'index', hand: 'left' | 'right'): Finger {
    return `${hand}-${finger}` as Finger;
}

// Convert keyboard-layouts format to keyboard-data format for visual rendering
function getLayoutKeyboardData(layoutName: 'qwerty' | 'dvorak' | 'colemak' | 'azerty'): KeyData[][] {
    if (layoutName === 'qwerty') {
        return qwertyLayout;
    }

    const layout: KeyboardLayout = getLayout(layoutName);

    // Convert the layout rows to KeyData format
    // We need to add special keys (Tab, Caps, Shift, etc.) that aren't in keyboard-layouts
    const result: KeyData[][] = [
        // Row 0: Number row with Backspace
        [
            ...layout.rows[0].map(k => ({
                key: k.key,
                shiftKey: k.shifted,
                finger: mapFinger(k.finger, k.hand),
                row: 0,
            })),
            { key: 'Backspace', finger: 'right-pinky' as Finger, row: 0, width: 2 },
        ],
        // Row 1: Top row with Tab
        [
            { key: 'Tab', finger: 'left-pinky' as Finger, row: 1, width: 1.5 },
            ...layout.rows[1].map(k => ({
                key: k.key,
                shiftKey: k.shifted,
                finger: mapFinger(k.finger, k.hand),
                row: 1,
            })),
        ],
        // Row 2: Home row with Caps and Enter
        [
            { key: 'CapsLock', finger: 'left-pinky' as Finger, row: 2, width: 1.75 },
            ...layout.rows[2].map(k => ({
                key: k.key,
                shiftKey: k.shifted,
                finger: mapFinger(k.finger, k.hand),
                row: 2,
            })),
            { key: 'Enter', finger: 'right-pinky' as Finger, row: 2, width: 2.25 },
        ],
        // Row 3: Bottom row with Shifts
        [
            { key: 'Shift', finger: 'left-pinky' as Finger, row: 3, width: 2.25 },
            ...layout.rows[3].map(k => ({
                key: k.key,
                shiftKey: k.shifted,
                finger: mapFinger(k.finger, k.hand),
                row: 3,
            })),
            { key: 'Shift', finger: 'right-pinky' as Finger, row: 3, width: 2.75 },
        ],
        // Row 4: Space bar row (same for all layouts)
        [
            { key: 'Ctrl', finger: 'left-pinky' as Finger, row: 4, width: 1.25 },
            { key: 'Win', finger: 'left-pinky' as Finger, row: 4, width: 1.25 },
            { key: 'Alt', finger: 'left-pinky' as Finger, row: 4, width: 1.25 },
            { key: ' ', finger: 'thumb' as Finger, row: 4, width: 6.25 },
            { key: 'Alt', finger: 'right-pinky' as Finger, row: 4, width: 1.25 },
            { key: 'Win', finger: 'right-pinky' as Finger, row: 4, width: 1.25 },
            { key: 'Menu', finger: 'right-pinky' as Finger, row: 4, width: 1.25 },
            { key: 'Ctrl', finger: 'right-pinky' as Finger, row: 4, width: 1.25 },
        ],
    ];

    return result;
}

function VirtualKeyboardComponent({ showHeatmap = false, className }: VirtualKeyboardProps) {
    const keyStats = useAnalyticsStore(s => showHeatmap ? s.keyStats : null);
    const settings = useSettingsStore(s => s.settings);
    const activeKey = useTypingStore(s => s.activeKey);

    // Get keyboard layout based on settings
    const currentLayout = useMemo(() => getLayoutKeyboardData(settings.keyboardLayout), [settings.keyboardLayout]);

    // Memoized accuracy map
    const accuracyMap = useMemo(() => {
        const map = new Map<string, number>();
        if (!showHeatmap || !keyStats) return map;
        for (const [key, stat] of Object.entries(keyStats)) {
            if (stat && stat.totalAttempts > 0) {
                map.set(key.toLowerCase(), Math.round(((stat.totalAttempts - stat.errors) / stat.totalAttempts) * 100));
            }
        }
        return map;
    }, [showHeatmap, keyStats]);

    return (
        <motion.div
            className={cn('flex flex-col gap-1.5 p-6 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl relative', className)}
            aria-hidden="true"
            style={{
                transformStyle: 'preserve-3d',
                transformPerspective: 1200,
                rotateX: 12,
                translateZ: 10
            }}
        >
            {/* Keyboard depth layer */}
            <div className="absolute inset-0 bg-black/40 rounded-2xl -z-10 translate-y-3 blur-sm" />

            {/* Layout indicator */}
            {settings.keyboardLayout !== 'qwerty' && (
                <div className="text-xs text-center text-muted-foreground mb-1">
                    {settings.keyboardLayout.toUpperCase()} Layout
                </div>
            )}

            {currentLayout.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex justify-center gap-1.5">
                    {row.map((keyData, keyIndex) => (
                        <MemoizedKey
                            key={`${rowIndex}-${keyIndex}`}
                            keyData={keyData}
                            isActive={isKeyActive(keyData, activeKey)}
                            showHeatmap={showHeatmap}
                            accuracy={showHeatmap ? (accuracyMap.get(keyData.key.toLowerCase()) ?? 100) : 100}
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
        </motion.div>
    );
}

export const VirtualKeyboard = memo(VirtualKeyboardComponent);


interface KeyProps {
    keyData: KeyData;
    isActive: boolean;
    showHeatmap: boolean;
    accuracy: number;
}

const MemoizedKey = memo(function Key({ keyData, isActive, showHeatmap, accuracy }: KeyProps) {
    const { key, shiftKey, finger, width = 1 } = keyData;
    const colors = fingerColors[finger];

    // Width calculation (base width is 48px)
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
            {shiftKey && shiftKey.toLowerCase() !== key.toLowerCase() && (
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

            {/* Active indicator glow — CSS-only, compositor thread, no JS RAF */}
            {isActive && (
                <div className={cn('absolute inset-0 rounded-lg animate-pulse', colors.bg)} />
            )}
        </motion.div>
    );
}, (prev, next) => {
    return (
        prev.isActive === next.isActive &&
        prev.accuracy === next.accuracy &&
        prev.showHeatmap === next.showHeatmap &&
        prev.keyData.key === next.keyData.key
    );
});

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
