# Detailed File-by-File Bug Report

## File: `e2e/01-app-foundation.spec.ts`
**Total Issues:** 1

- **Line 245** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "hamburger".
  - *Solution*: Delete the unused variable assignment to clean up dead code.

---

## File: `e2e/02-typing-engine.spec.ts`
**Total Issues:** 7

- **Line 51** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "typingPage".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 63** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "typingPage".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 57** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 57** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line 69** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 69** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line 260** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.

---

## File: `e2e/03-lessons.spec.ts`
**Total Issues:** 4

- **Line 10** | [MINOR] CODE_SMELL: Remove this unused import of 'DashboardPage'.
- **Line 12** | [MINOR] CODE_SMELL: Remove this unused import of 'TOTAL_LESSONS'.
- **Line 229** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 254** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `e2e/04-dashboard.spec.ts`
**Total Issues:** 3

- **Line 271** | [MAJOR] CODE_SMELL: Replace this alternation with a character class.
- **Line 9** | [MINOR] CODE_SMELL: Remove this unused import of 'DashboardPage'.
- **Line 11** | [MINOR] CODE_SMELL: Remove this unused import of 'waitForCharts'.

---

## File: `e2e/05-gamification.spec.ts`
**Total Issues:** 10

- **Line 6** | [MINOR] CODE_SMELL: Remove this unused import of 'Page'.
- **Line 9** | [MINOR] CODE_SMELL: Remove this unused import of 'GamificationPage'.
- **Line 54** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 55** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 69** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 89** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 166** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 225** | [MINOR] CODE_SMELL: Use concise character class syntax '\d' instead of '[0-9]'.
- **Line 239** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 258** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `e2e/06-weakness-detection.spec.ts`
**Total Issues:** 6

- **Line 6** | [MINOR] CODE_SMELL: Remove this unused import of 'Page'.
- **Line 7** | [MINOR] CODE_SMELL: Remove this unused import of 'AppPage'.
- **Line 202** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 206** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 210** | [MINOR] CODE_SMELL: Handle this exception or don't catch it at all.
- **Line 217** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `e2e/07-persistence.spec.ts`
**Total Issues:** 6

- **Line 7** | [MINOR] CODE_SMELL: Remove this unused import of 'Page'.
- **Line 11** | [MINOR] CODE_SMELL: Remove this unused import of 'dumpIndexedDB'.
- **Line 63** | [MINOR] CODE_SMELL: This assertion is unnecessary since the receiver accepts the original type of the expression.
- **Line 235** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 277** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 324** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `e2e/08-sync.spec.ts`
**Total Issues:** 6

- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'AppPage'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'SyncPage'.
- **Line 220** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 235** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 260** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 284** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `e2e/09-accessibility.spec.ts`
**Total Issues:** 8

- **Line 36** | [MAJOR] CODE_SMELL: Either use this collection's contents or remove the collection.
- **Line 7** | [MINOR] CODE_SMELL: Remove this unused import of 'Page'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'AppPage'.
- **Line 27** | [MINOR] CODE_SMELL: Prefer `.at(…)` over `[….length - index]`.
- **Line 172** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 175** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 175** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 370** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `e2e/10-performance.spec.ts`
**Total Issues:** 27

- **Line 416** | [MAJOR] CODE_SMELL: Prefer using an optional chain expression instead, as it's more concise and easier to read.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'AppPage'.
- **Line 17** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 21** | [MINOR] CODE_SMELL: Prefer `.at(…)` over `[….length - index]`.
- **Line 22** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 24** | [MINOR] CODE_SMELL: Handle this exception or don't catch it at all.
- **Line 30** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 38** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 43** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 47** | [MINOR] CODE_SMELL: Handle this exception or don't catch it at all.
- **Line 53** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 76** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 80** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 83** | [MINOR] CODE_SMELL: Handle this exception or don't catch it at all.
- **Line 89** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 158** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 158** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 197** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 197** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 198** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 199** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 201** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 221** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 473** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 477** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 480** | [MINOR] CODE_SMELL: Handle this exception or don't catch it at all.
- **Line 488** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `e2e/helpers.ts`
**Total Issues:** 4

- **Line 59** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 59** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line 66** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 66** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.

---

