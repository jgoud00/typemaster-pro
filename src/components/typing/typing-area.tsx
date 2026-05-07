'use client';

import { useRef, useEffect, useState, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/stores/settings-store';
import { cn } from '@/lib/utils';
import { TypingCharacter } from './typing-character';

import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';

interface TypingAreaProps {
    readonly className?: string;
}

// Isolated sub-component: subscribes to wpm/accuracy/combo without re-rendering parent
function SrOnlyStats({ progress }: { progress: number }) {
    const wpm = useTypingStore(s => s.getWpm());
    const accuracy = useTypingStore(s => s.getAccuracy());
    const combo = useGameStore(s => s.game.combo);
    return (
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {`Speed: ${wpm} words per minute. Accuracy: ${accuracy} percent. Combo: ${combo}. Progress: ${progress} percent complete.`}
        </div>
    );
}

import { ErrorBoundary } from '@/components/ui/error-boundary';

function TypingAreaComponent({
    className
}: TypingAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const { settings } = useSettingsStore();
    const { cursorStyle } = settings;

    const hasMounted = typeof window !== 'undefined';

    // Connect to stores
    const text = useTypingStore(s => s.state.text);
    const currentIndex = useTypingStore(s => s.state.currentIndex);
    const errorIndices = useTypingStore(s => s.state.errorIndices);

    // Auto-scroll to keep cursor visible
    useEffect(() => {
        if (cursorRef.current && containerRef.current) {
            const cursor = cursorRef.current;
            const container = containerRef.current;

            const cursorRect = cursor.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Scroll if cursor is near bottom
            if (cursorRect.bottom > containerRect.bottom - 50) {
                cursor.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentIndex]);

    const errorSet = useMemo(() => new Set(errorIndices), [errorIndices]);
    const progress = text.length > 0 ? Math.round((currentIndex / text.length) * 100) : 0;
    
    // Group characters into words for focus effect
    const words = useMemo(() => {
        const result = [];
        let currentWord = [];
        for (let i = 0; i < text.length; i++) {
            currentWord.push({ char: text[i], index: i });
            if (text[i] === ' ') {
                result.push(currentWord);
                currentWord = [];
            }
        }
        if (currentWord.length > 0) result.push(currentWord);
        return result;
    }, [text]);

    const currentWordIdx = useMemo(() => {
        return text.slice(0, currentIndex).split(' ').length - 1;
    }, [text, currentIndex]);
    
    // Calculate line index approximately based on word index for smooth scrolling
    const currentLineIndex = Math.floor(currentWordIdx / 10);

    if (!hasMounted) {
        return (
            <div className={cn('relative bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/15 min-h-[180px]', className)}>
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div
                ref={containerRef}
                role="application"
                aria-label="Typing practice area"
                className={cn('relative bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/15 p-8 shadow-2xl overflow-hidden', className)}
            >
                {/* Background glow */}
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary/5 blur-[100px] pointer-events-none" />

                {/* Screen reader live region */}
                <SrOnlyStats progress={progress} />

                {/* Text content area - Minimal & Large */}
                <div
                    aria-label="Text to type"
                    role="textbox"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        // Prevent default scrolling for space
                        if (e.key === ' ') e.preventDefault();
                    }}
                    className={cn(
                        'relative',
                        'min-h-[180px] overflow-hidden',
                        'text-[2.5rem] leading-relaxed font-mono text-center focus:outline-none'
                    )}
                >
                    <motion.div 
                        className="flex flex-wrap justify-center gap-x-1 gap-y-2"
                        animate={{ y: -(currentLineIndex * 60) }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {words.map((word, wIdx) => (
                            <div key={`word-${word[0]?.index ?? wIdx}`} className={cn(
                                "inline-block whitespace-nowrap transition-opacity duration-200",
                                wIdx === currentWordIdx ? "opacity-100" : "opacity-30"
                            )}>
                                {word.map(({ char, index }) => {
                                    const isTyped = index < currentIndex;
                                    const isCurrent = index === currentIndex;
                                    const isError = errorSet.has(index);
                                    const isNext = index === currentIndex + 1;
                                    return (
                                        <TypingCharacter
                                            key={`char-${index}`}
                                            char={char}
                                            isTyped={isTyped}
                                            isCurrent={isCurrent}
                                            isError={isError}
                                            isNext={isNext}
                                            cursorStyle={cursorStyle}
                                            smoothCaret={settings.smoothCaret}
                                            ref={cursorRef}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export const TypingArea = memo(TypingAreaComponent);
