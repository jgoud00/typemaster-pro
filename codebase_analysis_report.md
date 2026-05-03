# Aloo Type - Codebase Analysis Report

This document provides a detailed breakdown of every file in the `Aloo Type` codebase. The application is a modern, full-stack typing application built with Next.js (App Router), React, Tailwind CSS, and Zustand for state management. It features a rich typing engine, machine-learning-based weakness detection, gamification, and robust E2E testing.

---

## 1. Configuration & Root Files
These files govern the behavior of the project's tooling, dependencies, and build pipeline.

- **`.gitignore`**: Specifies intentionally untracked files (e.g., `node_modules`, `.next`) to ignore in Git.
- **`components.json`**: Configuration for `shadcn/ui`, defining where UI components are installed and their default styles.
- **`CONTRIBUTING.md`**: Guidelines for developers contributing to the repository.
- **`eslint.config.mjs`**: ESLint configuration for code linting, ensuring code quality and consistent styling.
- **`next-env.d.ts`**: TypeScript declarations specific to Next.js, generated automatically.
- **`next.config.ts`**: Configuration for the Next.js framework (e.g., redirects, experimental features).
- **`package.json` / `package-lock.json`**: Defines NPM dependencies, project metadata, and executable scripts (like `dev`, `build`, `test`).
- **`playwright.config.ts`**: Configuration for Playwright, the End-to-End (E2E) testing framework used in this project.
- **`postcss.config.mjs`**: Configuration for PostCSS, required for processing Tailwind CSS.
- **`README.md`**: The main project documentation and overview.
- **`tailwind.config.ts`**: Tailwind CSS configuration, defining themes, custom colors, and safelists (e.g., for heatmap colors).
- **`tsconfig.json` / `tsconfig.tsbuildinfo`**: TypeScript compiler configuration and build cache.
- **`vitest.config.ts`**: Configuration for Vitest, used for running unit and integration tests.
- **`.vscode/settings.json`**: Workspace-specific settings for VS Code.
- **`.github/workflows/ci.yml`**: GitHub Actions Continuous Integration pipeline, running tests and linting on push/pull requests.

---

## 2. Documentation (`docs/`)
Markdown files that outline the architectural and algorithmic decisions.

- **`ALGORITHMS.md`**: Details the machine learning and mathematical algorithms used for typing analysis (WPM, accuracy, n-grams).
- **`DATA_SCHEMA.md`**: Outlines the data models and database schemas used for persisting user data.
- **`VALIDATION.md`**: Documents the data validation rules, specifically around anti-cheat mechanisms and input sanitization.
- **`WEAKNESS_DETECTOR_REFACTOR.md`**: Documentation regarding the refactoring of the weakness detection logic, likely moving it to Web Workers.

---

## 3. End-to-End Tests (`e2e/`)
Playwright tests ensuring the application works correctly from a user's perspective.

- **`01-app-foundation.spec.ts`**: Tests for core layout, rendering, and routing.
- **`02-typing-engine.spec.ts`**: Tests the core typing logic, input handling, and WPM calculation.
- **`03-lessons.spec.ts`**: Tests the lesson progression and rendering.
- **`04-dashboard.spec.ts`**: Tests the user dashboard and statistics display.
- **`05-gamification.spec.ts`**: Tests achievements, combos, and streaks.
- **`06-weakness-detection.spec.ts`**: Tests the ML weakness detection integration.
- **`07-persistence.spec.ts` / `persistence.spec.ts`**: Tests that user data is correctly saved and loaded across sessions.
- **`08-sync.spec.ts`**: Tests data synchronization (likely via local storage or API).
- **`09-accessibility.spec.ts`**: Tests to ensure the app is usable via screen readers and keyboard navigation.
- **`10-performance.spec.ts`**: Tests ensuring the application meets performance benchmarks.
- **`helpers.ts`**: Reusable Playwright helper functions for common actions (e.g., simulating typing).
- **`offline.spec.ts`**: Tests the application's offline capabilities (PWA features).
- **`qa-typing-audit.spec.ts` / `typing-flow.spec.ts`**: Specific QA audits and core typing flow validations.

