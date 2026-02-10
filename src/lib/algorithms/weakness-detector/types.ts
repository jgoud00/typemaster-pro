/**
 * Weakness Detector Types
 * 
 * Shared interfaces for the ultimate weakness detection system.
 * Extracted for better modularity and tree-shaking.
 */

export type HMMState = 'learning' | 'proficient' | 'mastered' | 'regressing';

export interface KeyState {
    // Accuracy modeling (Beta-Binomial)
    alphaPrior: number;
    betaPrior: number;
    alphaPost: number;
    betaPost: number;

    // Speed modeling (Gamma-Poisson)
    shapeParam: number;
    rateParam: number;

    // Hidden Markov Model states
    hmmState: HMMState;
    transitionProbs: Map<string, number>;

    // Temporal features
    attempts: number[];
    successes: number[];
    speeds: number[];

    // Contextual factors
    timeOfDay: Map<number, number>;
    sessionPosition: Map<number, number>;
    adjacentKeys: Map<string, number>;
    fingerLoad: number;

    // Meta-learning
    learningCurve: number[];
    plateauDetected: boolean;
    optimalPracticeInterval: number;

    // Causal inference
    interventionEffects: Map<string, number>;
    confoundingFactors: string[];
}

// Serialized version for localStorage (Maps become arrays)
export interface SerializedKeyState {
    alphaPrior: number;
    betaPrior: number;
    alphaPost: number;
    betaPost: number;
    shapeParam: number;
    rateParam: number;
    hmmState: HMMState;
    transitionProbs: [string, number][];
    attempts: number[];
    successes: number[];
    speeds: number[];
    timeOfDay: [number, number][];
    sessionPosition: [number, number][];
    adjacentKeys: [string, number][];
    fingerLoad: number;
    learningCurve: number[];
    plateauDetected: boolean;
    optimalPracticeInterval: number;
    interventionEffects: [string, number][];
    confoundingFactors: string[];
}

export interface UltimateWeaknessResult {
    key: string;

    // Primary metrics
    accuracyEstimate: number;
    accuracyCI: [number, number];
    speedEstimate: number;
    speedCI: [number, number];

    // State estimation
    currentState: HMMState;
    stateProbabilities: Map<string, number>;

    // Weakness classification
    isWeak: boolean;
    weaknessScore: number;
    confidence: number;

    // Priority & scheduling
    practicePriority: number;
    optimalNextPractice: Date;
    estimatedSessionsToMastery: number;

    // Contextual insights
    bestPracticeTime: number;
    optimalSessionPosition: 'early' | 'middle' | 'late';
    correlatedKeys: Array<{ key: string; correlation: number }>;

    // Causal insights
    recommendedInterventions: Array<{
        intervention: string;
        expectedImprovement: number;
        confidence: number;
    }>;

    // Ensemble predictions
    ensemblePredictions: {
        bayesian: number;
        hmm: number;
        temporal: number;
        ensemble: number;
    };

    // Meta-learning insights
    learningRate: number;
    expectedPlateauDate: Date | null;
    transferLearningPotential: Map<string, number>;
}

// Re-export for backward compatibility
export type { UltimateWeaknessResult as WeaknessResult };
