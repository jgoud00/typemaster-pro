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
                'relative p-8 bg-card rounded-xl border overflow-hidden',
                'font-mono text-2xl leading-loose tracking-wide',
                className
            )}
        >
            <div className="max-h-[300px] overflow-y-auto pr-4">
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
                                // Typed correctly
                                isTyped && !isError && 'text-green-500',
                                // Typed with error (but eventually corrected if we reach this point)
                                isTyped && isError && 'text-green-500', // If we passed it, it was eventually correct
                                // Current position - not yet typed but had errors
                                isCurrent && isError && 'bg-red-500/20',
                                // Not yet typed
                                !isTyped && !isCurrent && 'text-muted-foreground/50',
                            )}
                        >
                            {/* Cursor */}
                            {isCurrent && (
                                <motion.span
                                    className="absolute left-0 top-0 w-0.5 h-full bg-primary"
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            )}

                            {/* Character */}
                            {char === ' ' ? '\u00A0' : char}

                            {/* Error underline for current position with previous errors */}
                            {isCurrent && isError && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                            )}
                        </span>
                    );
                })}
            </div>

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-card to-transparent pointer-events-none" />
        </div>
    );
}