## File: `e2e/persistence.spec.ts`
**Total Issues:** 1

- **Line 33** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `e2e/qa-typing-audit.spec.ts`
**Total Issues:** 9

- **Line 82** | [MAJOR] CODE_SMELL: Use 'String#startsWith' method instead.
- **Line 127** | [MAJOR] CODE_SMELL: Use 'String#startsWith' method instead.
- **Line 40** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line 113** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 138** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 138** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line 152** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 385** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 406** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.

---

## File: `next.config.ts`
**Total Issues:** 2

- **Line 23** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.

---

## File: `playwright-report/index.html`
**Total Issues:** 5

- **Line 4** | [MAJOR] BUG: Add "lang" and/or "xml:lang" attributes to this "<html>" element
- **Line 83** | [MAJOR] BUG: Unexpected duplicate "font-weight"
- **Line 83** | [MAJOR] CODE_SMELL: Unexpected duplicate selector ":root", first used at line 83
- **Line 83** | [MAJOR] CODE_SMELL: Unexpected duplicate selector ":root", first used at line 83
- **Line 83** | [MAJOR] CODE_SMELL: Unexpected duplicate selector ":root.dark-mode", first used at line 83

---

## File: `public/sw.js`
**Total Issues:** 1

- **Line 13** | [MINOR] CODE_SMELL: Prefer `globalThis` over `self`.

---

## File: `scripts/train-weakness-detector-v2.ts`
**Total Issues:** 15

- **Line 97** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 24 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 223** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 25 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 256** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "keyAccuracies".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line N/A** | [MAJOR] CODE_SMELL: Prefer top-level await over using a promise chain.
- **Line 16** | [MINOR] CODE_SMELL: Prefer `node:fs` over `fs`.
- **Line 17** | [MINOR] CODE_SMELL: Prefer `node:path` over `path`.
- **Line 18** | [MINOR] CODE_SMELL: Prefer `node:readline` over `readline`.
- **Line 106** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 107** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 109** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 111** | [MINOR] CODE_SMELL: Prefer `Number.isNaN` over `isNaN`.
- **Line 111** | [MINOR] CODE_SMELL: Prefer `Number.isNaN` over `isNaN`.
- **Line 380** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 408** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 409** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.

---

## File: `scripts/train-weakness-detector.ts`
**Total Issues:** 24

- **Line 244** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 52 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 88** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "header".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 154** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "key".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 175** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "key".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 213** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "key".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 281** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "sessionKey".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 329** | [MAJOR] CODE_SMELL: 'If' statement should not be the only statement in 'else' block
- **Line 408** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "key".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line N/A** | [MAJOR] CODE_SMELL: Prefer top-level await over using a promise chain.
- **Line 16** | [MINOR] CODE_SMELL: Prefer `node:fs` over `fs`.
- **Line 17** | [MINOR] CODE_SMELL: Prefer `node:path` over `path`.
- **Line 97** | [MINOR] CODE_SMELL: Prefer `Number.parseInt` over `parseInt`.
- **Line 100** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 101** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 102** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 103** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 104** | [MINOR] CODE_SMELL: Prefer `Number.parseFloat` over `parseFloat`.
- **Line 108** | [MINOR] CODE_SMELL: Prefer `Number.isNaN` over `isNaN`.
- **Line 109** | [MINOR] CODE_SMELL: Prefer `Number.isNaN` over `isNaN`.
- **Line 421** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 480** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 481** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 482** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 483** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.

---

## File: `src/app/api/session/route.ts`
**Total Issues:** 2

- **Line 31** | [MINOR] CODE_SMELL: Prefer `globalThis` over `global`.
- **Line 32** | [MINOR] CODE_SMELL: Prefer `globalThis` over `global`.

---

## File: `src/app/api/submit-score/route.ts`
**Total Issues:** 1

- **Line 27** | [MINOR] CODE_SMELL: Prefer `.at(…)` over `[….length - index]`.

---

## File: `src/app/diagnostic/page.tsx`
**Total Issues:** 5

