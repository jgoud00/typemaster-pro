'use client';

import { useRef, useEffect, useState, memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/settings-store';
import { cn } from '@/lib/utils';
import { TypingCharacter } from './typing-character';
import { ErrorBoundary } from '@/components/ui/error-boundary';

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

function TypingAreaComponent({
    className
}: TypingAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const { settings } = useSettingsStore();
    const { cursorStyle } = settings;

    const hasMounted = typeof window !== 'undefined';

    // Connect to stores
    const text = useTypingStore(s => s.state.text);
    const currentIndex = useTypingStore(s => s.state.currentIndex);
    const errorIndices = useTypingStore(s => s.state.errorIndices);
    const hasStarted = useTypingStore(s => s.state.startTime !== null);
    const isComplete = useTypingStore(s => s.state.isComplete);

    // Focus state for "Click to Focus" overlay
    const [isFocused, setIsFocused] = useState(true);

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

    // Keep hidden input focused for mobile keyboard capture
    const focusInput = useCallback(() => {
        hiddenInputRef.current?.focus();
        setIsFocused(true);
    }, []);

    // Auto-focus on mount and on click
    useEffect(() => {
        focusInput();
    }, [focusInput]);

    // Track focus/blur on the container
    useEffect(() => {
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => {
            // Small delay to avoid flash when clicking within the container
            setTimeout(() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                    setIsFocused(false);
                }
            }, 100);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('focusin', handleFocus);
            container.addEventListener('focusout', handleBlur);
            return () => {
                container.removeEventListener('focusin', handleFocus);
                container.removeEventListener('focusout', handleBlur);
            };
        }
    }, []);

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

    // Show overlay only when: has started, not complete, and not focused
    const showFocusOverlay = hasStarted && !isComplete && !isFocused;

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
                onClick={focusInput}
                className={cn(
                    'relative bg-white/5 backdrop-blur-2xl rounded-2xl border p-8 shadow-2xl overflow-hidden cursor-text transition-all duration-300',
                    isFocused ? 'border-primary/50 ring-4 ring-primary/10' : 'border-white/15',
                    className
                )}
            >
                {/* Hidden input for mobile keyboard capture */}
                <input
                    ref={hiddenInputRef}
                    type="text"
                    data-typing-shim="true"
                    aria-label="Type here"
                    autoCapitalize="off"
                    autoCorrect="off"
                    autoComplete="off"
                    spellCheck={false}
                    className="absolute w-0 h-0 opacity-0 pointer-events-none"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        // Prevent default scrolling for space
                        if (e.key === ' ') e.preventDefault();
                    }}
                    onBlur={() => {
                        // Re-focus if user clicked within the typing area
                        setTimeout(() => {
                            if (containerRef.current?.contains(document.activeElement)) {
                                focusInput();
                            }
                        }, 50);
                    }}
                />

                {/* Background glow */}
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary/5 blur-[100px] pointer-events-none" />

                {/* Screen reader live region */}
                <SrOnlyStats progress={progress} />

                {/* CLICK TO FOCUS overlay */}
                <AnimatePresence>
                    {showFocusOverlay && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl cursor-pointer"
                            onClick={focusInput}
                        >
                            <div className="text-center space-y-2">
                                <div className="text-2xl font-bold text-white">Click to resume</div>
                                <div className="text-sm text-white/60">Timer is paused</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Text content area - Minimal & Large */}
                <div
                    aria-label="Text to type"
                    role="textbox"
                    tabIndex={-1}
                    className={cn(
                        'relative',
                        'min-h-[180px] overflow-hidden',
                        'text-[2.5rem] leading-relaxed font-mono text-center focus:outline-none',
                        showFocusOverlay && 'blur-sm select-none'
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
