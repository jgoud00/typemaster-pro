'use client';

import { useRef, useEffect, useState, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/stores/settings-store';
import { HandOverlay } from '@/components/keyboard/HandOverlay';
import { cn } from '@/lib/utils';
import { useWeaknessDetectorWorker } from '@/hooks/use-weakness-detector-worker';
import { WeaknessOverlay } from './WeaknessOverlay';
import { useErrorExplanation } from './ErrorExplanationToast';
import { TypingCharacter } from './typing-character';

import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';

interface TypingAreaProps {
    readonly ghostIndex?: number;
    readonly predictedMistakeIndices?: number[];
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
    ghostIndex,
    predictedMistakeIndices = [],
    className
}: TypingAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const { settings } = useSettingsStore();
    const { cursorStyle } = settings;

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

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

    const [errorProbabilities, setErrorProbabilities] = useState<Map<string, number>>(new Map());
    const { analyzeAllKeys } = useWeaknessDetectorWorker();

    useEffect(() => {
        analyzeAllKeys()
            .then((analysis: any[]) => {
                const probs = new Map<string, number>();
                analysis.forEach((w: any) => probs.set(w.key, w.accuracyEstimate < 0.8 ? (1 - w.accuracyEstimate) : 0));
                setErrorProbabilities(probs);
            })
            .catch(console.error);
    }, [text, analyzeAllKeys]);

    const { recordError } = useErrorExplanation();

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

    const errorSet = useMemo(() => new Set(errorIndices), [errorIndices]);
    const predictionSet = useMemo(() => new Set(predictedMistakeIndices), [predictedMistakeIndices]);
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
    // (Assuming ~10 words per line on average)
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
        <div
            ref={containerRef}
            role="application"
            aria-label="Typing practice area"
            className={cn(
                // Large rectangular box with glassmorphism
                'relative bg-white/5 backdrop-blur-2xl rounded-2xl',
                'border border-white/15 shadow-2xl shadow-black/20',
                className
            )}
        >

            {/* Weakness Overlay - Predictive Warning */}
            <WeaknessOverlay
                text={text}
                currentIndex={currentIndex}
                errorProbabilities={errorProbabilities}
            />

            {/* Screen reader live region — isolated to avoid re-rendering char grid */}
            <SrOnlyStats progress={progress} />

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
                    'p-4 md:p-8',
                    'min-h-[180px] max-h-[280px] overflow-hidden',
                    'text-[1.8rem] leading-[1.7] font-medium tracking-[0.05em] font-mono focus:outline-none selection:bg-transparent'
                )}
            >
                <motion.div 
                    className="text-wrap wrap-break-word flex flex-wrap gap-x-0 gap-y-2"
                    animate={{ y: -(currentLineIndex * 40) }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {words.map((word, wIdx) => (
                        <div key={wIdx} className={cn(
                            "inline-block whitespace-nowrap transition-opacity duration-200",
                            wIdx === currentWordIdx ? "opacity-100" : "opacity-40"
                        )}>
                            {word.map(({ char, index }) => {
                                const isTyped = index < currentIndex;
                                const isCurrent = index === currentIndex;
                                const isError = errorSet.has(index);
                                const isPredictedError = predictionSet.has(index);
                                const isNext = index === currentIndex + 1;
                                const isGhost = ghostIndex !== undefined && index === Math.floor(ghostIndex);
                                const errorProb = errorProbabilities.get(char.toLowerCase()) || 0;

                                return (
                                    <TypingCharacter
                                        key={index}
                                        char={char}
                                        isTyped={isTyped}
                                        isCurrent={isCurrent}
                                        isError={isError}
                                        isPredictedError={isPredictedError}
                                        isNext={isNext}
                                        isGhost={isGhost}
                                        errorProb={errorProb}
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

            {/* Gradient fade at bottom for scroll indication */}
            <div
                className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card/90 via-card/50 to-transparent pointer-events-none rounded-b-2xl"
                aria-hidden="true"
            />
            {/* Hand & Finger Fatigue Overlay */}
            {settings.showKeyboardOverlay && (
                <div className="mt-8">
                    <HandOverlay />
                </div>
            )}
        </div>
    );
}

export const TypingArea = memo(TypingAreaComponent);
