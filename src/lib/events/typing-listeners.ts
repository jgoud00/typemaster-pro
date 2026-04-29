// src/lib/events/typing-listeners.ts
import { typingBus } from './typing-bus';
import { useAnalyticsStore } from '@/stores/analytics-store';
import { useGameStore } from '@/stores/game-store';
import { useProgressStore } from '@/stores/progress-store';
import { useAchievementStore } from '@/stores/achievement-store';
import { useTypingStore } from '@/stores/typing-store';
import { ngramAnalyzer } from '@/lib/ngram-analyzer';
import { errorPredictor } from '@/lib/algorithms/error-prediction-model';
import { advancedNgramAnalyzer } from '@/lib/algorithms';
import { soundEngine } from '@/lib/sound-engine';
import { toast } from 'react-hot-toast';

let listenersInitialized = false;
let errorPredictorTimer: NodeJS.Timeout | null = null;

export function initializeTypingListeners() {
    if (listenersInitialized) return;
    listenersInitialized = true;

    // 1. Keystroke Processor (ML & Gamification)
    typingBus.on('KEYSTROKE_REGISTERED', (ctx) => {
        // Analytics
        useAnalyticsStore.getState().recordKeystroke({
            key: ctx.key,
            expected: ctx.expectedChar,
            isCorrect: ctx.isCorrect,
            timestamp: ctx.timestamp,
            hesitationMs: ctx.delayFromLastKey,
            finger: 'unknown' as any,
            previousKey: null,
        });

        // Ngrams
        ngramAnalyzer.recordKeystroke(ctx.key, ctx.timestamp, ctx.isCorrect);

        // Gamification Combos
        const gameState = useGameStore.getState();
        if (ctx.isCorrect) {
            gameState.incrementCombo();
            gameState.addScore(10);
            const level = gameState.getComboLevel();
            
            // Check milestone internally without React refs
            if (level > 0 && gameState.game.combo % 50 === 0) {
                 typingBus.emit('COMBO_ACHIEVED', { combo: gameState.game.combo });
            }
        } else {
            if (gameState.game.combo > 10) {
                typingBus.emit('COMBO_BROKEN');
            }
            gameState.breakCombo();
        }

        // ML: Error Prediction for NEXT keystrokes - Deferred via requestIdleCallback
        if (!errorPredictorTimer) {
            errorPredictorTimer = setTimeout(() => {
                errorPredictorTimer = null;
                    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
                    idleCallback(() => {
                        const typingState = useTypingStore.getState().state;
                        const history = (typingState.keystrokes || []).slice(-5).map(k => k.key);
                        const upcomingChar = (typingState.text || '')[ctx.currentIndex + 1] || '';
                    
                    const currentContext = {
                        currentChar: upcomingChar,
                        previousChars: history,
                        currentWPM: ctx.wpm,
                        currentAccuracy: ctx.accuracy,
                        timeOfDay: new Date().getHours(),
                        sessionDuration: 1, 
                        recentErrors: 0, 
                        keyDifficulty: 50, 
                        ngramDifficulty: advancedNgramAnalyzer.getNgramDifficulty(ctx.key + upcomingChar)
                    };

                    const prediction = errorPredictor.predict(currentContext);
                    if (prediction) {
                        useTypingStore.getState().setRiskLevel(prediction.probability);
                    }
                });
            }, 500);
        }
    });

    // 2. Completion Processor
    typingBus.on('TYPING_COMPLETED', (stats) => {
        const gameState = useGameStore.getState();
        const progress = useProgressStore.getState();
        
        soundEngine.play('complete');
        
        // Anti-cheat: Only update leaderboards and personal bests if the session is valid
        if (stats.valid !== false) {
            progress.updatePersonalBests(stats.wpm, stats.accuracy, gameState.game.maxCombo);
            
            useAchievementStore.getState().checkAchievements(progress.progress, gameState.game, {
                type: 'session_end',
                wpm: stats.wpm,
                accuracy: stats.accuracy,
                duration: 60, // approximate
            });
        }
        
        // Keystrokes accumulate regardless to reflect practice effort
        progress.addKeystrokes(stats.wpm * 5); // approximate
    });

    // 3. Combo Processors
    typingBus.on('COMBO_ACHIEVED', () => {
        soundEngine.play('combo-1');
    });
    
    typingBus.on('COMBO_BROKEN', () => {
        // Optional penalty sound here if desired
    });
}
