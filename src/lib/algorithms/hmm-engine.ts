import { KeyState } from './types';

export function updateHMMState(
    state: KeyState,
    wasCorrect: boolean,
    _recentErrors: number
): void {
    const observationProbs = {
        learning: wasCorrect ? 0.6 : 0.4,
        proficient: wasCorrect ? 0.85 : 0.15,
        mastered: wasCorrect ? 0.95 : 0.05,
        regressing: wasCorrect ? 0.5 : 0.5,
    };

    const statePosteriors = new Map<string, number>();

    (['learning', 'proficient', 'mastered', 'regressing'] as const).forEach(nextState => {
        const transitionKey = `${state.hmmState}->${nextState}`;
        const transitionProb = state.transitionProbs.get(transitionKey) || 0.1;
        const observationProb = observationProbs[nextState];

        statePosteriors.set(nextState, transitionProb * observationProb);
    });

    const total = Array.from(statePosteriors.values()).reduce((a, b) => a + b, 0);
    if (total > 0) {
        statePosteriors.forEach((prob, s) => {
            statePosteriors.set(s, prob / total);
        });
    }

    let maxProb = 0;
    let mostLikelyState = state.hmmState;

    statePosteriors.forEach((prob, s) => {
        if (prob > maxProb) {
            maxProb = prob;
            mostLikelyState = s as KeyState['hmmState'];
        }
    });

    if (state.hmmState !== mostLikelyState) {
        state.hmmState = mostLikelyState;
        state.stateHistory.push(mostLikelyState);

        if (state.stateHistory.length > 50) {
            state.stateHistory.shift();
        }
    } else if (state.stateHistory.length === 0) {
        state.stateHistory.push(mostLikelyState);
    }

    if (state.attempts.length > 10 && state.stateHistory.length > 2) {
        learnTransitionProbabilities(state);
    }
}

export function learnTransitionProbabilities(state: KeyState): void {
    if (state.stateHistory.length < 2) return;

    const lastState = state.stateHistory[state.stateHistory.length - 1];
    const prevState = state.stateHistory[state.stateHistory.length - 2];
    const key = `${prevState}->${lastState}`;

    const currentProb = state.transitionProbs.get(key) || 0;
    // O(1) incremental update for the recent state transition transition array over previous:
    state.transitionProbs.set(key, currentProb * 0.8 + 0.2); 

    normalizeTransitionProbs(state, prevState);
}

export function normalizeTransitionProbs(state: KeyState, sourceState: string): void {
    const stateTransitions = ['learning', 'proficient', 'mastered', 'regressing']
        .map(next => `${sourceState}->${next}`);

    const total = stateTransitions.reduce((sum, key) =>
        sum + (state.transitionProbs.get(key) || 0), 0
    );

    if (total > 0) {
        stateTransitions.forEach(key => {
            const current = state.transitionProbs.get(key) || 0;
            state.transitionProbs.set(key, current / total);
        });
    }
}

export function calculateHMMPrediction(state: KeyState): number {
    const stateAccuracies: Record<KeyState['hmmState'], number> = {
        learning: 0.65,
        proficient: 0.85,
        mastered: 0.95,
        regressing: 0.55,
    };

    return stateAccuracies[state.hmmState];
}

export function getStateProbabilities(state: KeyState): Map<string, number> {
    const probs = new Map<string, number>();

    ['learning', 'proficient', 'mastered', 'regressing'].forEach(s => {
        const transitionKey = `${state.hmmState}->${s}`;
        probs.set(s, state.transitionProbs.get(transitionKey) || 0.1);
    });

    return probs;
}

export function initializeTransitionProbs(): Map<string, number> {
    return new Map([
        ['learning->learning', 0.150],
        ['learning->proficient', 0.472],
        ['learning->mastered', 0.102],
        ['learning->regressing', 0.020],

        ['proficient->learning', 0.002],
        ['proficient->proficient', 0.250],
        ['proficient->mastered', 0.153],
        ['proficient->regressing', 0.010],

        ['mastered->learning', 0.010],
        ['mastered->proficient', 0.050],
        ['mastered->mastered', 0.900],
        ['mastered->regressing', 0.005],

        ['regressing->learning', 0.300],
        ['regressing->proficient', 0.100],
        ['regressing->mastered', 0.020],
        ['regressing->regressing', 0.500],
    ]);
}