- **Line 36** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "typedText".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 236** | [MAJOR] CODE_SMELL: Avoid non-native interactive elements. If using native HTML is not possible, add an appropriate role and support for tabbing, mouse, keyboard, and touch inputs to an interactive content element.
- **Line 270** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line 5** | [MINOR] CODE_SMELL: Remove this unused import of 'AnimatePresence'.
- **Line 236** | [MINOR] BUG: Visible, non-interactive elements with click handlers must have at least one keyboard listener.

---

## File: `src/app/diagnostic/results/page.tsx`
**Total Issues:** 5

- **Line 132** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line 9** | [MINOR] CODE_SMELL: Remove this unused import of 'Trophy'.
- **Line 217** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'TrendingUp'.
- **Line 258** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/app/error.tsx`
**Total Issues:** 2

- **Line 9** | [MAJOR] BUG: Do not use "Error" to declare a function - use another name.
- **Line 9** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/app/lessons/[id]/page.tsx`
**Total Issues:** 1

- **Line 18** | [MINOR] CODE_SMELL: Remove this unused import of 'useTypingStore'.

---

## File: `src/app/not-found.tsx`
**Total Issues:** 1

- **Line 37** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/app/page.tsx`
**Total Issues:** 7

- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'X'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'ChevronRight'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'Star'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'Settings'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'Info'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'BookOpen'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'Play'.

---

## File: `src/app/practice/infinite/page.tsx`
**Total Issues:** 1

- **Line 12** | [MINOR] CODE_SMELL: Remove this unused import of 'useSound'.

---

## File: `src/app/practice/page.tsx`
**Total Issues:** 14

- **Line 126** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 18 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 539** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "sessionId".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 187** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "controllerIsComplete".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 336** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 269** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line 281** | [MINOR] CODE_SMELL: Handle this exception or don't catch it at all.
- **Line 305** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 306** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 416** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line 416** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.
- **Line 7** | [MINOR] CODE_SMELL: Remove this unused import of 'Zap'.
- **Line 93** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 126** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 364** | [MINOR] CODE_SMELL: Unexpected negated condition.

---

## File: `src/app/practice/smart/page.tsx`
**Total Issues:** 10

- **Line N/A** | [MAJOR] BUG: React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.
- **Line N/A** | [MAJOR] BUG: React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.
- **Line N/A** | [MAJOR] BUG: React Hook "useEffect" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.
- **Line N/A** | [MAJOR] BUG: React Hook "useMemo" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.
- **Line N/A** | [MAJOR] BUG: React Hook "useMemo" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.
- **Line N/A** | [MAJOR] BUG: React Hook "useAnalyticsStore" is called conditionally. React Hooks must be called in the exact same order in every component render.
  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.
- **Line N/A** | [MAJOR] BUG: React Hook "useMemo" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.
- **Line N/A** | [MAJOR] BUG: React Hook "useTypingController" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  - *Solution*: Move the React hook outside of conditional statements to ensure stable call order.
- **Line 273** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/app/practice/speed-training/page.tsx`
**Total Issues:** 11

- **Line 197** | [MAJOR] CODE_SMELL: A form label must be associated with a control.
- **Line 328** | [MAJOR] CODE_SMELL: 'If' statement should not be the only statement in 'else' block
- **Line 702** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line N/A** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "startWpm".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line N/A** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "setLevelDuration".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line N/A** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "now".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 93** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "fireLessonComplete".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line N/A** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "now".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 105** | [MINOR] CODE_SMELL: useState call is not destructured into value + setter pair
- **Line 399** | [MINOR] CODE_SMELL: Unexpected negated condition.
- **Line 449** | [MINOR] CODE_SMELL: useState call is not destructured into value + setter pair

---

## File: `src/app/practice/warmup/page.tsx`
**Total Issues:** 3

