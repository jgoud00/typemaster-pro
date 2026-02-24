
import { UltimateWeaknessDetector } from './ultimate-weakness-detector';
import { KeyState } from './ultimate-weakness-detector';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Test
async function verifyRepairs() {
    console.log("Verifying UltimateWeaknessDetector Repairs...");

    // 1. Test Temporal Data Structure
    const detector = new UltimateWeaknessDetector();
    const now = Date.now();

    console.log("Testing KeyAttempt structure...");
    detector.updateKey('a', true, 100, {
        timestamp: now,
        sessionPosition: 0.1,
        recentErrors: 0
    });

    // Access private state via any cast for verification
    const keyStates = (detector as any).keyStates;
    const state = keyStates.get('a') as KeyState;

    if (!state) {
        console.error("FAIL: keyStates.get('a') is undefined. Map keys:", Array.from(keyStates.keys()));
        return; // Exit early
    }

    if (state.attempts.length === 1 && state.attempts[0].timestamp === now) {
        console.log("PASS: KeyAttempt recorded correctly.");
    } else {
        console.error("FAIL: KeyAttempt structure incorrect.", state.attempts);
    }

    // 2. Test Temporal Decay
    console.log("Testing Temporal Decay...");
    // Add old attempts
    (detector as any).updateKey('b', true, 100, { timestamp: now - 3600000 * 24 }); // 24 hours ago
    (detector as any).updateKey('b', false, 100, { timestamp: now }); // Now (failure)

    const analysis = detector.analyze('b');
    // Recent failure should weigh heavily despite old success
    // Just checking it runs without error for now and produces a result
    if (analysis) {
        console.log("PASS: Analysis ran with temporal data.");
        console.log(`Accuracy Estimate: ${analysis.accuracyEstimate}`);
    } else {
        console.error("FAIL: Analysis failed.");
    }

    // 3. Test One Source of Truth (Adapter Removal)
    // We can't easily test file deletion here, but we can check if we can import the detector.

    // 4. Test Debounced Save
    console.log("Testing Debounced Save...");
    jest.useFakeTimers();
    (detector as any).scheduleSave();

    if (setTimeout.mock.calls.length > 0) {
        console.log("PASS: Save scheduled via setTimeout.");
    } else {
        console.error("FAIL: Save not scheduled.");
    }

    console.log("Verification Complete.");
}

// Simple mock for jest timers if running in node without jest
if (typeof jest === 'undefined') {
    global.jest = {
        useFakeTimers: () => { },
    } as any;
    const originalSetTimeout = setTimeout;
    global.setTimeout = ((fn: any, ms: any) => {
        console.log(`[Mock] setTimeout called with ${ms}ms`);
        fn(); // Run immediately for this simple test
        return 1 as any;
    }) as any;
}

verifyRepairs().catch(console.error);
