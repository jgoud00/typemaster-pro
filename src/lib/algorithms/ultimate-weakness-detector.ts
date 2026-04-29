import { loadFromDB, saveToDB, clearFromDB } from '../storage/db';
import { KeyAttempt, KeyState, SerializedKeyState, UltimateWeaknessResult } from './types';
import {
    updateHMMState,
    learnTransitionProbabilities,
    normalizeTransitionProbs,
    calculateHMMPrediction,
    getStateProbabilities,
    initializeTransitionProbs
} from './hmm-engine';
import {
    updateSpeedModel,
    calculateSpeedEstimate,
    calculateBayesianAccuracy,
    sampleBeta
} from './bayesian-engine';
import {
    updateContextualFactor,
    extractContextualInsights,
    calculateTemporalPrediction,
    calculateTransferLearning
} from './bigram-engine';
import { random } from './prng';

export * from './types';

export class UltimateWeaknessDetector {
    private keyStates = new Map<string, KeyState>();
    private globalPriors = { alpha: 50.38, beta: 2.72 };

    private speedModel = {
        shape: 8.45,
        rate: 1570,
        meanWPM: 56.84,
        stdDev: 19.55
    };

    private timingModel = {
        dwellMean: 114.6,
        dwellStd: 70.6,
        flightMean: 128.0,
        flightStd: 245.1
    };

    private explorationRate = 0.1;

    private ensembleWeights = {
        bayesian: 0.35,
        hmm: 0.30,
        temporal: 0.20,
        meta: 0.15
    };

    private static globalLearningCurves = new Map<string, Array<{ accuracy: number, count: number }>>();
    private saveTimeout: NodeJS.Timeout | null = null;
    private debounceTimers = new Map<string, NodeJS.Timeout>();
    private debouncedResults = new Map<string, UltimateWeaknessResult>();
    private loadStarted = false;

    constructor() {
        const isMainThread = typeof window !== 'undefined' && typeof document !== 'undefined';
        const safeStorage = (globalThis as any).localStorage;
        if (isMainThread && safeStorage) {
            this.load();
        }
    }

    private initLoaded() {
        if (typeof window === 'undefined' && typeof (globalThis as any).importScripts === 'undefined') return;
        if (!this.loadStarted) {
            this.loadStarted = true;
            this.load();
        }
    }

    private getKeyState(key: string): KeyState {
        if (!this.keyStates.has(key)) {
            const totalPrior = this.globalPriors.alpha + this.globalPriors.beta;
            const capFactor = Math.min(1, 20 / totalPrior);
            const cappedAlpha = this.globalPriors.alpha * capFactor;
            const cappedBeta = this.globalPriors.beta * capFactor;

            this.keyStates.set(key, {
                alphaPrior: cappedAlpha,
                betaPrior: cappedBeta,
                alphaPost: cappedAlpha,
                betaPost: cappedBeta,
                shapeParam: this.speedModel.shape,
                rateParam: this.speedModel.rate,
                hmmState: 'learning',
                stateProbabilities: new Map([['learning', 1.0], ['proficient', 0], ['mastered', 0], ['regressing', 0]]),
                stateHistory: ['learning'],
                transitionProbs: new Map(),
                attempts: [],
                timeOfDay: new Map(),
                sessionPosition: new Map(),
                adjacentKeys: new Map(),
                fingerLoad: 0,
                learningCurve: [],
                plateauDetected: false,
                optimalPracticeInterval: 1,
                interventionEffects: new Map(),
                confoundingFactors: [],
            });
        }
        return this.keyStates.get(key)!;
    }

    updateKey(
        key: string,
        wasCorrect: boolean,
        speed: number,
        context: {
            timestamp: number;
            sessionPosition: number;
            recentErrors: number;
            adjacentKey?: string;
        }
    ): void {
        this.initLoaded();
        const state = this.getKeyState(key);

        if (wasCorrect) state.alphaPost++;
        else state.betaPost++;

        state.attempts.push({
            timestamp: context.timestamp,
            isCorrect: wasCorrect,
            delay: speed
        });

        if (state.attempts.length > 500) {
            state.attempts.shift();
        }

        updateSpeedModel(state, speed);

        const hour = new Date(context.timestamp).getHours();
        updateContextualFactor(state.timeOfDay, hour, wasCorrect);

        const positionBucket = Math.floor(context.sessionPosition * 5);
        updateContextualFactor(state.sessionPosition, positionBucket, wasCorrect);

        if (context.adjacentKey) {
            updateContextualFactor(state.adjacentKeys, context.adjacentKey, wasCorrect);
        }

        updateHMMState(state, wasCorrect, context.recentErrors);
        this.updateLearningCurve(state);
        this.detectPlateau(state);
        state.fingerLoad = this.calculateFingerLoad(state);
        this.pruneHistory(state);

        this.scheduleSave();
    }

