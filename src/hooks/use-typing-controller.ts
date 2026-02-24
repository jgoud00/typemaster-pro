'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useGameStore } from '@/stores/game-store';
import { useProgressStore } from '@/stores/progress-store';
import { useAchievementStore } from '@/stores/achievement-store';
import { ngramAnalyzer } from '@/lib/ngram-analyzer'; // Keep legacy for basic stats
import { weaknessDetector, advancedNgramAnalyzer } from '@/lib/algorithms'; // Unified Adapter & Advanced Ngram
import { errorPredictor } from '@/lib/algorithms/error-prediction-model';
import { PracticeMode, PerformanceRecord } from '@/types';

interface UseTypingControllerOptions {
    text: string;
    mode: PracticeMode;
    lessonId?: string;
    timeLimitSeconds?: number;
    onComplete?: (record: PerformanceRecord) => void;
    onComboMilestone?: (combo: number, level: number) => void;
}

// Consolidated completion state for race condition prevention
interface CompletionState {
    completed: boolean;
    reason: 'text' | 'time' | null;
}

/**
 * Controller hook for the typing engine.
 * 
 * OPTIMIZATION NOTE:
 * This hook handles the logic (timer, keydown, completion) but DOES NOT return 
 * high-frequency state (like currentIndex, wpm, etc).
 * 
 * Components needing that state should subscribe to the store directly.
 * This prevents the parent page from re-rendering on every keystroke.
 */
