# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Typing Area Rendering >> accuracy starts at 100%
- Location: e2e\02-typing-engine.spec.ts:62:7

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
                - 'generic "Next character: L" [ref=e38]': L
                - generic [ref=e40]: e
                - generic [ref=e41]: a
                - generic [ref=e42]: r
                - generic [ref=e43]: "n"
                - generic [ref=e44]: i
                - generic [ref=e45]: "n"
                - generic [ref=e46]: g
              - generic [ref=e49]: a
              - generic [ref=e51]:
                - generic [ref=e52]: "n"
                - generic [ref=e53]: e
                - generic [ref=e54]: w
              - generic [ref=e56]:
                - generic [ref=e57]: l
                - generic [ref=e58]: a
                - generic [ref=e59]: "n"
                - generic [ref=e60]: g
                - generic [ref=e61]: u
                - generic [ref=e62]: a
                - generic [ref=e63]: g
                - generic [ref=e64]: e
              - generic [ref=e66]:
                - generic [ref=e67]: o
                - generic [ref=e68]: p
                - generic [ref=e69]: e
                - generic [ref=e70]: "n"
                - generic [ref=e71]: s
              - generic [ref=e73]:
                - generic [ref=e74]: u
                - generic [ref=e75]: p
              - generic [ref=e77]:
                - generic [ref=e78]: "n"
                - generic [ref=e79]: e
                - generic [ref=e80]: w
              - generic [ref=e82]:
                - generic [ref=e83]: a
                - generic [ref=e84]: v
                - generic [ref=e85]: e
                - generic [ref=e86]: "n"
                - generic [ref=e87]: u
                - generic [ref=e88]: e
                - generic [ref=e89]: s
              - generic [ref=e91]:
                - generic [ref=e92]: f
                - generic [ref=e93]: o
                - generic [ref=e94]: r
              - generic [ref=e96]:
                - generic [ref=e97]: c
                - generic [ref=e98]: o
                - generic [ref=e99]: m
                - generic [ref=e100]: m
                - generic [ref=e101]: u
                - generic [ref=e102]: "n"
                - generic [ref=e103]: i
                - generic [ref=e104]: c
                - generic [ref=e105]: a
                - generic [ref=e106]: t
                - generic [ref=e107]: i
                - generic [ref=e108]: o
                - generic [ref=e109]: "n"
              - generic [ref=e111]:
                - generic [ref=e112]: a
                - generic [ref=e113]: "n"
                - generic [ref=e114]: d
              - generic [ref=e116]:
                - generic [ref=e117]: u
                - generic [ref=e118]: "n"
                - generic [ref=e119]: d
                - generic [ref=e120]: e
                - generic [ref=e121]: r
                - generic [ref=e122]: s
                - generic [ref=e123]: t
                - generic [ref=e124]: a
                - generic [ref=e125]: "n"
                - generic [ref=e126]: d
                - generic [ref=e127]: i
                - generic [ref=e128]: "n"
                - generic [ref=e129]: g
                - generic [ref=e130]: .
              - generic [ref=e132]:
                - generic [ref=e133]: I
                - generic [ref=e134]: t
              - generic [ref=e136]:
                - generic [ref=e137]: e
                - generic [ref=e138]: x
                - generic [ref=e139]: p
                - generic [ref=e140]: o
                - generic [ref=e141]: s
                - generic [ref=e142]: e
                - generic [ref=e143]: s
              - generic [ref=e145]:
                - generic [ref=e146]: "y"
                - generic [ref=e147]: o
                - generic [ref=e148]: u
              - generic [ref=e150]:
                - generic [ref=e151]: t
                - generic [ref=e152]: o
              - generic [ref=e154]:
                - generic [ref=e155]: d
                - generic [ref=e156]: i
                - generic [ref=e157]: f
                - generic [ref=e158]: f
                - generic [ref=e159]: e
                - generic [ref=e160]: r
                - generic [ref=e161]: e
                - generic [ref=e162]: "n"
                - generic [ref=e163]: t
              - generic [ref=e165]:
                - generic [ref=e166]: c
                - generic [ref=e167]: u
                - generic [ref=e168]: l
                - generic [ref=e169]: t
                - generic [ref=e170]: u
                - generic [ref=e171]: r
                - generic [ref=e172]: e
                - generic [ref=e173]: s
              - generic [ref=e175]:
                - generic [ref=e176]: a
                - generic [ref=e177]: "n"
                - generic [ref=e178]: d
              - generic [ref=e180]:
                - generic [ref=e181]: w
                - generic [ref=e182]: a
                - generic [ref=e183]: "y"
                - generic [ref=e184]: s
              - generic [ref=e186]:
                - generic [ref=e187]: o
                - generic [ref=e188]: f
              - generic [ref=e190]:
                - generic [ref=e191]: t
                - generic [ref=e192]: h
                - generic [ref=e193]: i
                - generic [ref=e194]: "n"
                - generic [ref=e195]: k
                - generic [ref=e196]: i
                - generic [ref=e197]: "n"
                - generic [ref=e198]: g
                - generic [ref=e199]: .
              - generic [ref=e201]:
                - generic [ref=e202]: B
                - generic [ref=e203]: i
                - generic [ref=e204]: l
                - generic [ref=e205]: i
                - generic [ref=e206]: "n"
                - generic [ref=e207]: g
                - generic [ref=e208]: u
                - generic [ref=e209]: a
                - generic [ref=e210]: l
                - generic [ref=e211]: i
                - generic [ref=e212]: s
                - generic [ref=e213]: m
              - generic [ref=e215]:
                - generic [ref=e216]: h
                - generic [ref=e217]: a
                - generic [ref=e218]: s
              - generic [ref=e220]:
                - generic [ref=e221]: a
                - generic [ref=e222]: l
                - generic [ref=e223]: s
                - generic [ref=e224]: o
              - generic [ref=e226]:
                - generic [ref=e227]: b
                - generic [ref=e228]: e
                - generic [ref=e229]: e
                - generic [ref=e230]: "n"
              - generic [ref=e232]:
                - generic [ref=e233]: s
                - generic [ref=e234]: h
                - generic [ref=e235]: o
                - generic [ref=e236]: w
                - generic [ref=e237]: "n"
              - generic [ref=e239]:
                - generic [ref=e240]: t
                - generic [ref=e241]: o
              - generic [ref=e243]:
                - generic [ref=e244]: p
                - generic [ref=e245]: r
                - generic [ref=e246]: o
                - generic [ref=e247]: v
                - generic [ref=e248]: i
                - generic [ref=e249]: d
                - generic [ref=e250]: e
              - generic [ref=e252]:
                - generic [ref=e253]: c
                - generic [ref=e254]: o
                - generic [ref=e255]: g
                - generic [ref=e256]: "n"
                - generic [ref=e257]: i
                - generic [ref=e258]: t
                - generic [ref=e259]: i
                - generic [ref=e260]: v
                - generic [ref=e261]: e
              - generic [ref=e263]:
                - generic [ref=e264]: b
                - generic [ref=e265]: e
                - generic [ref=e266]: "n"
                - generic [ref=e267]: e
                - generic [ref=e268]: f
                - generic [ref=e269]: i
                - generic [ref=e270]: t
                - generic [ref=e271]: s
              - generic [ref=e273]:
                - generic [ref=e274]: a
                - generic [ref=e275]: "n"
                - generic [ref=e276]: d
              - generic [ref=e278]:
                - generic [ref=e279]: d
                - generic [ref=e280]: e
                - generic [ref=e281]: l
                - generic [ref=e282]: a
                - generic [ref=e283]: "y"
              - generic [ref=e285]:
                - generic [ref=e286]: t
                - generic [ref=e287]: h
                - generic [ref=e288]: e
              - generic [ref=e290]:
                - generic [ref=e291]: o
                - generic [ref=e292]: "n"
                - generic [ref=e293]: s
                - generic [ref=e294]: e
                - generic [ref=e295]: t
              - generic [ref=e297]:
                - generic [ref=e298]: o
                - generic [ref=e299]: f
              - generic [ref=e301]:
                - generic [ref=e302]: d
                - generic [ref=e303]: e
                - generic [ref=e304]: m
                - generic [ref=e305]: e
                - generic [ref=e306]: "n"
                - generic [ref=e307]: t
                - generic [ref=e308]: i
                - generic [ref=e309]: a
                - generic [ref=e310]: .
  - alert [ref=e311]
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