import { KeyAttempt, KeyState } from './types';

export function updateContextualFactor(
    factorMap: Map<number | string, number>,
    key: number | string,
    success: boolean
): void {
    const current = factorMap.get(key) || 0.5;

    const learningRate = 0.1;
    const updated = current + learningRate * ((success ? 1 : 0) - current);

    factorMap.set(key, updated);
}

export function extractContextualInsights(state: KeyState): {
    bestTime: number;
    optimalPosition: 'early' | 'middle' | 'late';
    correlatedKeys: Array<{ key: string; correlation: number }>;
} {
    let bestTime = 12;
    let bestAccuracy = 0;

    state.timeOfDay.forEach((accuracy, hour) => {
        if (accuracy > bestAccuracy) {
            bestAccuracy = accuracy;
            bestTime = hour;
        }
    });

    let optimalPosition: 'early' | 'middle' | 'late' = 'early';
    const earlyAccuracy = state.sessionPosition.get(0) || 0.5;
    const midAccuracy = state.sessionPosition.get(2) || 0.5;
    const lateAccuracy = state.sessionPosition.get(4) || 0.5;

    if (midAccuracy > earlyAccuracy && midAccuracy > lateAccuracy) {
        optimalPosition = 'middle';
    } else if (lateAccuracy > earlyAccuracy && lateAccuracy > midAccuracy) {
        optimalPosition = 'late';
    }

    const correlatedKeys = Array.from(state.adjacentKeys.entries())
        .map(([key, correlation]) => ({ key: String(key), correlation }))
        .sort((a, b) => b.correlation - a.correlation)
        .slice(0, 5);

    return {
        bestTime,
        optimalPosition,
        correlatedKeys,
    };
}

export function calculateTemporalPrediction(state: KeyState): number {
    if (state.attempts.length < 20) {
        return 0.5; 
    }

    return applyTemporalDecay(state.attempts);
}

export function applyTemporalDecay(attempts: KeyAttempt[]): number {
    const now = Date.now();
    const HALF_LIFE = 1000 * 60 * 60; 

    let weightedCorrect = 0;
    let weightedTotal = 0;

    for (const attempt of attempts) {
        const age = now - attempt.timestamp;
        const weight = Math.exp(-age / HALF_LIFE);

        weightedTotal += weight;
        if (attempt.isCorrect) weightedCorrect += weight;
    }

    return weightedTotal > 0 ? weightedCorrect / weightedTotal : 0.5;
}

export function getFingerMapping(): Map<string, string> {
    return new Map([
        ['q', 'left-pinky'], ['a', 'left-pinky'], ['z', 'left-pinky'],
        ['w', 'left-ring'], ['s', 'left-ring'], ['x', 'left-ring'],
        ['e', 'left-middle'], ['d', 'left-middle'], ['c', 'left-middle'],
        ['r', 'left-index'], ['f', 'left-index'], ['v', 'left-index'],
        ['t', 'left-index'], ['g', 'left-index'], ['b', 'left-index'],

        ['y', 'right-index'], ['h', 'right-index'], ['n', 'right-index'],
        ['u', 'right-index'], ['j', 'right-index'], ['m', 'right-index'],
        ['i', 'right-middle'], ['k', 'right-middle'],
        ['o', 'right-ring'], ['l', 'right-ring'],
        ['p', 'right-pinky'], [';', 'right-pinky'],
    ]);
}

export function calculateTransferLearning(
    _state: KeyState,
    key: string
): Map<string, number> {
    const transferPotential = new Map<string, number>();

    const fingerMap = getFingerMapping();
    const keyFinger = fingerMap.get(key);

    if (keyFinger) {
        fingerMap.forEach((finger, otherKey) => {
            if (finger === keyFinger && otherKey !== key) {
                transferPotential.set(otherKey, 0.6);
            }
        });
    }

    return transferPotential;
}