- **Line 304** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "keystrokes".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 123** | [MINOR] CODE_SMELL: Unexpected negated condition.
- **Line 236** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/app/settings/page.tsx`
**Total Issues:** 1

- **Line 49** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "handleResetData".
  - *Solution*: Delete the unused variable assignment to clean up dead code.

---

## File: `src/app/stats/ai-visualizer/page.tsx`
**Total Issues:** 7

- **Line 247** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "alpha".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 248** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "beta".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 249** | [MAJOR] CODE_SMELL: Prefer using an optional chain expression instead, as it's more concise and easier to read.
- **Line 16** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 76** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 139** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 209** | [MINOR] CODE_SMELL: Handle this exception or don't catch it at all.

---

## File: `src/app/stats/page.tsx`
**Total Issues:** 5

- **Line 114** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "hasChartData".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 42** | [MINOR] CODE_SMELL: Remove this unused import of 'mean'.
- **Line 42** | [MINOR] CODE_SMELL: Remove this unused import of 'median'.
- **Line 42** | [MINOR] CODE_SMELL: Remove this unused import of 'standardDeviation'.
- **Line 42** | [MINOR] CODE_SMELL: Remove this unused import of 'consistencyScore'.

---

## File: `src/components/WeaknessHeatmap.tsx`
**Total Issues:** 1

- **Line 14** | [MAJOR] CODE_SMELL: Move this array "sort" operation to a separate statement or replace it with "toSorted".

---

## File: `src/components/analytics/FingerFatigueDashboard.tsx`
**Total Issues:** 6

- **Line 37** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 116** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 117** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 117** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 117** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 94** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/dashboard/HeroBanner.tsx`
**Total Issues:** 2

- **Line 9** | [MINOR] CODE_SMELL: Remove this unused import of 'cn'.
- **Line 20** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/diagnostic/certificate.tsx`
**Total Issues:** 3

- **Line 6** | [MINOR] CODE_SMELL: Remove this unused import of 'Button'.
- **Line 41** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 67** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/gamification/SkillTree.tsx`
**Total Issues:** 2

- **Line 140** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 165** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/keyboard/FingerHeatmap.tsx`
**Total Issues:** 5

- **Line 121** | [CRITICAL] CODE_SMELL: Refactor this code to not nest functions more than 4 levels deep.
- **Line 75** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 149** | [MAJOR] CODE_SMELL: Ambiguous spacing after previous element span
- **Line 166** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 3** | [MINOR] CODE_SMELL: Remove this unused import of 'useMemo'.

---

## File: `src/components/keyboard/HandOverlay.tsx`
**Total Issues:** 5

- **Line 135** | [CRITICAL] CODE_SMELL: Refactor this code to not nest functions more than 4 levels deep.
- **Line 70** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 7** | [MINOR] CODE_SMELL: Remove this unused import of 'cn'.
- **Line 70** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 243** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/keyboard/virtual-keyboard.tsx`
**Total Issues:** 1

- **Line 3** | [MINOR] CODE_SMELL: Remove this unused import of 'useRef'.

---

## File: `src/components/layout/SiteHeader.tsx`
**Total Issues:** 1

- **Line 127** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/lessons/lesson-journey.tsx`
**Total Issues:** 6

- **Line 28** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line 84** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 174** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 22** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 62** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 144** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/multiplayer/RaceMode.tsx`
**Total Issues:** 4

- **Line 204** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 102** | [MINOR] CODE_SMELL: '(from: number, length?: number | undefined): string' is deprecated.
- **Line 201** | [MINOR] CODE_SMELL: Unexpected negated condition.
- **Line 250** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/components/practice/result-chart.tsx`
**Total Issues:** 6

- **Line 32** | [MAJOR] CODE_SMELL: Ambiguous spacing after previous element span
- **Line 36** | [MAJOR] CODE_SMELL: Ambiguous spacing after previous element span
- **Line 4** | [MINOR] CODE_SMELL: Remove this unused import of 'PerformanceRecord'.
- **Line 6** | [MINOR] CODE_SMELL: Remove this unused import of 'LineChart'.
- **Line 22** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 99** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/pwa-registry.tsx`
**Total Issues:** 2

- **Line 6** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 6** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/components/stats/KeyboardHeatmap.tsx`
**Total Issues:** 2

- **Line 78** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line 128** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.

---

## File: `src/components/stats/PerformanceSection.tsx`
**Total Issues:** 1

- **Line 52** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/stats/PersonalRecordsDashboard.tsx`
**Total Issues:** 2

