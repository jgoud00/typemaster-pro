/**
 * Lazy-loaded Weakness Detector
 * 
 * Provides lazy-loading wrapper for the UltimateWeaknessDetector
 * to reduce initial bundle size and improve performance.
 */

import type { UltimateWeaknessResult } from './types';

// Re-export types for convenience
export type { UltimateWeaknessResult, KeyState, HMMState, SerializedKeyState } from './types';

type DetectorType = Awaited<typeof import('../ultimate-weakness-detector')>['ultimateWeaknessDetector'];

// Lazy singleton
let detectorInstance: DetectorType | null = null;
let loadingPromise: Promise<DetectorType> | null = null;

/**
 * Lazily load the weakness detector
 * Only imports the full module when first needed
 */
export async function getWeaknessDetector(): Promise<DetectorType> {
    if (detectorInstance) {
        return detectorInstance;
    }

    if (!loadingPromise) {
        loadingPromise = import('../ultimate-weakness-detector').then((module) => {
            detectorInstance = module.ultimateWeaknessDetector;
            return detectorInstance;
        });
    }

    return loadingPromise;
}

/**
 * Synchronous check if detector is loaded
 */
export function isDetectorLoaded(): boolean {
    return detectorInstance !== null;
}

/**
 * Preload the detector (call early in app lifecycle if needed)
 */
export function preloadDetector(): void {
    getWeaknessDetector();
}

/**
 * Analyze a key lazily (returns promise)
 */
export async function analyzeKeyLazy(key: string): Promise<UltimateWeaknessResult> {
    const detector = await getWeaknessDetector();
    return detector.analyze(key);
}

/**
 * Update key lazily
 */
export async function updateKeyLazy(
    key: string,
    wasCorrect: boolean,
    speed: number,
    context: {
        timestamp: number;
        sessionPosition: number;
        recentErrors: number;
        adjacentKey?: string;
    }
): Promise<void> {
    const detector = await getWeaknessDetector();
    detector.updateKey(key, wasCorrect, speed, context);
}



/**
 * Analyze with debouncing lazily
 */
export async function analyzeDebouncedLazy(
    key: string,
    delayMs: number = 50
): Promise<UltimateWeaknessResult> {
    const detector = await getWeaknessDetector();
    return detector.analyzeDebounced(key, delayMs);
}
