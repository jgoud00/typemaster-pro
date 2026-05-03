// ─────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────
export const API_ROUTES = {
  SESSION: "/api/session",
  SUBMIT_SCORE: "/api/submit-score",
} as const;

// ─────────────────────────────────────────────────────────────
// Social Sharing URL Templates
// Tokens: {text} and {url} — replaced at call time via buildShareUrl()
// ─────────────────────────────────────────────────────────────
export const SHARE_URLS = {
  TWITTER:  "https://twitter.com/intent/tweet?text={text}&url={url}",
  FACEBOOK: "https://www.facebook.com/sharer/sharer.php?u={url}",
  REDDIT:   "https://www.reddit.com/submit?title={text}&url={url}",
} as const;

export function buildShareUrl(template: string, text: string, url: string): string {
  return template
    .replace("{text}", encodeURIComponent(text))
    .replace("{url}",  encodeURIComponent(url));
}

// ─────────────────────────────────────────────────────────────
// UI Timers & Animation Durations  (ms)
// ─────────────────────────────────────────────────────────────
export const TIMERS = {
  COUNTDOWN_TICK_MS:        100,   // live WPM/accuracy refresh rate
  ELAPSED_SECOND_MS:       1000,   // elapsed seconds counter update
  WELCOME_MODAL_LOADING_MS:   0,   // 0 = instant (removed artificial delay)
  DEBOUNCE_MS: 150,
  POLLING_INTERVAL_MS: 1000,
  RATE_LIMIT_COOLDOWN_MS: 2000,
  SESSION_EXPIRY_MS: 360000,
  CLEANUP_INTERVAL_MS: 30000,
  STAR_STAGGER_MS: 200,
} as const;

export const CONFETTI = {
  STAGGER_MS:  150,
  BURST_MS:    300,
  CLEANUP_MS:  200,
} as const;
