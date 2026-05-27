'use client';

import { memo } from 'react';
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

/**
 * TypingCharacter — Pure CSS animation, no useState.
 * 
 * Previous implementation used useState + setTimeout for correct-flash animation,
 * causing a re-render on every correctly typed character. Now the animation is
 * triggered purely by CSS class transitions (animate-char-correct), which the
 * browser handles on the compositor thread.
 */
export const TypingCharacter = memo(function TypingCharacter({
    char,
    isTyped,
    isCurrent,
    isError,
    isNext,
    cursorStyle,
    ref,
}: Readonly<TypingCharacterProps>) {
    return (
        <span
            ref={isCurrent ? ref : undefined}
            aria-current={isCurrent ? 'location' : undefined}
            aria-label={isCurrent ? `Next character: ${char === ' ' ? 'space' : char}` : undefined}
            className={cn(
                'relative inline-block',
                isError && isCurrent && 'animate-char-shake',
                isTyped && !isError && 'char-correct animate-char-correct',
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
    prev.smoothCaret === next.smoothCaret &&
    prev.char === next.char
);
