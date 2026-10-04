# Aloo Type project analysis

Reviewed 3 October 2026 against the current working tree, including the uncommitted redesign.

## Assessment

Aloo Type is a substantial Next.js/React typing tutor with a usable architectural foundation. It contains a dedicated typing store and controller, lesson curriculum, adaptive practice, keystroke analytics, worker-based inference, achievements, challenges, local persistence, authentication and cloud synchronization. Stabilizing the existing experience is more valuable now than adding more features or rewriting it.

The main risks are correctness across persistence/account boundaries and the gap between security intentions and database enforcement. The build is healthy; that does not establish live cloud reliability or end-to-end learning effectiveness.

## Validation performed

| Check | Current result |
| --- | --- |
| `npm run test` | 4 files, 28 tests passed |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed; application routes generated successfully |
| Browser/E2E interactions | Not executed in this review |
| Live Supabase policies, migrations, authentication and writes | Not verified |
| Adaptive learning effectiveness | Not measured |

No application source was changed. Existing Git state includes 28 modified tracked files plus untracked UI components, prototype folders and documentation. Preserve this work before implementing fixes. Secrets were not printed or inspected.

## Findings and recommended fixes

### 1. High: database authorization does not enforce server-only leaderboard updates

Evidence: `supabase/migrations/001_initial_schema.sql` permits authenticated owners to insert and update their leaderboard rows. `003_serverless_session_hardening.sql` adds a `SECURITY DEFINER` `upsert_leaderboard` function accepting an arbitrary user ID, without an explicit execute-grant restriction, identity check or pinned search path. No supplied later migration removes the direct-write policies or restricts that function.

Impact: the supplied schema allows paths around the score-validation endpoint. The live database may differ and must be inspected before claiming a deployed vulnerability.

Fix: make trusted leaderboard writes service-role-only, restrict function execution, pin its search path and verify denial for anonymous/authenticated direct writes. Decide separately whether client-written typing sessions are trusted or merely local-history data.

### 2. High: account changes are not handled by the global sync provider

Evidence: `src/components/providers/sync-provider.tsx` obtains the user once in an effect with an empty dependency array. It never subscribes to auth changes; its interval retains that user ID. Local stores are shared rather than scoped by authenticated account.

Impact: signing in after mount does not start this provider's periodic sync. Signing out or switching accounts leaves stale sync targeting and creates a risk of mixing progress between users. Database RLS may reject stale writes, but that does not resolve local account isolation.

Fix: subscribe to auth changes, cancel stale operations/intervals, and define guest-to-account adoption and account-specific storage explicitly. Test guest → sign-in → sign-out → second account.

### 3. High: rate limiting and score persistence ignore returned database errors

Evidence: `src/app/api/session/route.ts` reads `count` without checking `error`, and ignores the rate-limit insert result. `src/app/api/submit-score/route.ts` also ignores query errors, session insert errors and leaderboard RPC errors. Its submission limit counts session-creation rows without recording submission attempts. Count-then-insert is not atomic.

Impact: an error returned as data can bypass the intended production fail-closed catch, or produce `ok: true` despite a failed save. Submission rate limiting does not measure submissions independently.

Fix: check every database result, distinguish verified/saved outcomes, record submission attempts separately and use an atomic database rate-limit operation.

### 4. Medium: coaching recommends missing lessons

Evidence: `src/lib/ai/coaching-engine.ts` maps G/H to `home-5-gh`, while the curriculum uses `home-8-gh`. Its top-row and bottom-row mappings also disagree with IDs in `src/lib/lessons/top-row.ts` and `bottom-row.ts`.

Impact: recommendation IDs cannot reliably resolve to lessons, even though the recommendation algorithm runs.

Fix: derive mappings from curriculum metadata and verify every recommendation resolves to an existing lesson.

### 5. Medium: cloud merges can lose independent device progress

Evidence: `src/lib/supabase/sync.ts` merges cumulative practice time and keystrokes with `Math.max`, chooses scalar winners by summed vector-clock counts, and truncates history to 100 records. `src/stores/analytics-store.ts` overwrites matching local key/ngram entries with remote entries and resets the vector clock. Cloud pushes replace the full JSON blob.

Impact: independent activity on two devices can be undercounted or overwritten. These operations do not establish conflict-safe multi-device synchronization.

Fix: use deduplicated session IDs or per-device counters with defined merge semantics; test concurrent devices, repeated pulls and offline reconnection.

### 6. Medium: E2E checks can give false confidence

Evidence: `e2e/helpers.ts` implements `completeTypingSession` and `waitForCharts` as body-visibility checks; `dumpIndexedDB` is empty. Hydration checks do not verify that stores have hydrated. `/sync` appears in helper routes but is absent from the production route inventory. Unit coverage comprises only four test files.

Fix: make helpers perform the named behavior and assert observable outcomes. Prioritize session completion, refresh persistence, wrong-key/backspace handling, account switching and cloud save failure. Review tests using these helpers before treating an E2E pass as proof.

### 7. Medium: score verification trusts client correctness flags

Evidence: `src/app/api/submit-score/route.ts` derives accuracy from client-supplied `correct` fields. The signed token binds time/IP, but does not bind a target text or keystroke content. Fields inside each keystroke are not fully runtime-validated. Tokens are consumed before later validation and persistence.

Impact: timing heuristics are insufficient to prove the submitted text was typed correctly. Malformed submissions or transient failures can also consume a token and prevent retry.

Fix: validate payload shape, bind competitive sessions to a server-issued challenge, derive correctness from the challenge and submitted input, and design idempotent saving/retry. Keep casual offline practice independent of competitive verification.

### 8. Medium: verification failure replaces displayed results with zero

Evidence: `src/app/practice/page.tsx` sets result WPM and accuracy to zero if score verification fails, after session completion handling has already run.

Impact: the user can see zero despite having completed a real session, while local progress can retain the original result.

Fix: retain local performance and show verification/save status separately; establish one authoritative completion flow.

### 9. Maintenance: documentation, accessibility and repository hygiene need consolidation

`docs/VALIDATION.md` still references TypeMaster Pro, old storage keys and a missing `src/lib/algorithms/ultimate-weakness-detector` module. The worker's named HMM method is an accuracy-window heuristic, and error prediction is rule-based; adaptive benefit remains unvalidated. Describe the implemented methods precisely.

The root skip link targets `#main-content`, but the matching ID exists only in an unused `AppShell`; current pages do not import that shell. Restore a consistent main landmark before repeating responsive/accessibility validation.

`.gitignore` has NUL-containing trailing entries, so those intended exclusions should be repaired. ESLint disables several useful rules globally; a clean lint run therefore gives limited hook-dependency and unused-code assurance. CI omits lint and ignores pushes to main. Its E2E job starts a server separately while Playwright is configured to start another server in CI; consolidate server ownership.

Prototype/reference/generated folders need explicit ownership and exclusion rules. Do not delete them without determining which assets are intentional.

## Suggested repair sequence

1. Preserve the current redesign as a reviewable Git checkpoint.
2. Correct database authorization and API error handling with meaningful regression tests.
3. Fix account lifecycle, hydration ordering and multi-device persistence semantics.
4. Repair lesson recommendation mappings and completion/result consistency.
5. Replace placeholder E2E helpers and run browser checks against the redesigned pages.
6. Align documentation and product claims with measured behavior, then conduct a small user pilot.

Recommended release condition: one full guest practice session, reload recovery, one lesson completion, sign-in sync, account switching and a simulated cloud failure all produce consistent user-visible results. Competitive leaderboard writes must reject direct client bypasses.
