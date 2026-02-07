'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TypingAreaProps {
    text: string;
    currentIndex: number;
    errorIndices: number[];
    className?: string;
}

export function TypingArea({ text, currentIndex, errorIndices, className }: TypingAreaProps) {
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

    const errorSet = new Set(errorIndices);

    return (
        <div
            ref={containerRef}
            className={cn(
                // Large rectangular box with prominent styling
                'relative bg-card/80 backdrop-blur rounded-2xl border-2 border-border/50',
                'shadow-lg shadow-black/5',
                className
            )}
        >
            {/* Text content area - larger and more readable */}
            <div
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

                        return (
                            <span
                                key={index}
                                ref={isCurrent ? cursorRef : undefined}
                                className={cn(
                                    'relative inline',
                                    'transition-colors duration-75',
                                    // Typed correctly - bright green
                                    isTyped && !isError && 'text-green-400',
                                    // Typed with error (but eventually corrected)
                                    isTyped && isError && 'text-green-400',
                                    // Current position - highlighted
                                    isCurrent && !isError && 'text-foreground',
                                    // Current position with previous errors
                                    isCurrent && isError && 'bg-red-500/20 text-foreground',
                                    // Not yet typed - muted
                                    !isTyped && !isCurrent && 'text-muted-foreground/60',
                                )}
                            >
                                {/* Cursor - prominent blinking line */}
                                {isCurrent && (
                                    <motion.span
                                        className="absolute left-0 top-[10%] w-[2px] h-[80%] bg-primary rounded-full"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                )}

                                {/* Character */}
                                {char === ' ' ? '\u00A0' : char}

                                {/* Error underline for current position */}
                                {isCurrent && isError && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
                                )}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Gradient fade at bottom for scroll indication */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-card/90 via-card/50 to-transparent pointer-events-none rounded-b-2xl" />
        </div>
    );
}

