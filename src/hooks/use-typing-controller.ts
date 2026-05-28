import { useCallback, useEffect, useRef } from 'react';
import { useTypingStore } from '@/stores/typing-store';
import { useGameStore } from '@/stores/game-store';
import { typingBus } from '@/lib/events/typing-bus';
import { initializeTypingListeners, disposeTypingListeners } from '@/lib/events/typing-listeners';
import { createAntiCheatCollector, analyzeSession, generateIntegrityHashAsync } from '@/lib/anti-cheat';
import { useSettingsStore } from '@/stores/settings-store';
import { getKeystrokeBuffer } from '@/stores/typing-store';
import { PracticeMode, PerformanceRecord } from '@/types';
import { saveSession, clearSession as clearRecoverySession, attachBeforeUnloadSync } from '@/lib/services/session-recovery';

interface UseTypingControllerOptions {
    text: string;
    mode: PracticeMode;
    lessonId?: string;
    timeLimitSeconds?: number;
    errorLimit?: number;
    onComplete?: (record: PerformanceRecord) => void;
    onComboMilestone?: (combo: number, level: number) => void;
}

interface CompletionState {
    completed: boolean;
    reason: 'text' | 'time' | 'errorLimit' | null;
}

export function useTypingController({
    text,
    mode,
    lessonId,
    timeLimitSeconds,
    errorLimit,
    onComplete,
    onComboMilestone,
}: UseTypingControllerOptions) {
    const setText = useTypingStore(s => s.setText);
    const reset = useTypingStore(s => s.reset);
    const getElapsedTime = useTypingStore(s => s.getElapsedTime);
    const handleKeystroke = useTypingStore(s => s.handleKeystroke);
    const handleBackspace = useTypingStore(s => s.handleBackspace);

    const isComplete = useTypingStore(s => s.state.isComplete);
    const startTime = useTypingStore(s => s.state.startTime);
    const isPaused = useTypingStore(s => s.state.isPaused);
    const currentIndex = useTypingStore(s => s.state.currentIndex);
    const errorIndices = useTypingStore(s => s.state.errorIndices);

    const currentText = useTypingStore(s => s.state.text);
    const activeKey = useTypingStore(s => s.activeKey);

    const completionStateRef = useRef<CompletionState>({ completed: false, reason: null });
    const rafIdRef = useRef<number>(0);
    // Per-session collector: isolated from other sessions/HMR resets
    const collectorRef = useRef(createAntiCheatCollector());

    // Initialize listeners once per hook mount; clean up on unmount to prevent
    // stale listeners on the typingBus after HMR or route changes.
    useEffect(() => {
        initializeTypingListeners();
        const cleanupUnload = attachBeforeUnloadSync(() => {
            const s = useTypingStore.getState();
            if (!s.state.startTime || s.state.isComplete) return null;
            return {
                text: s.state.text,
                currentIndex: s.state.currentIndex,
                errorIndices: s.state.errorIndices,
                startTime: s.state.startTime,
                pausedMs: s.state.pausedMs,
                mode,
                lessonId,
            };
        });

        return () => {
            disposeTypingListeners();
            cleanupUnload();
        };
    }, [mode, lessonId]);

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
        const storeText = useTypingStore.getState().state.text;
        
        if (prevTextRef.current && text.startsWith(prevTextRef.current) && text !== prevTextRef.current) {
            const store = useTypingStore.getState();
            useTypingStore.setState({
                state: { ...store.state, text },
                activeKey: store.state.currentIndex < text.length ? text[store.state.currentIndex] : null,
            });
        } else if (text !== storeText) {
            // Only reset the store if the incoming text actually differs from the store's text.
            // This allows us to inject a recovered session into the store without it being immediately wiped.
            setText(text);
            completionStateRef.current = { completed: false, reason: null };
        }
        prevTextRef.current = text;
    }, [text, setText]);

    // Save session on every keystroke (debounced under the hood by session-recovery.ts)
    useEffect(() => {
        if (!startTime || isComplete) return;
        saveSession({
            text: currentText,
            currentIndex,
            errorIndices,
            startTime,
            pausedMs: useTypingStore.getState().state.pausedMs,
            mode,
            lessonId
        }, false);
    }, [currentIndex, isComplete]);

    // Removed reset on unmount to prevent React StrictMode double-rendering
    // from wiping the recovered session state injected prior to mount.

    // Anti-cheat: Block paste, drop, and autofill
    useEffect(() => {
        const collector = collectorRef.current;
        const blockPaste = (e: ClipboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
            e.preventDefault();
            collector.recordPasteAttempt();
        };
        const blockDrop = (e: DragEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
            e.preventDefault();
            collector.recordDropAttempt();
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
            if (e.key === 'Delete') return true;
            return false;
        };

        const isInputTarget = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.dataset.typingShim !== undefined) return false;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return true;
            if (document.activeElement?.closest('[role="dialog"]')) return true;
            return false;
        };

        const isInvalidState = (s: ReturnType<typeof useTypingStore.getState>, e: KeyboardEvent) => {
            if (s.state.isComplete || s.state.isPaused || document.hidden) return true;
            // Do NOT gate on !e.isTrusted here — untrusted events are recorded
            // as suspicious by the collector but must still flow through to count.
            if (timeLimitSeconds && s.state.startTime) {
                const pauseAdj = s.state.pausedMs + (s.state.pauseStart ? Date.now() - s.state.pauseStart : 0);
                if ((Date.now() - s.state.startTime - pauseAdj) / 1000 >= timeLimitSeconds) return true;
            }
            return false;
        };

        const processKeystroke = (key: string, isTrusted: boolean, eventTimestamp: number) => {
            // Use high-resolution event timestamp (performance.now()-relative) for accuracy
            collectorRef.current.recordKeystroke(eventTimestamp, isTrusted);
            const layout = useSettingsStore.getState().settings.keyboardLayout;
            const keystroke = handleKeystroke(key, layout);
            
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

            // Backspace: undo last character (Monkeytype-style)
            if (e.key === 'Backspace') {
                e.preventDefault();
                handleBackspace();
                return;
            }

            if (e.key.length === 1) {
                e.preventDefault();
                processKeystroke(e.key, e.isTrusted, e.timeStamp);
            }
        };

        globalThis.window.addEventListener('keydown', handleKeyDown);
        return () => globalThis.window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeystroke, handleBackspace, timeLimitSeconds]);

    const completeSession = useCallback((reason: 'text' | 'time' | 'errorLimit') => {
        if (completionStateRef.current.completed) return;
        completionStateRef.current = { completed: true, reason };

        const store = useTypingStore.getState();
        const wpm = store.getWpm();
        const accuracy = store.getAccuracy();
        const duration = store.getElapsedTime();
        const freshIndex = store.state.currentIndex;
        const freshErrors = store.state.errorIndices.length;
        const maxCombo = useGameStore.getState().game.maxCombo;

        const integrity = analyzeSession(collectorRef.current, wpm, accuracy);
        const collectorData = collectorRef.current.getData();

        // Calculate a rewarding score based on wpm, accuracy, duration, and combo
        const baseScore = wpm * (accuracy / 100) * duration;
        const comboBonus = maxCombo * 5;
        const sessionScore = Math.round(baseScore + comboBonus);

        // Update global game store
        if (integrity.valid) {
            useGameStore.getState().addScore(sessionScore);
            useGameStore.getState().addXP(Math.round(sessionScore / 10));
        }

        // Build record synchronously first so onComplete fires immediately,
        // then upgrade the hash asynchronously (server validates independently).
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
            score: sessionScore,
            timestamp: Date.now(),
            cheatScore: integrity.cheatScore,
            valid: integrity.valid,
            integrityHash: integrity.hash,
        };

        typingBus.emit('TYPING_COMPLETED', { wpm, accuracy, totalErrors: freshErrors, valid: integrity.valid, duration });

        // Upgrade to async SHA-256 hash before calling onComplete
        generateIntegrityHashAsync(wpm, accuracy, integrity.cheatScore, collectorData.totalKeyEvents, collectorData.intervals)
            .then(strongHash => {
                onComplete?.({ ...record, integrityHash: strongHash });
            })
            .catch(() => {
                onComplete?.(record);
            });
    }, [lessonId, mode, onComplete]);

    // Time limit check
    useEffect(() => {
        if (!timeLimitSeconds || !startTime || isComplete) return;
        if (completionStateRef.current.completed) return;
        
        const timerId = setInterval(() => {
            if (completionStateRef.current.completed) return;
            const elapsed = getElapsedTime();
            if (elapsed >= timeLimitSeconds) {
                completeSession('time');
                clearInterval(timerId);
            }
        }, 250);
        
        return () => clearInterval(timerId);
    }, [startTime, isComplete, timeLimitSeconds, getElapsedTime, completeSession]);

    // Error limit check (Sudden Death)
    useEffect(() => {
        if (!errorLimit || !startTime || isComplete) return;
        if (completionStateRef.current.completed) return;
        
        if (errorIndices.length >= errorLimit) {
            completeSession('errorLimit');
        }
    }, [startTime, isComplete, errorIndices.length, errorLimit, completeSession]);

    // Text completion check
    useEffect(() => {
        if (isComplete && !completionStateRef.current.completed) {
            completeSession('text');
        }
    }, [isComplete, completeSession]);

    const handleReset = useCallback(() => {
        reset();
        clearRecoverySession();
        collectorRef.current = createAntiCheatCollector();
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

        activeKey,
    };
}
