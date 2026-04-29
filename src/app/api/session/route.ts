import { NextResponse } from 'next/server';
import { randomBytes, createHmac } from 'node:crypto';

let _secret: string | null = null;
function getSecret(): string {
  if (!_secret) {
    _secret = process.env.SCORE_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-secret');
    if (!_secret) throw new Error('SCORE_SECRET env var is required in production');
  }
  return _secret;
}
// In Next.js, we can't use a simple Map for sessions if we scale, but for now this is the local state.
// Note: In production Next.js, this would need Redis or a Database.
const rateLimit = new Map<string, number>();
const sessions = new Map<string, { startTime: number; ip: string; token: string; }>();

const getIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

export async function GET(req: Request) {
  const ip = getIp(req);
  const now = Date.now();
  if ((rateLimit.get(ip) || 0) > now) return NextResponse.json({ ok: false }, { status: 429 });
  rateLimit.set(ip, now + 2000); // 2s cooldown for rapid restarts

  const sid = randomBytes(16).toString('hex');
  const token = createHmac('sha256', getSecret()).update(sid + now).digest('hex');
  sessions.set(sid, { startTime: now, ip, token });
  return NextResponse.json({ sessionId: sid, startTime: now, token });
}

if (!(global as any).cleanupInterval) {
  (global as any).cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [id, s] of sessions) if (now - s.startTime > 360000) sessions.delete(id);
    for (const [ip, exp] of rateLimit) if (exp < now) rateLimit.delete(ip);
  }, 30000);
}

// Export sessions for the submit-score route to share
export { sessions };
