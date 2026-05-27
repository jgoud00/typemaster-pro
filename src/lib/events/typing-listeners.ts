// src/lib/events/typing-listeners.ts
import { typingBus } from './typing-bus';
import { recordTypingKeystroke } from '@/lib/analytics/analytics-recorder';
import { useGameStore } from '@/stores/game-store';
import { useProgressStore } from '@/stores/progress-store';
import { useAchievementStore } from '@/stores/achievement-store';
import { ngramAnalyzer } from '@/lib/ngram-analyzer';
import { soundEngine } from '@/lib/sound-engine';
import { terminateMLWorker } from '@/workers/ml-worker-instance';

// Use a WeakRef-safe symbol so HMR module replacement fully resets this flag.
const _INIT_KEY = '__typingListenersInitialized__';

function isInitialized(): boolean {
    return (globalThis as Record<string, unknown>)[_INIT_KEY] === true;
}

function setInitialized(value: boolean): void {
    (globalThis as Record<string, unknown>)[_INIT_KEY] = value;
}

export function disposeTypingListeners(): void {
    typingBus.all.clear();
    terminateMLWorker();
    setInitialized(false);
}

export function initializeTypingListeners(): void {
    if (isInitialized()) return;
    setInitialized(true);

    // 1. Keystroke Processor (Analytics & Gamification)
    // ngramAnalyzer deferred via queueMicrotask — keeps this handler off the
    // synchronous keystroke hot path. Runs before next frame, not blocking input.
    typingBus.on('KEYSTROKE_REGISTERED', (ctx) => {
        recordTypingKeystroke(ctx);

        // Calculate spatial pan based on key position (QWERTY approximation)
        const leftKeys = '12345qwertasdfgzxcvb'.split('');
        const rightKeys = '67890yuiophjklnm,./;\'[]\\'.split('');
        let pan = 0;
        const keyLower = ctx.key.toLowerCase();
        if (leftKeys.includes(keyLower)) {
            pan = -0.6; // Pan left
        } else if (rightKeys.includes(keyLower)) {
            pan = 0.6; // Pan right
        }
        
        // Play spatial keystroke sound
        soundEngine.play('keystroke', { pan, wpm: ctx.wpm });

        const gameState = useGameStore.getState();
        if (ctx.isCorrect) {
            gameState.incrementCombo();
            gameState.addScore(10);
            const level = gameState.getComboLevel();
            if (level > 0 && gameState.game.combo % 50 === 0) {
                typingBus.emit('COMBO_ACHIEVED', { combo: gameState.game.combo });
            }
        } else {
            if (gameState.game.combo >= 10) {
                typingBus.emit('COMBO_BROKEN', { lastCombo: gameState.game.combo });
            }
            gameState.breakCombo();
        }

        // Defer ngram analysis — non-critical, dequeued after current call stack.
        queueMicrotask(() => {
            ngramAnalyzer.recordKeystroke(ctx.key, ctx.timestamp, ctx.isCorrect);
        });
    });

    // 2. Completion Processor
    typingBus.on('TYPING_COMPLETED', (stats) => {
        const gameState = useGameStore.getState();
        const progress = useProgressStore.getState();

        soundEngine.play('complete');

        if (stats.valid !== false) {
            progress.updatePersonalBests(stats.wpm, stats.accuracy, gameState.game.maxCombo);
            useAchievementStore.getState().checkAchievements(
                progress.progress,
                gameState.game,
                {
                    type: 'session_end',
                    wpm: stats.wpm,
                    accuracy: stats.accuracy,
                    duration: 60,
                }
            );
        }

        progress.addKeystrokes(stats.wpm * 5);
    });

    // 3. Combo Processors
    typingBus.on('COMBO_ACHIEVED', () => {
        soundEngine.play('combo-1');
    });

    typingBus.on('COMBO_BROKEN', (payload) => {
        if (payload?.lastCombo >= 10) {
            soundEngine.play('error');
        }
    });
}

// HMR: tear down listeners on module replacement so re-import starts clean.
if (typeof module !== 'undefined' && (module as NodeModule & { hot?: { dispose: (fn: () => void) => void } }).hot) {
    (module as NodeModule & { hot?: { dispose: (fn: () => void) => void } }).hot!.dispose(() => {
        disposeTypingListeners();
    });
}