    private pruneHistory(state: KeyState): void {
        const MAX_HISTORY = 1000;
        const excessAttempts = state.attempts.length - MAX_HISTORY;
        if (excessAttempts > 0) {
            state.attempts.splice(0, excessAttempts);
        }
    }

    private updateLearningCurve(state: KeyState): void {
        const windowSize = 20;

        if (state.attempts.length >= windowSize) {
            const recentAttempts = state.attempts.slice(-windowSize);
            const recentSuccesses = recentAttempts.filter(a => a.isCorrect).length;

            const accuracy = recentSuccesses / windowSize;
            state.learningCurve.push(accuracy);

            if (state.learningCurve.length > 50) {
                state.learningCurve.shift();
            }
        }
    }

    private detectPlateau(state: KeyState): void {
        if (state.learningCurve.length < 20) {
            state.plateauDetected = false;
            return;
        }

        const recent = state.learningCurve.slice(-10);
        const previous = state.learningCurve.slice(-20, -10);

        const recentMean = recent.reduce((a, b) => a + b, 0) / recent.length;
        const previousMean = previous.reduce((a, b) => a + b, 0) / previous.length;

        const improvement = recentMean - previousMean;
        state.plateauDetected = Math.abs(improvement) < 0.02;
    }

    private calculateFingerLoad(state: KeyState): number {
        if (state.attempts.length === 0) return 0;

        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        const recentAttempts = state.attempts.filter(a =>
            now - a.timestamp < oneHour
        ).length;

        return Math.min(1, recentAttempts / 100);
    }

    analyzeKey(key: string): UltimateWeaknessResult {
        return this.analyze(key);
    }

    analyze(key: string): UltimateWeaknessResult {
        this.initLoaded();
        const state = this.getKeyState(key);

        const bayesianAccuracy = calculateBayesianAccuracy(state);
        const hmmPrediction = calculateHMMPrediction(state);
        const temporalPrediction = calculateTemporalPrediction(state);
        const metaPrediction = this.calculateMetaPrediction(state, key);

        const ensemblePrediction = this.combineEnsemble(
            bayesianAccuracy.estimate,
            hmmPrediction,
            temporalPrediction,
            metaPrediction
        );

        const speedEstimate = calculateSpeedEstimate(state);
        const weaknessScore = this.calculateWeaknessScore(state, ensemblePrediction);
        const priority = this.calculatePriority(state, weaknessScore);
        const nextPractice = this.calculateOptimalSchedule(state, weaknessScore);
        const contextualInsights = extractContextualInsights(state);
        const interventions = this.recommendInterventions(state, weaknessScore);
        const transferPotential = calculateTransferLearning(state, key);
        const sessionsToMastery = this.estimateSessionsToMastery(state);

        return {
            key,
            accuracyEstimate: ensemblePrediction,
            accuracyCI: bayesianAccuracy.ci,
            speedEstimate: speedEstimate.estimate,
            speedCI: speedEstimate.ci,
            averageDelay: speedEstimate.arithmeticMean,
            currentState: state.hmmState,
            stateProbabilities: getStateProbabilities(state),
            isWeak: weaknessScore > 60,
            weaknessScore,
            confidence: bayesianAccuracy.confidence,
            practicePriority: priority,
            optimalNextPractice: nextPractice,
            estimatedSessionsToMastery: sessionsToMastery,
            bestPracticeTime: contextualInsights.bestTime,
            optimalSessionPosition: contextualInsights.optimalPosition,
            correlatedKeys: contextualInsights.correlatedKeys,
            recommendedInterventions: interventions,
            ensemblePredictions: {
                bayesian: bayesianAccuracy.estimate,
                hmm: hmmPrediction,
                temporal: temporalPrediction,
                ensemble: ensemblePrediction,
            },
            learningRate: this.calculateLearningRate(state),
            expectedPlateauDate: this.predictPlateauDate(state),
            transferLearningPotential: transferPotential,
            fingerLoad: state.fingerLoad,
        };
    }

