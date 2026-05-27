import { NextResponse } from 'next/server';
import { verifySessionToken } from '../session/helper';
import { createClient, createServiceClient } from '@/lib/supabase/server';

const MAX_VALID_WPM = 300;
const MAX_KEYSTROKES = 5000;
// Separate rate limit for score submission (tighter than session creation)
const SUBMIT_RATE_LIMIT_MAX = 20;
const SUBMIT_RATE_WINDOW_MS = 300_000; // 5 minutes

interface Keystroke {
  t: number;
  correct: boolean;
}

interface SubmitScoreBody {
  token: string;
  keystrokes: Keystroke[];
  mode?: string;
}

const ALLOWED_MODES = new Set(['speed-test', 'free', 'custom', 'lesson', 'burst', 'smart']);

export async function POST(req: Request) {
  try {
    const body: SubmitScoreBody = await req.json();
    const { token, keystrokes } = body;
    const mode = typeof body.mode === 'string' && ALLOWED_MODES.has(body.mode) ? body.mode : 'speed-test';
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

    if (!token || !Array.isArray(keystrokes)) {
      return NextResponse.json({ ok: false, reason: 'Invalid payload' }, { status: 400 });
    }

    if (keystrokes.length < 5 || keystrokes.length > MAX_KEYSTROKES) {
      return NextResponse.json({ ok: false, reason: 'Invalid keystroke count' }, { status: 400 });
    }

    // ── Submit-level rate limiting ────────────────────────────────────────────
    // Session creation is already rate-limited, but an attacker with a valid
    // token could resubmit scores in bulk. Guard separately here.
    try {
      const svc = createServiceClient();
      const windowStart = new Date(Date.now() - SUBMIT_RATE_WINDOW_MS).toISOString();
      const { count } = await svc
        .from('session_rate_limit')
        .select('*', { count: 'exact', head: true })
        .eq('ip', ip)
        .gte('created_at', windowStart);

      if ((count ?? 0) >= SUBMIT_RATE_LIMIT_MAX) {
        return NextResponse.json(
          { ok: false, reason: 'Rate limit exceeded' },
          { status: 429, headers: { 'Retry-After': '300' } }
        );
      }
    } catch {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ ok: false, reason: 'Service unavailable' }, { status: 503 });
      }
    }

    // verifySessionToken performs jti replay check atomically
    const sess = await verifySessionToken(token);
    if (!sess) {
      return NextResponse.json({ ok: false, reason: 'Unauthorized or replayed session' }, { status: 401 });
    }

    if (process.env.NODE_ENV !== 'development' && sess.ip !== ip) {
      return NextResponse.json({ ok: false, reason: 'IP mismatch' }, { status: 401 });
    }

    const startTime = sess.startTime;
    const now = Date.now();
    const sessionEndMax = startTime + (360 + 10) * 1000; // JWT TTL + 10s clock skew

    // ── Timestamp validation ──────────────────────────────────────────────────
    // All timestamps must be numbers, monotonically ordered, within session window.
    // Also reject implausible same-millisecond streaks (>3 consecutive identical
    // timestamps indicate fabricated data).
    let sameTimestampRun = 0;
    for (let i = 0; i < keystrokes.length; i++) {
      const k = keystrokes[i];
      if (typeof k.t !== 'number' || k.t < startTime - 1000 || k.t > Math.min(now + 1000, sessionEndMax)) {
        return NextResponse.json({ ok: false, reason: 'Invalid timestamps' }, { status: 400 });
      }
      if (i > 0) {
        if (k.t < keystrokes[i - 1].t) {
          return NextResponse.json({ ok: false, reason: 'Non-monotonic timestamps' }, { status: 400 });
        }
        sameTimestampRun = k.t === keystrokes[i - 1].t ? sameTimestampRun + 1 : 0;
        if (sameTimestampRun > 3) {
          return NextResponse.json({ ok: false, reason: 'Fabricated timestamps' }, { status: 400 });
        }
      }
    }

    // ── Server-side metric derivation ─────────────────────────────────────────
    const validKs = keystrokes.filter(k => k.correct);
    const ksDuration = Math.max(1, (keystrokes[keystrokes.length - 1].t - keystrokes[0].t) / 1000);
    const sWpm = (validKs.length / 5) / (ksDuration / 60);
    const sAcc = (validKs.length / keystrokes.length) * 100;

    // ── Bot / macro detection ─────────────────────────────────────────────────
    const ivs = keystrokes.slice(1).map((k, i) => k.t - keystrokes[i].t).filter(v => v >= 0);
    let serverCheatScore = 0;

    if (ivs.length > 20) {
      const avg = ivs.reduce((a, b) => a + b, 0) / ivs.length;
      const variance = ivs.reduce((a, b) => a + (b - avg) ** 2, 0) / ivs.length;
      // Correct normalization: divide variance by avg² (coefficient of variation squared)
      const cv2 = avg > 0 ? variance / (avg * avg) : 0;
      const cv = Math.sqrt(cv2);

      // Median for superhuman speed check
      const sorted = [...ivs].sort((a, b) => a - b);
      const medianIv = sorted[Math.floor(sorted.length / 2)];

      // Sub-2ms ratio (fabricated timestamps)
      const zeroRatio = ivs.filter(v => v <= 2).length / ivs.length;

      // WPM hard cap
      if (sWpm > MAX_VALID_WPM) {
        return NextResponse.json({ ok: false, reason: 'WPM exceeds physical maximum' }, { status: 403 });
      }
      // Superhuman median interval
      if (medianIv < 16) serverCheatScore += 25;
      // Robot-like rhythm (CV < 10%)
      if (cv < 0.10) serverCheatScore += 20;
      // Near-zero delay saturation
      if (zeroRatio > 0.08) serverCheatScore += 20;
      // Raw avg < 30ms (impossible sustained speed)
      if (avg < 30) serverCheatScore += 15;

      if (serverCheatScore >= 40) {
        return NextResponse.json({ ok: false, reason: 'Unnatural typing detected' }, { status: 403 });
      }
    }

    // Perfect accuracy at high WPM
    if (sAcc >= 100 && sWpm > 95) serverCheatScore += 15;
    const finalIsValid = serverCheatScore < 40;

    const finalWpm = Math.min(MAX_VALID_WPM, Math.round(sWpm));
    const finalAcc = Math.round(sAcc);

    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('typing_sessions').insert({
          user_id: user.id,
          wpm: finalWpm,
          accuracy: finalAcc,
          duration: Math.round(ksDuration),
          mode,
          max_combo: 0,
          score: 0,
          total_chars: keystrokes.length,
          errors: keystrokes.filter(k => !k.correct).length,
          // Use server-derived cheat score — never trust client-supplied value
          cheat_score: serverCheatScore,
          is_valid: finalIsValid,
        });

        if (finalIsValid) {
          // Atomic upsert using DB-side MAX to prevent race conditions and
          // ensure only valid sessions can affect the leaderboard.
          await createServiceClient().rpc('upsert_leaderboard', {
            p_user_id: user.id,
            p_wpm: finalWpm,
            p_accuracy: finalAcc,
            p_duration: Math.round(ksDuration),
          });
        }
      }
    } catch (e) {
      console.error('[SubmitScore] Supabase persistence failed:', e);
    }

    return NextResponse.json({ ok: true, wpm: finalWpm, accuracy: finalAcc, valid: finalIsValid });
  } catch {
    return NextResponse.json({ ok: false, error: 'Internal validation error' }, { status: 500 });
  }
}
