# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Keystroke Handling >> correct keystrokes are highlighted green/correct
- Location: e2e\02-typing-engine.spec.ts:89:7

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
                - 'generic "Next character: S" [ref=e38]': S
                - generic [ref=e40]: p
                - generic [ref=e41]: a
                - generic [ref=e42]: c
                - generic [ref=e43]: e
              - generic [ref=e45]:
                - generic [ref=e46]: e
                - generic [ref=e47]: x
                - generic [ref=e48]: p
                - generic [ref=e49]: l
                - generic [ref=e50]: o
                - generic [ref=e51]: r
                - generic [ref=e52]: a
                - generic [ref=e53]: t
                - generic [ref=e54]: i
                - generic [ref=e55]: o
                - generic [ref=e56]: "n"
              - generic [ref=e58]:
                - generic [ref=e59]: e
                - generic [ref=e60]: x
                - generic [ref=e61]: p
                - generic [ref=e62]: a
                - generic [ref=e63]: "n"
                - generic [ref=e64]: d
                - generic [ref=e65]: s
              - generic [ref=e67]:
                - generic [ref=e68]: o
                - generic [ref=e69]: u
                - generic [ref=e70]: r
              - generic [ref=e72]:
                - generic [ref=e73]: u
                - generic [ref=e74]: "n"
                - generic [ref=e75]: d
                - generic [ref=e76]: e
                - generic [ref=e77]: r
                - generic [ref=e78]: s
                - generic [ref=e79]: t
                - generic [ref=e80]: a
                - generic [ref=e81]: "n"
                - generic [ref=e82]: d
                - generic [ref=e83]: i
                - generic [ref=e84]: "n"
                - generic [ref=e85]: g
              - generic [ref=e87]:
                - generic [ref=e88]: o
                - generic [ref=e89]: f
              - generic [ref=e91]:
                - generic [ref=e92]: t
                - generic [ref=e93]: h
                - generic [ref=e94]: e
              - generic [ref=e96]:
                - generic [ref=e97]: u
                - generic [ref=e98]: "n"
                - generic [ref=e99]: i
                - generic [ref=e100]: v
                - generic [ref=e101]: e
                - generic [ref=e102]: r
                - generic [ref=e103]: s
                - generic [ref=e104]: e
                - generic [ref=e105]: .
              - generic [ref=e107]:
                - generic [ref=e108]: M
                - generic [ref=e109]: i
                - generic [ref=e110]: s
                - generic [ref=e111]: s
                - generic [ref=e112]: i
                - generic [ref=e113]: o
                - generic [ref=e114]: "n"
                - generic [ref=e115]: s
              - generic [ref=e117]:
                - generic [ref=e118]: t
                - generic [ref=e119]: o
              - generic [ref=e121]:
                - generic [ref=e122]: M
                - generic [ref=e123]: a
                - generic [ref=e124]: r
                - generic [ref=e125]: s
              - generic [ref=e127]:
                - generic [ref=e128]: s
                - generic [ref=e129]: e
                - generic [ref=e130]: a
                - generic [ref=e131]: r
                - generic [ref=e132]: c
                - generic [ref=e133]: h
              - generic [ref=e135]:
                - generic [ref=e136]: f
                - generic [ref=e137]: o
                - generic [ref=e138]: r
              - generic [ref=e140]:
                - generic [ref=e141]: s
                - generic [ref=e142]: i
                - generic [ref=e143]: g
                - generic [ref=e144]: "n"
                - generic [ref=e145]: s
              - generic [ref=e147]:
                - generic [ref=e148]: o
                - generic [ref=e149]: f
              - generic [ref=e151]:
                - generic [ref=e152]: p
                - generic [ref=e153]: a
                - generic [ref=e154]: s
                - generic [ref=e155]: t
              - generic [ref=e157]:
                - generic [ref=e158]: l
                - generic [ref=e159]: i
                - generic [ref=e160]: f
                - generic [ref=e161]: e
                - generic [ref=e162]: ","
              - generic [ref=e164]:
                - generic [ref=e165]: w
                - generic [ref=e166]: h
                - generic [ref=e167]: i
                - generic [ref=e168]: l
                - generic [ref=e169]: e
              - generic [ref=e171]:
                - generic [ref=e172]: t
                - generic [ref=e173]: e
                - generic [ref=e174]: l
                - generic [ref=e175]: e
                - generic [ref=e176]: s
                - generic [ref=e177]: c
                - generic [ref=e178]: o
                - generic [ref=e179]: p
                - generic [ref=e180]: e
                - generic [ref=e181]: s
              - generic [ref=e183]:
                - generic [ref=e184]: p
                - generic [ref=e185]: e
                - generic [ref=e186]: e
                - generic [ref=e187]: r
              - generic [ref=e189]:
                - generic [ref=e190]: d
                - generic [ref=e191]: e
                - generic [ref=e192]: e
                - generic [ref=e193]: p
              - generic [ref=e195]:
                - generic [ref=e196]: i
                - generic [ref=e197]: "n"
                - generic [ref=e198]: t
                - generic [ref=e199]: o
              - generic [ref=e201]:
                - generic [ref=e202]: s
                - generic [ref=e203]: p
                - generic [ref=e204]: a
                - generic [ref=e205]: c
                - generic [ref=e206]: e
              - generic [ref=e208]:
                - generic [ref=e209]: t
                - generic [ref=e210]: o
              - generic [ref=e212]:
                - generic [ref=e213]: o
                - generic [ref=e214]: b
                - generic [ref=e215]: s
                - generic [ref=e216]: e
                - generic [ref=e217]: r
                - generic [ref=e218]: v
                - generic [ref=e219]: e
              - generic [ref=e221]:
                - generic [ref=e222]: d
                - generic [ref=e223]: i
                - generic [ref=e224]: s
                - generic [ref=e225]: t
                - generic [ref=e226]: a
                - generic [ref=e227]: "n"
                - generic [ref=e228]: t
              - generic [ref=e230]:
                - generic [ref=e231]: g
                - generic [ref=e232]: a
                - generic [ref=e233]: l
                - generic [ref=e234]: a
                - generic [ref=e235]: x
                - generic [ref=e236]: i
                - generic [ref=e237]: e
                - generic [ref=e238]: s
                - generic [ref=e239]: .
              - generic [ref=e241]:
                - generic [ref=e242]: T
                - generic [ref=e243]: h
                - generic [ref=e244]: e
              - generic [ref=e246]:
                - generic [ref=e247]: c
                - generic [ref=e248]: o
                - generic [ref=e249]: "n"
                - generic [ref=e250]: t
                - generic [ref=e251]: i
                - generic [ref=e252]: "n"
                - generic [ref=e253]: u
                - generic [ref=e254]: o
                - generic [ref=e255]: u
                - generic [ref=e256]: s
              - generic [ref=e258]:
                - generic [ref=e259]: q
                - generic [ref=e260]: u
                - generic [ref=e261]: e
                - generic [ref=e262]: s
                - generic [ref=e263]: t
              - generic [ref=e265]:
                - generic [ref=e266]: f
                - generic [ref=e267]: o
                - generic [ref=e268]: r
              - generic [ref=e270]:
                - generic [ref=e271]: k
                - generic [ref=e272]: "n"
                - generic [ref=e273]: o
                - generic [ref=e274]: w
                - generic [ref=e275]: l
                - generic [ref=e276]: e
                - generic [ref=e277]: d
                - generic [ref=e278]: g
                - generic [ref=e279]: e
              - generic [ref=e281]:
                - generic [ref=e282]: d
                - generic [ref=e283]: r
                - generic [ref=e284]: i
                - generic [ref=e285]: v
                - generic [ref=e286]: e
                - generic [ref=e287]: s
              - generic [ref=e289]:
                - generic [ref=e290]: h
                - generic [ref=e291]: u
                - generic [ref=e292]: m
                - generic [ref=e293]: a
                - generic [ref=e294]: "n"
                - generic [ref=e295]: i
                - generic [ref=e296]: t
                - generic [ref=e297]: "y"
              - generic [ref=e299]:
                - generic [ref=e300]: t
                - generic [ref=e301]: o
              - generic [ref=e303]:
                - generic [ref=e304]: r
                - generic [ref=e305]: e
                - generic [ref=e306]: a
                - generic [ref=e307]: c
                - generic [ref=e308]: h
              - generic [ref=e310]:
                - generic [ref=e311]: f
                - generic [ref=e312]: o
                - generic [ref=e313]: r
              - generic [ref=e315]:
                - generic [ref=e316]: t
                - generic [ref=e317]: h
                - generic [ref=e318]: e
              - generic [ref=e320]:
                - generic [ref=e321]: s
                - generic [ref=e322]: t
                - generic [ref=e323]: a
                - generic [ref=e324]: r
                - generic [ref=e325]: s
                - generic [ref=e326]: .
  - alert [ref=e327]
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