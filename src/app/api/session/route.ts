import { NextResponse } from 'next/server';
import { randomBytes, createHmac } from 'node:crypto';

import { TIMERS } from '@/lib/config/constants';

const secret = process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET || randomBytes(32).toString("hex");

// In Next.js, we can't use a simple Map for sessions if we scale, but for now this is the local state.
// Note: In production Next.js, this would need Redis or a Database.
export interface Session {
  startTime: number;
  ip: string;
  token: string;
}

const rateLimit = new Map<string, number>();
const sessions = new Map<string, Session>();

const getIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

export async function GET(req: Request) {
  const ip = getIp(req);
  const now = Date.now();
  if ((rateLimit.get(ip) || 0) > now) return NextResponse.json({ ok: false, error: 'Rate limit exceeded' }, { status: 429 });
  rateLimit.set(ip, now + TIMERS.RATE_LIMIT_COOLDOWN_MS);

  const sid = randomBytes(16).toString('hex');
  const token = createHmac('sha256', secret).update(sid + now).digest('hex');
  sessions.set(sid, { startTime: now, ip, token });
  return NextResponse.json({ sessionId: sid, startTime: now, token });
}

// Global variable for interval to survive HMR in dev
const globalWithCleanup = globalThis as typeof globalThis & { cleanupInterval?: NodeJS.Timeout };

if (!globalWithCleanup.cleanupInterval) {
  globalWithCleanup.cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [id, s] of sessions) if (now - s.startTime > TIMERS.SESSION_EXPIRY_MS) sessions.delete(id);
    for (const [ip, exp] of rateLimit) if (exp < now) rateLimit.delete(ip);
  }, TIMERS.CLEANUP_INTERVAL_MS);
}

// Export sessions for the submit-score route to share
export { sessions };
