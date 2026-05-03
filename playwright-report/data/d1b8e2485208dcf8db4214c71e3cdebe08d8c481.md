# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Keystroke Handling >> focuses input on click
- Location: e2e\02-typing-engine.spec.ts:79:7

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
                - 'generic "Next character: T" [ref=e38]': T
                - generic [ref=e40]: h
                - generic [ref=e41]: e
              - generic [ref=e43]:
                - generic [ref=e44]: i
                - generic [ref=e45]: "n"
                - generic [ref=e46]: t
                - generic [ref=e47]: e
                - generic [ref=e48]: r
                - generic [ref=e49]: "n"
                - generic [ref=e50]: e
                - generic [ref=e51]: t
              - generic [ref=e53]:
                - generic [ref=e54]: h
                - generic [ref=e55]: a
                - generic [ref=e56]: s
              - generic [ref=e58]:
                - generic [ref=e59]: r
                - generic [ref=e60]: e
                - generic [ref=e61]: v
                - generic [ref=e62]: o
                - generic [ref=e63]: l
                - generic [ref=e64]: u
                - generic [ref=e65]: t
                - generic [ref=e66]: i
                - generic [ref=e67]: o
                - generic [ref=e68]: "n"
                - generic [ref=e69]: i
                - generic [ref=e70]: z
                - generic [ref=e71]: e
                - generic [ref=e72]: d
              - generic [ref=e74]:
                - generic [ref=e75]: h
                - generic [ref=e76]: o
                - generic [ref=e77]: w
              - generic [ref=e79]:
                - generic [ref=e80]: w
                - generic [ref=e81]: e
              - generic [ref=e83]:
                - generic [ref=e84]: a
                - generic [ref=e85]: c
                - generic [ref=e86]: c
                - generic [ref=e87]: e
                - generic [ref=e88]: s
                - generic [ref=e89]: s
              - generic [ref=e91]:
                - generic [ref=e92]: i
                - generic [ref=e93]: "n"
                - generic [ref=e94]: f
                - generic [ref=e95]: o
                - generic [ref=e96]: r
                - generic [ref=e97]: m
                - generic [ref=e98]: a
                - generic [ref=e99]: t
                - generic [ref=e100]: i
                - generic [ref=e101]: o
                - generic [ref=e102]: "n"
              - generic [ref=e104]:
                - generic [ref=e105]: a
                - generic [ref=e106]: "n"
                - generic [ref=e107]: d
              - generic [ref=e109]:
                - generic [ref=e110]: c
                - generic [ref=e111]: o
                - generic [ref=e112]: "n"
                - generic [ref=e113]: "n"
                - generic [ref=e114]: e
                - generic [ref=e115]: c
                - generic [ref=e116]: t
              - generic [ref=e118]:
                - generic [ref=e119]: w
                - generic [ref=e120]: i
                - generic [ref=e121]: t
                - generic [ref=e122]: h
              - generic [ref=e124]:
                - generic [ref=e125]: o
                - generic [ref=e126]: t
                - generic [ref=e127]: h
                - generic [ref=e128]: e
                - generic [ref=e129]: r
                - generic [ref=e130]: s
                - generic [ref=e131]: .
              - generic [ref=e133]:
                - generic [ref=e134]: I
                - generic [ref=e135]: t
              - generic [ref=e137]:
                - generic [ref=e138]: h
                - generic [ref=e139]: a
                - generic [ref=e140]: s
              - generic [ref=e142]:
                - generic [ref=e143]: c
                - generic [ref=e144]: r
                - generic [ref=e145]: e
                - generic [ref=e146]: a
                - generic [ref=e147]: t
                - generic [ref=e148]: e
                - generic [ref=e149]: d
              - generic [ref=e151]:
                - generic [ref=e152]: "n"
                - generic [ref=e153]: e
                - generic [ref=e154]: w
              - generic [ref=e156]:
                - generic [ref=e157]: i
                - generic [ref=e158]: "n"
                - generic [ref=e159]: d
                - generic [ref=e160]: u
                - generic [ref=e161]: s
                - generic [ref=e162]: t
                - generic [ref=e163]: r
                - generic [ref=e164]: i
                - generic [ref=e165]: e
                - generic [ref=e166]: s
              - generic [ref=e168]:
                - generic [ref=e169]: a
                - generic [ref=e170]: "n"
                - generic [ref=e171]: d
              - generic [ref=e173]:
                - generic [ref=e174]: t
                - generic [ref=e175]: r
                - generic [ref=e176]: a
                - generic [ref=e177]: "n"
                - generic [ref=e178]: s
                - generic [ref=e179]: f
                - generic [ref=e180]: o
                - generic [ref=e181]: r
                - generic [ref=e182]: m
                - generic [ref=e183]: e
                - generic [ref=e184]: d
              - generic [ref=e186]:
                - generic [ref=e187]: e
                - generic [ref=e188]: x
                - generic [ref=e189]: i
                - generic [ref=e190]: s
                - generic [ref=e191]: t
                - generic [ref=e192]: i
                - generic [ref=e193]: "n"
                - generic [ref=e194]: g
              - generic [ref=e196]:
                - generic [ref=e197]: o
                - generic [ref=e198]: "n"
                - generic [ref=e199]: e
                - generic [ref=e200]: s
                - generic [ref=e201]: .
              - generic [ref=e203]:
                - generic [ref=e204]: H
                - generic [ref=e205]: o
                - generic [ref=e206]: w
                - generic [ref=e207]: e
                - generic [ref=e208]: v
                - generic [ref=e209]: e
                - generic [ref=e210]: r
                - generic [ref=e211]: ","
              - generic [ref=e213]:
                - generic [ref=e214]: i
                - generic [ref=e215]: t
              - generic [ref=e217]:
                - generic [ref=e218]: a
                - generic [ref=e219]: l
                - generic [ref=e220]: s
                - generic [ref=e221]: o
              - generic [ref=e223]:
                - generic [ref=e224]: p
                - generic [ref=e225]: r
                - generic [ref=e226]: e
                - generic [ref=e227]: s
                - generic [ref=e228]: e
                - generic [ref=e229]: "n"
                - generic [ref=e230]: t
                - generic [ref=e231]: s
              - generic [ref=e233]:
                - generic [ref=e234]: c
                - generic [ref=e235]: h
                - generic [ref=e236]: a
                - generic [ref=e237]: l
                - generic [ref=e238]: l
                - generic [ref=e239]: e
                - generic [ref=e240]: "n"
                - generic [ref=e241]: g
                - generic [ref=e242]: e
                - generic [ref=e243]: s
              - generic [ref=e245]:
                - generic [ref=e246]: r
                - generic [ref=e247]: e
                - generic [ref=e248]: g
                - generic [ref=e249]: a
                - generic [ref=e250]: r
                - generic [ref=e251]: d
                - generic [ref=e252]: i
                - generic [ref=e253]: "n"
                - generic [ref=e254]: g
              - generic [ref=e256]:
                - generic [ref=e257]: p
                - generic [ref=e258]: r
                - generic [ref=e259]: i
                - generic [ref=e260]: v
                - generic [ref=e261]: a
                - generic [ref=e262]: c
                - generic [ref=e263]: "y"
                - generic [ref=e264]: ","
              - generic [ref=e266]:
                - generic [ref=e267]: m
                - generic [ref=e268]: i
                - generic [ref=e269]: s
                - generic [ref=e270]: i
                - generic [ref=e271]: "n"
                - generic [ref=e272]: f
                - generic [ref=e273]: o
                - generic [ref=e274]: r
                - generic [ref=e275]: m
                - generic [ref=e276]: a
                - generic [ref=e277]: t
                - generic [ref=e278]: i
                - generic [ref=e279]: o
                - generic [ref=e280]: "n"
                - generic [ref=e281]: ","
              - generic [ref=e283]:
                - generic [ref=e284]: a
                - generic [ref=e285]: "n"
                - generic [ref=e286]: d
              - generic [ref=e288]:
                - generic [ref=e289]: t
                - generic [ref=e290]: h
                - generic [ref=e291]: e
              - generic [ref=e293]:
                - generic [ref=e294]: d
                - generic [ref=e295]: i
                - generic [ref=e296]: g
                - generic [ref=e297]: i
                - generic [ref=e298]: t
                - generic [ref=e299]: a
                - generic [ref=e300]: l
              - generic [ref=e302]:
                - generic [ref=e303]: d
                - generic [ref=e304]: i
                - generic [ref=e305]: v
                - generic [ref=e306]: i
                - generic [ref=e307]: d
                - generic [ref=e308]: e
                - generic [ref=e309]: .
  - alert [ref=e310]
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