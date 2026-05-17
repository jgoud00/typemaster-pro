-- Migration: Serverless-safe rate limiting and replay prevention
-- Resolves: in-memory Map() serverless incompatibility

-- ── Rate limit table ──────────────────────────────────
-- Tracks session creation attempts per IP per time window.
-- Auto-cleanup via pg_cron or TTL: rows older than 1 minute are irrelevant.
CREATE TABLE IF NOT EXISTS session_rate_limit (
    id          BIGSERIAL PRIMARY KEY,
    ip          TEXT        NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_created
    ON session_rate_limit (ip, created_at DESC);

-- Auto-purge rows older than 2 minutes to keep table lean
CREATE OR REPLACE FUNCTION cleanup_rate_limit() RETURNS void
    LANGUAGE sql SECURITY DEFINER AS $$
    DELETE FROM session_rate_limit WHERE created_at < NOW() - INTERVAL '2 minutes';
$$;

-- ── Used token table (replay prevention) ─────────────
-- Each JWT jti is inserted once. Unique constraint makes insert fail on replay.
CREATE TABLE IF NOT EXISTS session_used_tokens (
    jti         TEXT        PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_used_tokens_expires
    ON session_used_tokens (expires_at);

-- Cleanup expired tokens (called periodically or via pg_cron)
CREATE OR REPLACE FUNCTION cleanup_used_tokens() RETURNS void
    LANGUAGE sql SECURITY DEFINER AS $$
    DELETE FROM session_used_tokens WHERE expires_at < NOW();
$$;

-- ── Atomic leaderboard upsert (eliminates read-modify-write race) ─────────
-- Uses DB-side MAX to prevent concurrent submits from overwriting each other.
CREATE OR REPLACE FUNCTION upsert_leaderboard(
    p_user_id   UUID,
    p_wpm       INTEGER,
    p_accuracy  INTEGER,
    p_duration  INTEGER
) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO leaderboard (user_id, best_wpm, best_accuracy, total_sessions, total_practice_time)
    VALUES (p_user_id, p_wpm, p_accuracy, 1, p_duration)
    ON CONFLICT (user_id) DO UPDATE SET
        best_wpm            = GREATEST(leaderboard.best_wpm, EXCLUDED.best_wpm),
        best_accuracy       = GREATEST(leaderboard.best_accuracy, EXCLUDED.best_accuracy),
        total_sessions      = leaderboard.total_sessions + 1,
        total_practice_time = leaderboard.total_practice_time + EXCLUDED.total_practice_time,
        updated_at          = NOW();
END;
$$;

-- ── RLS policies ──────────────────────────────────────
ALTER TABLE session_rate_limit ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_used_tokens ENABLE ROW LEVEL SECURITY;

-- Only service role (server-side) may read/write these tables
CREATE POLICY "service_only_rate_limit" ON session_rate_limit
    FOR ALL USING (false);  -- blocked for all anon/authenticated; server uses service key

CREATE POLICY "service_only_used_tokens" ON session_used_tokens
    FOR ALL USING (false);
