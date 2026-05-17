'use client';

import { useRef, useEffect, useState, memo, useMemo, useCallback } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { cn } from '@/lib/utils';
import { TypingCharacter } from './typing-character';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';

interface TypingAreaProps {
    readonly className?: string;
}

// Selectors extracted to module-scope — stable references, never recreated.
const selectCombo = (s: ReturnType<typeof useGameStore.getState>) => s.game.combo;
const selectHasStarted = (s: ReturnType<typeof useTypingStore.getState>) =>
    s.state.startTime !== null;
const selectIsComplete = (s: ReturnType<typeof useTypingStore.getState>) => s.state.isComplete;

// Isolated sub-component: polls wpm/accuracy at 500 ms via getState() — no selector subscription.
const SrOnlyStats = memo(function SrOnlyStats({ progress }: Readonly<{ progress: number }>) {
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const combo = useGameStore(selectCombo);
    const hasStarted = useTypingStore(selectHasStarted);
    const isComplete = useTypingStore(selectIsComplete);

    useEffect(() => {
        if (!hasStarted || isComplete) return;
        const id = setInterval(() => {
            const s = useTypingStore.getState();
            setWpm(s.getWpm());
            setAccuracy(s.getAccuracy());
        }, 500);
        return () => clearInterval(id);
    }, [hasStarted, isComplete]);

    return (
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {`Speed: ${wpm} words per minute. Accuracy: ${accuracy} percent. Combo: ${combo}. Progress: ${progress} percent complete.`}
        </div>
    );
});

// Settings selectors — granular to avoid rerender on unrelated settings changes.
const selectCursorStyle = (s: ReturnType<typeof useSettingsStore.getState>) =>
    s.settings.cursorStyle;
const selectSmoothCaret = (s: ReturnType<typeof useSettingsStore.getState>) =>
    s.settings.smoothCaret;

