import { KeyState } from './types';
import { random } from './prng';

export function updateSpeedModel(state: KeyState, newSpeed: number): void {
    state.shapeParam = state.shapeParam + 1;
    state.rateParam = state.rateParam + newSpeed;
}

export function calculateSpeedEstimate(state: KeyState): {
    estimate: number;
    ci: [number, number];
    arithmeticMean: number;
} {
    if (state.attempts.length === 0) {
        return { estimate: 200, ci: [150, 250], arithmeticMean: 200 };
    }

    const estimate = state.rateParam / state.shapeParam;

    const meanLambda = state.shapeParam / state.rateParam;
    const stdLambda = Math.sqrt(state.shapeParam) / state.rateParam;

    const lowerLambda = Math.max(0.001, meanLambda - 1.96 * stdLambda);
    const upperLambda = meanLambda + 1.96 * stdLambda;

    const upper = 1 / lowerLambda;
    const lower = 1 / upperLambda;

    const hasAttempts = state.attempts.length > 0;
    
    // O(1) sum formula prevents O(N) array iteration per keydown
    const arithmeticMean = hasAttempts 
        ? state.rateParam / state.shapeParam 
        : 200;

    return { estimate, ci: [lower, upper], arithmeticMean };
}

export function calculateBayesianAccuracy(state: KeyState & { _bayesianCache?: any }): {
    estimate: number;
    ci: [number, number];
    confidence: number;
} {
    if (state._bayesianCache?.alpha === state.alphaPost && state._bayesianCache?.beta === state.betaPost) {
        return state._bayesianCache.result;
    }

    const alpha = state.alphaPost;
    const beta = state.betaPost;

    const estimate = alpha / (alpha + beta);

    const variance = (alpha * beta) /
        (Math.pow(alpha + beta, 2) * (alpha + beta + 1));
    const stdDev = Math.sqrt(variance);

    const z = 1.96;
    const lower = Math.max(0, estimate - z * stdDev);
    const upper = Math.min(1, estimate + z * stdDev);

    const confidence = 1 / (1 + variance * 10);

    const result = { estimate, ci: [lower, upper] as [number, number], confidence };
    state._bayesianCache = { alpha, beta, result };

    return result;
}

export function sampleBeta(alpha: number, beta: number): number {
    const x = sampleGamma(alpha, 1);
    const y = sampleGamma(beta, 1);
    return x / (x + y);
}

export function sampleGamma(shape: number, rate: number): number {
    if (shape < 1) {
        return sampleGamma(shape + 1, rate) * Math.pow(random.next(), 1 / shape);
    }

    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);

    while (true) {
        let x: number, v: number;
        do {
            x = sampleNormal(0, 1);
            v = 1 + c * x;
        } while (v <= 0);

        v = v * v * v;
        const u = random.next();

        if (u < 1 - 0.0331 * x * x * x * x) {
            return d * v / rate;
        }

        if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
            return d * v / rate;
        }
    }
}

export function sampleNormal(mean: number, stdDev: number): number {
    const u1 = random.next();
    const u2 = random.next();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z;
}
