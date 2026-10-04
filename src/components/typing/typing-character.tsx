'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface TypingCharacterProps {
  char: string;
  isTyped: boolean;
  isCurrent: boolean;
  isError: boolean;
  cursorStyle: 'line' | 'block' | 'underline' | 'bar';
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
export const TypingCharacter = memo(
  function TypingCharacter({
    char,
    isTyped,
    isCurrent,
    isError,
    cursorStyle,
    ref,
  }: Readonly<TypingCharacterProps>) {
    return (
      <span
        ref={isCurrent ? ref : undefined}
        aria-current={isCurrent ? 'location' : undefined}
        aria-label={isCurrent ? `Next character: ${char === ' ' ? 'space' : char}` : undefined}
        className={cn(
          'relative inline-block transition-colors duration-75',
          isError && isCurrent && 'animate-char-shake',
          isTyped && !isError && 'char-correct',
          isCurrent && 'char-active font-medium',
          isError && 'char-error',
          !isTyped && !isCurrent && 'char-untyped',
        )}
      >
        {/* Amber Caret Indicator */}
        {isCurrent && (
          <span
            className={cn(
              'absolute pointer-events-none caret-blink transition-all duration-75',
              (cursorStyle === 'line' || cursorStyle === 'bar' || !cursorStyle) &&
                'left-0 top-[10%] w-[2.5px] h-[80%] bg-primary rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]',
              cursorStyle === 'block' &&
                'inset-0 bg-primary/25 rounded-xs border-b-2 border-primary',
              cursorStyle === 'underline' &&
                'bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]',
            )}
          />
        )}

        {char === ' ' ? '\u00A0' : char}
      </span>
    );
  },
  (prev, next) =>
    prev.isTyped === next.isTyped &&
    prev.isCurrent === next.isCurrent &&
    prev.isError === next.isError &&
    prev.cursorStyle === next.cursorStyle &&
    prev.char === next.char,
);
