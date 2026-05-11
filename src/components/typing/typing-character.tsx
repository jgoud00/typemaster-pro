import { memo } from 'react';
import { motion } from 'framer-motion';
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
    smoothCaret,
    ref
}: TypingCharacterProps) {
    return (
        <motion.span
            ref={isCurrent ? ref : undefined}
            aria-current={isCurrent ? 'location' : undefined}
            aria-label={isCurrent ? `Next character: ${char === ' ' ? 'space' : char}` : undefined}
            animate={
                isError && isCurrent ? { x: [-2, 2, -2, 2, 0], color: '#f87171' } :
                    isTyped && !isError ? { scale: [1, 1.05, 1] } : {}
            }
            transition={{ duration: 0.15 }}
            className={cn(
                'relative inline-block transition-colors duration-75',

                // CURRENT CHARACTER (cursor position)
                isCurrent && 'char-active',

                // CORRECT TYPED TEXT
                isTyped && !isError && 'char-correct',

                // ERROR TEXT
                isTyped && isError && 'char-error',

                // FUTURE TEXT (dim but readable)
                !isTyped && !isCurrent && 'char-untyped'
            )}
        >
            {/* The Cursor Element (Smooth animated caret) */}
            {isCurrent && (
                <motion.div
                    layoutId={smoothCaret ? "caret" : undefined}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute left-0 top-[10%] w-[3px] h-[80%] bg-yellow-500 rounded-sm shadow-[0_0_8px_rgba(234,179,8,0.5)] opacity-90 animate-pulse"
                    style={{ animationDuration: '1.2s' }}
                />
            )}



            {/* Character */}
            {char === ' ' ? '\u00A0' : char}
        </motion.span>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function for performance
    // Only re-render if any of these props change
    return (
        prevProps.isTyped === nextProps.isTyped &&
        prevProps.isCurrent === nextProps.isCurrent &&
        prevProps.isError === nextProps.isError &&
        prevProps.isNext === nextProps.isNext &&
        prevProps.cursorStyle === nextProps.cursorStyle &&
        prevProps.smoothCaret === nextProps.smoothCaret &&
        prevProps.char === nextProps.char
    );
});
