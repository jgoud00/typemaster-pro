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
    errorProb: number;
    cursorStyle: 'line' | 'block' | 'underline' | 'bar';
    smoothCaret: boolean;
    cursorRef?: React.RefObject<HTMLSpanElement | null>;
}

export const TypingCharacter = memo(function TypingCharacter({
    char,
    isTyped,
    isCurrent,
    isError,
    isNext,
    isGhost,
    errorProb,
    cursorStyle,
    smoothCaret,
    cursorRef
}: TypingCharacterProps) {
    return (
        <span
            ref={isCurrent ? cursorRef : undefined}
            aria-current={isCurrent ? 'location' : undefined}
            aria-label={isCurrent ? `Next character: ${char === ' ' ? 'space' : char}` : undefined}
            className={cn(
                'relative inline-block',
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
            {/* Cursor - Configurable Styles */}
            {isCurrent && (
                <motion.span
                    className={cn(
                        "absolute z-10 bg-primary/90",
                        cursorStyle === 'line' && "left-0 top-[10%] w-[2px] h-[80%] rounded-full",
                        cursorStyle === 'block' && "inset-0 opacity-30 animate-pulse",
                        cursorStyle === 'underline' && "left-0 right-0 bottom-0 h-[3px] rounded-full",
                        cursorStyle === 'bar' && "left-0 top-0 w-[4px] h-full rounded-full"
                    )}
                    animate={cursorStyle !== 'block' ? { opacity: [1, 0, 1] } : undefined}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    aria-hidden="true"
                    layoutId={smoothCaret ? "caret" : undefined}
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
}, (prevProps, nextProps) => {
    // Custom comparison function for performance
    // Only re-render if any of these props change
    return (
        prevProps.isTyped === nextProps.isTyped &&
        prevProps.isCurrent === nextProps.isCurrent &&
        prevProps.isError === nextProps.isError &&
        prevProps.isNext === nextProps.isNext &&
        prevProps.isGhost === nextProps.isGhost &&
        prevProps.errorProb === nextProps.errorProb &&
        prevProps.cursorStyle === nextProps.cursorStyle &&
        prevProps.smoothCaret === nextProps.smoothCaret &&
        prevProps.char === nextProps.char
        // Note: cursorRef doesn't need deep comparison as it's conditionally passed based on isCurrent
    );
});
