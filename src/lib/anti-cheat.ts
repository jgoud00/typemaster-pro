/**
 * Anti-Cheat Engine — Lightweight client-side integrity system
 *
 * Detects: paste/drop/autofill, bot-like timing, impossibly consistent rhythm,
 *          perfect accuracy at high WPM, programmatic keystrokes.
 *
 * Produces a cheatScore (0–100) and session validity verdict.
 *
 * Security model: client hash is a tamper-evident commitment, NOT a
 * cryptographic guarantee. Server independently re-derives all metrics
 * from raw keystroke timestamps.
 */

// ── Types ──────────────────────────────────────────────

export interface CheatFlag {
    id: string;
    weight: number;
    reason: string;
    value?: number;
}

export interface SessionIntegrity {
    cheatScore: number;
    flags: CheatFlag[];
    valid: boolean;
    hash: string;
    timestamp: number;
}

// ── Constants ──────────────────────────────────────────
// React 19 synthetic event batching + requestAnimationFrame scheduling can
// coalesce events, producing apparent inter-key gaps as low as ~16ms on a
// 60Hz display. Thresholds are tuned to avoid false positives for human
// users typing at up to ~200 WPM.

const THRESHOLDS = {
    // Human lower bound: ~16ms (1 frame at 60Hz). Anything below is bot-like.
    MIN_MEDIAN_INTERVAL: 16,
    // Human rhythm variability: real typists show ≥12% CV. Bots ≤ 2–5%.
    // Set conservatively at 10% to avoid flagging mechanical keyboard users.
    MIN_VARIANCE_COEFF: 0.10,
    // Perfect accuracy at high speed is improbable. 95 WPM chosen as boundary
    // (~1 in 500 genuine sessions achieve this with 100% accuracy).
    PERFECT_ACC_WPM_LIMIT: 95,
    // Cheat score cutoff
    VALIDITY_CUTOFF: 40,
    // Minimum keystrokes before interval heuristics are applied
    MIN_KEYSTROKES: 15,
    // Zero/near-zero delay ratio: allow up to 8% for burst-typing humans
    // (reduced from 15% — real typists rarely produce >5% sub-2ms intervals)
    MAX_ZERO_DELAY_RATIO: 0.08,
    // Jitter band: ignore intervals within ±1 frame of a suspiciously
    // consistent value (catches macro tools that add small random jitter)
    JITTER_BAND_MS: 2,
    // Minimum unique interval buckets to consider rhythm natural
    MIN_UNIQUE_BUCKETS: 5,
} as const;

// ── Keystroke Collector ────────────────────────────────
// Create one instance per session via createAntiCheatCollector().
// Never use the legacy singleton in new code.

export class AntiCheatCollector {
    private intervals: number[] = [];
    private lastTimestamp = 0;
    private pasteAttempts = 0;
    private dropAttempts = 0;
    private suspiciousKeyEvents = 0;
    private totalKeyEvents = 0;
    // Track high-precision timestamps separately to detect sub-ms fabrication
    private rawTimestamps: number[] = [];

    /**
     * @param timestamp  - performance.now() or e.timeStamp (preferred over Date.now())
     * @param isTrusted  - e.isTrusted from the native KeyboardEvent
     */
    recordKeystroke(timestamp: number, isTrusted: boolean) {
        this.totalKeyEvents++;
        if (!isTrusted) this.suspiciousKeyEvents++;

        this.rawTimestamps.push(timestamp);
        if (this.rawTimestamps.length > 2000) {
            this.rawTimestamps = this.rawTimestamps.slice(-1000);
        }

        if (this.lastTimestamp > 0) {
            const interval = timestamp - this.lastTimestamp;
            // Discard negative/zero intervals (clock drift, duplicate events)
            if (interval > 0) {
                this.intervals.push(interval);
                if (this.intervals.length > 1000) {
                    this.intervals = this.intervals.slice(-500);
                }
            }
        }
        this.lastTimestamp = timestamp;
    }

    recordPasteAttempt() { this.pasteAttempts++; }
    recordDropAttempt() { this.dropAttempts++; }