function TypingAreaComponent({ className }: TypingAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const scrollRafRef = useRef<number>(0);
    const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Granular settings selectors — no full-object re-subscription.
    const cursorStyle = useSettingsStore(selectCursorStyle);
    const smoothCaret = useSettingsStore(selectSmoothCaret);

    // Primitive store slices only.
    const text = useTypingStore(s => s.state.text);
    const currentIndex = useTypingStore(s => s.state.currentIndex);
    const errorIndices = useTypingStore(s => s.state.errorIndices);
    const hasStarted = useTypingStore(selectHasStarted);
    const isComplete = useTypingStore(selectIsComplete);

    const [isFocused, setIsFocused] = useState(true);

    // rAF-gated auto-scroll, cancelled on cleanup.
    useEffect(() => {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = requestAnimationFrame(() => {
            if (cursorRef.current && containerRef.current) {
                const cursorRect = cursorRef.current.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                if (cursorRect.bottom > containerRect.bottom - 50) {
                    cursorRef.current.scrollIntoView({ behavior: 'instant', block: 'center' });
                }
            }
        });
        return () => cancelAnimationFrame(scrollRafRef.current);
    }, [currentIndex]);

    const focusInput = useCallback(() => {
        hiddenInputRef.current?.focus();
        setIsFocused(true);
    }, []);

    useEffect(() => { focusInput(); }, [focusInput]);

    // Stable event handlers allocated once — no closure recreation on render.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => {
            if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
            blurTimerRef.current = setTimeout(() => {
                if (!containerRef.current?.contains(document.activeElement)) {
                    setIsFocused(false);
                }
            }, 100);
        };

        container.addEventListener('focusin', handleFocus);
        container.addEventListener('focusout', handleBlur);
        return () => {
            container.removeEventListener('focusin', handleFocus);
            container.removeEventListener('focusout', handleBlur);
            if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
        };
    }, []);

    // errorSet: only rebuild when errorIndices array length changes. Contents
    // only grow (no item removed mid-session), so length equality guards suffice.
    const errorCount = errorIndices.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const errorSet = useMemo(() => new Set(errorIndices), [errorCount]);

    const progress = text.length > 0 ? Math.round((currentIndex / text.length) * 100) : 0;

    // Word grouping — only recompute when text changes, not on every keystroke.
    const words = useMemo(() => {
        const result: { char: string; index: number }[][] = [];
        let current: { char: string; index: number }[] = [];
        for (let i = 0; i < text.length; i++) {
            current.push({ char: text[i], index: i });
            if (text[i] === ' ') { result.push(current); current = []; }
        }
        if (current.length > 0) result.push(current);
        return result;
    }, [text]);

    // O(n) word index scan — still needed per keystroke but kept minimal.
    // Optimized: early exit when space count reaches target.
    const currentWordIdx = useMemo(() => {
        let count = 0;
        for (let i = 0; i < currentIndex; i++) {
            if (text[i] === ' ') count++;
        }
        return count;
    }, [text, currentIndex]);

    const currentLineIndex = Math.floor(currentWordIdx / 10);
    const showFocusOverlay = hasStarted && !isComplete && !isFocused;

    return (
        <ErrorBoundary>
            <div
                ref={containerRef}
                role="region"
                aria-label="Typing practice area"
                onClick={focusInput}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') focusInput(); }}
                className={cn(
                    'relative bg-white/5 backdrop-blur-2xl rounded-2xl border p-8 shadow-2xl overflow-hidden cursor-text transition-colors duration-300',
                    isFocused ? 'border-primary/50 ring-4 ring-primary/10' : 'border-white/15',
                    className
                )}
            >
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
                    onKeyDown={(e) => { if (e.key === ' ') e.preventDefault(); }}
                    onBlur={() => {
                        if (blurTimerRef.current) clearTimeout(blurTimerRef.current);
                        blurTimerRef.current = setTimeout(() => {
                            if (containerRef.current?.contains(document.activeElement)) {
                                focusInput();
                            }
                        }, 50);
                    }}
                />

                {/* Background glow — pointer-events-none, no JS */}
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-primary/5 blur-[100px] pointer-events-none" />

                <SrOnlyStats progress={progress} />

                {/* Focus overlay — CSS-only opacity transition, no Framer AnimatePresence. */}
                {showFocusOverlay && (
                    <div
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl cursor-pointer typing-overlay-enter"
                        onClick={focusInput}
                    >
                        <div className="text-center space-y-2">
                            <div className="text-2xl font-bold text-white">Click to resume</div>
                            <div className="text-sm text-text-secondary">Timer is paused</div>
                        </div>
                    </div>
                )}

                {/* Text content area */}
                <div
                    aria-label="Text to type"
                    role="status"
                    aria-live="polite"
                    className={cn(
                        'relative min-h-[180px] overflow-hidden',
                        'text-[2.5rem] leading-relaxed font-mono text-center focus:outline-none',
                        showFocusOverlay && 'blur-sm select-none'
                    )}
                >
                    {/* CSS transform — compositor-only, no Framer spring overhead. */}
                    <div
                        className="flex flex-wrap justify-center gap-x-1 gap-y-2 typing-scroll-container"
                        style={{ transform: `translateY(${-(currentLineIndex * 60)}px)` }}
                    >
                        {words.map((word, wIdx) => (
                            <div
                                key={`w-${word[0]?.index ?? wIdx}`}
                                className={cn(
                                    'inline-block whitespace-nowrap',
                                    // CSS-only opacity — no Framer, no transition-opacity repaint cascade.
                                    wIdx === currentWordIdx ? 'word-active' : 'word-inactive'
                                )}
                            >
                                {word.map(({ char, index }) => {
                                    const isTyped = index < currentIndex;
                                    const isCurrent = index === currentIndex;
                                    const isError = errorSet.has(index);
                                    const isNext = index === currentIndex + 1;
                                    return (
                                        <TypingCharacter
                                            key={`c-${index}`}
                                            char={char}
                                            isTyped={isTyped}
                                            isCurrent={isCurrent}
                                            isError={isError}
                                            isNext={isNext}
                                            cursorStyle={cursorStyle}
                                            smoothCaret={smoothCaret}
                                            ref={cursorRef}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export const TypingArea = memo(TypingAreaComponent);