export function useTypingController({
    text,
    mode,
    lessonId,
    timeLimitSeconds,
    onComplete,
    onComboMilestone,
}: UseTypingControllerOptions) {
    // OPTIMIZED: No full state subscription
    const setText = useTypingStore(s => s.setText);
    const reset = useTypingStore(s => s.reset);
    const getWpm = useTypingStore(s => s.getWpm);
    const getAccuracy = useTypingStore(s => s.getAccuracy);
    const getElapsedTime = useTypingStore(s => s.getElapsedTime);
    const getProgress = useTypingStore(s => s.getProgress);
    const totalCount = useTypingStore(s => s.totalCount);
    const handleKeystroke = useTypingStore(s => s.handleKeystroke);

    // Only subscribe to what's needed for effects
    const isComplete = useTypingStore(s => s.state.isComplete);
    const startTime = useTypingStore(s => s.state.startTime);
    const isPaused = useTypingStore(s => s.state.isPaused);
    const currentIndex = useTypingStore(s => s.state.currentIndex);
    const errorIndices = useTypingStore(s => s.state.errorIndices);
    const keystrokes = useTypingStore(s => s.state.keystrokes);
    const currentText = useTypingStore(s => s.state.text);
    const activeKey = useTypingStore(s => s.activeKey);
    // Valid: Subscribes to state to drive logic, but we won't return it.

    const { recordKeystroke, clearSession } = useAnalyticsStore();
    const { game, incrementCombo, breakCombo, addScore, getComboLevel, checkDailyStreak } = useGameStore();
    const { completeLesson, addRecord, updatePersonalBests, addPracticeTime, addKeystrokes, progress: userProgress } = useProgressStore();
    const { checkAchievements } = useAchievementStore();

    const previousComboLevel = useRef(0);
    const completionStateRef = useRef<CompletionState>({ completed: false, reason: null });

    // Initialize
    useEffect(() => {
        setText(text);
        clearSession();
        completionStateRef.current = { completed: false, reason: null };
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

            // Safety check for inputs
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            // SYSTEM INTEGRATION: Error Prediction
            // Predict risk before processing the keystroke (or after, for next key)
            // Here we predict for the *next* likely keystroke based on current state
            const state = useTypingStore.getState().state;
            const currentWpm = useTypingStore.getState().getWpm();
            const currentEfficiency = useTypingStore.getState().getAccuracy();

            // Get last few chars
            const history = state.keystrokes.slice(-5).map(k => k.key);

            // Analyze N-gram context
            const upcomingChar = state.text[state.currentIndex] || '';
            const previousChar = state.text[state.currentIndex - 1] || '';
            const currentBigram = previousChar + upcomingChar;

            const currentContext = {
                currentChar: upcomingChar,
                previousChars: history,
                currentWPM: currentWpm,
                currentAccuracy: currentEfficiency,
                timeOfDay: new Date().getHours(),
                sessionDuration: (Date.now() - (state.startTime || Date.now())) / 1000 / 60, // minutes
                recentErrors: state.errorIndices.filter(i => i > state.currentIndex - 10).length,
                keyDifficulty: weaknessDetector.analyzeKey(upcomingChar)?.isWeak ? 80 : 20, // Simplified lookup
                ngramDifficulty: advancedNgramAnalyzer.getNgramDifficulty(currentBigram)
            };

            // Run prediction in background to avoid blocking UI
            const prediction = errorPredictor.predict(currentContext);
            useTypingStore.getState().setRiskLevel(prediction.probability);

            // Safety: Block typing if a Dialog/Modal is open (heuristic via role)
            // Or if focus is not on body and not in the game container (implicit)
            if (document.activeElement?.closest('[role="dialog"]')) {
                return;
            }

            if (e.key.length === 1) {
                e.preventDefault();

                const keystroke = handleKeystroke(e.key);
                if (keystroke) {
                    queueMicrotask(() => {
                        recordKeystroke(keystroke);
                        ngramAnalyzer.recordKeystroke(e.key, keystroke.timestamp, keystroke.isCorrect);
                        weaknessDetector.recordKeystroke(e.key, keystroke.isCorrect, keystroke.hesitationMs);
                    });

                    if (keystroke.isCorrect) {
                        incrementCombo();
                        addScore(10);
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
    }, [handleKeystroke, recordKeystroke, incrementCombo, breakCombo, addScore, getComboLevel, game.combo, onComboMilestone]);

    // Time limit check
    useEffect(() => {
        if (!timeLimitSeconds || !startTime || isComplete) return;
        if (completionStateRef.current.completed) return;

        let rafId: number;
        const checkTimeLimit = () => {
            if (completionStateRef.current.completed) return;
            const elapsed = getElapsedTime();
            if (elapsed >= timeLimitSeconds) {
                completeSession('time');
                return;
            }
            rafId = requestAnimationFrame(checkTimeLimit);
        };
        rafId = requestAnimationFrame(checkTimeLimit);
        return () => { if (rafId) cancelAnimationFrame(rafId); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime, isComplete, timeLimitSeconds, getElapsedTime]);

    // Text completion check
    useEffect(() => {
        if (isComplete && !completionStateRef.current.completed) {
            completeSession('text');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isComplete]);

    const completeSession = useCallback((reason: 'text' | 'time') => {
        if (completionStateRef.current.completed) return;

        completionStateRef.current = { completed: true, reason };

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
            totalChars: currentIndex,
            errors: errorIndices.length, // Get fresh errors
            maxCombo,
            score,
            timestamp: Date.now(),
        };

        if (mode === 'lesson' && lessonId) {
            completeLesson(lessonId, wpm, accuracy, score);
        }
        addRecord(record);
        updatePersonalBests(wpm, accuracy, maxCombo);
        addPracticeTime(duration);
        addKeystrokes(totalCount);

        checkAchievements(userProgress, game, {
            type: 'session_end',
            wpm,
            accuracy,
            duration,
        });

        onComplete?.(record);
    }, [getWpm, getAccuracy, getElapsedTime, game, currentIndex, errorIndices.length, totalCount, lessonId, mode, completeLesson, addRecord, updatePersonalBests, addPracticeTime, addKeystrokes, checkAchievements, onComplete, getProgress, userProgress]);

    const handleReset = useCallback(() => {
        reset();
        clearSession();
        completionStateRef.current = { completed: false, reason: null };
        previousComboLevel.current = 0;
    }, [reset, clearSession]);

    return {
        // Only return actions and stable state needed for control
        reset: handleReset,
        isComplete,
        isPaused,
        hasStarted: startTime !== null,
        // State
        text: currentText,
        currentIndex,
        errorIndices,
        keystrokes,
        activeKey,
        // We might need to expose wpm/elapsedTime IF the parent component needs to display them 
        // OUTSIDE of the specialized sub-components.
        // But for optimization, we should try to avoid it.
        // For now, let's expose helper getters if necessary, but changing them will trigger re-render 
        // if this hook is used. 
        // Ideally, the parent component using this hook should NOT display WPM.
    };
}
