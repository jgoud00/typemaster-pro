-- ============================================================
-- Aloo Type — Analytics Sync Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_analytics (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  vector_clock JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON public.user_analytics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own analytics"
  ON public.user_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON public.user_analytics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS update_user_analytics_updated_at ON public.user_analytics;
CREATE TRIGGER update_user_analytics_updated_at
  BEFORE UPDATE ON public.user_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
