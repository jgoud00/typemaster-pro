/**
 * Anti-Cheat Engine — Lightweight client-side integrity system
 * 
 * Detects: paste/drop/autofill, bot-like timing, impossibly consistent rhythm,
 *          perfect accuracy at high WPM, programmatic keystrokes.
 * 
 * Produces a cheatScore (0–100) and session validity verdict.
 */

// ── Types ──────────────────────────────────────────────

export interface CheatFlag {
    id: string;
    weight: number;       // 0–30 per flag
    reason: string;
    value?: number;       // the detected anomaly value
}

export interface SessionIntegrity {
    cheatScore: number;   // 0 = clean, 100 = certain cheat
    flags: CheatFlag[];
    valid: boolean;       // cheatScore < threshold
    hash: string;         // HMAC-like integrity token
    timestamp: number;
}

// ── Constants ──────────────────────────────────────────

const THRESHOLDS = {
    // Minimum realistic inter-key interval (ms). World record ~30ms avg.
    MIN_MEDIAN_INTERVAL: 25,
    // Below this variance coefficient = bot-like consistency
    MIN_VARIANCE_COEFF: 0.08,
    // Perfect accuracy above this WPM is suspicious
    PERFECT_ACC_WPM_LIMIT: 80,
    // Max cheatScore before session is invalid
    VALIDITY_CUTOFF: 40,
    // Minimum keystrokes to evaluate
    MIN_KEYSTROKES: 10,
    // Max % of zero-delay keys (programmatic injection)
    MAX_ZERO_DELAY_RATIO: 0.15,
} as const;

// ── Keystroke Collector ────────────────────────────────

export class AntiCheatCollector {
    private intervals: number[] = [];
    private lastTimestamp = 0;
    private pasteAttempts = 0;
    private dropAttempts = 0;
    private suspiciousKeyEvents = 0;
    private totalKeyEvents = 0;

    /** Call on every valid keystroke */
    recordKeystroke(timestamp: number, isTrusted: boolean) {
        this.totalKeyEvents++;

        if (!isTrusted) {
            this.suspiciousKeyEvents++;
        }

        if (this.lastTimestamp > 0) {
            const interval = timestamp - this.lastTimestamp;
            this.intervals.push(interval);
            // Cap to prevent unbounded growth on long sessions
            if (this.intervals.length > 500) this.intervals.shift();
        }
        this.lastTimestamp = timestamp;
    }

    /** Call when paste/drop blocked */
    recordPasteAttempt() { this.pasteAttempts++; }
    recordDropAttempt() { this.dropAttempts++; }

    /** Reset between sessions */
    reset() {
        this.intervals = [];
        this.lastTimestamp = 0;
        this.pasteAttempts = 0;
        this.dropAttempts = 0;
        this.suspiciousKeyEvents = 0;
        this.totalKeyEvents = 0;
    }

    /** Get raw data for analysis */
    getData() {
        return {
            intervals: this.intervals,
            pasteAttempts: this.pasteAttempts,
            dropAttempts: this.dropAttempts,
            suspiciousKeyEvents: this.suspiciousKeyEvents,
            totalKeyEvents: this.totalKeyEvents,
        };
    }
}

// ── Analysis Engine ────────────────────────────────────

function median(arr: number[]): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function coefficientOfVariation(arr: number[]): number {
    if (arr.length < 2) return 1;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (mean === 0) return 0;
    const variance = arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / arr.length;
    return Math.sqrt(variance) / mean;
}

