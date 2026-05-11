-- ============================================================
-- Analytics Data Sync Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_analytics (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    vector_clock JSONB NOT NULL DEFAULT '{}'::jsonb,
    schema_version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_updated_at ON public.user_analytics(updated_at DESC);

-- Enable RLS
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own analytics" ON public.user_analytics;
CREATE POLICY "Users can view own analytics" 
    ON public.user_analytics FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own analytics" ON public.user_analytics;
CREATE POLICY "Users can insert own analytics" 
    ON public.user_analytics FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own analytics" ON public.user_analytics;
CREATE POLICY "Users can update own analytics" 
    ON public.user_analytics FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS update_user_analytics_updated_at ON public.user_analytics;
CREATE TRIGGER update_user_analytics_updated_at
    BEFORE UPDATE ON public.user_analytics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
