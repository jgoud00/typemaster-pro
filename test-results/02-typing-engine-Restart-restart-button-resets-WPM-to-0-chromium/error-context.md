# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Restart >> restart button resets WPM to 0
- Location: e2e\02-typing-engine.spec.ts:223:7

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
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - link [ref=e6] [cursor=pointer]:
            - /url: /practice
            - button [ref=e7]:
              - img
          - heading "Free Practice" [level=1] [ref=e8]
        - button [ref=e10]:
          - img
    - main [ref=e11]:
      - tablist [ref=e14]:
        - tab "Speed Test" [ref=e15]
        - tab "Free Practice" [selected] [ref=e16]
        - tab "Custom Text" [ref=e17]
      - generic [ref=e18]:
        - generic [ref=e20]:
          - generic [ref=e21]: Flow
          - generic [ref=e22]: "0"
        - generic [ref=e23]:
          - generic [ref=e24]:
            - generic [ref=e25]: 0:00
            - generic [ref=e26]: time
          - generic [ref=e27]:
            - generic [ref=e28]: "--"
            - generic [ref=e29]: wpm
          - generic [ref=e30]:
            - generic [ref=e31]: "--%"
            - generic [ref=e32]: acc
        - application "Typing practice area" [ref=e33]:
          - status [ref=e34]: "Speed: 0 words per minute. Accuracy: 100 percent. Combo: 0. Progress: 0 percent complete."
          - textbox [ref=e35]:
            - generic [ref=e36]:
              - generic [ref=e37]:
                - 'generic "Next character: P" [ref=e38]': P
                - generic [ref=e40]: h
                - generic [ref=e41]: i
                - generic [ref=e42]: l
                - generic [ref=e43]: o
                - generic [ref=e44]: s
                - generic [ref=e45]: o
                - generic [ref=e46]: p
                - generic [ref=e47]: h
                - generic [ref=e48]: "y"
              - generic [ref=e50]:
                - generic [ref=e51]: e
                - generic [ref=e52]: "n"
                - generic [ref=e53]: c
                - generic [ref=e54]: o
                - generic [ref=e55]: u
                - generic [ref=e56]: r
                - generic [ref=e57]: a
                - generic [ref=e58]: g
                - generic [ref=e59]: e
                - generic [ref=e60]: s
              - generic [ref=e62]:
                - generic [ref=e63]: u
                - generic [ref=e64]: s
              - generic [ref=e66]:
                - generic [ref=e67]: t
                - generic [ref=e68]: o
              - generic [ref=e70]:
                - generic [ref=e71]: a
                - generic [ref=e72]: s
                - generic [ref=e73]: k
              - generic [ref=e75]:
                - generic [ref=e76]: f
                - generic [ref=e77]: u
                - generic [ref=e78]: "n"
                - generic [ref=e79]: d
                - generic [ref=e80]: a
                - generic [ref=e81]: m
                - generic [ref=e82]: e
                - generic [ref=e83]: "n"
                - generic [ref=e84]: t
                - generic [ref=e85]: a
                - generic [ref=e86]: l
              - generic [ref=e88]:
                - generic [ref=e89]: q
                - generic [ref=e90]: u
                - generic [ref=e91]: e
                - generic [ref=e92]: s
                - generic [ref=e93]: t
                - generic [ref=e94]: i
                - generic [ref=e95]: o
                - generic [ref=e96]: "n"
                - generic [ref=e97]: s
              - generic [ref=e99]:
                - generic [ref=e100]: a
                - generic [ref=e101]: b
                - generic [ref=e102]: o
                - generic [ref=e103]: u
                - generic [ref=e104]: t
              - generic [ref=e106]:
                - generic [ref=e107]: e
                - generic [ref=e108]: x
                - generic [ref=e109]: i
                - generic [ref=e110]: s
                - generic [ref=e111]: t
                - generic [ref=e112]: e
                - generic [ref=e113]: "n"
                - generic [ref=e114]: c
                - generic [ref=e115]: e
                - generic [ref=e116]: ","
              - generic [ref=e118]:
                - generic [ref=e119]: k
                - generic [ref=e120]: "n"
                - generic [ref=e121]: o
                - generic [ref=e122]: w
                - generic [ref=e123]: l
                - generic [ref=e124]: e
                - generic [ref=e125]: d
                - generic [ref=e126]: g
                - generic [ref=e127]: e
                - generic [ref=e128]: ","
              - generic [ref=e130]:
                - generic [ref=e131]: v
                - generic [ref=e132]: a
                - generic [ref=e133]: l
                - generic [ref=e134]: u
                - generic [ref=e135]: e
                - generic [ref=e136]: s
                - generic [ref=e137]: ","
              - generic [ref=e139]:
                - generic [ref=e140]: a
                - generic [ref=e141]: "n"
                - generic [ref=e142]: d
              - generic [ref=e144]:
                - generic [ref=e145]: r
                - generic [ref=e146]: e
                - generic [ref=e147]: a
                - generic [ref=e148]: s
                - generic [ref=e149]: o
                - generic [ref=e150]: "n"
                - generic [ref=e151]: .
              - generic [ref=e153]:
                - generic [ref=e154]: I
                - generic [ref=e155]: t
              - generic [ref=e157]:
                - generic [ref=e158]: c
                - generic [ref=e159]: h
                - generic [ref=e160]: a
                - generic [ref=e161]: l
                - generic [ref=e162]: l
                - generic [ref=e163]: e
                - generic [ref=e164]: "n"
                - generic [ref=e165]: g
                - generic [ref=e166]: e
                - generic [ref=e167]: s
              - generic [ref=e169]:
                - generic [ref=e170]: o
                - generic [ref=e171]: u
                - generic [ref=e172]: r
              - generic [ref=e174]:
                - generic [ref=e175]: a
                - generic [ref=e176]: s
                - generic [ref=e177]: s
                - generic [ref=e178]: u
                - generic [ref=e179]: m
                - generic [ref=e180]: p
                - generic [ref=e181]: t
                - generic [ref=e182]: i
                - generic [ref=e183]: o
                - generic [ref=e184]: "n"
                - generic [ref=e185]: s
              - generic [ref=e187]:
                - generic [ref=e188]: a
                - generic [ref=e189]: "n"
                - generic [ref=e190]: d
              - generic [ref=e192]:
                - generic [ref=e193]: h
                - generic [ref=e194]: e
                - generic [ref=e195]: l
                - generic [ref=e196]: p
                - generic [ref=e197]: s
              - generic [ref=e199]:
                - generic [ref=e200]: u
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
                - generic [ref=e213]: c
                - generic [ref=e214]: r
                - generic [ref=e215]: i
                - generic [ref=e216]: t
                - generic [ref=e217]: i
                - generic [ref=e218]: c
                - generic [ref=e219]: a
                - generic [ref=e220]: l
              - generic [ref=e222]:
                - generic [ref=e223]: t
                - generic [ref=e224]: h
                - generic [ref=e225]: i
                - generic [ref=e226]: "n"
                - generic [ref=e227]: k
                - generic [ref=e228]: i
                - generic [ref=e229]: "n"
                - generic [ref=e230]: g
              - generic [ref=e232]:
                - generic [ref=e233]: s
                - generic [ref=e234]: k
                - generic [ref=e235]: i
                - generic [ref=e236]: l
                - generic [ref=e237]: l
                - generic [ref=e238]: s
                - generic [ref=e239]: .
              - generic [ref=e241]:
                - generic [ref=e242]: E
                - generic [ref=e243]: "n"
                - generic [ref=e244]: g
                - generic [ref=e245]: a
                - generic [ref=e246]: g
                - generic [ref=e247]: i
                - generic [ref=e248]: "n"
                - generic [ref=e249]: g
              - generic [ref=e251]:
                - generic [ref=e252]: w
                - generic [ref=e253]: i
                - generic [ref=e254]: t
                - generic [ref=e255]: h
              - generic [ref=e257]:
                - generic [ref=e258]: p
                - generic [ref=e259]: h
                - generic [ref=e260]: i
                - generic [ref=e261]: l
                - generic [ref=e262]: o
                - generic [ref=e263]: s
                - generic [ref=e264]: o
                - generic [ref=e265]: p
                - generic [ref=e266]: h
                - generic [ref=e267]: i
                - generic [ref=e268]: c
                - generic [ref=e269]: a
                - generic [ref=e270]: l
              - generic [ref=e272]:
                - generic [ref=e273]: i
                - generic [ref=e274]: d
                - generic [ref=e275]: e
                - generic [ref=e276]: a
                - generic [ref=e277]: s
              - generic [ref=e279]:
                - generic [ref=e280]: b
                - generic [ref=e281]: r
                - generic [ref=e282]: o
                - generic [ref=e283]: a
                - generic [ref=e284]: d
                - generic [ref=e285]: e
                - generic [ref=e286]: "n"
                - generic [ref=e287]: s
              - generic [ref=e289]:
                - generic [ref=e290]: o
                - generic [ref=e291]: u
                - generic [ref=e292]: r
              - generic [ref=e294]:
                - generic [ref=e295]: p
                - generic [ref=e296]: e
                - generic [ref=e297]: r
                - generic [ref=e298]: s
                - generic [ref=e299]: p
                - generic [ref=e300]: e
                - generic [ref=e301]: c
                - generic [ref=e302]: t
                - generic [ref=e303]: i
                - generic [ref=e304]: v
                - generic [ref=e305]: e
                - generic [ref=e306]: s
                - generic [ref=e307]: .
  - alert [ref=e308]
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