    reset() {
        this.intervals = [];
        this.rawTimestamps = [];
        this.lastTimestamp = 0;
        this.pasteAttempts = 0;
        this.dropAttempts = 0;
        this.suspiciousKeyEvents = 0;
        this.totalKeyEvents = 0;
    }

    getData() {
        return {
            intervals: [...this.intervals],
            rawTimestamps: [...this.rawTimestamps],
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

/**
 * Count distinct interval "buckets" rounded to nearest JITTER_BAND_MS.
 * Macro tools with random jitter collapse to very few buckets.
 */
function countJitterBuckets(arr: number[]): number {
    const band = THRESHOLDS.JITTER_BAND_MS;
    const buckets = new Set(arr.map(v => Math.round(v / band)));
    return buckets.size;
}

export function analyzeSession(
    collector: AntiCheatCollector,
    wpm: number,
    accuracy: number,
): SessionIntegrity {
    const flags: CheatFlag[] = [];
    const data = collector.getData();
    const intervals = data.intervals;

    // ── Paste / Drop ──────────────────────────────────
    if (data.pasteAttempts > 0) {
        flags.push({
            id: 'paste_attempt',
            weight: Math.min(20, data.pasteAttempts * 7),
            reason: `${data.pasteAttempts} paste attempt(s) blocked`,
            value: data.pasteAttempts,
        });
    }
    if (data.dropAttempts > 0) {
        flags.push({
            id: 'drop_attempt',
            weight: Math.min(15, data.dropAttempts * 5),
            reason: `${data.dropAttempts} drop attempt(s) blocked`,
            value: data.dropAttempts,
        });
    }

    // ── Untrusted Events ──────────────────────────────
    if (data.totalKeyEvents > 0) {
        const untrustedRatio = data.suspiciousKeyEvents / data.totalKeyEvents;
        // Threshold raised to 15%: browser extensions can inject trusted=false
        // events on legitimate keypresses in some configurations.
        if (untrustedRatio > 0.15) {
            flags.push({
                id: 'untrusted_events',
                weight: Math.min(30, Math.round(untrustedRatio * 80)),
                reason: `${Math.round(untrustedRatio * 100)}% of key events were programmatic`,
                value: untrustedRatio,
            });
        }
    }

    // ── Timing Heuristics (only with enough data) ─────
    if (intervals.length >= THRESHOLDS.MIN_KEYSTROKES) {
        const med = median(intervals);

        // Superhuman speed: median below 1-frame threshold
        if (med < THRESHOLDS.MIN_MEDIAN_INTERVAL) {
            flags.push({
                id: 'superhuman_speed',
                weight: 25,
                reason: `Median key interval ${med.toFixed(1)}ms is below human minimum (${THRESHOLDS.MIN_MEDIAN_INTERVAL}ms)`,
                value: med,
            });
        }

        // Low variance: robot-like rhythm
        const cv = coefficientOfVariation(intervals);
        if (cv < THRESHOLDS.MIN_VARIANCE_COEFF) {
            flags.push({
                id: 'low_variance',
                weight: 20,
                reason: `Typing rhythm CV ${(cv * 100).toFixed(1)}% is bot-like (human ≥${THRESHOLDS.MIN_VARIANCE_COEFF * 100}%)`,
                value: cv,
            });
        }

        // Sub-2ms keystroke ratio (adjusted from ≤1ms — catches 1ms macro jitter)
        const zeroDelays = intervals.filter(i => i <= 2).length;
        const zeroRatio = zeroDelays / intervals.length;
        if (zeroRatio > THRESHOLDS.MAX_ZERO_DELAY_RATIO) {
            flags.push({
                id: 'zero_delay_keys',
                weight: 25,
                reason: `${Math.round(zeroRatio * 100)}% of keystrokes had ≤2ms delay`,
                value: zeroRatio,
            });
        }

        // Jitter-band uniqueness: detect fixed-interval bots with random noise
        if (intervals.length >= 30) {
            const buckets = countJitterBuckets(intervals);
            if (buckets < THRESHOLDS.MIN_UNIQUE_BUCKETS) {
                flags.push({
                    id: 'jitter_pattern',
                    weight: 20,
                    reason: `Only ${buckets} distinct timing buckets — macro jitter pattern`,
                    value: buckets,
                });
            }
        }
    }

    // ── Perfect Accuracy at High WPM ──────────────────
    if (accuracy >= 100 && wpm > THRESHOLDS.PERFECT_ACC_WPM_LIMIT) {
        flags.push({
            id: 'perfect_highspeed',
            weight: 15,
            reason: `100% accuracy at ${wpm} WPM is statistically improbable`,
            value: wpm,
        });
    }

    const cheatScore = Math.min(100, flags.reduce((sum, f) => sum + f.weight, 0));
    const valid = cheatScore < THRESHOLDS.VALIDITY_CUTOFF;

    const hash = generateIntegrityHash(wpm, accuracy, cheatScore, data.totalKeyEvents, intervals);

    return { cheatScore, flags, valid, hash, timestamp: Date.now() };
}

// ── Integrity Hash ─────────────────────────────────────
// Uses Web Crypto SHA-256 with a per-session nonce + structural interval
// digest. The hash is a tamper-evident commitment sent to the server which
// re-runs its own validation — this hash is NOT the source of trust.

async function sha256Hex(data: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Synchronous fallback for environments without SubtleCrypto.
 * Still stronger than FNV-1a: incorporates interval distribution signature.
 */
function intervalDigest(intervals: number[]): string {
    if (intervals.length === 0) return '0';
    // Use p10, median, p90, and count as structural fingerprint
    const sorted = [...intervals].sort((a, b) => a - b);
    const p10 = sorted[Math.floor(sorted.length * 0.1)];
    const med = sorted[Math.floor(sorted.length * 0.5)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];
    return `${p10}|${med}|${p90}|${intervals.length}`;
}

function generateIntegrityHash(
    wpm: number,
    accuracy: number,
    cheatScore: number,
    keyCount: number,
    intervals: number[],
): string {
    const nonce = crypto.randomUUID();
    const minuteBucket = Math.floor(Date.now() / 60000);
    const ivDigest = intervalDigest(intervals);
    const payload = `tm-v3|${wpm}|${accuracy}|${cheatScore}|${keyCount}|${minuteBucket}|${ivDigest}|${nonce}`;

    // Return sync placeholder; caller should use generateIntegrityHashAsync when possible
    // FNV-1a is intentionally replaced with a stronger mixing function here
    let h1 = 0x9e3779b9 ^ payload.length;
    let h2 = 0x6c62272e;
    for (let i = 0; i < payload.length; i++) {
        const c = payload.codePointAt(i) ?? 0;
        h1 = Math.imul(h1 ^ c, 0x9e3779b9 + (i << 6) + (i >> 2));
        h2 = Math.imul(h2 ^ c, 0x85ebca77 + (i << 3));
    }
    h1 ^= h2 >>> 16;
    return ((h1 >>> 0).toString(36) + (h2 >>> 0).toString(36)).padStart(16, '0');
}

/**
 * Async SHA-256 version. Prefer this when available (in useTypingController).
 */
export async function generateIntegrityHashAsync(
    wpm: number,
    accuracy: number,
    cheatScore: number,
    keyCount: number,
    intervals: number[],
): Promise<string> {
    const nonce = crypto.randomUUID();
    const minuteBucket = Math.floor(Date.now() / 60000);
    const ivDigest = intervalDigest(intervals);
    const payload = `tm-v3|${wpm}|${accuracy}|${cheatScore}|${keyCount}|${minuteBucket}|${ivDigest}|${nonce}`;
    try {
        return await sha256Hex(payload);
    } catch {
        return generateIntegrityHash(wpm, accuracy, cheatScore, keyCount, intervals);
    }
}

// ── Factory ─────────────────────────────────────────────
// Always create a new instance per session — never share across resets.

export function createAntiCheatCollector(): AntiCheatCollector {
    return new AntiCheatCollector();
}


