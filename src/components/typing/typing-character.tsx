'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TypingCharacterProps {
    char: string;
    isTyped: boolean;
    isCurrent: boolean;
    isError: boolean;
    isNext: boolean;
    cursorStyle: 'line' | 'block' | 'underline' | 'bar';
    smoothCaret: boolean;
    ref?: React.RefObject<HTMLSpanElement | null>;
}

export const TypingCharacter = memo(function TypingCharacter({
    char,
    isTyped,
    isCurrent,
    isError,
    isNext,
    cursorStyle,
    ref,
}: Readonly<TypingCharacterProps>) {
    const [showCorrectFlash, setShowCorrectFlash] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Trigger bounce when char transitions to correct
    useEffect(() => {
        if (isTyped && !isError) {
            setShowCorrectFlash(true);
            timerRef.current = setTimeout(() => setShowCorrectFlash(false), 120);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isTyped, isError]);

    return (
        <span
            ref={isCurrent ? ref : undefined}
            aria-current={isCurrent ? 'location' : undefined}
            aria-label={isCurrent ? `Next character: ${char === ' ' ? 'space' : char}` : undefined}
            className={cn(
                'relative inline-block',
                isError && isCurrent && 'animate-char-shake',
                showCorrectFlash && 'animate-char-correct',
                isTyped && !isError && 'char-correct',
                isCurrent && 'char-active',
                isTyped && isError && 'char-error',
                !isTyped && !isCurrent && 'char-untyped',
            )}
        >
            {/* Caret — cyan glow pulse, no Framer overhead */}
            {isCurrent && (
                <span
                    className={cn(
                        'absolute left-0 top-[10%] w-[3px] h-[80%] rounded-sm caret-glow',
                        'bg-(--color-primary)',
                        cursorStyle === 'block' && 'w-full opacity-30',
                        cursorStyle === 'underline' && 'top-auto bottom-0 h-[3px] w-full',
                    )}
                    style={{
                        boxShadow: '0 0 8px color-mix(in srgb, var(--color-primary) 50%, transparent)',
                    }}
                />
            )}

            {char === ' ' ? '\u00A0' : char}
        </span>
    );
}, (prev, next) =>
    prev.isTyped === next.isTyped &&
    prev.isCurrent === next.isCurrent &&
    prev.isError === next.isError &&
    prev.isNext === next.isNext &&
    prev.cursorStyle === next.cursorStyle &&
    prev.char === next.char
);