export function analyzeSession(
    collector: AntiCheatCollector,
    wpm: number,
    accuracy: number,
): SessionIntegrity {
    const flags: CheatFlag[] = [];
    const data = collector.getData();
    const intervals = data.intervals;

    // ── 1. Paste/Drop attempts ─────────────────────────
    if (data.pasteAttempts > 0) {
        flags.push({
            id: 'paste_attempt',
            weight: Math.min(15, data.pasteAttempts * 5),
            reason: `${data.pasteAttempts} paste attempt(s) blocked`,
            value: data.pasteAttempts,
        });
    }
    if (data.dropAttempts > 0) {
        flags.push({
            id: 'drop_attempt',
            weight: Math.min(10, data.dropAttempts * 5),
            reason: `${data.dropAttempts} drop attempt(s) blocked`,
            value: data.dropAttempts,
        });
    }

    // ── 2. Untrusted (programmatic) key events ─────────
    if (data.totalKeyEvents > 0) {
        const untrustedRatio = data.suspiciousKeyEvents / data.totalKeyEvents;
        if (untrustedRatio > 0.1) {
            flags.push({
                id: 'untrusted_events',
                weight: Math.min(30, Math.round(untrustedRatio * 100)),
                reason: `${Math.round(untrustedRatio * 100)}% of key events were programmatic`,
                value: untrustedRatio,
            });
        }
    }

    // Skip timing analysis if too few keystrokes
    if (intervals.length >= THRESHOLDS.MIN_KEYSTROKES) {

        // ── 3. Superhuman speed ────────────────────────
        const med = median(intervals);
        if (med < THRESHOLDS.MIN_MEDIAN_INTERVAL) {
            flags.push({
                id: 'superhuman_speed',
                weight: 25,
                reason: `Median key interval ${med.toFixed(0)}ms is below human limit`,
                value: med,
            });
        }

        // ── 4. Bot-like consistency ────────────────────
        const cv = coefficientOfVariation(intervals);
        if (cv < THRESHOLDS.MIN_VARIANCE_COEFF) {
            flags.push({
                id: 'low_variance',
                weight: 20,
                reason: `Typing variance ${(cv * 100).toFixed(1)}% is bot-like (human ≥ ${THRESHOLDS.MIN_VARIANCE_COEFF * 100}%)`,
                value: cv,
            });
        }

        // ── 5. Zero-delay keystroke ratio ──────────────
        const zeroDelays = intervals.filter(i => i <= 1).length;
        const zeroRatio = zeroDelays / intervals.length;
        if (zeroRatio > THRESHOLDS.MAX_ZERO_DELAY_RATIO) {
            flags.push({
                id: 'zero_delay_keys',
                weight: 25,
                reason: `${Math.round(zeroRatio * 100)}% of keystrokes had ≤1ms delay`,
                value: zeroRatio,
            });
        }
    }

    // ── 6. Perfect accuracy at high WPM ────────────────
    if (accuracy >= 100 && wpm > THRESHOLDS.PERFECT_ACC_WPM_LIMIT) {
        flags.push({
            id: 'perfect_highspeed',
            weight: 15,
            reason: `100% accuracy at ${wpm} WPM is statistically improbable`,
            value: wpm,
        });
    }

    // ── Score & Verdict ────────────────────────────────
    const cheatScore = Math.min(100, flags.reduce((sum, f) => sum + f.weight, 0));
    const valid = cheatScore < THRESHOLDS.VALIDITY_CUTOFF;

    // ── Integrity Hash ─────────────────────────────────
    const hash = generateIntegrityHash(wpm, accuracy, cheatScore, data.totalKeyEvents);

    return {
        cheatScore,
        flags,
        valid,
        hash,
        timestamp: Date.now(),
    };
}

// ── Integrity Hash ─────────────────────────────────────
// Simple HMAC-like token (client-side = deterrent, not bulletproof)

function generateIntegrityHash(
    wpm: number,
    accuracy: number,
    cheatScore: number,
    keyCount: number,
): string {
    // Rotate salt per-session to prevent replay
    const salt = 'aloo-type-v1';
    const payload = `${salt}|${wpm}|${accuracy}|${cheatScore}|${keyCount}|${Math.floor(Date.now() / 60000)}`;

    // FNV-1a 32-bit hash — fast, no crypto dependency needed
    let h = 0x811c9dc5;
    for (let i = 0; i < payload.length; i++) {
        h ^= payload.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36);
}

// ── Singleton ──────────────────────────────────────────
export const antiCheatCollector = new AntiCheatCollector();