    private calculateMetaPrediction(state: KeyState, key: string): number {
        const globalCurve = UltimateWeaknessDetector.globalLearningCurves.get(key);

        if (!globalCurve || state.attempts.length < 10) {
            return 0.5;
        }

        const currentProgress = state.attempts.length;
        const similarProgress = Math.min(currentProgress, globalCurve.length - 1);
        return globalCurve[similarProgress].accuracy;
    }

    private combineEnsemble(
        bayesian: number,
        hmm: number,
        temporal: number,
        meta: number
    ): number {
        return (
            bayesian * this.ensembleWeights.bayesian +
            hmm * this.ensembleWeights.hmm +
            temporal * this.ensembleWeights.temporal +
            meta * this.ensembleWeights.meta
        );
    }

    private calculateWeaknessScore(state: KeyState, accuracy: number): number {
        let score = 0;

        const userBaseline = this.getUserBaseline();
        const accuracyGap = Math.max(0, userBaseline - accuracy);
        score += accuracyGap * 400;

        const variance = (state.alphaPost * state.betaPost) /
            (Math.pow(state.alphaPost + state.betaPost, 2) * (state.alphaPost + state.betaPost + 1));
        score += variance * 200;

        const speeds = state.attempts.map(a => a.delay);
        const avgSpeed = speeds.length > 0
            ? speeds.reduce((a, b) => a + b, 0) / speeds.length
            : 200;
        const speedPenalty = Math.max(0, (avgSpeed - 200) / 10);
        score += Math.min(20, speedPenalty);

        if (state.hmmState === 'regressing') score += 10;
        if (state.plateauDetected) score += 10;

        return Math.min(100, Math.max(0, score));
    }

    private calculatePriority(state: KeyState, weaknessScore: number): number {
        const sampledAccuracy = sampleBeta(state.alphaPost, state.betaPost);
        const explorationBonus = this.explorationRate *
            Math.sqrt(Math.log(state.attempts.length + 1) / (state.attempts.length + 1));

        const exploitScore = weaknessScore;
        const exploreScore = (1 - sampledAccuracy) * 100 + explorationBonus * 100;

        const priority = exploitScore * 0.7 + exploreScore * 0.3;
        return Math.min(100, Math.max(0, priority));
    }

