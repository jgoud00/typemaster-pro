import { NextResponse } from 'next/server';
import { sessions } from '../session/route';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sid, token, keystrokes } = body;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    if (!sid || !token || !Array.isArray(keystrokes)) return NextResponse.json({ ok: false }, { status: 400 });
    
    const sess = sessions.get(sid);
    if (!sess || sess.token !== token) return NextResponse.json({ ok: false }, { status: 401 });
    if (process.env.NODE_ENV !== 'development' && sess.ip !== ip) return NextResponse.json({ ok: false }, { status: 401 });
    if ((Date.now() - sess.startTime) > 360000) { sessions.delete(sid); return NextResponse.json({ ok: false }, { status: 401 }); }

    // Fix #4: Validate timestamp ordering and bounds
    const sorted = keystrokes.every((k: any, i: number) => i === 0 || k.t >= keystrokes[i - 1].t);
    if (!sorted || keystrokes.some((k: any) => typeof k.t !== 'number' || k.t > Date.now() + 1000 || k.t < sess.startTime - 1000))
      return NextResponse.json({ ok: false, reason: 'Invalid timestamps' }, { status: 400 });


    if (keystrokes.length < 2) return NextResponse.json({ ok: false, reason: 'Too few keystrokes' }, { status: 400 });
    // Fix #3: Use only correct keystrokes for WPM (prevents padding attack)
    const validKs = keystrokes.filter((k: any) => k.correct && typeof k.t === 'number');
    // Use keystroke timestamp span for WPM (robust to client-side buffer truncation)
    const ksDuration = Math.max(1, (keystrokes[keystrokes.length - 1].t - keystrokes[0].t) / 1000);
    const sWpm = (validKs.length / 5) / (ksDuration / 60);
    const sAcc = (validKs.length / keystrokes.length) * 100;

    const ivs = keystrokes.slice(1).map((k: any, i: number) => k.t - keystrokes[i].t);
    const avg = ivs.reduce((a: number, b: number) => a + b, 0) / ivs.length;
    const variance = ivs.reduce((a: number, b: number) => a + Math.pow(b - avg, 2), 0) / ivs.length;
    const normalizedVariance = variance / (avg || 1);
    
    if (ivs.length > 10 && (avg < 15 || normalizedVariance < 0.5 || sWpm > 250)) {
      return NextResponse.json({ ok: false, reason: 'Macro detected' }, { status: 403 });
    }

    sessions.delete(sid); // Fix 8: Final delete after all validation
    return NextResponse.json({ ok: true, wpm: Math.min(250, sWpm), accuracy: Math.min(100, sAcc) });
  } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
}
