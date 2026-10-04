# Aloo Type — UI/UX Redesign Implementation Plan & Comprehensive Audit

> **Document Type:** Pre-Redesign Architectural Audit & Strategy
> **Status:** AUDIT COMPLETE — AWAITING DESIGN PACK
> **Target Application:** Aloo Type (AI-Powered Typing Tutor)
> **Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Zustand 5, Radix UI, Framer Motion 12, Recharts 3, IndexedDB (idb-keyval), Supabase SSR.

---

## A. Existing Frontend Architecture

- **Framework:** Next.js 16.2.6 using the App Router (`src/app/`). All major pages use Client Components (`'use client'`) due to real-time keystroke tracking, live timers, audio synthesizers, and client-side Zustand store consumption.
- **Render Mode & Hydration:** React 19.2.3 with strict hydration suppression wrappers (`suppressHydrationWarning`, `HydrationProvider`) to allow safe reading of local storage and IndexedDB persistence.
- **Event Bus:** Decoupled `mitt` event bus (`typingBus` in [src/lib/events/typing-bus.ts](file:///d:/College/vibecode/src/lib/events/typing-bus.ts)) connects low-level keystroke events to sound synthesis, anti-cheat telemetry, and achievement triggers without re-rendering high-level trees.
- **Web Workers:** Web Worker integration managed via Comlink (`ml-worker-instance.ts`, `ml-worker.ts`) executing off-main-thread ML/N-gram analysis.

---

## B. Routes Discovered

| Route | File Path | Primary Function | State & Logic Handled |
|---|---|---|---|
| `/` | [src/app/page.tsx](file:///d:/College/vibecode/src/app/page.tsx) | Home / Dashboard | Hero banner, course progress overview, quick actions, metric summary cards, recent activity. |
| `/lessons` | [src/app/lessons/page.tsx](file:///d:/College/vibecode/src/app/lessons/page.tsx) | Curriculum Roadmap | Vertical curriculum journey (73 lessons across 6 categories), lock/unlock states, star ratings. |
| `/lessons/[id]` | [src/app/lessons/[id]/page.tsx](file:///d:/College/vibecode/src/app/lessons/%5Bid%5D/page.tsx) | Active Lesson Typing | Text generation by key tier, keystroke validation, telemetry bar, virtual keyboard, completion modal. |
| `/practice` | [src/app/practice/page.tsx](file:///d:/College/vibecode/src/app/practice/page.tsx) | Practice Hub & Drill Runner | Hub mode selector + full typing runner for Free Practice, Speed Test (60s, 2m, 5m), Sudden Death, Zen, and Custom Text. |
| `/practice/smart` | [src/app/practice/smart/page.tsx](file:///d:/College/vibecode/src/app/practice/smart/page.tsx) | Adaptive Smart Practice | Weakness-targeted drills dynamically generated from key error stats. |
| `/practice/speed-training`| [src/app/practice/speed-training/page.tsx](file:///d:/College/vibecode/src/app/practice/speed-training/page.tsx) | Burst Mode Runner | High-intensity interval pacing drills and survival runs. |
| `/practice/warmup` | [src/app/practice/warmup/page.tsx](file:///d:/College/vibecode/src/app/practice/warmup/page.tsx) | Pre-Session Warmup | Short guided finger warm-up sequences. |
| `/challenges` | [src/app/challenges/page.tsx](file:///d:/College/vibecode/src/app/challenges/page.tsx) | Daily & Weekly Challenges | Seed-deterministic daily quote & weekly endurance tests. |
| `/stats` | [src/app/stats/page.tsx](file:///d:/College/vibecode/src/app/stats/page.tsx) | Analytics & Performance | Recharts WPM/accuracy timelines, key accuracy heatmap, AI coach recommendations, danger zone. |
| `/achievements` | [src/app/achievements/page.tsx](file:///d:/College/vibecode/src/app/achievements/page.tsx) | Achievements & Badges | Categorized unlocks (Quick Wins, Speed, Accuracy, Milestones, Streaks, Secret), points counter. |
| `/settings` | [src/app/settings/page.tsx](file:///d:/College/vibecode/src/app/settings/page.tsx) | Settings & Data Management | Audio synthesizer selector, volume slider, font size, caret styles, keyboard layouts, JSON backup/restore. |
| `/about` | [src/app/about/page.tsx](file:///d:/College/vibecode/src/app/about/page.tsx) | Info Page | Product overview, mission, and architecture summary. |
| `/api/session` | [src/app/api/session/route.ts](file:///d:/College/vibecode/src/app/api/session/route.ts) | Backend API | Session persistence / sync endpoint. |
| `/api/submit-score` | [src/app/api/submit-score/route.ts](file:///d:/College/vibecode/src/app/api/submit-score/route.ts) | Anti-cheat Verification | Verifies HMAC/SHA-256 session integrity and records high scores. |

---

## C. Shared Layout Structure

- **Root Layout** ([src/app/layout.tsx](file:///d:/College/vibecode/src/app/layout.tsx)):
  - Global fonts injected: `Inter` (`--font-sans`), `JetBrains_Mono` (`--font-mono`), `Syne` (`--font-display`).
  - Providers hierarchy: `ErrorBoundary` -> `ThemeProvider` -> `SyncProvider` -> `WorkerProvider` -> `HydrationProvider` -> `AnalyticsSyncProvider`.
  - Ambient presentation: `AmbientBackground` (floating canvas glow) and `PWARegistry`.
  - Global feedback: `AchievementToast` (bottom-left popup) and `react-hot-toast` (`Toaster` bottom-right).
- **Header Navigation** ([src/components/layout/SiteHeader.tsx](file:///d:/College/vibecode/src/components/layout/SiteHeader.tsx)):
  - Sticky glass header (`bg-[#09090d]/90`, blur 12px, border-b).
  - Brand mark ("AlooType" with keyboard icon).
  - Desktop nav links with active motion pill indicator (`layoutId="nav-active-pill"`).
  - Daily streak badge with live count (`Flame` icon).
  - "More" dropdown (for Mobile navigation fallback + Achievements + About + Settings).
  - Theme picker dropdown.
  - Supabase Auth cluster (`Sign In` trigger modal or username pill with `Sign Out` action).

---

## D. Existing Reusable UI Components

Found in [src/components/ui/](file:///d:/College/vibecode/src/components/ui/):
- `button.tsx`: CVA-based button supporting variants (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `glow`, `amber`) and sizes (`default`, `sm`, `lg`, `icon`, `xl`).
- `badge.tsx`: CVA-based badge variants (`default`, `secondary`, `destructive`, `outline`, `success`, `warning`, `amber`).
- `card.tsx`: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
- `dialog.tsx`: Radix UI Dialog wrapper with modal backdrop, portal, and animations.
- `metric-card.tsx`: Stat display card with icon, label, primary metric, subtext, and subtle glow.
- `page-header.tsx`: Standardized page title + description header.
- `progress.tsx`: Radix UI Progress bar wrapper with animated indicator.
- `slider.tsx`: Radix UI Slider for volume control.
- `switch.tsx`: Radix UI Switch for toggle options.
- `tabs.tsx`: Radix UI Tabs for tabbed navigation.
- `tooltip.tsx`: Radix UI Tooltip.
- `skeleton.tsx`: Loading shimmer placeholder.
- `empty-state.tsx`: Standard empty state presentation.
- `error-boundary.tsx`: React error boundary with retry triggers.

---

## E. Existing Application-Specific Components

- **Typing Engine Presentation**:
  - `TypingArea` ([src/components/typing/typing-area.tsx](file:///d:/College/vibecode/src/components/typing/typing-area.tsx)): Renders tokenized word/character spans, active caret indicator, smooth auto-scroll with rAF, hidden mobile keyboard input shim.
  - `TypingCharacter` ([src/components/typing/typing-character.tsx](file:///d:/College/vibecode/src/components/typing/typing-character.tsx)): Individual character styling (`char-untyped`, `char-correct`, `char-error`, `char-active`).
  - `TypingStats` ([src/components/typing/typing-stats.tsx](file:///d:/College/vibecode/src/components/typing/typing-stats.tsx)): Live telemetry bar showing WPM, Accuracy %, Time Remaining/Elapsed, and Flow state.
  - `LiveFlowGraph` ([src/components/typing/live-flow-graph.tsx](file:///d:/College/vibecode/src/components/typing/live-flow-graph.tsx)): Dynamic mini SVG curve showing real-time speed stability.
  - `ParticleSystem` ([src/components/typing/particles.tsx](file:///d:/College/vibecode/src/components/typing/particles.tsx)): Canvas-based burst on keystroke hits.
- **Virtual Keyboard**:
  - `VirtualKeyboard` ([src/components/keyboard/virtual-keyboard.tsx](file:///d:/College/vibecode/src/components/keyboard/virtual-keyboard.tsx)): Responsive visual representation of physical keyboard layouts (QWERTY, Dvorak, Colemak, AZERTY) with finger-zone color coding and live active-key depression glow.
- **Gamification & Feedback**:
  - `ComboPopup` ([src/components/gamification/combo-popup.tsx](file:///d:/College/vibecode/src/components/gamification/combo-popup.tsx)): Milestone toasts at 25x, 50x, 100x combos.
  - `LessonComplete` ([src/components/gamification/lesson-complete.tsx](file:///d:/College/vibecode/src/components/gamification/lesson-complete.tsx)): Post-run modal with star calculation, WPM, accuracy, XP gained, and Next Lesson action.
  - `AchievementToast` ([src/components/gamification/achievement-toast.tsx](file:///d:/College/vibecode/src/components/gamification/achievement-toast.tsx)): Animated corner banner when achievements unlock.
- **Analytics & Stats**:
  - `PerformanceSection` ([src/components/stats/PerformanceSection.tsx](file:///d:/College/vibecode/src/components/stats/PerformanceSection.tsx)): Recharts responsive container with area/line graph for speed/accuracy over time.
  - `KeyboardHeatmap` ([src/components/stats/KeyboardHeatmap.tsx](file:///d:/College/vibecode/src/components/stats/KeyboardHeatmap.tsx)): Color-interpolated keyboard layout displaying per-key error rates.
  - `AICoach` ([src/components/stats/AICoach.tsx](file:///d:/College/vibecode/src/components/stats/AICoach.tsx)): Suggestion card derived from N-gram weaknesses.

---

## F. Current Styling Architecture

- **Tailwind Version:** Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css` with `@theme inline`).
- **Color Variables:** Dual definition in CSS `:root` and `.dark` (Amber `#f59e0b`, Surface `#0a0a0f`, Elevated `#141419`, Zinc neutral content).
- **Typography:**
  - Sans: Inter (`var(--font-sans)`)
  - Mono: JetBrains Mono (`var(--font-mono)`)
  - Display: Syne (`var(--font-display)`)
- **Key Issues with Current Styles:**
  - Incomplete theme migration: Some legacy screens still feature teal/cyan borders and hardcoded `#121217` or `oklch(...)` styles while newer ones use amber-500.
  - Disconnected utility classes: Multiple ad-hoc classes (`.glass`, `.glass-card`, `.glass-subtle`, `.glass-strong`, `.glass-glow-amber`) have minor duplicate declarations.
  - Inconsistent spacing and contrast ratios across pages.

---

## G. State Management Architecture

Built entirely on **Zustand v5** with distinct single-responsibility stores:
1. `useTypingStore` ([src/stores/typing-store.ts](file:///d:/College/vibecode/src/stores/typing-store.ts)): Keystroke buffer, character pointer `currentIndex`, error arrays, active key, raw/net WPM, accuracy calculation.
2. `useProgressStore` ([src/stores/progress-store.ts](file:///d:/College/vibecode/src/stores/progress-store.ts)): Persistent user records, personal bests, completed lesson IDs, category progress, total practice time, keystrokes. Backed by `idb-keyval` / `localStorage`.
3. `useGameStore` ([src/stores/game-store.ts](file:///d:/College/vibecode/src/stores/game-store.ts)): Streak counter, active combo, XP, level, high scores.
4. `useAnalyticsStore` ([src/stores/analytics-store.ts](file:///d:/College/vibecode/src/stores/analytics-store.ts)): Per-key stats (attempts, errors, latencies, finger distribution).
5. `useAchievementStore` ([src/stores/achievement-store.ts](file:///d:/College/vibecode/src/stores/achievement-store.ts)): Unlocked badges, achievement progress, point tallying.
6. `useSettingsStore` ([src/stores/settings-store.ts](file:///d:/College/vibecode/src/stores/settings-store.ts)): Audio synthesis options, layout preferences, typography sizes, caret configurations.
7. `useUserStore` ([src/stores/user-store.ts](file:///d:/College/vibecode/src/stores/user-store.ts)): Authenticated user session, profile synchronization with Supabase.
8. `useLeaderboardStore` ([src/stores/leaderboard-store.ts](file:///d:/College/vibecode/src/stores/leaderboard-store.ts)): High score standings and rankings.

---

## H. Components Containing Critical Business Logic (MUST BE PROTECTED)

> [!CAUTION]
> Under no circumstances should the business logic in these files be altered or rewritten during the visual redesign.

1. **`useTypingController`** ([src/hooks/use-typing-controller.ts](file:///d:/College/vibecode/src/hooks/use-typing-controller.ts)):
   - Keystroke capture, Backspace handling, event interception, anti-cheat drop/paste prevention, high-resolution event timing, session completion triggers, and recovery serialization.
2. **`useTypingStore` & `typing-bus`** ([src/stores/typing-store.ts](file:///d:/College/vibecode/src/stores/typing-store.ts), [src/lib/events/typing-bus.ts](file:///d:/College/vibecode/src/lib/events/typing-bus.ts)):
   - WPM calculation formulas, net/gross WPM, accuracy %, error tracking, and event emission.
3. **`anti-cheat.ts`** ([src/lib/anti-cheat.ts](file:///d:/College/vibecode/src/lib/anti-cheat.ts)):
   - Collector recording event timestamps, interval variance, paste/drop violations, and SHA-256 integrity hash verification.
4. **`progress-store.ts` & `session-recovery.ts`** ([src/stores/progress-store.ts](file:///d:/College/vibecode/src/stores/progress-store.ts), [src/lib/services/session-recovery.ts](file:///d:/College/vibecode/src/lib/services/session-recovery.ts)):
   - Lesson unlocking logic, personal best updates, auto-saving mid-session drills, and data export/import schemas.
5. **`keyboard-data.ts` & `keyboard-layouts.ts`** ([src/lib/keyboard-data.ts](file:///d:/College/vibecode/src/lib/keyboard-data.ts), [src/lib/keyboard-layouts.ts](file:///d:/College/vibecode/src/lib/keyboard-layouts.ts)):
   - Physical finger-to-key mapping, row indices, key widths, shifted values, and layout translations.

---

## I. Components Safe to Visually Replace

All presentation markup, visual shells, and page layouts can be safely reimagined:
- `SiteHeader.tsx` & navigation wrappers
- `HeroBanner.tsx` and dashboard cards
- `MetricCard.tsx`
- `LessonPath` / `lesson-journey.tsx` and category headers
- `PracticeHub` card grid and mode selector cards
- `TypingStats.tsx` presentation container
- `TypingArea.tsx` styling (container framing, caret animation, character font size/contrast)
- `VirtualKeyboard.tsx` key styles, borders, active glow, and finger legend pills
- `ResultChart.tsx` and `WeaknessAnalysis.tsx` presentation
- `PerformanceSection.tsx` and `AICoach.tsx` card layouts
- `AchievementCard.tsx` and categories tab layout
- `SettingsPage` layout, group cards, and input controls
- `WelcomeModal.tsx` and `AuthModal.tsx` dialog aesthetics

---

## J. UI Problems Discovered

1. **Theme Fragmentation:** Inconsistent accent colors across different features (amber on home, cyan/teal in certain practice components, purple/red in others).
2. **Low Typing Contrast:** Dimmed untyped characters in the typing box (`#52525b`) suffer from poor readability against deep dark backgrounds, causing eye strain.
3. **Information Density Imbalance:**
   - The lessons list renders as a very long vertical list that requires extensive scrolling.
   - The practice page is monolithic (695 lines) bundling both the hub card grid and the entire drill execution engine in one file.
   - The stats page feels vacant when no historical sessions are recorded.
4. **Mobile Navigation:** Navigation links collapse into an awkward "More" dropdown rather than an accessible mobile drawer or bottom nav bar.
5. **Virtual Keyboard Sizing:** Min-width fixed at 680px forces horizontal scroll on mobile devices without an adaptive or simplified keyboard view.

---

## K. Technical Debt Affecting the Redesign

1. **Monolithic Page Components:** `src/app/practice/page.tsx` (35KB) and `src/app/practice/speed-training/page.tsx` (35KB) mix configuration selection, execution flow, results displays, and modals. Separating presentation from flow state will be required.
2. **Hardcoded CSS Values:** Many components use inline hexadecimal colors (`#121217`, `#09090d`, `rgba(255,255,255,0.08)`) instead of semantic Tailwind design tokens.
3. **Tailwind v4 Transition Gaps:** Mixed usage of `@theme inline` tokens, `@layer utilities`, and standard Tailwind classes. Needs consolidation into a single clean semantic token dictionary.

---

## L. Proposed New Component Structure

```text
src/
  ├── components/
  │   ├── ui/                         <-- Base Radix/Shadcn primitives with custom tokens
  │   │   ├── button.tsx
  │   │   ├── card.tsx
  │   │   ├── badge.tsx
  │   │   ├── dialog.tsx
  │   │   ├── sheet.tsx               <-- (New) Clean mobile drawer
  │   │   ├── tabs.tsx
  │   │   ├── progress.tsx
  │   │   ├── slider.tsx
  │   │   ├── switch.tsx
  │   │   ├── tooltip.tsx
  │   │   ├── skeleton.tsx
  │   │   └── empty-state.tsx
  │   ├── layout/
  │   │   ├── AppShell.tsx            <-- (New) Unified application wrapper
  │   │   ├── Navbar.tsx              <-- Replaces monolithic SiteHeader
  │   │   ├── MobileNav.tsx           <-- (New) Dedicated responsive navigation
  │   │   └── PageHeader.tsx
  │   ├── dashboard/
  │   │   ├── ContinueLearningCard.tsx
  │   │   ├── QuickPracticeGrid.tsx
  │   │   ├── DashboardStatsGrid.tsx
  │   │   └── ActivityFeed.tsx
  │   ├── lessons/
  │   │   ├── CurriculumOverview.tsx
  │   │   ├── LessonCategorySection.tsx
  │   │   └── LessonCard.tsx
  │   ├── practice/
  │   │   ├── ModeSelectorCard.tsx
  │   │   ├── SpeedTestConfig.tsx
  │   │   ├── CustomTextInput.tsx
  │   │   └── PracticeResultsModal.tsx
  │   ├── typing/
  │   │   ├── TypingWorkspace.tsx     <-- Clean isolated workspace container
  │   │   ├── TypingArea.tsx          <-- Optimized non-rerendering text display
  │   │   ├── TypingTelemetry.tsx     <-- Polished WPM, Accuracy, Time, Flow
  │   │   └── VirtualKeyboard.tsx     <-- Redesigned ergonomic visual keyboard
  │   ├── stats/
  │   │   ├── AnalyticsSummary.tsx
  │   │   ├── SpeedAccuracyChart.tsx
  │   │   └── KeyHeatmapVisualizer.tsx
  │   ├── achievements/
  │   │   ├── AchievementProgressHeader.tsx
  │   │   └── AchievementItemCard.tsx
  │   └── settings/
  │       ├── SettingsGroupCard.tsx
  │       └── SettingsControlRow.tsx
```

---

## M. Proposed Migration Phases

- **Phase 1: Design Tokens & Base UI Primitives**
  - Establish complete semantic tokens in `globals.css` and `tailwind.config.ts`.
  - Refactor base UI primitives (`Button`, `Card`, `Badge`, `Dialog`, `Tabs`, `Progress`, `Switch`, `Slider`).
- **Phase 2: App Shell & Navigation**
  - Implement unified `Navbar` and responsive `MobileNav` with polished active states and streak indicator.
- **Phase 3: Dashboard (`/`)**
  - Transform home into a clear high-hierarchy dashboard answering: *What should I do now? How am I improving?*
- **Phase 4: Core Typing Experience (`TypingArea`, `VirtualKeyboard`, `TypingStats`)**
  - High-contrast, zero-latency typing interface with smooth caret, clear error styling, and refined keyboard keys.
- **Phase 5: Practice Mode Screens (`/practice`, speed test, burst, custom text)**
  - Clean mode cards on the hub; compact, collapsible controls when typing begins.
- **Phase 6: Lessons Curriculum (`/lessons`, `/lessons/[id]`)**
  - Redesigned lesson roadmap with distinct active, completed, and locked states.
- **Phase 7: Statistics & Analytics (`/stats`)**
  - Enhanced Recharts performance visualization, empty state handling, and interactive heatmap.
- **Phase 8: Achievements (`/achievements`)**
  - Polished badge cards with clear locked vs. unlocked visual weight and category filters.
- **Phase 9: Settings (`/settings`)**
  - Structured settings layout with categorized panels.
- **Phase 10: Responsive & Mobile Polish**
  - Strict breakpoint testing (360px to 1920px), mobile-optimized typing buffers and keyboard drawer/toggles.
- **Phase 11: Accessibility & ARIA Verification**
  - WCAG AA compliance, focus rings, screen reader attributes, reduced motion checks.
- **Phase 12: Cleanup & Legacy Deprecation**
  - Purge dead CSS, obsolete components, and verify all Playwright + Vitest test suites.

---

## N. Possible Regression Risks & Mitigations

1. **Typing Latency & Frame Drops:**
   - *Risk:* Complex animations or re-renders in `TypingArea` will lag keystrokes.
   - *Mitigation:* Zero framer-motion wrapping per character; keep `TypingCharacter` pure and memoized; isolate store subscriptions.
2. **Anti-Cheat & Keystroke Event Dropping:**
   - *Risk:* Wrapping inputs or changing focus traps breaks `window.keydown` event interception or trips anti-cheat false positives.
   - *Mitigation:* Preserve `useTypingController` event bindings and `data-typing-shim` attributes intact.
3. **Playwright E2E Selector Breakages:**
   - *Risk:* Redesigning markup breaks existing tests that look for specific ARIA roles or data-testids.
   - *Mitigation:* Maintain all required `[data-testid]`, `[role="status"]`, `[aria-label="Text to type"]`, and `[role="dialog"]` attributes.
4. **IndexedDB / Hydration Mismatch:**
   - *Risk:* Rendering server vs. client states for streak or progress causes React 19 hydration errors.
   - *Mitigation:* Keep `HydrationProvider` and client-only guards on persisted store values.

---

## O. Tests Protecting Important Functionality

- **Unit Tests (`vitest`):**
  - `src/stores/typing-store.test.ts` (WPM, backspace, accuracy logic)
  - `src/stores/analytics-store.test.ts` (Key attempts and error accumulation)
  - `src/lib/practice-texts.test.ts` (Text generation and lesson vocabulary)
  - `src/workers/ml.worker.test.ts` (N-gram and ML calculation)
- **End-to-End Tests (`playwright`):**
  - `e2e/01-app-foundation.spec.ts`: Hydration, layout, header navigation, theme switching.
  - `e2e/02-typing-engine.spec.ts`: Live typing, WPM calculation, error handling, backspace.
  - `e2e/03-lessons.spec.ts`: Lesson navigation, exercise completion, star rating.
  - `e2e/04-dashboard.spec.ts`: Stats cards, charts, progress display.
  - `e2e/05-gamification.spec.ts`: Combos, streaks, achievement toasts.
  - `e2e/06-weakness-detection.spec.ts`: Error logging and heatmaps.
  - `e2e/07-persistence.spec.ts`: LocalStorage and IndexedDB state retention.
  - `e2e/08-sync.spec.ts`: Synchronization with Supabase backend.
  - `e2e/09-accessibility.spec.ts`: Keyboard navigation, ARIA attributes, focus states.
  - `e2e/10-performance.spec.ts`: Input latency and render benchmarks.

---

**Audit completed.** The codebase is stable, type checks cleanly, and all underlying application logic and persistence layers are mapped. Ready for design pack inspection.
