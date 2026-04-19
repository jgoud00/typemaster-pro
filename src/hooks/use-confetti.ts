'use client';

import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
    const isPlayingRef = useRef(false);

    const fireConfetti = useCallback((options?: confetti.Options) => {
        if (isPlayingRef.current) return;
        isPlayingRef.current = true;

        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            ...options,
        })?.finally(() => {
            isPlayingRef.current = false;
        });
    }, []);

    const fireComboMilestone = useCallback((level: number) => {
        const colors: Record<number, string[]> = {
            1: ['#fbbf24', '#f59e0b'],
            2: ['#3b82f6', '#60a5fa'],
            3: ['#a855f7', '#c084fc'],
            4: ['#ef4444', '#f97316', '#eab308'],
        };

        const particleCount = 30 + level * 20;
        const selectedColors = colors[level] ?? ['#8b5cf6'];

        confetti({
            particleCount,
            spread: 60 + level * 10,
            origin: { y: 0.7 },
            colors: selectedColors,
        });
    }, []);

    const fireLessonComplete = useCallback(() => {
        // Fire a burst from each side
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        confetti({
            ...defaults,
            particleCount: 50,
            origin: { x: 0.2, y: 0.5 },
        });

        setTimeout(() => {
            confetti({
                ...defaults,
                particleCount: 50,
                origin: { x: 0.8, y: 0.5 },
            });
        }, 150);

        setTimeout(() => {
            confetti({
                ...defaults,
                particleCount: 80,
                origin: { x: 0.5, y: 0.4 },
                colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
            });
        }, 300);
    }, []);

    const fireStars = useCallback((starCount: number) => {
        const shapes: confetti.Shape[] = ['star'];
        const colors = ['#fbbf24', '#f59e0b', '#d97706'];

        for (let i = 0; i < starCount; i++) {
            setTimeout(() => {
                confetti({
                    particleCount: 15,
                    spread: 50,
                    origin: { x: 0.3 + i * 0.2, y: 0.5 },
                    shapes,
                    colors,
                    scalar: 1.2,
                });
            }, i * 200);
        }
    }, []);

    return {
        fireConfetti,
        fireComboMilestone,
        fireLessonComplete,
        fireStars,
    };
}
