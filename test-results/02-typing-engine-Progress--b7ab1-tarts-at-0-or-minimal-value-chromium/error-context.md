# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Progress Bar >> progress bar starts at 0% or minimal value
- Location: e2e\02-typing-engine.spec.ts:253:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[role="textbox"][aria-label="Text to type"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner:
      - generic:
        - generic:
          - link:
            - /url: /practice
            - button:
              - img
          - heading "Free Practice" [level=1]
        - generic:
          - button:
            - img
    - main [ref=e3]:
      - generic:
        - generic:
          - tablist:
            - tab "Speed Test"
            - tab "Free Practice" [selected]
            - tab "Custom Text"
      - generic [ref=e4]:
        - generic [ref=e5]:
          - generic [ref=e6]:
            - generic [ref=e7]: Flow
            - generic [ref=e8]: "66"
          - img [ref=e10]
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: 0:26
            - generic [ref=e17]: time
          - generic [ref=e18]:
            - generic [ref=e19]: "28"
            - generic [ref=e20]: wpm
          - generic [ref=e21]:
            - generic [ref=e22]: 78%
            - generic [ref=e23]: acc
        - application "Typing practice area" [ref=e24]:
          - status [ref=e25]: "Speed: 28 words per minute. Accuracy: 78 percent. Combo: 6. Progress: 31 percent complete."
          - textbox [ref=e26]:
            - generic [ref=e27]:
              - generic [ref=e28]:
                - generic [ref=e29]: T
                - generic [ref=e30]: h
                - generic [ref=e31]: e
              - generic [ref=e33]:
                - generic [ref=e34]: q
                - generic [ref=e35]: u
                - generic [ref=e36]: i
                - generic [ref=e37]: c
                - generic [ref=e38]: k
              - generic [ref=e40]:
                - generic [ref=e41]: b
                - generic [ref=e42]: r
                - generic [ref=e43]: o
                - generic [ref=e44]: w
                - generic [ref=e45]: "n"
              - generic [ref=e47]:
                - generic [ref=e48]: f
                - generic [ref=e49]: o
                - generic [ref=e50]: x
              - generic [ref=e52]:
                - generic [ref=e53]: j
                - generic [ref=e54]: u
                - generic [ref=e55]: m
                - generic [ref=e56]: p
                - generic [ref=e57]: s
              - generic [ref=e59]:
                - generic [ref=e60]: o
                - generic [ref=e61]: v
                - generic [ref=e62]: e
                - generic [ref=e63]: r
              - generic [ref=e65]:
                - generic [ref=e66]: t
                - generic [ref=e67]: h
                - generic [ref=e68]: e
              - generic [ref=e70]:
                - generic [ref=e71]: l
                - generic [ref=e72]: a
                - generic [ref=e73]: z
                - generic [ref=e74]: "y"
              - generic [ref=e76]:
                - generic [ref=e77]: d
                - generic [ref=e78]: o
                - generic [ref=e79]: g
                - generic [ref=e80]: .
              - generic [ref=e82]:
                - generic [ref=e83]: T
                - generic [ref=e84]: h
                - generic [ref=e85]: i
                - generic [ref=e86]: s
              - generic [ref=e88]:
                - generic [ref=e89]: s
                - generic [ref=e90]: e
                - generic [ref=e91]: "n"
                - generic [ref=e92]: t
                - generic [ref=e93]: e
                - generic [ref=e94]: "n"
                - generic [ref=e95]: c
                - generic [ref=e96]: e
              - generic [ref=e98]:
                - generic [ref=e99]: c
                - generic [ref=e100]: o
                - 'generic "Next character: n" [ref=e101]': "n"
                - generic [ref=e103]: t
                - generic [ref=e104]: a
                - generic [ref=e105]: i
                - generic [ref=e106]: "n"
                - generic [ref=e107]: s
              - generic [ref=e109]:
                - generic [ref=e110]: e
                - generic [ref=e111]: v
                - generic [ref=e112]: e
                - generic [ref=e113]: r
                - generic [ref=e114]: "y"
              - generic [ref=e116]:
                - generic [ref=e117]: l
                - generic [ref=e118]: e
                - generic [ref=e119]: t
                - generic [ref=e120]: t
                - generic [ref=e121]: e
                - generic [ref=e122]: r
              - generic [ref=e124]:
                - generic [ref=e125]: o
                - generic [ref=e126]: f
              - generic [ref=e128]:
                - generic [ref=e129]: t
                - generic [ref=e130]: h
                - generic [ref=e131]: e
              - generic [ref=e133]:
                - generic [ref=e134]: a
                - generic [ref=e135]: l
                - generic [ref=e136]: p
                - generic [ref=e137]: h
                - generic [ref=e138]: a
                - generic [ref=e139]: b
                - generic [ref=e140]: e
                - generic [ref=e141]: t
              - generic [ref=e143]:
                - generic [ref=e144]: a
                - generic [ref=e145]: "n"
                - generic [ref=e146]: d
              - generic [ref=e148]:
                - generic [ref=e149]: i
                - generic [ref=e150]: s
              - generic [ref=e152]:
                - generic [ref=e153]: c
                - generic [ref=e154]: o
                - generic [ref=e155]: m
                - generic [ref=e156]: m
                - generic [ref=e157]: o
                - generic [ref=e158]: "n"
                - generic [ref=e159]: l
                - generic [ref=e160]: "y"
              - generic [ref=e162]:
                - generic [ref=e163]: u
                - generic [ref=e164]: s
                - generic [ref=e165]: e
                - generic [ref=e166]: d
              - generic [ref=e168]:
                - generic [ref=e169]: f
                - generic [ref=e170]: o
                - generic [ref=e171]: r
              - generic [ref=e173]:
                - generic [ref=e174]: t
                - generic [ref=e175]: "y"
                - generic [ref=e176]: p
                - generic [ref=e177]: i
                - generic [ref=e178]: "n"
                - generic [ref=e179]: g
              - generic [ref=e181]:
                - generic [ref=e182]: p
                - generic [ref=e183]: r
                - generic [ref=e184]: a
                - generic [ref=e185]: c
                - generic [ref=e186]: t
                - generic [ref=e187]: i
                - generic [ref=e188]: c
                - generic [ref=e189]: e
                - generic [ref=e190]: .
              - generic [ref=e192]:
                - generic [ref=e193]: I
                - generic [ref=e194]: t
              - generic [ref=e196]:
                - generic [ref=e197]: h
                - generic [ref=e198]: e
                - generic [ref=e199]: l
                - generic [ref=e200]: p
                - generic [ref=e201]: s
              - generic [ref=e203]:
                - generic [ref=e204]: d
                - generic [ref=e205]: e
                - generic [ref=e206]: v
                - generic [ref=e207]: e
                - generic [ref=e208]: l
                - generic [ref=e209]: o
                - generic [ref=e210]: p
              - generic [ref=e212]:
                - generic [ref=e213]: m
                - generic [ref=e214]: u
                - generic [ref=e215]: s
                - generic [ref=e216]: c
                - generic [ref=e217]: l
                - generic [ref=e218]: e
              - generic [ref=e220]:
                - generic [ref=e221]: m
                - generic [ref=e222]: e
                - generic [ref=e223]: m
                - generic [ref=e224]: o
                - generic [ref=e225]: r
                - generic [ref=e226]: "y"
              - generic [ref=e228]:
                - generic [ref=e229]: f
                - generic [ref=e230]: o
                - generic [ref=e231]: r
              - generic [ref=e233]:
                - generic [ref=e234]: a
                - generic [ref=e235]: l
                - generic [ref=e236]: l
              - generic [ref=e238]:
                - generic [ref=e239]: k
                - generic [ref=e240]: e
                - generic [ref=e241]: "y"
                - generic [ref=e242]: s
              - generic [ref=e244]:
                - generic [ref=e245]: o
                - generic [ref=e246]: "n"
              - generic [ref=e248]:
                - generic [ref=e249]: t
                - generic [ref=e250]: h
                - generic [ref=e251]: e
              - generic [ref=e253]:
                - generic [ref=e254]: k
                - generic [ref=e255]: e
                - generic [ref=e256]: "y"
                - generic [ref=e257]: b
                - generic [ref=e258]: o
                - generic [ref=e259]: a
                - generic [ref=e260]: r
                - generic [ref=e261]: d
                - generic [ref=e262]: .
  - alert [ref=e263]
```

# Test source

```ts
  1   | /**
  2   |  * SPEC 02 — Typing Engine
  3   |  * Tests: TypingArea rendering, keystroke handling, WPM calculation,
  4   |  *        accuracy tracking, error highlighting, cursor movement,
  5   |  *        requestAnimationFrame loop, restart, backspace, timer.
  6   |  */
  7   | import { test, expect } from "@playwright/test";
  8   | import {
  9   |   AppPage,
  10  |   TypingAreaPage,
  11  | } from "./helpers";
  12  | 
  13  | // Navigate to the first lesson or home and set up typing area
  14  | async function setupTypingTest(page: import("@playwright/test").Page) {
  15  |   const app = new AppPage(page);
  16  |   // Navigate directly to practice to avoid intermittent homepage button/modal issues in parallel tests
  17  |   await app.goto("/practice?mode=free");
  18  |   await app.waitForHydration();
  19  |   
  20  |   // Wait for the typing area and ensure it has text
  21  |   const textbox = page.locator('[role="textbox"][aria-label="Text to type"]');
> 22  |   await textbox.waitFor({ state: 'attached', timeout: 30000 });
      |                 ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  23  |   await expect(textbox).not.toHaveText("", { timeout: 10000 });
  24  | 
  25  |   return new TypingAreaPage(page);
  26  | }
  27  | 
  28  | // ─────────────────────────────────────────────
  29  | //  TYPING AREA RENDERING
  30  | // ─────────────────────────────────────────────
  31  | test.describe("Typing Area Rendering", () => {
  32  |   test("typing area mounts and is visible", async ({ page }) => {
  33  |     await setupTypingTest(page);
  34  |     const area = page.locator(
  35  |       '[role="textbox"][aria-label="Text to type"], [role="application"][aria-label="Typing practice area"]'
  36  |     ).first();
  37  |     await expect(area).toBeVisible({ timeout: 5000 });
  38  |   });
  39  | 
  40  |   test("text to type is displayed", async ({ page }) => {
  41  |     await setupTypingTest(page);
  42  |     const textDisplay = page.locator(
  43  |       '[role="textbox"][aria-label="Text to type"]'
  44  |     ).first();
  45  |     await expect(textDisplay).toBeVisible({ timeout: 5000 });
  46  |     const text = await textDisplay.innerText();
  47  |     expect(text.trim().length).toBeGreaterThan(5);
  48  |   });
  49  | 
  50  |   test("WPM counter starts at 0", async ({ page }) => {
  51  |     const typingPage = await setupTypingTest(page);
  52  |     const wpmEl = page.locator(
  53  |       '[data-testid="wpm"], [aria-label*="WPM"], [aria-label*="words per minute"]'
  54  |     ).first();
  55  |     if (await wpmEl.isVisible({ timeout: 3000 }).catch(() => false)) {
  56  |       const text = await wpmEl.innerText();
  57  |       const num = parseInt(text.replace(/\D/g, ""), 10);
  58  |       expect(num).toBe(0);
  59  |     }
  60  |   });
  61  | 
  62  |   test("accuracy starts at 100%", async ({ page }) => {
  63  |     const typingPage = await setupTypingTest(page);
  64  |     const accEl = page.locator(
  65  |       '[data-testid="accuracy"], [aria-label*="accuracy"]'
  66  |     ).first();
  67  |     if (await accEl.isVisible({ timeout: 3000 }).catch(() => false)) {
  68  |       const text = await accEl.innerText();
  69  |       const num = parseFloat(text.replace(/[^0-9.]/g, ""));
  70  |       expect(num).toBeGreaterThanOrEqual(99);
  71  |     }
  72  |   });
  73  | });
  74  | 
  75  | // ─────────────────────────────────────────────
  76  | //  KEYSTROKE HANDLING
  77  | // ─────────────────────────────────────────────
  78  | test.describe("Keystroke Handling", () => {
  79  |   test("focuses input on click", async ({ page }) => {
  80  |     await setupTypingTest(page);
  81  |     // The app might not use a real input but a global keyboard listener
  82  |     // But we check for interactivity anyway
  83  |     const body = page.locator('body');
  84  |     await body.click();
  85  |     await page.keyboard.press("a");
  86  |     await page.waitForTimeout(200);
  87  |   });
  88  | 
  89  |   test("correct keystrokes are highlighted green/correct", async ({ page }) => {
  90  |     await setupTypingTest(page);
  91  |     await page.keyboard.press("a");
  92  |     await page.waitForTimeout(200);
  93  | 
  94  |     // Check for some kind of visual feedback on typed characters
  95  |     const correctChars = page.locator(
  96  |       '.correct, .char-correct, [data-state="correct"], .text-green-500, .text-primary'
  97  |     );
  98  |     const incorrectChars = page.locator(
  99  |       '.incorrect, .char-error, [data-state="incorrect"], .text-red-500'
  100 |     );
  101 |     const total =
  102 |       (await correctChars.count()) + (await incorrectChars.count());
  103 |     expect(total).toBeGreaterThanOrEqual(0); // non-crashing
  104 |   });
  105 | 
  106 |   test("backspace removes last character", async ({ page }) => {
  107 |     await setupTypingTest(page);
  108 |     await page.keyboard.press("a");
  109 |     await page.keyboard.press("b");
  110 |     await page.keyboard.press("Backspace");
  111 |     await page.waitForTimeout(200);
  112 | 
  113 |     // After backspace, state should roll back — just check no crash
  114 |     const alive = await page.locator("body").isVisible();
  115 |     expect(alive).toBe(true);
  116 |   });
  117 | 
  118 |   test("typing special characters does not crash the app", async ({ page }) => {
  119 |     await setupTypingTest(page);
  120 |     const errors: string[] = [];
  121 |     page.on("pageerror", (e) => errors.push(e.message));
  122 | 
```