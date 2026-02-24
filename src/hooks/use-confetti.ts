'use client';

import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
    const isPlayingRef = useRef(false);

    const fireConfetti = useCallback((options?: confetti.Options) => {
        // Visual effects disabled
    }, []);

    const fireComboMilestone = useCallback((level: number) => {
        // Visual effects disabled
    }, []);

    const fireLessonComplete = useCallback(() => {
        // Visual effects disabled
    }, []);

    const fireStars = useCallback((starCount: number) => {
        // Visual effects disabled
    }, []);

    return {
        fireConfetti,
        fireComboMilestone,
        fireLessonComplete,
        fireStars,
    };
}
