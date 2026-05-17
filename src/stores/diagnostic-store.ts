import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { classifyUserLevel, generateInterpretations, generateRecommendations } from '@/lib/diagnostics-engine';

export interface DiagnosticResult {
    // Core metrics
    wpm: number;
    accuracy: number;
    totalKeystrokes: number;
    correctKeystrokes: number;
    errors: number;

    // Error analysis
    adjacentKeyErrors: number;      // e.g., hitting 'r' instead of 't'
    sameFingerErrors: number;       // consecutive keys with same finger
    weakHandErrors: { left: number; right: number };

    // Rhythm analysis
    averageLatency: number;         // ms between keystrokes
    latencyVariance: number;        // consistency (lower = steadier)
    burstiness: number;             // 0-1 (0 = steady, 1 = very bursty)

    // Backspace analysis
    backspaceCount: number;
    backspaceDependence: number;    // ratio of backspaces to keystrokes

    // Per-key performance
    keyPerformance: Record<string, { correct: number; errors: number; avgLatency: number }>;

    // Weak areas identified
    weakKeys: string[];
    weakFingers: string[];

    // Timestamp
    completedAt: number;
}

export interface Interpretation {
    type: 'strength' | 'weakness' | 'insight';
    title: string;
    description: string;
    severity?: 'low' | 'medium' | 'high';
}

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    path: string;           // URL to recommended practice
    priority: number;       // 1 = highest
    category: 'lesson' | 'practice' | 'mode';
}

export type UserLevel = 'beginner' | 'intermediate' | 'fast-sloppy' | 'advanced';

interface DiagnosticState {
    hasTakenDiagnostic: boolean;
    diagnosticResult: DiagnosticResult | null;
    userLevel: UserLevel | null;
    interpretations: Interpretation[];
    recommendations: Recommendation[];

    // Actions
    setDiagnosticResult: (result: DiagnosticResult) => void;
    resetDiagnostic: () => void;
}

const defaultState = {
    hasTakenDiagnostic: false,
    diagnosticResult: null,
    userLevel: null,
    interpretations: [],
    recommendations: [],
};

export const useDiagnosticStore = create<DiagnosticState>()(
    persist(
        (set) => ({
            ...defaultState,

            setDiagnosticResult: (result: DiagnosticResult) => {
                const userLevel = classifyUserLevel(result);
                const interpretations = generateInterpretations(result);
                const recommendations = generateRecommendations(result, userLevel);

                set({
                    hasTakenDiagnostic: true,
                    diagnosticResult: result,
                    userLevel,
                    interpretations,
                    recommendations,
                });
            },

            resetDiagnostic: () => set(defaultState),
        }),
        {
            name: 'typemaster-diagnostic',
            skipHydration: true,
            partialize: (state) => ({
                hasTakenDiagnostic: state.hasTakenDiagnostic,
                diagnosticResult: state.diagnosticResult,
                userLevel: state.userLevel,
                interpretations: state.interpretations,
                recommendations: state.recommendations,
            }),
        }
    )
);