- **Line 52** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line 69** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/sync/WebRTCSync.tsx`
**Total Issues:** 8

- **Line 27** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "peerId".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 34** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "importData".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 7** | [MINOR] CODE_SMELL: Remove this unused import of 'X'.
- **Line 7** | [MINOR] CODE_SMELL: Remove this unused import of 'QrCode'.
- **Line 7** | [MINOR] CODE_SMELL: Remove this unused import of 'Key'.
- **Line 12** | [MINOR] CODE_SMELL: Remove this unused import of 'useSettingsStore'.
- **Line 91** | [MINOR] CODE_SMELL: Unexpected negated condition.
- **Line 321** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.

---

## File: `src/components/typing/ErrorExplanationToast.tsx`
**Total Issues:** 2

- **Line 18** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 110** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/typing/WeaknessOverlay.tsx`
**Total Issues:** 2

- **Line 22** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.
- **Line 93** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/typing/flow-state-graph.tsx`
**Total Issues:** 4

- **Line 20** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "isRising".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 47** | [MAJOR] CODE_SMELL: Refactor this code to not use nested template literals.
- **Line 58** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 63** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.

---

## File: `src/components/typing/typing-area.tsx`
**Total Issues:** 5

- **Line 185** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line 83** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "recordError".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 89** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "expected".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 168** | [MAJOR] CODE_SMELL: Use <input type=...>, <input list=...>, <input list=...>, <input list=...>, <input list=...>, or <textarea> instead of the "textbox" role to ensure accessibility across all devices.
- **Line 23** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/components/typing/typing-character.tsx`
**Total Issues:** 4

- **Line 20** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 18 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 40** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 37** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line N/A** | [MINOR] CODE_SMELL: Unexpected negated condition.

---

## File: `src/components/typing/typing-stats.tsx`
**Total Issues:** 6

- **Line 48** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "errorBreakdown".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 108** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 5** | [MINOR] CODE_SMELL: Remove this unused import of 'Target'.
- **Line 5** | [MINOR] CODE_SMELL: Remove this unused import of 'Clock'.
- **Line 5** | [MINOR] CODE_SMELL: Remove this unused import of 'Zap'.
- **Line 39** | [MINOR] CODE_SMELL: useState call is not destructured into value + setter pair

---

## File: `src/components/ui/error-boundary.tsx`
**Total Issues:** 1

- **Line 48** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/components/weakness/UltimateWeaknessDashboard.tsx`
**Total Issues:** 6

- **Line 206** | [MAJOR] CODE_SMELL: Do not use Array index in keys
- **Line 219** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 220** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 242** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 323** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 299** | [MINOR] CODE_SMELL: Mark the props of the component as read-only.

---

## File: `src/hooks/use-typing-controller.ts`
**Total Issues:** 12

- **Line 125** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 23 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line N/A** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 19 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 40** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "getWpm".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 41** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "getAccuracy".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 101** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 102** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 104** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 105** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 12** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Remove this unused import of 'useState'.
- **Line 185** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 186** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/hooks/use-typing-engine.ts`
**Total Issues:** 1

- **Line N/A** | [MINOR] CODE_SMELL: useState call is not destructured into value + setter pair

---

## File: `src/hooks/use-weakness-detector-worker.ts`
**Total Issues:** 2

- **Line 11** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 56** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/__tests__/ultimate-weakness-detector.test.ts`
**Total Issues:** 6

- **Line 19** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "EXPECTED_PRIOR_MEAN".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 135** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "sorted".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 135** | [MAJOR] CODE_SMELL: Move this array "sort" operation to a separate statement or replace it with "toSorted".
- **Line 29** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 1** | [MINOR] CODE_SMELL: Remove this unused import of 'vi'.
- **Line 3** | [MINOR] CODE_SMELL: Remove this unused import of 'UltimateWeaknessResult'.

---

## File: `src/lib/adaptive-lessons.ts`
**Total Issues:** 4

- **Line 121** | [MAJOR] CODE_SMELL: Move this array "sort" operation to a separate statement or replace it with "toSorted".
- **Line 146** | [MAJOR] CODE_SMELL: Move this array "sort" operation to a separate statement or replace it with "toSorted".
- **Line 198** | [MAJOR] CODE_SMELL: Move this array "sort" operation to a separate statement or replace it with "toSorted".
- **Line 193** | [MINOR] CODE_SMELL: Do not call `Array#push()` multiple times.

---

## File: `src/lib/algorithms/adaptive-curriculum.ts`
**Total Issues:** 11

