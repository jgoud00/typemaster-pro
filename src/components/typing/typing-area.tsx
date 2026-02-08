'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ultimateWeaknessDetector } from '@/lib/algorithms/ultimate-weakness-detector';
import { WeaknessOverlay, CharacterDifficultyIndicator } from './WeaknessOverlay';
import { useErrorExplanation } from './ErrorExplanationToast';

interface TypingAreaProps {
    readonly text: string;
    readonly currentIndex: number;
    readonly errorIndices: number[];
    readonly wpm?: number;
    readonly accuracy?: number;
    readonly combo?: number;
    readonly className?: string;
}

export function TypingArea({
    text,
    currentIndex,
    errorIndices,
    wpm = 0,
    accuracy = 100,
    combo = 0,
    className
}: TypingAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);

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

    const [errorProbabilities, setErrorProbabilities] = useState<Map<string, number>>(new Map());
    const { recordError } = useErrorExplanation();

    // Update error probabilities when text changes
    useEffect(() => {
        const probs = new Map<string, number>();
        const analysis = ultimateWeaknessDetector.analyzeAll();
        analysis.forEach(w => probs.set(w.key, w.accuracyEstimate < 0.8 ? (1 - w.accuracyEstimate) : 0));
        setErrorProbabilities(probs);
    }, [text]);

    // Record errors for explanation engine
    useEffect(() => {
        const lastErrorIndex = errorIndices[errorIndices.length - 1];
        if (lastErrorIndex === currentIndex - 1) {
            const expected = text[lastErrorIndex];
            // We don't have the actual typed char here easily without changing the hook, 
            // but we can infer or pass it down. For now, we'll skip recording here 
            // and rely on the parent component or hook to handle recording if needed,
            // or just use the existence of an error to trigger the explanation toast 
            // if we had the actual char.
            // 
            // A better approach is to let the hook handle recording, 
            // but for now we'll just show the toast if we have error context.
        }
    }, [errorIndices, currentIndex, text]);

    const errorSet = new Set(errorIndices);
    const progress = text.length > 0 ? Math.round((currentIndex / text.length) * 100) : 0;

    return (
        <div
            ref={containerRef}
            role="application"
            aria-label="Typing practice area"
            className={cn(
                // Large rectangular box with prominent styling
                'relative bg-card/80 backdrop-blur rounded-2xl border-2 border-border/50',
                'shadow-lg shadow-black/5',
                className
            )}
        >
            {/* Weakness Overlay - Predictive Warning */}
            <WeaknessOverlay
                text={text}
                currentIndex={currentIndex}
                errorProbabilities={errorProbabilities}
            />

            {/* Screen reader live region for stats announcements */}
            <div
                className="sr-only"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {`Speed: ${wpm} words per minute. Accuracy: ${accuracy} percent. Combo: ${combo}. Progress: ${progress} percent complete.`}
            </div>

            {/* Hidden instructions for screen readers */}
            <p id="typing-instructions" className="sr-only">
                Type the characters shown below. Correct characters turn green with a checkmark effect.
                Incorrect attempts are marked with an underline. Press Escape to restart.
            </p>

            {/* Text content area - larger and more readable */}
            <div
                role="textbox"
                aria-label="Text to type"
                aria-describedby="typing-instructions"
                aria-readonly="true"
                className={cn(
                    'p-8 md:p-10',
                    'min-h-[180px] max-h-[280px] overflow-y-auto',
                    'font-mono text-xl md:text-2xl leading-relaxed tracking-wide',
                    'selection:bg-primary/20'
                )}
            >
                <div className="text-wrap wrap-break-word">
                    {text.split('').map((char, index) => {
                        const isTyped = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isError = errorSet.has(index);
                        const isNext = index === currentIndex + 1;

                        // Get probability for this char
                        const errorProb = errorProbabilities.get(char.toLowerCase()) || 0;

                        return (
                            <span
                                key={index}
                                ref={isCurrent ? cursorRef : undefined}
                                aria-current={isCurrent ? 'location' : undefined}
                                aria-label={isCurrent ? `Next character: ${char === ' ' ? 'space' : char}` : undefined}
                                className={cn(
                                    'relative inline-block', // Changed to inline-block for transforms
                                    'transition-colors duration-75',
                                    // Typed correctly - bright green
                                    isTyped && !isError && 'text-green-400',
                                    // Typed with error - green but with underline for colorblind support
                                    isTyped && isError && 'text-green-400 underline decoration-wavy decoration-amber-500',
                                    // Current position - highlighted with border for colorblind support
                                    isCurrent && !isError && 'text-foreground bg-primary/10 border-b-2 border-primary',
                                    // Current position with previous errors
                                    isCurrent && isError && 'bg-red-500/20 text-foreground underline decoration-wavy decoration-red-500',
                                    // Not yet typed - muted
                                    !isTyped && !isCurrent && 'text-muted-foreground/60',
                                )}
                            >
                                {/* Cursor - prominent blinking line */}
                                {isCurrent && (
                                    <motion.span
                                        className="absolute left-0 top-[10%] w-[2px] h-[80%] bg-primary rounded-full z-10"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                                        aria-hidden="true"
                                    />
                                )}

                                {/* Character */}
                                {char === ' ' ? '\u00A0' : char}

                                {/* Error underline for current position */}
                                {isCurrent && isError && (
                                    <span
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                                        aria-hidden="true"
                                    />
                                )}

                                {/* Predictive Difficulty Indicator */}
                                {!isTyped && !isError && (
                                    <CharacterDifficultyIndicator
                                        probability={errorProb}
                                        isNextChar={isCurrent || isNext}
                                    />
                                )}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Gradient fade at bottom for scroll indication */}
            <div
                className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card/90 via-card/50 to-transparent pointer-events-none rounded-b-2xl"
                aria-hidden="true"
            />
        </div>
    );
}
