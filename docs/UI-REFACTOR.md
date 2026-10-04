# Aloo Type UI refactor

Rebuilt October 3, 2026 following the request for a bright editorial direction.

The previous sidebar dashboard composition was replaced. The overview now has an oversized editorial hero, home-row key sculpture, integrated next lesson, a divided metric strip, and numbered practice choices. Shared headings and surfaces carry the new direction across the application.

## What changed

- A new editorial workspace shell with horizontal desktop navigation, a mobile drawer, active routes, and searchable lessons.
- A warm paper and ink design system with forest green accents, large serif headings, quieter surfaces, and consistent controls.
- Redesigned overview, curriculum, practice modes, typing sessions, analytics, achievements, challenges, settings, and About pages.
- Dashboard metrics and recent activity use actual saved progress; new users see honest empty states.
- Lesson search, category filtering, progress indicators, and disabled locked lessons.
- Analytics time ranges now filter the plotted sessions.
- Accessible Radix dialogs for sign-in, search, lesson completion, and reset confirmation.
- Paper and ink is the new default. Version-zero dark settings migrate to light while preserving other preferences; optional named palettes remain available. Improved mobile keyboard and typing statistics layouts.
- Replaced the continuously animated background canvas with a lightweight CSS background.

Existing typing, progress, and authentication integrations remain connected. Existing uncommitted project work was preserved. Some source files also received formatting changes.

## Validation

- Production build: passed.
- ESLint: passed.
- TypeScript: passed.
- Vitest: 28 tests passed across four files.
- Focused Chrome browser suite: ten tests passed, covering search and focus restoration, curriculum filtering, mobile navigation, sign-in dialog, theme persistence, typing and backspace, analytics filtering, reset cancellation, and theme migration preserving other preferences, and the header light/dark toggle on narrow mobile.
- Responsive route audit: 15 route variants at 1440, 768, 390, and 320 pixels. All 60 checks had no horizontal document overflow, one main landmark, and one page heading; no browser page errors were recorded.
- Desktop and mobile screenshots were visually inspected.

The focused browser suite is separate from the existing full E2E suite. Live Supabase sign-up, cloud synchronization, and authenticated account flows were not exercised. These checks establish the UI and local interactions, not a full backend production certification.

## Run locally

```powershell
npm run dev
```

Production preview:

```powershell
npm run build
npm run start -- --port 3100
```

Focused browser checks using installed Chrome:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:e2e:ui
```

The browser configuration builds and starts a production server when port 3100 is not already serving the application.

The moon/sun button in the global header switches between Paper & ink and Dark studio. The existing settings store persists the selection across routes and reloads.

Dark-mode follow-up: the 15-route responsive audit was repeated in Dark studio at all four widths (60 checks), with no document overflow or page errors. Mobile sign-in and search dialogs were also checked, including Escape and focus restoration. Session results and analytics icon backgrounds now use theme-aware colors.

Latest visual update: replaced green branding with muted blue and periwinkle accents in both default themes. Navigation, shared cards, lesson tiles, typing areas, and dialogs use translucent backgrounds, backdrop blur, fine borders, and soft shadows. Static atmospheric gradients sit behind the glass. CSS includes an opaque fallback when backdrop blur is unavailable. Production build and lint passed; all 18 focused browser checks passed, including error visibility and blocking in both themes. Light, dark, and mobile screenshots were inspected.

## Monochrome glass update (2026-10-03)

The workspace now uses black, white and neutral gray in both clear glass (light) and smoked glass (dark). Shared cards, lesson panels, practice surfaces, navigation and overlays use translucent fills, backdrop blur, highlighted edges and soft shadows over a static atmospheric backdrop. Decorative statistics accents and chart lines are neutral. Typing errors retain a red underline and explicit correction prompt so mistakes remain unmistakable.

Added a reusable accessible workspace skeleton for initial preference hydration, practice-history hydration and route loading. Skeleton shapes are hidden from assistive technology; their container announces loading. Shimmer stops for reduced-motion preferences. An opaque fallback supports browsers without backdrop-filter. Theme selection is restricted to the two monochrome modes, with older named palettes migrated while retaining other preferences.

Validation on the production build: lint and build passed; 38 unit tests passed; 19 Chrome browser tests passed, including deferred-JavaScript skeleton visibility, reduced motion, 320px layout, theme persistence and typing-error correction. Fifteen routes/modes checked at 1440, 768, 390 and 320px in both themes (120 checks) had no horizontal overflow, duplicate main landmarks, missing page headings or browser runtime errors. Existing search, authentication dialog, empty-state actions and reset confirmation remain covered by browser tests. Live authentication and cloud score submission were not exercised.

Visual evidence: `docs/ui/monochrome-glass-light.png`, `monochrome-glass-dark.png`, `monochrome-glass-mobile.png` and `monochrome-skeleton.png`.

## Stronger glass treatment (2026-10-04)

Added visible monochrome spheres and a curved ribbon behind the workspace, reduced panel opacity, increased frosted blur to 32px, strengthened inset reflections and rounded shared surfaces. The backdrop is decorative, static, clipped to the viewport and does not intercept input. Mobile shapes scale down. The production build, targeted component lint and all 19 browser interaction tests passed. Updated light, dark and mobile screenshots were reviewed.

## Page-specific compositions (2026-10-04)

Reworked the repeated card layouts: lessons now use numbered chapter rows with clear target/status columns; practice features a custom key sculpture and asymmetric mode selection; preferences place controls beside a sticky introduction; analytics prioritizes the performance chart with a paired keyboard/insights layout; achievements use an open medal gallery; challenges emphasize the daily quote beside a smaller weekly goal; the about page uses a two-column editorial story. Homepage metrics are an open, divided strip instead of four touching rounded cards. The header is substantially more opaque when scrolling, while glass panels remain translucent and decorative background forms are quieter. Corrected challenge-button and active achievement-tab foreground contrast in light mode.

Validation: production build and lint for changed components passed. All 19 browser interaction tests passed. Initial 120 route/theme/viewport checks found one analytics overflow at 768px; the breakpoint was corrected, and a final 16-check analytics/practice sweep across both themes at 1440, 768, 390 and 320px passed. Reviewed page screenshots and the dark header at scroll position 430px. Evidence: `docs/ui/distinct-*.png` and `docs/ui/scrolled-dark-header.png`.