---

## 4. Public Assets (`public/`)
Static assets served directly by the browser.

- **`favicon.svg` / `icon.svg` / `next.svg` / `vercel.svg` / `file.svg` / `globe.svg` / `window.svg` / `grid.svg`**: Various SVG icons and logos used in the UI and branding.
- **`manifest.json`**: The Web App Manifest for Progressive Web App (PWA) installation.
- **`sw.js`**: The Service Worker file, enabling offline support and caching.

---

## 5. Scripts (`scripts/`)
Utility scripts, mostly for offline data processing.

- **`train-weakness-detector.ts` / `train-weakness-detector-v2.ts`**: Scripts to pre-train or generate the machine learning models used to detect typing weaknesses.

---

## 6. App Router (`src/app/`)
Next.js app directory containing the routes and pages.

- **`layout.tsx`**: The root layout wrapping all pages (includes providers, fonts, and global metadata).
- **`page.tsx`**: The main landing page.
- **`globals.css`**: Global CSS styles, including Tailwind directives.
- **`error.tsx` / `not-found.tsx`**: Global error boundary and 404 Not Found page.
- **`icon.svg`**: Application icon for the App Router.
- **`about/page.tsx`**: The "About" page.
- **`achievements/page.tsx`**: Page displaying the user's unlocked badges and achievements.
- **`api/session/route.ts`**: Backend API route for handling user sessions (pseudo-authentication).
- **`api/submit-score/route.ts`**: Backend API route for submitting scores securely (includes anti-cheat validation).
- **`challenges/page.tsx`**: Page showing daily and weekly typing challenges.
- **`lessons/page.tsx` / `lessons/[id]/page.tsx`**: The lesson listing page and dynamic route for individual typing lessons.
- **`practice/page.tsx` / `practice/speed-training/page.tsx`**: Open practice and specialized speed-training modes.
- **`race/page.tsx`**: A multiplayer or simulated racing mode page.
- **`settings/page.tsx`**: User settings (theme, keyboard layout, sound preferences).
- **`stats/page.tsx`**: Detailed user analytics and performance dashboard.

---

## 7. Components (`src/components/`)
React components, split into UI primitives and feature-specific domains.

