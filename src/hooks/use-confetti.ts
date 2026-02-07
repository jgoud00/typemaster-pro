'use client';

import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
    const isPlayingRef = useRef(false);

    const fireConfetti = useCallback((options?: confetti.Options) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            ...options,
        });
    }, []);

    const fireComboMilestone = useCallback((level: number) => {
        if (isPlayingRef.current) return;
        isPlayingRef.current = true;

        const colors = [
            ['#ffd700', '#ffaa00'], // Level 1 - Gold
            ['#00ff88', '#00cc66'], // Level 2 - Green
            ['#00aaff', '#0088cc'], // Level 3 - Blue
            ['#ff00ff', '#cc00cc'], // Level 4 - Purple (max)
        ];

        const selectedColors = colors[Math.min(level - 1, colors.length - 1)];

        // Side cannons
        const count = 50 + level * 25;
        const defaults = {
            origin: { y: 0.7 },
            colors: selectedColors,
        };

        confetti({
            ...defaults,
            particleCount: count,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });

        confetti({
            ...defaults,
            particleCount: count,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        setTimeout(() => {
            isPlayingRef.current = false;
        }, 1000);
    }, []);

    const fireLessonComplete = useCallback(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = {
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 999, // Below modals but above content
            disableForReducedMotion: true,
        };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    }, []);

    const fireStars = useCallback((starCount: number) => {
        const shapes: confetti.Shape[] = ['star'];
        const colors = ['#ffd700', '#ffcc00', '#ff9900'];

        for (let i = 0; i < starCount; i++) {
            setTimeout(() => {
                confetti({
                    particleCount: 20,
                    spread: 60,
                    shapes,
                    colors,
                    origin: { x: 0.3 + i * 0.2, y: 0.5 },
                });
            }, i * 300);
        }
    }, []);

    return {
        fireConfetti,
        fireComboMilestone,
        fireLessonComplete,
        fireStars,
    };
}
