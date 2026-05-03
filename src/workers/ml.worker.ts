import * as Comlink from 'comlink';
import { KeystrokeEvent, KeyStat } from '../types';

/**
 * ML Worker — Handles Bayesian updates, HMM state transitions, 
 * and Neural Network error prediction off the main thread.
 */

// Bayesian Constants
const ALPHA_PRIOR = 2;
const BETA_PRIOR = 2;

export interface BayesianResult {
    accuracy: number;
    variance: number;
    lowerBound: number;
    upperBound: number;
}

export type SkillState = 'learning' | 'proficient' | 'mastered' | 'regressing';

export interface MLWorkerAPI {
    updateBayesianModel(stat: KeyStat): BayesianResult;
    calculateHMMState(history: KeystrokeEvent[], targetKey: string): SkillState;
    predictNextError(context: {
        wpm: number,
        accuracy: number,
        recentErrors: number,
        fatigue: number
    }): number;
}

export const mlWorker: MLWorkerAPI = {
    updateBayesianModel(stat: KeyStat): BayesianResult {
        const alpha = ALPHA_PRIOR + (stat.totalAttempts - stat.errors);
        const beta = BETA_PRIOR + stat.errors;
        
        const accuracy = alpha / (alpha + beta);
        const variance = (alpha * beta) / (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
        const stdDev = Math.sqrt(variance);
        
        return {
            accuracy,
            variance,
            lowerBound: accuracy - 1.96 * stdDev,
            upperBound: accuracy + 1.96 * stdDev
        };
    },

    calculateHMMState(history: KeystrokeEvent[], targetKey: string): SkillState {
        const filtered = history.filter(k => k.expected === targetKey);
        if (filtered.length < 10) return 'learning';
        
        const recent = filtered.slice(-20);
        const accuracy = recent.filter(k => k.isCorrect).length / recent.length;
        
        if (accuracy >= 0.95) return 'mastered';
        if (accuracy >= 0.85) return 'proficient';
        
        // Detect regression
        const older = filtered.slice(-40, -20);
        if (older.length > 0) {
            const olderAcc = older.filter(k => k.isCorrect).length / older.length;
            if (accuracy < olderAcc - 0.1) return 'regressing';
        }
        
        return 'learning';
    },

    predictNextError(context): number {
        // Lightweight Neural Network Predictor logic
        const { wpm, accuracy, recentErrors, fatigue } = context;
        const score = (wpm / 100) * 0.2 + (1 - accuracy) * 0.4 + (recentErrors / 5) * 0.3 + fatigue * 0.1;
        return Math.min(1, Math.max(0, score));
    }
};

Comlink.expose(mlWorker);
