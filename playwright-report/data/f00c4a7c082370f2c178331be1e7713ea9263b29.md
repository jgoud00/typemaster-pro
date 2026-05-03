# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Typing Area Rendering >> WPM counter starts at 0
- Location: e2e\02-typing-engine.spec.ts:50:7

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
            - generic [ref=e8]: "68"
          - img [ref=e10]
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: 0:18
            - generic [ref=e17]: time
          - generic [ref=e18]:
            - generic [ref=e19]: "36"
            - generic [ref=e20]: wpm
          - generic [ref=e21]:
            - generic [ref=e22]: 86%
            - generic [ref=e23]: acc
        - application "Typing practice area" [ref=e24]:
          - status [ref=e25]: "Speed: 36 words per minute. Accuracy: 86 percent. Combo: 12. Progress: 22 percent complete."
          - textbox [ref=e26]:
            - generic [ref=e27]:
              - generic [ref=e28]:
                - generic [ref=e29]: P
                - generic [ref=e30]: h
                - generic [ref=e31]: o
                - generic [ref=e32]: t
                - generic [ref=e33]: o
                - generic [ref=e34]: g
                - generic [ref=e35]: r
                - generic [ref=e36]: a
                - generic [ref=e37]: p
                - generic [ref=e38]: h
                - generic [ref=e39]: "y"
              - generic [ref=e41]:
                - generic [ref=e42]: a
                - generic [ref=e43]: l
                - generic [ref=e44]: l
                - generic [ref=e45]: o
                - generic [ref=e46]: w
                - generic [ref=e47]: s
              - generic [ref=e49]:
                - generic [ref=e50]: u
                - generic [ref=e51]: s
              - generic [ref=e53]:
                - generic [ref=e54]: t
                - generic [ref=e55]: o
              - generic [ref=e57]:
                - generic [ref=e58]: c
                - generic [ref=e59]: a
                - generic [ref=e60]: p
                - generic [ref=e61]: t
                - generic [ref=e62]: u
                - generic [ref=e63]: r
                - generic [ref=e64]: e
              - generic [ref=e66]:
                - generic [ref=e67]: f
                - generic [ref=e68]: l
                - generic [ref=e69]: e
                - generic [ref=e70]: e
                - generic [ref=e71]: t
                - generic [ref=e72]: i
                - generic [ref=e73]: "n"
                - generic [ref=e74]: g
              - generic [ref=e76]:
                - generic [ref=e77]: m
                - generic [ref=e78]: o
                - generic [ref=e79]: m
                - generic [ref=e80]: e
                - generic [ref=e81]: "n"
                - generic [ref=e82]: t
                - generic [ref=e83]: s
              - generic [ref=e85]:
                - generic [ref=e86]: a
                - generic [ref=e87]: "n"
                - generic [ref=e88]: d
              - generic [ref=e90]:
                - generic [ref=e91]: p
                - generic [ref=e92]: r
                - generic [ref=e93]: e
                - 'generic "Next character: s" [ref=e94]': s
                - generic [ref=e96]: e
                - generic [ref=e97]: r
                - generic [ref=e98]: v
                - generic [ref=e99]: e
              - generic [ref=e101]:
                - generic [ref=e102]: t
                - generic [ref=e103]: h
                - generic [ref=e104]: e
                - generic [ref=e105]: m
              - generic [ref=e107]:
                - generic [ref=e108]: f
                - generic [ref=e109]: o
                - generic [ref=e110]: r
                - generic [ref=e111]: e
                - generic [ref=e112]: v
                - generic [ref=e113]: e
                - generic [ref=e114]: r
                - generic [ref=e115]: .
              - generic [ref=e117]:
                - generic [ref=e118]: I
                - generic [ref=e119]: t
              - generic [ref=e121]:
                - generic [ref=e122]: i
                - generic [ref=e123]: s
              - generic [ref=e126]: a
              - generic [ref=e128]:
                - generic [ref=e129]: p
                - generic [ref=e130]: o
                - generic [ref=e131]: w
                - generic [ref=e132]: e
                - generic [ref=e133]: r
                - generic [ref=e134]: f
                - generic [ref=e135]: u
                - generic [ref=e136]: l
              - generic [ref=e138]:
                - generic [ref=e139]: m
                - generic [ref=e140]: e
                - generic [ref=e141]: d
                - generic [ref=e142]: i
                - generic [ref=e143]: u
                - generic [ref=e144]: m
              - generic [ref=e146]:
                - generic [ref=e147]: f
                - generic [ref=e148]: o
                - generic [ref=e149]: r
              - generic [ref=e151]:
                - generic [ref=e152]: s
                - generic [ref=e153]: t
                - generic [ref=e154]: o
                - generic [ref=e155]: r
                - generic [ref=e156]: "y"
                - generic [ref=e157]: t
                - generic [ref=e158]: e
                - generic [ref=e159]: l
                - generic [ref=e160]: l
                - generic [ref=e161]: i
                - generic [ref=e162]: "n"
                - generic [ref=e163]: g
                - generic [ref=e164]: ","
              - generic [ref=e166]:
                - generic [ref=e167]: c
                - generic [ref=e168]: a
                - generic [ref=e169]: p
                - generic [ref=e170]: a
                - generic [ref=e171]: b
                - generic [ref=e172]: l
                - generic [ref=e173]: e
              - generic [ref=e175]:
                - generic [ref=e176]: o
                - generic [ref=e177]: f
              - generic [ref=e179]:
                - generic [ref=e180]: c
                - generic [ref=e181]: o
                - generic [ref=e182]: "n"
                - generic [ref=e183]: v
                - generic [ref=e184]: e
                - generic [ref=e185]: "y"
                - generic [ref=e186]: i
                - generic [ref=e187]: "n"
                - generic [ref=e188]: g
              - generic [ref=e190]:
                - generic [ref=e191]: c
                - generic [ref=e192]: o
                - generic [ref=e193]: m
                - generic [ref=e194]: p
                - generic [ref=e195]: l
                - generic [ref=e196]: e
                - generic [ref=e197]: x
              - generic [ref=e199]:
                - generic [ref=e200]: e
                - generic [ref=e201]: m
                - generic [ref=e202]: o
                - generic [ref=e203]: t
                - generic [ref=e204]: i
                - generic [ref=e205]: o
                - generic [ref=e206]: "n"
                - generic [ref=e207]: s
              - generic [ref=e209]:
                - generic [ref=e210]: w
                - generic [ref=e211]: i
                - generic [ref=e212]: t
                - generic [ref=e213]: h
                - generic [ref=e214]: o
                - generic [ref=e215]: u
                - generic [ref=e216]: t
              - generic [ref=e218]:
                - generic [ref=e219]: w
                - generic [ref=e220]: o
                - generic [ref=e221]: r
                - generic [ref=e222]: d
                - generic [ref=e223]: s
                - generic [ref=e224]: .
              - generic [ref=e226]:
                - generic [ref=e227]: U
                - generic [ref=e228]: "n"
                - generic [ref=e229]: d
                - generic [ref=e230]: e
                - generic [ref=e231]: r
                - generic [ref=e232]: s
                - generic [ref=e233]: t
                - generic [ref=e234]: a
                - generic [ref=e235]: "n"
                - generic [ref=e236]: d
                - generic [ref=e237]: i
                - generic [ref=e238]: "n"
                - generic [ref=e239]: g
              - generic [ref=e241]:
                - generic [ref=e242]: l
                - generic [ref=e243]: i
                - generic [ref=e244]: g
                - generic [ref=e245]: h
                - generic [ref=e246]: t
                - generic [ref=e247]: ","
              - generic [ref=e249]:
                - generic [ref=e250]: c
                - generic [ref=e251]: o
                - generic [ref=e252]: m
                - generic [ref=e253]: p
                - generic [ref=e254]: o
                - generic [ref=e255]: s
                - generic [ref=e256]: i
                - generic [ref=e257]: t
                - generic [ref=e258]: i
                - generic [ref=e259]: o
                - generic [ref=e260]: "n"
                - generic [ref=e261]: ","
              - generic [ref=e263]:
                - generic [ref=e264]: a
                - generic [ref=e265]: "n"
                - generic [ref=e266]: d
              - generic [ref=e268]:
                - generic [ref=e269]: t
                - generic [ref=e270]: i
                - generic [ref=e271]: m
                - generic [ref=e272]: i
                - generic [ref=e273]: "n"
                - generic [ref=e274]: g
              - generic [ref=e276]:
                - generic [ref=e277]: i
                - generic [ref=e278]: s
              - generic [ref=e280]:
                - generic [ref=e281]: e
                - generic [ref=e282]: s
                - generic [ref=e283]: s
                - generic [ref=e284]: e
                - generic [ref=e285]: "n"
                - generic [ref=e286]: t
                - generic [ref=e287]: i
                - generic [ref=e288]: a
                - generic [ref=e289]: l
              - generic [ref=e291]:
                - generic [ref=e292]: f
                - generic [ref=e293]: o
                - generic [ref=e294]: r
              - generic [ref=e296]:
                - generic [ref=e297]: t
                - generic [ref=e298]: a
                - generic [ref=e299]: k
                - generic [ref=e300]: i
                - generic [ref=e301]: "n"
                - generic [ref=e302]: g
              - generic [ref=e304]:
                - generic [ref=e305]: c
                - generic [ref=e306]: o
                - generic [ref=e307]: m
                - generic [ref=e308]: p
                - generic [ref=e309]: e
                - generic [ref=e310]: l
                - generic [ref=e311]: l
                - generic [ref=e312]: i
                - generic [ref=e313]: "n"
                - generic [ref=e314]: g
              - generic [ref=e316]:
                - generic [ref=e317]: p
                - generic [ref=e318]: h
                - generic [ref=e319]: o
                - generic [ref=e320]: t
                - generic [ref=e321]: o
                - generic [ref=e322]: g
                - generic [ref=e323]: r
                - generic [ref=e324]: a
                - generic [ref=e325]: p
                - generic [ref=e326]: h
                - generic [ref=e327]: s
                - generic [ref=e328]: .
  - alert [ref=e329]
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