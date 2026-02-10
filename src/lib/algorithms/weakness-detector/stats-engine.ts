/**
 * Stats Engine
 * 
 * High-level statistical analysis for the weakness detector.
 * Combines Bayesian inference, HMM predictions, and ensemble methods.
 */

import { betaInv, betaMean, sampleBeta, sampleGamma, lgamma } from './statistics';

export interface BayesianPriors {
    alpha: number;
    beta: number;
}

export interface PosteriorEstimate {
    mean: number;
    variance: number;
    ci: [number, number];
    confidence: number;
}

export interface HMMStateProbs {
    learning: number;
    proficient: number;
    mastered: number;
    regressing: number;
}

export type HMMState = keyof HMMStateProbs;

/**
 * Calculate posterior estimate from Beta-Binomial model
 */
export function calculateBayesianPosterior(
    priors: BayesianPriors,
    successes: number,
    failures: number,
    confidenceLevel: number = 0.95
): PosteriorEstimate {
    const alphaPost = priors.alpha + successes;
    const betaPost = priors.beta + failures;

    const mean = betaMean(alphaPost, betaPost);
    const variance = (alphaPost * betaPost) /
        (Math.pow(alphaPost + betaPost, 2) * (alphaPost + betaPost + 1));

    // Calculate credible interval
    const tailProb = (1 - confidenceLevel) / 2;
    const lowerCI = betaInv(tailProb, alphaPost, betaPost);
    const upperCI = betaInv(1 - tailProb, alphaPost, betaPost);

    // Confidence based on effective sample size
    const effectiveSampleSize = alphaPost + betaPost - priors.alpha - priors.beta;
    const confidence = Math.min(1, effectiveSampleSize / 100);

    return {
        mean,
        variance,
        ci: [lowerCI, upperCI],
        confidence,
    };
}

/**
 * Thompson Sampling for exploration-exploitation
 */
export function thompsonSample(
    priors: BayesianPriors,
    successes: number,
    failures: number
): number {
    const alphaPost = priors.alpha + successes;
    const betaPost = priors.beta + failures;
    return sampleBeta(alphaPost, betaPost);
}

/**
 * Calculate practice priority using multi-factor scoring
 */
export function calculatePracticePriority(
    accuracyEstimate: number,
    confidence: number,
    hmmState: HMMState,
    recentTrend: number, // -1 to 1, negative = declining
    daysSinceLastPractice: number
): number {
    // Base priority from accuracy (lower = higher priority)
    let priority = (1 - accuracyEstimate) * 50;

    // Boost for regressing keys
    if (hmmState === 'regressing') {
        priority += 20;
    }

    // Boost for declining trend
    if (recentTrend < 0) {
        priority += Math.abs(recentTrend) * 15;
    }

    // Exploration bonus for low-confidence estimates
    if (confidence < 0.5) {
        priority += (0.5 - confidence) * 10;
    }

    // Spaced repetition: boost for keys not practiced recently
    if (daysSinceLastPractice > 1) {
        priority += Math.min(daysSinceLastPractice * 2, 15);
    }

    return Math.min(100, Math.max(0, priority));
}

/**
 * HMM state transition probabilities
 */
export const DEFAULT_TRANSITION_MATRIX: Record<HMMState, HMMStateProbs> = {
    learning: { learning: 0.7, proficient: 0.25, mastered: 0.03, regressing: 0.02 },
    proficient: { learning: 0.05, proficient: 0.7, mastered: 0.2, regressing: 0.05 },
    mastered: { learning: 0.01, proficient: 0.09, mastered: 0.85, regressing: 0.05 },
    regressing: { learning: 0.2, proficient: 0.3, mastered: 0.1, regressing: 0.4 },
};

/**
 * Update HMM state based on observations
 */
export function updateHMMState(
    currentState: HMMState,
    wasCorrect: boolean,
    speed: number,
    avgSpeed: number,
    transitionMatrix: Record<HMMState, HMMStateProbs> = DEFAULT_TRANSITION_MATRIX
): HMMState {
    // Emission probability adjustment based on observation
    const emissionBonus = wasCorrect ? 1.2 : 0.5;
    const speedFactor = speed < avgSpeed ? 1.1 : 0.9;

    // Calculate adjusted state probabilities
    const probs = transitionMatrix[currentState];
    const adjusted: HMMStateProbs = {
        learning: probs.learning * (wasCorrect ? 0.8 : 1.3),
        proficient: probs.proficient * emissionBonus,
        mastered: probs.mastered * emissionBonus * speedFactor,
        regressing: probs.regressing * (wasCorrect ? 0.7 : 1.5),
    };

    // Normalize
    const sum = adjusted.learning + adjusted.proficient + adjusted.mastered + adjusted.regressing;
    const normalized: HMMStateProbs = {
        learning: adjusted.learning / sum,
        proficient: adjusted.proficient / sum,
        mastered: adjusted.mastered / sum,
        regressing: adjusted.regressing / sum,
    };

    // Sample next state
    let cumulative = 0;
    const rand = Math.random();
    for (const [state, prob] of Object.entries(normalized)) {
        cumulative += prob;
        if (rand < cumulative) {
            return state as HMMState;
        }
    }

    return currentState;
}

/**
 * Calculate ensemble prediction from multiple models
 */
export function calculateEnsemblePrediction(
    bayesianPred: number,
    hmmPred: number,
    temporalPred: number,
    weights: { bayesian: number; hmm: number; temporal: number } = {
        bayesian: 0.5,
        hmm: 0.3,
        temporal: 0.2,
    }
): number {
    return (
        bayesianPred * weights.bayesian +
        hmmPred * weights.hmm +
        temporalPred * weights.temporal
    );
}

/**
 * Estimate sessions to mastery using learning curve analysis
 */
export function estimateSessionsToMastery(
    currentAccuracy: number,
    learningRate: number,
    masteryThreshold: number = 0.95
): number {
    if (currentAccuracy >= masteryThreshold) return 0;
    if (learningRate <= 0) return Infinity;

    // Exponential learning model: accuracy(n) = 1 - (1 - a0) * e^(-r*n)
    // Solve for n when accuracy(n) = threshold
    const a0 = currentAccuracy;
    const gap = masteryThreshold - a0;
    const currentGap = 1 - a0;

    if (currentGap <= 0) return 0;

    const sessions = Math.log(currentGap / (1 - masteryThreshold)) / learningRate;
    return Math.max(1, Math.ceil(sessions));
}

/**
 * Calculate optimal practice interval using spaced repetition
 */
export function calculateOptimalPracticeInterval(
    accuracy: number,
    consecutiveCorrect: number,
    baseIntervalDays: number = 1
): number {
    // Modified SuperMemo SM-2 algorithm
    let easeFactor = 2.5;

    if (accuracy < 0.6) {
        easeFactor = Math.max(1.3, easeFactor - 0.8);
    } else if (accuracy < 0.8) {
        easeFactor = Math.max(1.3, easeFactor - 0.15);
    } else if (accuracy > 0.95) {
        easeFactor = Math.min(2.5, easeFactor + 0.1);
    }

    const interval = baseIntervalDays * Math.pow(easeFactor, consecutiveCorrect);
    return Math.min(30, Math.max(1, interval)); // Cap at 30 days
}
