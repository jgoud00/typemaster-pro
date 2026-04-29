import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CharacterDifficultyIndicator } from './WeaknessOverlay';

interface TypingCharacterProps {
    char: string;
    isTyped: boolean;
    isCurrent: boolean;
    isError: boolean;
    isNext: boolean;
    isGhost: boolean;
    isPredictedError?: boolean;
    errorProb: number;
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
    isGhost,
    isPredictedError,
    errorProb,
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
                'relative inline-block',
                'transition-colors duration-150',
                // Typed correctly - crisp white/primary (old text)
                isTyped && !isError && 'text-primary opacity-60 drop-shadow-[0_0_2px_rgba(255,255,255,0.1)]',
                // Typed with error - softer red
                isTyped && isError && 'text-red-400 opacity-60',
                // Current position
                isCurrent && !isError && 'text-primary opacity-100',
                isCurrent && isError && 'text-red-500 opacity-100',
                // Predicted error - amber glow
                !isTyped && isPredictedError && 'text-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
                // Not yet typed - subtle dim
                !isTyped && !isCurrent && !isPredictedError && 'text-muted-foreground/30',
            )}
        >
            {/* The Cursor Element (Smooth animated caret) */}
            {isCurrent && (
                <motion.div
                    layoutId={smoothCaret ? "caret" : undefined}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute left-0 top-[10%] w-[3px] h-[80%] bg-primary rounded-sm shadow-[0_0_8px_var(--color-primary)] opacity-90 animate-pulse"
                    style={{ animationDuration: '1.2s' }}
                />
            )}

            {/* Ghost Cursor */}
            {isGhost && !isCurrent && (
                <span
                    className="absolute left-0 top-[10%] w-[2px] h-[80%] bg-emerald-500/50 z-20 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    aria-hidden="true"
                />
            )}

            {/* Character */}
            {char === ' ' ? '\u00A0' : char}

            {/* Predictive Difficulty Indicator */}
            {!isTyped && !isError && (
                <CharacterDifficultyIndicator
                    probability={errorProb}
                    isNextChar={isCurrent || isNext}
                />
            )}
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
        prevProps.isGhost === nextProps.isGhost &&
        prevProps.isPredictedError === nextProps.isPredictedError &&
        prevProps.errorProb === nextProps.errorProb &&
        prevProps.cursorStyle === nextProps.cursorStyle &&
        prevProps.smoothCaret === nextProps.smoothCaret &&
        prevProps.char === nextProps.char
        // Note: cursorRef doesn't need deep comparison as it's conditionally passed based on isCurrent
    );
});
