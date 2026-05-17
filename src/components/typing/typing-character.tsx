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
                // Error shake — pure CSS, no JS animation frame
                isError && isCurrent && 'animate-char-shake',
                // Correct flash — pure CSS keyframe, skipped for untouched chars
                isTyped && !isError && 'char-correct',
                isCurrent && 'char-active',
                isTyped && isError && 'char-error',
                !isTyped && !isCurrent && 'char-untyped',
            )}
        >
            {/* Caret — rendered only on the active character. No Framer overhead. */}
            {isCurrent && (
                <span
                    className={cn(
                        'absolute left-0 top-[10%] w-[3px] h-[80%] bg-yellow-500 rounded-sm shadow-[0_0_8px_rgba(234,179,8,0.5)] caret-blink',
                        cursorStyle === 'block' && 'w-full opacity-30',
                        cursorStyle === 'underline' && 'top-auto bottom-0 h-[3px] w-full',
                    )}
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
