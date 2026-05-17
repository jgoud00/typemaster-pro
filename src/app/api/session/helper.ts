import { jwtVerify, type JWTPayload } from 'jose';
import { createServiceClient } from '@/lib/supabase/server';

export const SESSION_TTL_SECONDS = 360; // 6 minutes

export interface SessionPayload extends JWTPayload {
    ip: string;
    startTime: number;
    jti: string;
}

export function getJwtSecret(): Uint8Array {
    const rawSecret = process.env.NEXTAUTH_SECRET ?? process.env.SESSION_SECRET;
    if (!rawSecret && process.env.NODE_ENV === 'production') {
        throw new Error('SESSION_SECRET env var is required in production');
    }
    return new TextEncoder().encode(rawSecret ?? 'dev-insecure-secret-change-me');
}

/**
 * Verifies a session token and returns the payload, or null if invalid/replayed.
 * Marks the jti as consumed in Supabase to prevent replay attacks.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
    let payload: SessionPayload;
    try {
        const secret = getJwtSecret();
        const result = await jwtVerify<SessionPayload>(token, secret);
        payload = result.payload;
    } catch {
        return null;
    }

    if (!payload.jti) return null;

    try {
        const supabase = createServiceClient();

        // Atomic check-and-insert: if jti already exists, insert will fail (unique constraint)
        const { error } = await supabase
            .from('session_used_tokens')
            .insert({ jti: payload.jti, expires_at: new Date((payload.exp ?? 0) * 1000).toISOString() });

        if (error) {
            // Duplicate jti = replay attack
            return null;
        }
    } catch {
        // In dev without the table, allow through
        if (process.env.NODE_ENV === 'production') return null;
    }

    return payload;
}
