-- Create incomplete_sessions table to store in-progress typing sessions

CREATE TABLE IF NOT EXISTS public.incomplete_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    current_index INTEGER NOT NULL,
    error_indices INTEGER[] NOT NULL DEFAULT '{}',
    start_time BIGINT NOT NULL,
    paused_ms BIGINT NOT NULL DEFAULT 0,
    mode TEXT NOT NULL,
    lesson_id TEXT,
    saved_at BIGINT NOT NULL,
    
    -- Ensure only one incomplete session per user
    CONSTRAINT unique_user_incomplete_session UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.incomplete_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own incomplete session"
    ON public.incomplete_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own incomplete session"
    ON public.incomplete_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own incomplete session"
    ON public.incomplete_sessions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own incomplete session"
    ON public.incomplete_sessions
    FOR DELETE
    USING (auth.uid() = user_id);
