'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useGameStore } from '@/stores/game-store';
import { useProgressStore } from '@/stores/progress-store';
import { useAchievementStore } from '@/stores/achievement-store';
import { ngramAnalyzer } from '@/lib/ngram-analyzer';
import { PracticeMode, PerformanceRecord } from '@/types';

interface UseTypingEngineOptions {
    text: string;
    mode: PracticeMode;
    lessonId?: string;
    timeLimitSeconds?: number;
    onComplete?: (record: PerformanceRecord) => void;
    onComboMilestone?: (combo: number, level: number) => void;
}

export function useTypingEngine({
    text,
    mode,
    lessonId,
    timeLimitSeconds,
    onComplete,
    onComboMilestone,
}: UseTypingEngineOptions) {
    const {
        state,
        activeKey,
        setText,
        handleKeystroke: storeHandleKeystroke,
        reset,
        getWpm,
        getAccuracy,
        getElapsedTime,
        getProgress,
    } = useTypingStore();

    const { recordKeystroke, clearSession } = useAnalyticsStore();
    const { game, incrementCombo, breakCombo, addScore, getComboLevel, checkDailyStreak } = useGameStore();
    const { progress, completeLesson, addRecord, updatePersonalBests, addPracticeTime, addKeystrokes } = useProgressStore();
    const { checkAchievements } = useAchievementStore();

    const previousComboLevel = useRef(0);
    const hasCompleted = useRef(false);

    // Initialize
    useEffect(() => {
        setText(text);
        clearSession();
        hasCompleted.current = false;
        checkDailyStreak();

        return () => {
            reset();
            clearSession();
        };
    }, [text, setText, clearSession, reset, checkDailyStreak]);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore modifier combinations and special keys
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            if (['Escape', 'Tab', 'CapsLock', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
            if (e.key.startsWith('F') && e.key.length > 1) return;
            if (e.key === 'Backspace' || e.key === 'Delete') return;

            // Handle printable characters
            if (e.key.length === 1) {
                e.preventDefault();

                const keystroke = storeHandleKeystroke(e.key);
                if (keystroke) {
                    // Record for analytics
                    recordKeystroke(keystroke);

                    // Record for ngram analysis
                    ngramAnalyzer.recordKeystroke(e.key, keystroke.timestamp, keystroke.isCorrect);

                    // Update game state
                    if (keystroke.isCorrect) {
                        incrementCombo();
                        addScore(10); // Base 10 points per correct keystroke

                        // Check for combo milestone
                        const newLevel = getComboLevel();
                        if (newLevel > previousComboLevel.current) {
                            previousComboLevel.current = newLevel;
                            onComboMilestone?.(game.combo + 1, newLevel);
                        }
                    } else {
                        breakCombo();
                        previousComboLevel.current = 0;
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [storeHandleKeystroke, recordKeystroke, incrementCombo, breakCombo, addScore, getComboLevel, game.combo, onComboMilestone]);

    // Time limit check
    useEffect(() => {
        if (!timeLimitSeconds || !state.startTime || state.isComplete) return;

        const interval = setInterval(() => {
            if (getElapsedTime() >= timeLimitSeconds) {
                finishTest();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [state.startTime, state.isComplete, timeLimitSeconds, getElapsedTime]);

    // Completion handler
    useEffect(() => {
        if (state.isComplete && !hasCompleted.current) {
            hasCompleted.current = true;
            finishTest();
        }
    }, [state.isComplete]);

    const finishTest = useCallback(() => {
        const wpm = getWpm();
        const accuracy = getAccuracy();
        const duration = getElapsedTime();
        const maxCombo = game.maxCombo;
        const score = game.score;

        const record: PerformanceRecord = {
            id: crypto.randomUUID(),
            lessonId,
            mode,
            wpm,
            accuracy,
            duration,
            totalChars: state.currentIndex,
            errors: state.errorIndices.length,
            maxCombo,
            score,
            timestamp: Date.now(),
        };

        // Update stores
        if (mode === 'lesson' && lessonId) {
            completeLesson(lessonId, wpm, accuracy, score);
        }
        addRecord(record);
        updatePersonalBests(wpm, accuracy, maxCombo);
        addPracticeTime(duration);
        addKeystrokes(state.keystrokes.length);

        // Check achievements after updating progress
        checkAchievements(progress, game, {
            type: 'session_end',
            wpm,
            accuracy,
            duration,
        });

        onComplete?.(record);
    }, [
        getWpm, getAccuracy, getElapsedTime,
        game.maxCombo, game.score, game,
        state.currentIndex, state.errorIndices.length, state.keystrokes.length,
        lessonId, mode, progress,
        completeLesson, addRecord, updatePersonalBests, addPracticeTime, addKeystrokes,
        checkAchievements,
        onComplete,
    ]);

    const handleReset = useCallback(() => {
        reset();
        clearSession();
        hasCompleted.current = false;
        previousComboLevel.current = 0;
    }, [reset, clearSession]);

    return {
        // State
        text: state.text,
        currentIndex: state.currentIndex,
        errorIndices: state.errorIndices,
        keystrokes: state.keystrokes,
        isComplete: state.isComplete,
        isPaused: state.isPaused,
        hasStarted: state.startTime !== null,
        activeKey,

        // Metrics
        wpm: getWpm(),
        accuracy: getAccuracy(),
        elapsedTime: getElapsedTime(),
        progress: getProgress(),
        remainingTime: timeLimitSeconds ? Math.max(0, timeLimitSeconds - getElapsedTime()) : null,

        // Game state
        combo: game.combo,
        multiplier: game.multiplier,
        score: game.score,
        maxCombo: game.maxCombo,

        // Actions
        reset: handleReset,
    };
}
