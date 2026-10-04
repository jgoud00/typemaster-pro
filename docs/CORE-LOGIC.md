# Typing and learning logic upgrade

October 3, 2026.

## Typing engine

- Stop on errors is enabled by default: the cursor stays on the incorrect character until corrected. The character turns red and underlined, and a prompt names the correct key. Users can disable Stop on errors in Settings for benchmark modes that advance through mistakes and support Backspace correction. Guided lessons and adaptive practice always require correction.
- Net WPM counts correct characters still present in the typed text, including spaces, divided by five and by active minutes. Deleting and retyping cannot create additional net characters.
- Accuracy uses correct character attempts divided by all character attempts. Correcting a mistake clears its red display but preserves the mistake in accuracy and error totals.
- Every incorrect attempt counts toward sudden death, including repeated mistakes. Input stops after the third mistake.
- Timed completion freezes the engine at its exact active-time deadline. Late input cannot modify the result. Completion callbacks from an older session cannot replace a restarted session.
- Pauses exclude inactive time from WPM and avoid treating the pause as hesitation on the next key. Losing typing focus pauses the session; returning focus resumes it.
- Repeated held-key events, composition events, and keyboard actions on other controls are excluded from typing input.
- Escape restart respects the Quick Restart preference and does not restart a session while closing a dialog. Tab followed by Enter also restarts practice.
- Restart resets the displayed metrics, not only the underlying store.

## Adaptive practice

Smart Practice now starts with the letters `e n i t r l`. Its lowercase text contains only unlocked letters and spaces. Three out of every five generated words target the focus letter; the remaining words mix the unlocked alphabet. Adjacent repeated words are avoided when alternatives exist.

The focus letter is the least-ready unlocked letter, based on evidence, accuracy, and average key speed. Each active letter needs at least 20 attempts, 95% accuracy, and 30 key WPM before the next letter unlocks. Key WPM is derived from the average delay for that key and is distinct from whole-test WPM. A new key takes priority in the next session. Previously unlocked keys remain available after weaker performance.

The readiness panel updates as the focus key is practiced. Unlocked letter progress is saved locally. This is a transparent initial learning policy; the thresholds have regression coverage but have not been validated in a longitudinal learning study.

## Session and lesson progress

Completed sessions are saved once in the shared controller, including practice time and actual attempted keystrokes. This covers practice, warmups, adaptive sessions, and lesson exercises. Invalid integrity results remain marked as invalid; existing integrity checks still control personal-best and reward eligibility.

Lesson exercises require their configured WPM and accuracy targets before advancing. Passing the final exercise marks the lesson complete and unlocks the next lesson. Failed attempts are saved and offer a retry.

Analytics history loads before practice renders, avoiding initialization writes that could replace saved statistics and ensuring adaptive practice sees the loaded history.

## Local results and online rankings

Local results are displayed and saved immediately. A leaderboard failure does not replace local WPM and accuracy with zero. The existing server submission endpoint derives metrics from its own keystroke evidence, so its accepted response does not overwrite the local net score. Server leaderboard scoring and authenticated cloud synchronization remain separate validation work; no claim of ranking parity or production anti-cheat certification is made here.

## Validation

- Production build, ESLint, and TypeScript passed.
- 38 unit tests passed, including net-WPM retyping, guided and benchmark correction, deadline freezing, paused hesitation, adaptive evidence requirements, unlocked-alphabet constraints, deterministic generation, and restricted-alphabet fallback.
- 17 focused Chrome browser tests passed. New checks cover benchmark correction, adaptive input, dialog-safe restart, sudden-death completion, exact timed duration, single record persistence, and lesson retry gating.
- Logic browser tests isolate session, recovery, and leaderboard API calls. Live authenticated cloud flows are not included.

Run `npm run test` and `$env:PLAYWRIGHT_CHANNEL='chrome'; npm run test:e2e:ui` to repeat the checks.
