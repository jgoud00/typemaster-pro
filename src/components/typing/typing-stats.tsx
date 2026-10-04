'use client';

import { cn } from '@/lib/utils';
import { memo, useState, useEffect } from 'react';
import { useTypingStore } from '@/stores/typing-store';

const selectStartTime = (s: ReturnType<typeof useTypingStore.getState>) => s.state.startTime;
const selectIsComplete = (s: ReturnType<typeof useTypingStore.getState>) => s.state.isComplete;
const selectIsPaused = (s: ReturnType<typeof useTypingStore.getState>) => s.state.isPaused;

export const TypingStats = memo(function TypingStats({
  remainingTime,
  className,
  totalWords,
}: {
  readonly remainingTime?: number | null;
  readonly className?: string;
  readonly totalWords?: number;
}) {
  const startTime = useTypingStore(selectStartTime);
  const isComplete = useTypingStore(selectIsComplete);
  const isPaused = useTypingStore(selectIsPaused);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);

  useEffect(() => {
    const active = startTime !== null && !isComplete && !isPaused;

    const tick = () => {
      const s = useTypingStore.getState();
      setWpm(s.getWpm());
      setAccuracy(s.getAccuracy());
      setElapsedTime(s.getElapsedTime());

      if (totalWords) {
        const typedText = s.state.text.substring(0, s.state.currentIndex);
        const words = typedText.trim() === '' ? 0 : typedText.trim().split(/\s+/).length;
        setWordsTyped(words);
      }
    };
    tick();
    if (!active) return;
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [startTime, isComplete, isPaused, totalWords]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayWpm = wpm > 0 ? wpm : 0;
  const displayAcc = `${accuracy}%`;
  const displayTime = formatTime(remainingTime ?? elapsedTime);

  const stats = [
    ...(totalWords
      ? [
          {
            value: `${wordsTyped}/${totalWords}`,
            label: 'words',
            testId: 'words',
            highlight: !!startTime,
          },
        ]
      : []),
    { value: displayTime, label: 'time', testId: 'timer', highlight: !!startTime },
    { value: displayWpm, label: 'wpm', testId: 'wpm', highlight: wpm > 0 },
    {
      value: displayAcc,
      label: 'acc',
      testId: 'accuracy',
      highlight: accuracy < 100 && accuracy > 0 && !!startTime,
    },
  ];

  return (
    <div className={cn('flex justify-center items-center gap-2 mb-8 select-none', className)}>
      <div className="flex items-center gap-px rounded-xl bg-card border border-border overflow-hidden shadow-xs">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2 px-3 sm:px-5 py-3 relative group"
          >
            {i > 0 && <div className="absolute left-0 inset-y-2.5 w-px bg-muted/60" />}
            <span
              data-testid={stat.testId}
              className={cn(
                'font-mono font-bold tabular-nums text-xl md:text-3xl transition-colors duration-200',
                stat.highlight ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {stat.value}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});
