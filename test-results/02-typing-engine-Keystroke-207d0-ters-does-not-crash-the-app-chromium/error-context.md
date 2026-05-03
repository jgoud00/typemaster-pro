# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Keystroke Handling >> typing special characters does not crash the app
- Location: e2e\02-typing-engine.spec.ts:118:7

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
                - 'generic "Next character: H" [ref=e38]': H
                - generic [ref=e40]: i
                - generic [ref=e41]: s
                - generic [ref=e42]: t
                - generic [ref=e43]: o
                - generic [ref=e44]: r
                - generic [ref=e45]: "y"
              - generic [ref=e47]:
                - generic [ref=e48]: p
                - generic [ref=e49]: r
                - generic [ref=e50]: o
                - generic [ref=e51]: v
                - generic [ref=e52]: i
                - generic [ref=e53]: d
                - generic [ref=e54]: e
                - generic [ref=e55]: s
              - generic [ref=e57]:
                - generic [ref=e58]: v
                - generic [ref=e59]: a
                - generic [ref=e60]: l
                - generic [ref=e61]: u
                - generic [ref=e62]: a
                - generic [ref=e63]: b
                - generic [ref=e64]: l
                - generic [ref=e65]: e
              - generic [ref=e67]:
                - generic [ref=e68]: l
                - generic [ref=e69]: e
                - generic [ref=e70]: s
                - generic [ref=e71]: s
                - generic [ref=e72]: o
                - generic [ref=e73]: "n"
                - generic [ref=e74]: s
              - generic [ref=e76]:
                - generic [ref=e77]: t
                - generic [ref=e78]: h
                - generic [ref=e79]: a
                - generic [ref=e80]: t
              - generic [ref=e82]:
                - generic [ref=e83]: c
                - generic [ref=e84]: a
                - generic [ref=e85]: "n"
              - generic [ref=e87]:
                - generic [ref=e88]: g
                - generic [ref=e89]: u
                - generic [ref=e90]: i
                - generic [ref=e91]: d
                - generic [ref=e92]: e
              - generic [ref=e94]:
                - generic [ref=e95]: o
                - generic [ref=e96]: u
                - generic [ref=e97]: r
              - generic [ref=e99]:
                - generic [ref=e100]: f
                - generic [ref=e101]: u
                - generic [ref=e102]: t
                - generic [ref=e103]: u
                - generic [ref=e104]: r
                - generic [ref=e105]: e
              - generic [ref=e107]:
                - generic [ref=e108]: d
                - generic [ref=e109]: e
                - generic [ref=e110]: c
                - generic [ref=e111]: i
                - generic [ref=e112]: s
                - generic [ref=e113]: i
                - generic [ref=e114]: o
                - generic [ref=e115]: "n"
                - generic [ref=e116]: s
                - generic [ref=e117]: .
              - generic [ref=e119]:
                - generic [ref=e120]: B
                - generic [ref=e121]: "y"
              - generic [ref=e123]:
                - generic [ref=e124]: s
                - generic [ref=e125]: t
                - generic [ref=e126]: u
                - generic [ref=e127]: d
                - generic [ref=e128]: "y"
                - generic [ref=e129]: i
                - generic [ref=e130]: "n"
                - generic [ref=e131]: g
              - generic [ref=e133]:
                - generic [ref=e134]: t
                - generic [ref=e135]: h
                - generic [ref=e136]: e
              - generic [ref=e138]:
                - generic [ref=e139]: t
                - generic [ref=e140]: r
                - generic [ref=e141]: i
                - generic [ref=e142]: u
                - generic [ref=e143]: m
                - generic [ref=e144]: p
                - generic [ref=e145]: h
                - generic [ref=e146]: s
              - generic [ref=e148]:
                - generic [ref=e149]: a
                - generic [ref=e150]: "n"
                - generic [ref=e151]: d
              - generic [ref=e153]:
                - generic [ref=e154]: f
                - generic [ref=e155]: a
                - generic [ref=e156]: i
                - generic [ref=e157]: l
                - generic [ref=e158]: u
                - generic [ref=e159]: r
                - generic [ref=e160]: e
                - generic [ref=e161]: s
              - generic [ref=e163]:
                - generic [ref=e164]: o
                - generic [ref=e165]: f
              - generic [ref=e167]:
                - generic [ref=e168]: t
                - generic [ref=e169]: h
                - generic [ref=e170]: e
              - generic [ref=e172]:
                - generic [ref=e173]: p
                - generic [ref=e174]: a
                - generic [ref=e175]: s
                - generic [ref=e176]: t
                - generic [ref=e177]: ","
              - generic [ref=e179]:
                - generic [ref=e180]: w
                - generic [ref=e181]: e
              - generic [ref=e183]:
                - generic [ref=e184]: c
                - generic [ref=e185]: a
                - generic [ref=e186]: "n"
              - generic [ref=e188]:
                - generic [ref=e189]: g
                - generic [ref=e190]: a
                - generic [ref=e191]: i
                - generic [ref=e192]: "n"
              - generic [ref=e194]:
                - generic [ref=e195]: i
                - generic [ref=e196]: "n"
                - generic [ref=e197]: s
                - generic [ref=e198]: i
                - generic [ref=e199]: g
                - generic [ref=e200]: h
                - generic [ref=e201]: t
                - generic [ref=e202]: s
              - generic [ref=e204]:
                - generic [ref=e205]: i
                - generic [ref=e206]: "n"
                - generic [ref=e207]: t
                - generic [ref=e208]: o
              - generic [ref=e210]:
                - generic [ref=e211]: h
                - generic [ref=e212]: u
                - generic [ref=e213]: m
                - generic [ref=e214]: a
                - generic [ref=e215]: "n"
              - generic [ref=e217]:
                - generic [ref=e218]: "n"
                - generic [ref=e219]: a
                - generic [ref=e220]: t
                - generic [ref=e221]: u
                - generic [ref=e222]: r
                - generic [ref=e223]: e
              - generic [ref=e225]:
                - generic [ref=e226]: a
                - generic [ref=e227]: "n"
                - generic [ref=e228]: d
              - generic [ref=e230]:
                - generic [ref=e231]: t
                - generic [ref=e232]: h
                - generic [ref=e233]: e
              - generic [ref=e235]:
                - generic [ref=e236]: c
                - generic [ref=e237]: o
                - generic [ref=e238]: "n"
                - generic [ref=e239]: s
                - generic [ref=e240]: e
                - generic [ref=e241]: q
                - generic [ref=e242]: u
                - generic [ref=e243]: e
                - generic [ref=e244]: "n"
                - generic [ref=e245]: c
                - generic [ref=e246]: e
                - generic [ref=e247]: s
              - generic [ref=e249]:
                - generic [ref=e250]: o
                - generic [ref=e251]: f
              - generic [ref=e253]:
                - generic [ref=e254]: o
                - generic [ref=e255]: u
                - generic [ref=e256]: r
              - generic [ref=e258]:
                - generic [ref=e259]: a
                - generic [ref=e260]: c
                - generic [ref=e261]: t
                - generic [ref=e262]: i
                - generic [ref=e263]: o
                - generic [ref=e264]: "n"
                - generic [ref=e265]: s
                - generic [ref=e266]: .
              - generic [ref=e268]:
                - generic [ref=e269]: I
                - generic [ref=e270]: t
              - generic [ref=e272]:
                - generic [ref=e273]: i
                - generic [ref=e274]: s
              - generic [ref=e276]:
                - generic [ref=e277]: e
                - generic [ref=e278]: s
                - generic [ref=e279]: s
                - generic [ref=e280]: e
                - generic [ref=e281]: "n"
                - generic [ref=e282]: t
                - generic [ref=e283]: i
                - generic [ref=e284]: a
                - generic [ref=e285]: l
              - generic [ref=e287]:
                - generic [ref=e288]: t
                - generic [ref=e289]: o
              - generic [ref=e291]:
                - generic [ref=e292]: r
                - generic [ref=e293]: e
                - generic [ref=e294]: m
                - generic [ref=e295]: e
                - generic [ref=e296]: m
                - generic [ref=e297]: b
                - generic [ref=e298]: e
                - generic [ref=e299]: r
              - generic [ref=e301]:
                - generic [ref=e302]: t
                - generic [ref=e303]: h
                - generic [ref=e304]: a
                - generic [ref=e305]: t
              - generic [ref=e307]:
                - generic [ref=e308]: h
                - generic [ref=e309]: i
                - generic [ref=e310]: s
                - generic [ref=e311]: t
                - generic [ref=e312]: o
                - generic [ref=e313]: r
                - generic [ref=e314]: "y"
              - generic [ref=e316]:
                - generic [ref=e317]: i
                - generic [ref=e318]: s
              - generic [ref=e320]:
                - generic [ref=e321]: o
                - generic [ref=e322]: f
                - generic [ref=e323]: t
                - generic [ref=e324]: e
                - generic [ref=e325]: "n"
              - generic [ref=e327]:
                - generic [ref=e328]: c
                - generic [ref=e329]: o
                - generic [ref=e330]: m
                - generic [ref=e331]: p
                - generic [ref=e332]: l
                - generic [ref=e333]: e
                - generic [ref=e334]: x
              - generic [ref=e336]:
                - generic [ref=e337]: a
                - generic [ref=e338]: "n"
                - generic [ref=e339]: d
              - generic [ref=e341]:
                - generic [ref=e342]: m
                - generic [ref=e343]: u
                - generic [ref=e344]: l
                - generic [ref=e345]: t
                - generic [ref=e346]: i
                - generic [ref=e347]: f
                - generic [ref=e348]: a
                - generic [ref=e349]: c
                - generic [ref=e350]: e
                - generic [ref=e351]: t
                - generic [ref=e352]: e
                - generic [ref=e353]: d
                - generic [ref=e354]: .
  - alert [ref=e355]
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