- **Line 67** | [MAJOR] CODE_SMELL: Member 'skills' is never reassigned; mark it as `readonly`.
- **Line 199** | [MAJOR] CODE_SMELL: Move this array "sort" operation to a separate statement or replace it with "toSorted".
- **Line 320** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 386** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 387** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 11** | [MINOR] CODE_SMELL: Remove this unused import of 'ultimateWeaknessDetector'.
- **Line N/A** | [MINOR] CODE_SMELL: Remove this unused import of 'weaknessDetector'.
- **Line 243** | [MINOR] CODE_SMELL: Do not call `Array#push()` multiple times.
- **Line 254** | [MINOR] CODE_SMELL: Do not call `Array#push()` multiple times.
- **Line 265** | [MINOR] CODE_SMELL: Do not call `Array#push()` multiple times.
- **Line 307** | [MINOR] CODE_SMELL: Do not call `Array#push()` multiple times.

---

## File: `src/lib/algorithms/advanced-ngram-analyzer.ts`
**Total Issues:** 13

- **Line 199** | [MAJOR] CODE_SMELL: Move this array "sort" operation to a separate statement or replace it with "toSorted".
- **Line 62** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 329** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 347** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 369** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 32** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 37** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 38** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 46** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 46** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 48** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.

---

## File: `src/lib/algorithms/ai-summary-generator.ts`
**Total Issues:** 2

- **Line 23** | [MINOR] CODE_SMELL: Prefer `.at(…)` over `[….length - index]`.
- **Line 30** | [MINOR] CODE_SMELL: Prefer `.at(…)` over `[….length - index]`.

---

## File: `src/lib/algorithms/bayesian-weakness-detector.ts`
**Total Issues:** 7

- **Line N/A** | [MAJOR] CODE_SMELL: Remove this commented out code.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.

---

## File: `src/lib/algorithms/diagnostic-analyzer.ts`
**Total Issues:** 1

- **Line N/A** | [MAJOR] CODE_SMELL: Prefer using an optional chain expression instead, as it's more concise and easier to read.

---

## File: `src/lib/algorithms/error-explanation-engine.ts`
**Total Issues:** 1

- **Line 154** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 18 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.

---

## File: `src/lib/algorithms/error-prediction-model.ts`
**Total Issues:** 6

- **Line 308** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 17 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 56** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 383** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 405** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/algorithms/hmm-engine.ts`
**Total Issues:** 14

- **Line 12** | [MAJOR] BUG: This conditional operation returns the same value whether the condition is "true" or "false".
- **Line 61** | [MINOR] CODE_SMELL: Prefer `.at(…)` over `[….length - index]`.
- **Line 62** | [MINOR] CODE_SMELL: Prefer `.at(…)` over `[….length - index]`.
- **Line 112** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 115** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 118** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 120** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 122** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 123** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 124** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 127** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 128** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 129** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 130** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.

---

## File: `src/lib/algorithms/levenshtein.ts`
**Total Issues:** 2

- **Line 28** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 17 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 34** | [MINOR] CODE_SMELL: Use `new Array()` instead of `Array()`.

---

## File: `src/lib/algorithms/markov-chain.ts`
**Total Issues:** 5

- **Line 9** | [MAJOR] CODE_SMELL: Member 'chain' is never reassigned; mark it as `readonly`.
- **Line 10** | [MAJOR] CODE_SMELL: Member 'starts' is never reassigned; mark it as `readonly`.
- **Line 11** | [MAJOR] CODE_SMELL: Member 'order' is never reassigned; mark it as `readonly`.
- **Line 55** | [MINOR] CODE_SMELL: Prefer `.at(…)` over `[….length - index]`.
- **Line 83** | [MINOR] CODE_SMELL: Prefer `String#replaceAll()` over `String#replace()`.
  - *Solution*: Swap `.replace()` with `.replaceAll()` for global string replacements.

---

## File: `src/lib/algorithms/next-word-predictor.ts`
**Total Issues:** 1

- **Line 3** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 24 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.

---

## File: `src/lib/algorithms/personalization-engine.ts`
**Total Issues:** 5

