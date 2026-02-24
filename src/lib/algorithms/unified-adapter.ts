import { UltimateWeaknessDetector, ultimateWeaknessDetector, UltimateWeaknessResult } from './ultimate-weakness-detector';
import { WeaknessResult } from './bayesian-weakness-detector';

/**
 * Unified Adapter
 * 
 * Bridges the gap between the legacy BayesianWeaknessDetector API
 * and the advanced UltimateWeaknessDetector.
 * 
 * This allows the entire application to upgrade to the Ensemble Model
 * without refactoring every component that consumes weakness data.
 */
export class UnifiedWeaknessDetectorAdapter {
    private engine: UltimateWeaknessDetector;

    constructor() {
        this.engine = ultimateWeaknessDetector;
    }

    /**
     * Record a keystroke (Legacy API -> Ultimate API)
     */
    public recordKeystroke(key: string, isCorrect: boolean, latencyMs?: number): void {
        // Enriched context for Ultimate Detector
        const context = {
            timestamp: Date.now(),
            sessionPosition: 0.5, // Default to middle for now (could be improved with session tracking)
            recentErrors: 0, // Simplified for adapter
        };

        this.engine.updateKey(
            key,
            isCorrect,
            latencyMs || 100, // Default speed if missing
            context
        );
    }

    /**
     * Analyze a single key (Legacy API -> Ultimate API)
     */
    public analyzeKey(key: string, userBaseline: number = 0.85): WeaknessResult | null {
        const result = this.engine.analyze(key);
        return this.mapToLegacyResult(result);
    }

    /**
     * Analyze all keys (Legacy API -> Ultimate API)
     */
    public analyzeAllKeys(): WeaknessResult[] {
        const results = this.engine.analyzeAllKeys();
        return results.map(r => this.mapToLegacyResult(r));
    }

    /**
     * Persist state (Pass-through)
     */
    public persist(): void {
        // Ultimate detector handles its own persistence automatically or via explicit save
        // We can trigger a save if the engine exposes it, or rely on its internal debouncing
    }

    /**
     * Map Ultimate Result complex object to Simple Result
     */
    private mapToLegacyResult(u: UltimateWeaknessResult): WeaknessResult {
        return {
            key: u.key,
            estimatedAccuracy: u.accuracyEstimate,
            confidence: u.confidence,
            isWeak: u.isWeak,
            priority: u.practicePriority,
            recentTrend: u.learningRate > 0 ? 'improving' : u.learningRate < 0 ? 'declining' : 'stable',
            nextReviewDate: new Date(u.optimalNextPractice)
        };
    }
}

export const unifiedWeaknessDetector = new UnifiedWeaknessDetectorAdapter();