### UI Primitives (`src/components/ui/`)
*Built on top of Radix UI and shadcn/ui.*
- **`badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `label.tsx`, `progress.tsx`, `skeleton.tsx`, `slider.tsx`, `switch.tsx`, `tabs.tsx`**: Standardized, reusable UI elements.
- **`empty-state.tsx`**: Component displayed when there is no data to show.
- **`error-boundary.tsx`**: React Error Boundary to catch UI crashes gracefully.

### Domain Components
- **`pwa-registry.tsx`**: Registers the service worker for PWA functionality.
- **`ShareButtons.tsx`**: Social sharing integration.
- **`challenges/WeeklyChallenges.tsx`**: UI for displaying weekly challenges.
- **`dashboard/HeroBanner.tsx`**: The hero/header section of the user dashboard.
- **`diagnostic/certificate.tsx`**: UI for generating a typing test certificate.
- **`gamification/achievement-toast.tsx` / `combo-popup.tsx` / `lesson-complete.tsx`**: Visual overlays for gamification events.
- **`goals/DailyGoals.tsx`**: UI for tracking daily typing goals.
- **`keyboard/virtual-keyboard.tsx` / `keyboard-redesign/VectorKeyboard.tsx`**: On-screen keyboard visualizations reacting to user input.
- **`layout/SiteHeader.tsx`**: Main site navigation bar.
- **`lessons/lesson-journey.tsx`**: UI component mapping out the lesson progression path.
- **`multiplayer/RaceMode.tsx`**: The UI for the race mode functionality.
- **`onboarding/WelcomeModal.tsx`**: Initial onboarding flow for new users.
- **`practice/result-chart.tsx`**: Charts displaying performance after a practice session.
- **`providers/hydration-provider.tsx` / `worker-provider.tsx`**: Context providers ensuring safe hydration (preventing React 19 mismatch) and worker initialization.
- **`settings/sound-settings.tsx`**: UI for toggling typing sounds.
- **`stats/KeyboardHeatmap.tsx` / `PerformanceSection.tsx` / `PersonalRecordsDashboard.tsx`**: Visualizations for user statistics.
- **`typing/live-flow-graph.tsx` / `typing-area.tsx` / `typing-character.tsx` / `typing-stats.tsx`**: The core interactive components of the typing interface.

---

## 8. Hooks (`src/hooks/`)
Custom React hooks encapsulating complex UI logic.

- **`use-confetti.ts`**: Triggers a confetti animation for celebrations.
- **`use-sound.ts`**: Manages audio playback for keystrokes.
- **`use-typing-controller.ts`**: The core controller hook managing keystrokes, accuracy, and interactions with the typing store.
- **`useMLWorker.ts`**: Hook for cleanly communicating with the ML Web Worker without blocking the main thread.

---

## 9. Library & Utilities (`src/lib/`)
Core business logic, helpers, and constants.

- **`achievements.ts`**: Definitions and logic for unlocking achievements.
- **`anti-cheat.ts`**: Logic to detect macros, botting, and impossible typing speeds.
- **`daily-challenges.ts`**: Logic for generating random or scheduled daily challenges.
- **`keyboard-data.ts` / `keyboard-layouts.ts` / `layouts.ts`**: Mapping of different keyboard layouts (QWERTY, Dvorak, Colemak).
- **`lessons.ts`**: Functions to retrieve and structure typing lessons.
- **`ngram-analyzer.ts`**: Analyzes sequences of characters (n-grams) to find common typing weaknesses.
- **`practice-texts.ts`**: A corpus of text used for practice mode.
- **`sound-engine.ts`**: Advanced audio handling for typing sounds.
- **`utils.ts`**: General helper functions (e.g., Tailwind class merging `cn`).
- **`locales/en.ts`**: English localization dictionary.
- **`storage/db.ts`**: Wrapper for IndexedDB or local storage to persist data.
- **`events/typing-bus.ts` / `events/typing-listeners.ts`**: A custom event bus decoupling typing components to improve performance.
- **`lessons/...`**: Content for specific lessons (`advanced.ts`, `bottom-row.ts`, `home-row-advanced.ts`, `home-row-basics.ts`, `numbers.ts`, `symbols.ts`, `top-row.ts`).

---

## 10. State Management (`src/stores/`)
Zustand stores used for global state management.

- **`achievement-store.ts`**: Tracks the user's unlocked achievements.
- **`analytics-store.ts`**: Stores historical typing data and heatmaps.
- **`challenge-store.ts`**: Manages the state of active daily/weekly challenges.
- **`diagnostic-store.ts`**: Manages state for the initial diagnostic typing test.
- **`game-store.ts`**: Manages gamification state like current combos and streaks.
- **`leaderboard-store.ts`**: Manages fetched leaderboard data.
- **`progress-store.ts`**: Tracks the user's overall progression through lessons.
- **`settings-store.ts`**: User preferences (theme, layout, sound).
- **`typing-store.ts`**: The highly active state of the current typing session (current word, errors, WPM).
- **`user-store.ts`**: User profile and session state.

---

## 11. Web Workers (`src/workers/`)
Scripts that run in background threads to keep the UI smooth.

- **`ml-worker-instance.ts`**: A singleton wrapper for initializing and accessing the Web Worker safely.
- **`ml.worker.ts`**: The actual Web Worker script that processes typing data and runs ML algorithms to detect weaknesses without blocking the React main thread.
- **`ml.worker.test.ts`**: Unit tests for the Web Worker logic.

---

## 12. Types & Test Setup
- **`src/types/index.ts`**: Shared TypeScript interfaces and types used throughout the application.
- **`src/test/setup.ts`**: Global setup file for Vitest, initializing mock environments or APIs for testing.