- **Line 57** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 357** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 370** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/algorithms/types.ts`
**Total Issues:** 1

- **Line 16** | [MINOR] CODE_SMELL: Replace this union type with a type alias.

---

## File: `src/lib/algorithms/ultimate-weakness-detector.ts`
**Total Issues:** 46

- **Line 54** | [MAJOR] CODE_SMELL: Member 'globalLearningCurves' is never reassigned; mark it as `readonly`.
- **Line 31** | [MAJOR] CODE_SMELL: Member 'speedModel' is never reassigned; mark it as `readonly`.
- **Line 38** | [MAJOR] CODE_SMELL: Member 'timingModel' is never reassigned; mark it as `readonly`.
- **Line 56** | [MAJOR] CODE_SMELL: Member 'debounceTimers' is never reassigned; mark it as `readonly`.
- **Line 57** | [MAJOR] CODE_SMELL: Member 'debouncedResults' is never reassigned; mark it as `readonly`.
- **Line 61** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 519** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 554** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 615** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 652** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 2** | [MINOR] CODE_SMELL: Remove this unused import of 'SerializedKeyState'.
- **Line 5** | [MINOR] CODE_SMELL: Remove this unused import of 'learnTransitionProbabilities'.
- **Line 6** | [MINOR] CODE_SMELL: Remove this unused import of 'normalizeTransitionProbs'.
- **Line 9** | [MINOR] CODE_SMELL: Remove this unused import of 'initializeTransitionProbs'.
- **Line 41** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 49** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 50** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line 69** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 69** | [MINOR] CODE_SMELL: Compare with `undefined` directly instead of using `typeof`.
- **Line 91** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Compare with `undefined` directly instead of using `typeof`.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Compare with `undefined` directly instead of using `typeof`.
- **Line 581** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Compare with `undefined` directly instead of using `typeof`.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Compare with `undefined` directly instead of using `typeof`.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Replace this union type with a type alias.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.
- **Line N/A** | [MINOR] CODE_SMELL: Don't use a zero fraction in the number.

---

## File: `src/lib/algorithms/ultimate-weakness-detector.worker.ts`
**Total Issues:** 4

- **Line 32** | [MAJOR] CODE_SMELL: Unexpected lexical declaration in case block.
- **Line 38** | [MAJOR] CODE_SMELL: Unexpected lexical declaration in case block.
- **Line 5** | [MINOR] CODE_SMELL: Prefer `globalThis` over `self`.
- **Line 51** | [MINOR] CODE_SMELL: export statement without specifiers is not allowed.

---

## File: `src/lib/algorithms/unified-adapter.ts`
**Total Issues:** 2

- **Line N/A** | [MAJOR] CODE_SMELL: Member 'engine' is never reassigned; mark it as `readonly`.
- **Line N/A** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.

---

## File: `src/lib/algorithms/verify_repairs.ts`
**Total Issues:** 7

- **Line N/A** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "originalSetTimeout".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line N/A** | [MAJOR] CODE_SMELL: Prefer top-level await over using a promise chain.
- **Line N/A** | [MINOR] CODE_SMELL: './ultimate-weakness-detector' imported multiple times.
- **Line N/A** | [MINOR] CODE_SMELL: './ultimate-weakness-detector' imported multiple times.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis` over `global`.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis` over `global`.

---

## File: `src/lib/algorithms/weakness-detector/history-manager.ts`
**Total Issues:** 1

- **Line 20** | [MAJOR] CODE_SMELL: Member 'config' is never reassigned; mark it as `readonly`.

---

## File: `src/lib/algorithms/weakness-detector/index.ts`
**Total Issues:** 1

- **Line 28** | [MINOR] CODE_SMELL: Prefer using nullish coalescing operator (`??=`) instead of an assignment expression, as it is simpler to read.

---

## File: `src/lib/algorithms/weakness-detector/statistics.ts`
**Total Issues:** 1

- **Line 39** | [MAJOR] CODE_SMELL: Arguments 'b' and 'a' have the same names but not the same order as the function parameters.

---

## File: `src/lib/algorithms/weakness-detector/stats-engine.ts`
**Total Issues:** 4

- **Line 202** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "gap".
  - *Solution*: Delete the unused variable assignment to clean up dead code.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'sampleGamma'.
- **Line 8** | [MINOR] CODE_SMELL: Remove this unused import of 'lgamma'.
- **Line 175** | [MINOR] CODE_SMELL: Do not use an object literal as default for parameter `weights`.

---

## File: `src/lib/anti-cheat.ts`
**Total Issues:** 1

- **Line 234** | [MINOR] CODE_SMELL: Prefer `String#codePointAt()` over `String#charCodeAt()`.

