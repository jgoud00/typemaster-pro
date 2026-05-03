import { NextResponse } from 'next/server';
import { sessions } from '../session/route';

const MAX_VALID_WPM = 300;

interface Keystroke {
  t: number;
  correct: boolean;
}

interface SubmitScoreBody {
  sid: string;
  token: string;
  keystrokes: Keystroke[];
}

export async function POST(req: Request) {
  try {
    const body: SubmitScoreBody = await req.json();
    const { sid, token, keystrokes } = body;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    if (!sid || !token || !Array.isArray(keystrokes)) {
      return NextResponse.json({ ok: false, reason: 'Invalid payload' }, { status: 400 });
    }
    
    const sess = sessions.get(sid);
    if (!sess || sess.token !== token) {
      return NextResponse.json({ ok: false, reason: 'Unauthorized session' }, { status: 401 });
    }
    
    // IP verification (skip in dev)
    if (process.env.NODE_ENV !== 'development' && sess.ip !== ip) {
      return NextResponse.json({ ok: false, reason: 'IP mismatch' }, { status: 401 });
    }

    // Session timeout (6 minutes)
    if ((Date.now() - sess.startTime) > 360000) { 
      sessions.delete(sid); 
      return NextResponse.json({ ok: false, reason: 'Session expired' }, { status: 401 }); 
    }

    // Validate timestamp ordering and bounds
    const sorted = keystrokes.every((k, i) => i === 0 || k.t >= keystrokes[i - 1].t);
    if (!sorted || keystrokes.some(k => typeof k.t !== 'number' || k.t > Date.now() + 1000 || k.t < sess.startTime - 1000)) {
      return NextResponse.json({ ok: false, reason: 'Invalid timestamps' }, { status: 400 });
    }

    if (keystrokes.length < 5) {
      return NextResponse.json({ ok: false, reason: 'Too few keystrokes' }, { status: 400 });
    }

    // Server-side WPM/Accuracy calculation
    const validKs = keystrokes.filter(k => k.correct);
    const ksDuration = Math.max(1, (keystrokes[keystrokes.length - 1].t - keystrokes[0].t) / 1000);
    const sWpm = (validKs.length / 5) / (ksDuration / 60);
    const sAcc = (validKs.length / keystrokes.length) * 100;

    // Macro Detection (Advanced)
    const ivs = keystrokes.slice(1).map((k, i) => k.t - keystrokes[i].t);
    const avg = ivs.reduce((a, b) => a + b, 0) / ivs.length;
    const variance = ivs.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / ivs.length;
    const normalizedVariance = variance / (avg || 1);
    
    // 1. Extreme speed check
    // 2. Too perfect rhythm (normalized variance < 0.2)
    // 3. Humanly impossible average latency (< 30ms)
    if (ivs.length > 20 && (avg < 30 || normalizedVariance < 0.2 || sWpm > MAX_VALID_WPM)) {
      return NextResponse.json({ ok: false, reason: 'Unnatural typing detected' }, { status: 403 });
    }

    sessions.delete(sid); // Consume session
    return NextResponse.json({ 
      ok: true, 
      wpm: Math.min(MAX_VALID_WPM, Math.round(sWpm)), 
      accuracy: Math.round(sAcc) 
    });
  } catch (e) { 
    return NextResponse.json({ ok: false, error: 'Internal validation error' }, { status: 500 }); 
  }
}
