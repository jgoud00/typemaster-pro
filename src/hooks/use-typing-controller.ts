import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';
import { typingBus } from '@/lib/events/typing-bus';
import { initializeTypingListeners } from '@/lib/events/typing-listeners';
import { antiCheatCollector, analyzeSession } from '@/lib/anti-cheat';
import { PracticeMode, PerformanceRecord } from '@/types';

// Run once safely
if (typeof window !== 'undefined') {
    initializeTypingListeners();
}

interface UseTypingControllerOptions {
    text: string;
    mode: PracticeMode;
    lessonId?: string;
    timeLimitSeconds?: number;
    onComplete?: (record: PerformanceRecord) => void;
    onComboMilestone?: (combo: number, level: number) => void;
}

interface CompletionState {
    completed: boolean;
    reason: 'text' | 'time' | null;
}

export function useTypingController({
    text,
    mode,
    lessonId,
    timeLimitSeconds,
    onComplete,
    onComboMilestone,
}: UseTypingControllerOptions) {
    const setText = useTypingStore(s => s.setText);
    const reset = useTypingStore(s => s.reset);
    const getElapsedTime = useTypingStore(s => s.getElapsedTime);
    const handleKeystroke = useTypingStore(s => s.handleKeystroke);

    const isComplete = useTypingStore(s => s.state.isComplete);
    const startTime = useTypingStore(s => s.state.startTime);
    const isPaused = useTypingStore(s => s.state.isPaused);
    const currentIndex = useTypingStore(s => s.state.currentIndex);
    const errorIndices = useTypingStore(s => s.state.errorIndices);
    const keystrokes = useTypingStore(s => s.state.keystrokes);
    const currentText = useTypingStore(s => s.state.text);
    const activeKey = useTypingStore(s => s.activeKey);

    const completionStateRef = useRef<CompletionState>({ completed: false, reason: null });
    const rafIdRef = useRef<number>(0);

    // Link milestone events
    useEffect(() => {
        if (!onComboMilestone) return;
        const handler = (data: { combo: number }) => onComboMilestone(data.combo, Math.floor(data.combo / 50));
        typingBus.on('COMBO_ACHIEVED', handler);
        return () => typingBus.off('COMBO_ACHIEVED', handler);
    }, [onComboMilestone]);

    // Initialize — only reset store when text is a genuinely new session
    const prevTextRef = useRef('');
    useEffect(() => {
        if (prevTextRef.current && text.startsWith(prevTextRef.current) && text !== prevTextRef.current) {
            const store = useTypingStore.getState();
            useTypingStore.setState({
                state: { ...store.state, text },
                activeKey: store.state.currentIndex < text.length ? text[store.state.currentIndex] : null,
            });
        } else {
            setText(text);
            completionStateRef.current = { completed: false, reason: null };
        }
        prevTextRef.current = text;
        return () => {
            reset();
        };
    }, [text, setText, reset]);

    // Anti-cheat: Block paste, drop, and autofill
    useEffect(() => {
        const blockPaste = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
            e.preventDefault();
            antiCheatCollector.recordPasteAttempt();
        };
        const blockDrop = (e: DragEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
            e.preventDefault();
            antiCheatCollector.recordDropAttempt();
        };
        globalThis.window.addEventListener('paste', blockPaste);
        globalThis.window.addEventListener('drop', blockDrop);
        return () => {
            globalThis.window.removeEventListener('paste', blockPaste);
            globalThis.window.removeEventListener('drop', blockDrop);
        };
    }, []);

    // Pause on tab switch
    useEffect(() => {
        const handler = () => {
            const s = useTypingStore.getState();
            if (document.hidden && s.state.startTime && !s.state.isComplete && !s.state.isPaused) {
                useTypingStore.getState().pause();
            } else if (!document.hidden && s.state.isPaused) {
                useTypingStore.getState().resume();
            }
        };
        document.addEventListener('visibilitychange', handler);
        return () => document.removeEventListener('visibilitychange', handler);
    }, []);

    // Handle keyboard events
    useEffect(() => {
        const isIgnoredKey = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.altKey || e.metaKey) return true;
            if (['Escape', 'Tab', 'CapsLock', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return true;
            if (e.key.startsWith('F') && e.key.length > 1) return true;
            if (e.key === 'Backspace' || e.key === 'Delete') return true;
            return false;
        };

        const isInputTarget = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.hasAttribute('data-typing-shim')) return false;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return true;
            if (document.activeElement?.closest('[role="dialog"]')) return true;
            return false;
        };

        const isInvalidState = (s: any, e: KeyboardEvent) => {
            if (s.state.isComplete || s.state.isPaused || document.hidden || !e.isTrusted) return true;
            if (timeLimitSeconds && s.state.startTime) {
                const pauseAdj = s.state.pausedMs + (s.state.pauseStart ? Date.now() - s.state.pauseStart : 0);
                if ((Date.now() - s.state.startTime - pauseAdj) / 1000 >= timeLimitSeconds) return true;
            }
            const lastKey = s.state.keystrokes[s.state.keystrokes.length - 1];
            if (lastKey && Date.now() - lastKey.timestamp < 10) return true;
            return false;
        };

        const processKeystroke = (key: string, isTrusted: boolean) => {
            antiCheatCollector.recordKeystroke(Date.now(), isTrusted);
            const keystroke = handleKeystroke(key);
            
            if (keystroke) {
                const freshState = useTypingStore.getState();
                typingBus.emit('KEYSTROKE_REGISTERED', {
                    key,
                    expectedChar: keystroke.expected,
                    isCorrect: keystroke.isCorrect,
                    timestamp: keystroke.timestamp,
                    delayFromLastKey: keystroke.hesitationMs,
                    finger: keystroke.finger,
                    previousKey: keystroke.previousKey,
                    wpm: freshState.getWpm(),
                    accuracy: freshState.getAccuracy(),
                    textLength: freshState.state.text.length,
                    currentIndex: freshState.state.currentIndex
                });
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isIgnoredKey(e) || isInputTarget(e)) return;

            const s = useTypingStore.getState();
            if (isInvalidState(s, e)) return;

            if (e.key.length === 1) {
                e.preventDefault();
                processKeystroke(e.key, e.isTrusted);
            }
        };

        globalThis.window.addEventListener('keydown', handleKeyDown);
        return () => globalThis.window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeystroke, timeLimitSeconds]);

    const completeSession = useCallback((reason: 'text' | 'time') => {
        if (completionStateRef.current.completed) return;
        completionStateRef.current = { completed: true, reason };

        const store = useTypingStore.getState();
        const wpm = store.getWpm();
        const accuracy = store.getAccuracy();
        const duration = store.getElapsedTime();
        const freshIndex = store.state.currentIndex;
        const freshErrors = store.state.errorIndices.length;
        const maxCombo = useGameStore.getState().game.maxCombo;

        const integrity = analyzeSession(antiCheatCollector, wpm, accuracy);

        const record: PerformanceRecord = {
            id: crypto.randomUUID(),
            lessonId,
            mode,
            wpm,
            accuracy,
            duration,
            totalChars: freshIndex,
            errors: freshErrors,
            maxCombo,
            score: 0,
            timestamp: Date.now(),
            cheatScore: integrity.cheatScore,
            valid: integrity.valid,
            integrityHash: integrity.hash,
        };

        typingBus.emit('TYPING_COMPLETED', { wpm, accuracy, totalErrors: freshErrors, valid: integrity.valid });
        onComplete?.(record);
    }, [lessonId, mode, onComplete]);

    // Time limit check
    useEffect(() => {
        if (!timeLimitSeconds || !startTime || isComplete) return;
        if (completionStateRef.current.completed) return;
        const checkTimeLimit = () => {
            if (completionStateRef.current.completed) return;
            const elapsed = getElapsedTime();
            if (elapsed >= timeLimitSeconds) {
                completeSession('time');
                return;
            }
            rafIdRef.current = requestAnimationFrame(checkTimeLimit);
        };
        rafIdRef.current = requestAnimationFrame(checkTimeLimit);
        return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); };
    }, [startTime, isComplete, timeLimitSeconds, getElapsedTime, completeSession]);

    // Text completion check
    useEffect(() => {
        if (isComplete && !completionStateRef.current.completed) {
            completeSession('text');
        }
    }, [isComplete, completeSession]);

    const handleReset = useCallback(() => {
        reset();
        antiCheatCollector.reset();
        completionStateRef.current = { completed: false, reason: null };
    }, [reset]);

    return {
        reset: handleReset,
        isComplete,
        isPaused,
        hasStarted: startTime !== null,
        text: currentText,
        currentIndex,
        errorIndices,
        keystrokes,
        activeKey,
    };
}
