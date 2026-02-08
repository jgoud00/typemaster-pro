/**
 * Finger Fatigue Tracker
 * 
 * Tracks per-finger load and detects fatigue patterns
 * to recommend breaks and optimize practice sessions.
 */

export type Finger = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
export type Hand = 'left' | 'right';

export interface FingerState {
    hand: Hand;
    finger: Finger;
    keystrokes: number;
    errors: number;
    lastKeystrokeTime: number;
    fatigueScore: number; // 0-100
}

export interface FatigueDashboardData {
    leftHand: Record<Finger, FingerState>;
    rightHand: Record<Finger, FingerState>;
    overallFatigue: number;
    recommendation: string;
    shouldTakeBreak: boolean;
}

// Finger assignments for each key
const KEY_TO_FINGER: Record<string, { hand: Hand; finger: Finger }> = {
    // Left pinky
    '`': { hand: 'left', finger: 'pinky' }, '1': { hand: 'left', finger: 'pinky' },
    'q': { hand: 'left', finger: 'pinky' }, 'a': { hand: 'left', finger: 'pinky' },
    'z': { hand: 'left', finger: 'pinky' }, 'tab': { hand: 'left', finger: 'pinky' },
    'capslock': { hand: 'left', finger: 'pinky' }, 'shift': { hand: 'left', finger: 'pinky' },
    // Left ring
    '2': { hand: 'left', finger: 'ring' }, 'w': { hand: 'left', finger: 'ring' },
    's': { hand: 'left', finger: 'ring' }, 'x': { hand: 'left', finger: 'ring' },
    // Left middle
    '3': { hand: 'left', finger: 'middle' }, 'e': { hand: 'left', finger: 'middle' },
    'd': { hand: 'left', finger: 'middle' }, 'c': { hand: 'left', finger: 'middle' },
    // Left index
    '4': { hand: 'left', finger: 'index' }, '5': { hand: 'left', finger: 'index' },
    'r': { hand: 'left', finger: 'index' }, 't': { hand: 'left', finger: 'index' },
    'f': { hand: 'left', finger: 'index' }, 'g': { hand: 'left', finger: 'index' },
    'v': { hand: 'left', finger: 'index' }, 'b': { hand: 'left', finger: 'index' },
    // Left thumb
    ' ': { hand: 'left', finger: 'thumb' },
    // Right index
    '6': { hand: 'right', finger: 'index' }, '7': { hand: 'right', finger: 'index' },
    'y': { hand: 'right', finger: 'index' }, 'u': { hand: 'right', finger: 'index' },
    'h': { hand: 'right', finger: 'index' }, 'j': { hand: 'right', finger: 'index' },
    'n': { hand: 'right', finger: 'index' }, 'm': { hand: 'right', finger: 'index' },
    // Right middle
    '8': { hand: 'right', finger: 'middle' }, 'i': { hand: 'right', finger: 'middle' },
    'k': { hand: 'right', finger: 'middle' }, ',': { hand: 'right', finger: 'middle' },
    // Right ring
    '9': { hand: 'right', finger: 'ring' }, 'o': { hand: 'right', finger: 'ring' },
    'l': { hand: 'right', finger: 'ring' }, '.': { hand: 'right', finger: 'ring' },
    // Right pinky
    '0': { hand: 'right', finger: 'pinky' }, '-': { hand: 'right', finger: 'pinky' },
    '=': { hand: 'right', finger: 'pinky' }, 'p': { hand: 'right', finger: 'pinky' },
    '[': { hand: 'right', finger: 'pinky' }, ']': { hand: 'right', finger: 'pinky' },
    '\\': { hand: 'right', finger: 'pinky' }, ';': { hand: 'right', finger: 'pinky' },
    "'": { hand: 'right', finger: 'pinky' }, '/': { hand: 'right', finger: 'pinky' },
    'enter': { hand: 'right', finger: 'pinky' }, 'backspace': { hand: 'right', finger: 'pinky' },
};

// Fatigue weights (some fingers tire faster)
const FATIGUE_WEIGHT: Record<Finger, number> = {
    pinky: 1.5,   // Weakest, tires fastest
    ring: 1.2,
    middle: 0.8,  // Strongest
    index: 1.0,
    thumb: 0.6,   // Very strong
};

class FatigueTracker {
    private fingerStates: Map<string, FingerState> = new Map();
    private sessionStartTime: number = Date.now();
    private totalKeystrokes: number = 0;

    constructor() {
        this.reset();
    }