---

## File: `src/lib/events/typing-listeners.ts`
**Total Issues:** 3

- **Line 62** | [CRITICAL] CODE_SMELL: Refactor this code to not nest functions more than 4 levels deep.
- **Line 12** | [MINOR] CODE_SMELL: Remove this unused import of 'toast'.
- **Line 59** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/gdpr-export.ts`
**Total Issues:** 4

- **Line N/A** | [MAJOR] CODE_SMELL: Prefer `childNode.remove()` over `parentNode.removeChild(childNode)`.
- **Line 45** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 102** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 120** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/keyboard-data.ts`
**Total Issues:** 1

- **Line 2** | [MINOR] CODE_SMELL: Remove this unused import of 'KeyboardKey'.

---

## File: `src/lib/logrocket.ts`
**Total Issues:** 3

- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/ngram-analyzer.ts`
**Total Issues:** 2

- **Line 47** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 238** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/practice-texts.ts`
**Total Issues:** 3

- **Line 95** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.
- **Line 7** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 127** | [MINOR] CODE_SMELL: Prefer `String#codePointAt()` over `String#charCodeAt()`.

---

## File: `src/lib/skill-tree.ts`
**Total Issues:** 5

- **Line 212** | [CRITICAL] CODE_SMELL: Refactor this asynchronous operation outside of the constructor.
- **Line 319** | [MAJOR] CODE_SMELL: This branch's code block is the same as the block for the branch on line 315.
- **Line 211** | [MINOR] CODE_SMELL: Unexpected negated condition.
- **Line 211** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 255** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/sound-engine.ts`
**Total Issues:** 3

- **Line 144** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 20 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 122** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.
- **Line 130** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/lib/storage/db.ts`
**Total Issues:** 3

- **Line 30** | [MINOR] CODE_SMELL: Compare with `undefined` directly instead of using `typeof`.
- **Line 30** | [MINOR] CODE_SMELL: Compare with `undefined` directly instead of using `typeof`.
- **Line N/A** | [MINOR] CODE_SMELL: Prefer `globalThis.window` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `src/stores/challenge-store.ts`
**Total Issues:** 1

- **Line 76** | [MAJOR] CODE_SMELL: Remove this useless assignment to variable "newCurrent".
  - *Solution*: Delete the unused variable assignment to clean up dead code.

---

## File: `src/stores/diagnostic-store.ts`
**Total Issues:** 3

- **Line 129** | [CRITICAL] CODE_SMELL: Refactor this function to reduce its Cognitive Complexity from 19 to the 15 allowed.
  - *Solution*: Modularize the function. Extract deeply nested logic into smaller helper functions.
- **Line 243** | [MINOR] CODE_SMELL: Do not call `Array#push()` multiple times.
- **Line 304** | [MINOR] CODE_SMELL: Do not call `Array#push()` multiple times.

---

## File: `src/stores/progress-store.ts`
**Total Issues:** 3

- **Line 49** | [MAJOR] CODE_SMELL: Use `Math.trunc` instead of `| 0`.
- **Line 49** | [MINOR] CODE_SMELL: Prefer `String#codePointAt()` over `String#charCodeAt()`.
- **Line 65** | [MINOR] CODE_SMELL: The empty object is useless.

---

## File: `src/stores/typing-store.ts`
**Total Issues:** 1

- **Line 122** | [MAJOR] CODE_SMELL: Extract this nested ternary operation into an independent statement.
  - *Solution*: Refactor the nested ternary into a clear `if/else` block.

---

## File: `src/test/setup.ts`
**Total Issues:** 1

- **Line 35** | [MINOR] CODE_SMELL: Prefer `globalThis` over `window`.
  - *Solution*: Use `globalThis.window` to prevent Next.js SSR hydration errors.

---

## File: `vitest.config.ts`
**Total Issues:** 1

- **Line 3** | [MINOR] CODE_SMELL: Prefer `node:path` over `path`.

---

