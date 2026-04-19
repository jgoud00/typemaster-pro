export interface KeyAttempt {
    timestamp: number;
    isCorrect: boolean;
    delay: number;
}

export interface KeyState {
    alphaPrior: number;
    betaPrior: number;
    alphaPost: number;
    betaPost: number;

    shapeParam: number;
    rateParam: number;

    hmmState: 'learning' | 'proficient' | 'mastered' | 'regressing';
    stateProbabilities: Map<string, number>;
    stateHistory: Array<'learning' | 'proficient' | 'mastered' | 'regressing'>;
    transitionProbs: Map<string, number>;

    attempts: KeyAttempt[];

    timeOfDay: Map<number, number>;
    sessionPosition: Map<number, number>;
    adjacentKeys: Map<string, number>;
    fingerLoad: number;

    learningCurve: number[];
    plateauDetected: boolean;
    optimalPracticeInterval: number;

    interventionEffects: Map<string, number>;
    confoundingFactors: string[];
}

export interface SerializedKeyState {
    alphaPrior: number;
    betaPrior: number;
    alphaPost: number;
    betaPost: number;
    shapeParam: number;
    rateParam: number;
    hmmState: 'learning' | 'proficient' | 'mastered' | 'regressing';
    stateProbabilities: [string, number][];
    stateHistory: Array<'learning' | 'proficient' | 'mastered' | 'regressing'>;
    transitionProbs: [string, number][];
    attempts: KeyAttempt[];
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

    accuracyEstimate: number;
    accuracyCI: [number, number];
    speedEstimate: number;
    speedCI: [number, number];
    averageDelay: number;

    currentState: 'learning' | 'proficient' | 'mastered' | 'regressing';
    stateProbabilities: Map<string, number>;

    isWeak: boolean;
    weaknessScore: number;
    confidence: number;

    practicePriority: number;
    optimalNextPractice: Date;
    estimatedSessionsToMastery: number;

    bestPracticeTime: number;
    optimalSessionPosition: 'early' | 'middle' | 'late';
    correlatedKeys: Array<{ key: string; correlation: number }>;

    recommendedInterventions: Array<{
        intervention: string;
        expectedImprovement: number;
        confidence: number;
    }>;

    ensemblePredictions: {
        bayesian: number;
        hmm: number;
        temporal: number;
        ensemble: number;
    };

    learningRate: number;
    expectedPlateauDate: Date | null;
    transferLearningPotential: Map<string, number>;
}