    /**
     * Initialize/reset all finger states
     */
    reset(): void {
        this.fingerStates.clear();
        this.sessionStartTime = Date.now();
        this.totalKeystrokes = 0;

        const fingers: Finger[] = ['pinky', 'ring', 'middle', 'index', 'thumb'];
        const hands: Hand[] = ['left', 'right'];

        for (const hand of hands) {
            for (const finger of fingers) {
                const key = `${hand}-${finger}`;
                this.fingerStates.set(key, {
                    hand,
                    finger,
                    keystrokes: 0,
                    errors: 0,
                    lastKeystrokeTime: 0,
                    fatigueScore: 0,
                });
            }
        }
    }

    /**
     * Record a keystroke
     */
    recordKeystroke(key: string, isError: boolean = false): void {
        const fingerInfo = KEY_TO_FINGER[key.toLowerCase()];
        if (!fingerInfo) return;

        const stateKey = `${fingerInfo.hand}-${fingerInfo.finger}`;
        const state = this.fingerStates.get(stateKey);
        if (!state) return;

        this.totalKeystrokes++;
        state.keystrokes++;
        if (isError) state.errors++;

        const now = Date.now();
        const timeSinceLastKeystroke = now - state.lastKeystrokeTime;
        state.lastKeystrokeTime = now;

        // Calculate fatigue based on:
        // 1. Total keystrokes for this finger
        // 2. Error rate
        // 3. Keystroke frequency (rapid successive keystrokes = more fatigue)
        // 4. Finger weakness weight

        const baseLoad = state.keystrokes / 100; // 100 keystrokes = 1 base unit
        const errorPenalty = (state.errors / Math.max(1, state.keystrokes)) * 20;
        const frequencyPenalty = timeSinceLastKeystroke < 200 ? 5 : 0; // Rapid typing
        const fingerWeight = FATIGUE_WEIGHT[state.finger];

        state.fatigueScore = Math.min(100, (baseLoad + errorPenalty + frequencyPenalty) * fingerWeight * 10);

        this.fingerStates.set(stateKey, state);
    }

    /**
     * Get dashboard data for visualization
     */
    getDashboardData(): FatigueDashboardData {
        const leftHand: Record<Finger, FingerState> = {} as Record<Finger, FingerState>;
        const rightHand: Record<Finger, FingerState> = {} as Record<Finger, FingerState>;

        const fingers: Finger[] = ['pinky', 'ring', 'middle', 'index', 'thumb'];

        for (const finger of fingers) {
            leftHand[finger] = this.fingerStates.get(`left-${finger}`)!;
            rightHand[finger] = this.fingerStates.get(`right-${finger}`)!;
        }

        // Calculate overall fatigue (weighted average)
        let totalFatigue = 0;
        let totalWeight = 0;
        this.fingerStates.forEach((state) => {
            const weight = FATIGUE_WEIGHT[state.finger];
            totalFatigue += state.fatigueScore * weight;
            totalWeight += weight;
        });
        const overallFatigue = totalWeight > 0 ? totalFatigue / totalWeight : 0;

        // Generate recommendation
        let recommendation = '';
        let shouldTakeBreak = false;

        if (overallFatigue >= 70) {
            recommendation = 'High fatigue detected! Take a 5-minute break to prevent strain.';
            shouldTakeBreak = true;
        } else if (overallFatigue >= 50) {
            recommendation = 'Moderate fatigue. Consider a 2-minute stretch break.';
        } else if (overallFatigue >= 30) {
            recommendation = 'Slight fatigue building. Stay hydrated and relax your shoulders.';
        } else {
            recommendation = 'Looking good! Fingers are fresh and ready.';
        }

        // Check for specific finger issues
        const tiredFingers: string[] = [];
        this.fingerStates.forEach((state) => {
            if (state.fatigueScore >= 60) {
                tiredFingers.push(`${state.hand} ${state.finger}`);
            }
        });

        if (tiredFingers.length > 0) {
            recommendation += ` Watch your ${tiredFingers.join(', ')}.`;
        }

        return {
            leftHand,
            rightHand,
            overallFatigue,
            recommendation,
            shouldTakeBreak,
        };
    }

    /**
     * Get fatigue level for a specific finger
     */
    getFingerFatigue(hand: Hand, finger: Finger): number {
        const state = this.fingerStates.get(`${hand}-${finger}`);
        return state?.fatigueScore || 0;
    }

    /**
     * Get session duration in minutes
     */
    getSessionDuration(): number {
        return (Date.now() - this.sessionStartTime) / 60000;
    }

    /**
     * Get color class for fatigue level
     */
    static getFatigueColor(fatigue: number): 'green' | 'yellow' | 'red' {
        if (fatigue < 30) return 'green';
        if (fatigue < 60) return 'yellow';
        return 'red';
    }
}

export const fatigueTracker = new FatigueTracker();
