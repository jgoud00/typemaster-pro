import { NextResponse } from 'next/server';
import { SignJWT, type JWTPayload } from 'jose';
import { createServiceClient } from '@/lib/supabase/server';
import { getJwtSecret, SESSION_TTL_SECONDS, type SessionPayload } from './helper';

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max sessions per IP per window

const getIp = (req: Request) =>
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1';

export async function GET(req: Request) {
    const ip = getIp(req);
    const now = Date.now();

    // Supabase-backed rate limiting — survives serverless cold starts
    try {
        const supabase = createServiceClient();
        const windowStart = new Date(now - RATE_LIMIT_WINDOW_MS).toISOString();

        const { count } = await supabase
            .from('session_rate_limit')
            .select('*', { count: 'exact', head: true })
            .eq('ip', ip)
            .gte('created_at', windowStart);

        if ((count ?? 0) >= RATE_LIMIT_MAX) {
            return NextResponse.json(
                { ok: false, reason: 'Rate limit exceeded' },
                { status: 429, headers: { 'Retry-After': '60' } }
            );
        }

        await supabase.from('session_rate_limit').insert({ ip, created_at: new Date(now).toISOString() });
    } catch {
        // Non-fatal: if rate-limit table is missing, degrade gracefully in dev
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ ok: false, reason: 'Service unavailable' }, { status: 503 });
        }
    }

    // jti = cryptographically random 16-byte nonce for single-use enforcement
    const jti = crypto.randomUUID();

    const token = await new SignJWT({ ip, startTime: now, jti } satisfies Omit<SessionPayload, keyof JWTPayload>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setJti(jti)
        .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
        .sign(getJwtSecret());

    return NextResponse.json({ token, startTime: now });
}

