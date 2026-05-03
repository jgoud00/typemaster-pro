// src/lib/events/typing-listeners.ts
import { typingBus } from './typing-bus';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useGameStore } from '@/stores/game-store';
import { useProgressStore } from '@/stores/progress-store';
import { useAchievementStore } from '@/stores/achievement-store';
import { ngramAnalyzer } from '@/lib/ngram-analyzer';
import { soundEngine } from '@/lib/sound-engine';
import { getMLProxy } from '@/workers/ml-worker-instance';

let listenersInitialized = false;

export function initializeTypingListeners() {
    if (listenersInitialized) return;
    listenersInitialized = true;

    // 1. Keystroke Processor (Analytics & Gamification)
    typingBus.on('KEYSTROKE_REGISTERED', (ctx) => {
        // FIX: Null guard — worker may not be ready on first keystroke
        const proxy = getMLProxy();
        useAnalyticsStore.getState().recordKeystroke(
            {
                key: ctx.key,
                expected: ctx.expectedChar,
                isCorrect: ctx.isCorrect,
                timestamp: ctx.timestamp,
                hesitationMs: ctx.delayFromLastKey,
                finger: ctx.finger,
                previousKey: ctx.previousKey,
            },
            { wpm: ctx.wpm, accuracy: ctx.accuracy },
            proxy ?? null  // safe: recordKeystroke must handle null proxy
        );

        // Ngrams
        ngramAnalyzer.recordKeystroke(ctx.key, ctx.timestamp, ctx.isCorrect);

        // Gamification Combos
        // FIX: was [gameState.game](http://gameState.game) — markdown artifact, invalid JS
        const gameState = useGameStore.getState();
        if (ctx.isCorrect) {
            gameState.incrementCombo();
            gameState.addScore(10);
            const level = gameState.getComboLevel();
            if (level > 0 && gameState.game.combo % 50 === 0) {
                typingBus.emit('COMBO_ACHIEVED', { combo: gameState.game.combo });
            }
        } else {
            if (gameState.game.combo > 10) {
                typingBus.emit('COMBO_BROKEN');
            }
            gameState.breakCombo();
        }
    });

    // 2. Completion Processor
    typingBus.on('TYPING_COMPLETED', (stats) => {
        const gameState = useGameStore.getState();
        const progress = useProgressStore.getState();

        // FIX: was [soundEngine.play](http://soundEngine.play) — markdown artifact
        soundEngine.play('complete');

        // Anti-cheat: Only update leaderboards and personal bests if session is valid
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

        // Keystrokes accumulate regardless to reflect practice effort
        progress.addKeystrokes(stats.wpm * 5);
    });

    // 3. Combo Processors
    // FIX: was [soundEngine.play](http://soundEngine.play) — markdown artifact
    typingBus.on('COMBO_ACHIEVED', () => {
        soundEngine.play('combo-1');
    });

    typingBus.on('COMBO_BROKEN', () => {
        // Optional penalty sound here if desired
    });
}