    private calculateOptimalSchedule(state: KeyState, weaknessScore: number): Date {
        let interval: number;

        if (weaknessScore > 70) interval = 1;
        else if (weaknessScore > 50) interval = 2;
        else if (weaknessScore > 30) interval = 7;
        else {
            const easeFactor = 1.3 + (state.alphaPost / (state.alphaPost + state.betaPost) - 0.6) * 0.3;
            interval = Math.round(state.optimalPracticeInterval * easeFactor);
        }

        state.optimalPracticeInterval = interval;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);
        return nextDate;
    }

    private recommendInterventions(
        state: KeyState,
        weaknessScore: number
    ): Array<{
        intervention: string;
        expectedImprovement: number;
        confidence: number;
    }> {
        const interventions: Array<any> = [];

        const speeds = state.attempts.map(a => a.delay);
        const avgSpeed = speeds.length > 0
            ? speeds.reduce((a, b) => a + b, 0) / speeds.length
            : 200;

        if (avgSpeed < 150 && weaknessScore > 50) {
            interventions.push({
                intervention: 'Practice at 70% speed to build accuracy first',
                expectedImprovement: 15,
                confidence: 0.8,
            });
        }

        const currentHour = new Date().getHours();
        const bestHour = extractContextualInsights(state).bestTime;

        if (Math.abs(currentHour - bestHour) > 3 && weaknessScore > 40) {
            const formatHour = (h: number) => `${h % 12 || 12}:00 ${h >= 12 ? 'PM' : 'AM'}`;
            interventions.push({
                intervention: `Practice at ${formatHour(bestHour)} for 20% better performance`,
                expectedImprovement: 20,
                confidence: 0.7,
            });
        }

        if (weaknessScore > 60) {
            interventions.push({
                intervention: 'Practice this key in isolation for 5 minutes',
                expectedImprovement: 25,
                confidence: 0.9,
            });
        }

        if (state.fingerLoad > 0.7) {
            interventions.push({
                intervention: 'Take a 10-minute break - finger fatigue detected',
                expectedImprovement: 10,
                confidence: 0.85,
            });
        }

        const correlatedKeys = extractContextualInsights(state).correlatedKeys;
        if (correlatedKeys.length > 0 && correlatedKeys[0].correlation < 0.7) {
            interventions.push({
                intervention: `Practice with adjacent key '${correlatedKeys[0].key}' - they're linked`,
                expectedImprovement: 18,
                confidence: 0.75,
            });
        }

        return interventions.sort((a, b) =>
            b.expectedImprovement * b.confidence - a.expectedImprovement * a.confidence
        );
    }

    private estimateSessionsToMastery(state: KeyState): number {
        if (state.learningCurve.length < 5) return 10;

        const learningRate = this.calculateLearningRate(state);
        const currentAccuracy = state.learningCurve[state.learningCurve.length - 1];
        const targetAccuracy = 0.95;

        if (currentAccuracy >= targetAccuracy) return 0;

        const gap = targetAccuracy - currentAccuracy;
        const estimatedSessions = Math.ceil(gap / Math.max(0.01, learningRate));

        return Math.min(50, Math.max(1, estimatedSessions));
    }

    private calculateLearningRate(state: KeyState): number {
        if (state.learningCurve.length < 3) return 0.02;

        const n = state.learningCurve.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = state.learningCurve;

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

        return Math.max(0, slope);
    }

    private predictPlateauDate(state: KeyState): Date | null {
        if (state.plateauDetected) return new Date();

        const learningRate = this.calculateLearningRate(state);

        if (learningRate < 0.005) {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            return date;
        }

        const currentAccuracy = state.learningCurve.length > 0
            ? state.learningCurve[state.learningCurve.length - 1]
            : 0.5;

        const gap = 0.95 - currentAccuracy;
        if (gap < 0.05) return null;

        const daysToSlow = Math.ceil((gap / 0.01) * state.optimalPracticeInterval);
        const date = new Date();
        date.setDate(date.getDate() + daysToSlow);

        return date;
    }

    private getUserBaseline(): number {
        let totalAlpha = 0;
        let totalBeta = 0;

        this.keyStates.forEach(state => {
            totalAlpha += state.alphaPost;
            totalBeta += state.betaPost;
        });

        return totalAlpha / (totalAlpha + totalBeta) || 0.85;
    }

    analyzeAllKeys(): UltimateWeaknessResult[] {
        this.initLoaded();
        const results: UltimateWeaknessResult[] = [];
        for (const [key] of this.keyStates) {
            results.push(this.analyze(key));
        }
        return results.sort((a, b) => b.practicePriority - a.practicePriority);
    }

    static updateGlobalCurve(key: string, accuracy: number, sessionNumber: number): void {
        if (!this.globalLearningCurves.has(key)) {
            this.globalLearningCurves.set(key, []);
        }

        const curve = this.globalLearningCurves.get(key)!;
        while (curve.length <= sessionNumber) {
            curve.push({ accuracy: 0.5, count: 0 });
        }

        const current = curve[sessionNumber];
        const newCount = current.count + 1;
        const newAccuracy = (current.accuracy * current.count + accuracy) / newCount;
        curve[sessionNumber] = { accuracy: newAccuracy, count: newCount };
    }

    scheduleSave(): void {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveNow();
            this.saveTimeout = null;
        }, 2000);
    }

    async saveNow(): Promise<void> {
        try {
            const isMainThread = typeof window !== 'undefined' && typeof document !== 'undefined';
            const safeStorage = (globalThis as any).localStorage;
            if (!isMainThread || !safeStorage) return;
            const data = {
                keyStates: Array.from(this.keyStates.entries()).map(([key, state]) => [
                    key,
                    {
                        ...state,
                        transitionProbs: Array.from(state.transitionProbs.entries()),
                        stateProbabilities: Array.from(state.stateProbabilities.entries()),
                        timeOfDay: Array.from(state.timeOfDay.entries()),
                        sessionPosition: Array.from(state.sessionPosition.entries()),
                        adjacentKeys: Array.from(state.adjacentKeys.entries()),
                        interventionEffects: Array.from(state.interventionEffects.entries()),
                    },
                ]),
                globalPriors: this.globalPriors,
                ensembleWeights: this.ensembleWeights,
                prngSeed: random.getSeed()
            };

            await saveToDB('ultimate-weakness-detector', data);
        } catch (e: any) {
            if (e.name === 'QuotaExceededError') {
                await this.clear();
            }
            console.error('[Storage] Failed to save ultimate weakness detector:', e);
        }
    }

    save(): void {
        this.scheduleSave();
    }

    async load(): Promise<void> {
        const isMainThread = typeof window !== 'undefined' && typeof document !== 'undefined';
        const safeStorage = (globalThis as any).localStorage;
        if (!isMainThread || !safeStorage) return;
        try {
            const data = await loadFromDB<any>('ultimate-weakness-detector');
            
            if (data) {
                this.keyStates = new Map(
                    data.keyStates.map(([key, state]: [string, any]) => {
                        let migratedAttempts: KeyAttempt[] = [];
                        if (Array.isArray(state.attempts) && state.attempts.length > 0) {
                            if (typeof state.attempts[0] === 'number') {
                                migratedAttempts = state.attempts.map((ts: number, i: number) => ({
                                    timestamp: ts,
                                    isCorrect: state.successes?.includes(ts) ?? true,
                                    delay: state.speeds?.[i] ?? 100
                                }));
                            } else {
                                migratedAttempts = state.attempts;
                            }
                        }

                        return [
                            key,
                            {
                                ...state,
                                transitionProbs: new Map(state.transitionProbs),
                                stateProbabilities: state.stateProbabilities ? new Map(state.stateProbabilities) : new Map([['learning', 1.0], ['proficient', 0], ['mastered', 0], ['regressing', 0]]),
                                stateHistory: state.stateHistory || [state.hmmState],
                                timeOfDay: new Map(state.timeOfDay),
                                sessionPosition: new Map(state.sessionPosition),
                                adjacentKeys: new Map(state.adjacentKeys),
                                interventionEffects: new Map(state.interventionEffects),
                                attempts: migratedAttempts,
                                successes: undefined,
                                speeds: undefined,
                            } as KeyState,
                        ];
                    })
                );
                if (data.globalPriors) this.globalPriors = data.globalPriors;
                if (data.ensembleWeights) this.ensembleWeights = data.ensembleWeights;
                if (data.prngSeed !== undefined) random.setSeed(data.prngSeed);
            }
        } catch (e) {
            console.error('[Storage] Failed to load ultimate weakness detector:', e);
        }
    }

    analyzeAll(): UltimateWeaknessResult[] {
        this.initLoaded();
        const results: UltimateWeaknessResult[] = [];
        this.keyStates.forEach((state, key) => {
            if (state.attempts.length >= 5) {
                results.push(this.analyze(key));
            }
        });
        return results.sort((a, b) => b.practicePriority - a.practicePriority);
    }

    async clear(): Promise<void> {
        const isMainThread = typeof window !== 'undefined' && typeof document !== 'undefined';
        const safeStorage = (globalThis as any).localStorage;
        if (!isMainThread || !safeStorage) return;

        this.keyStates.clear();
        await clearFromDB('ultimate-weakness-detector');
    }

    analyzeDebounced(key: string, delayMs: number = 50): UltimateWeaknessResult {
        const cached = this.debouncedResults.get(key);

        const existingTimer = this.debounceTimers.get(key);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        const timer = setTimeout(() => {
            const freshResult = this.analyze(key);
            this.debouncedResults.set(key, freshResult);
            this.debounceTimers.delete(key);
        }, delayMs);

        this.debounceTimers.set(key, timer);

        return cached ?? this.analyze(key);
    }

    analyzeBatchDebounced(keys: string[], delayMs: number = 100): Map<string, UltimateWeaknessResult> {
        const results = new Map<string, UltimateWeaknessResult>();
        for (const key of keys) {
            results.set(key, this.analyzeDebounced(key, delayMs));
        }
        return results;
    }
}

const createInstance = () => {
    const isMainThread = typeof window !== 'undefined' && typeof document !== 'undefined';
    if (!isMainThread) {
        // In Worker or Server - skip sync initialization if it touches DOM
    }
    return new UltimateWeaknessDetector();
};
export const ultimateWeaknessDetector = createInstance();
