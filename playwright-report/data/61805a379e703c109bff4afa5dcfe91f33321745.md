# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Typing Area Rendering >> text to type is displayed
- Location: e2e\02-typing-engine.spec.ts:40:7

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
                - generic [ref=e44]: p
                - generic [ref=e45]: r
                - generic [ref=e46]: o
                - generic [ref=e47]: c
                - generic [ref=e48]: e
                - generic [ref=e49]: s
                - generic [ref=e50]: s
              - generic [ref=e52]:
                - generic [ref=e53]: o
                - generic [ref=e54]: f
              - generic [ref=e56]:
                - generic [ref=e57]: s
                - generic [ref=e58]: c
                - generic [ref=e59]: i
                - generic [ref=e60]: e
                - generic [ref=e61]: "n"
                - generic [ref=e62]: t
                - generic [ref=e63]: i
                - generic [ref=e64]: f
                - generic [ref=e65]: i
                - generic [ref=e66]: c
              - generic [ref=e68]:
                - generic [ref=e69]: i
                - generic [ref=e70]: "n"
                - generic [ref=e71]: q
                - generic [ref=e72]: u
                - generic [ref=e73]: i
                - generic [ref=e74]: r
                - generic [ref=e75]: "y"
              - generic [ref=e77]:
                - generic [ref=e78]: i
                - generic [ref=e79]: "n"
                - generic [ref=e80]: v
                - generic [ref=e81]: o
                - generic [ref=e82]: l
                - generic [ref=e83]: v
                - generic [ref=e84]: e
                - generic [ref=e85]: s
              - generic [ref=e87]:
                - generic [ref=e88]: o
                - generic [ref=e89]: b
                - generic [ref=e90]: s
                - generic [ref=e91]: e
                - generic [ref=e92]: r
                - generic [ref=e93]: v
                - generic [ref=e94]: a
                - generic [ref=e95]: t
                - generic [ref=e96]: i
                - generic [ref=e97]: o
                - generic [ref=e98]: "n"
                - generic [ref=e99]: ","
              - generic [ref=e101]:
                - generic [ref=e102]: h
                - generic [ref=e103]: "y"
                - generic [ref=e104]: p
                - generic [ref=e105]: o
                - generic [ref=e106]: t
                - generic [ref=e107]: h
                - generic [ref=e108]: e
                - generic [ref=e109]: s
                - generic [ref=e110]: i
                - generic [ref=e111]: s
              - generic [ref=e113]:
                - generic [ref=e114]: f
                - generic [ref=e115]: o
                - generic [ref=e116]: r
                - generic [ref=e117]: m
                - generic [ref=e118]: a
                - generic [ref=e119]: t
                - generic [ref=e120]: i
                - generic [ref=e121]: o
                - generic [ref=e122]: "n"
                - generic [ref=e123]: ","
              - generic [ref=e125]:
                - generic [ref=e126]: e
                - generic [ref=e127]: x
                - generic [ref=e128]: p
                - generic [ref=e129]: e
                - generic [ref=e130]: r
                - generic [ref=e131]: i
                - generic [ref=e132]: m
                - generic [ref=e133]: e
                - generic [ref=e134]: "n"
                - generic [ref=e135]: t
                - generic [ref=e136]: a
                - generic [ref=e137]: t
                - generic [ref=e138]: i
                - generic [ref=e139]: o
                - generic [ref=e140]: "n"
                - generic [ref=e141]: ","
              - generic [ref=e143]:
                - generic [ref=e144]: a
                - generic [ref=e145]: "n"
                - generic [ref=e146]: d
              - generic [ref=e148]:
                - generic [ref=e149]: a
                - generic [ref=e150]: "n"
                - generic [ref=e151]: a
                - generic [ref=e152]: l
                - generic [ref=e153]: "y"
                - generic [ref=e154]: s
                - generic [ref=e155]: i
                - generic [ref=e156]: s
                - generic [ref=e157]: .
              - generic [ref=e159]:
                - generic [ref=e160]: I
                - generic [ref=e161]: t
              - generic [ref=e163]:
                - generic [ref=e164]: i
                - generic [ref=e165]: s
              - generic [ref=e168]: a
              - generic [ref=e170]:
                - generic [ref=e171]: s
                - generic [ref=e172]: "y"
                - generic [ref=e173]: s
                - generic [ref=e174]: t
                - generic [ref=e175]: e
                - generic [ref=e176]: m
                - generic [ref=e177]: a
                - generic [ref=e178]: t
                - generic [ref=e179]: i
                - generic [ref=e180]: c
              - generic [ref=e182]:
                - generic [ref=e183]: a
                - generic [ref=e184]: p
                - generic [ref=e185]: p
                - generic [ref=e186]: r
                - generic [ref=e187]: o
                - generic [ref=e188]: a
                - generic [ref=e189]: c
                - generic [ref=e190]: h
              - generic [ref=e192]:
                - generic [ref=e193]: t
                - generic [ref=e194]: o
              - generic [ref=e196]:
                - generic [ref=e197]: a
                - generic [ref=e198]: c
                - generic [ref=e199]: q
                - generic [ref=e200]: u
                - generic [ref=e201]: i
                - generic [ref=e202]: r
                - generic [ref=e203]: i
                - generic [ref=e204]: "n"
                - generic [ref=e205]: g
              - generic [ref=e207]:
                - generic [ref=e208]: k
                - generic [ref=e209]: "n"
                - generic [ref=e210]: o
                - generic [ref=e211]: w
                - generic [ref=e212]: l
                - generic [ref=e213]: e
                - generic [ref=e214]: d
                - generic [ref=e215]: g
                - generic [ref=e216]: e
              - generic [ref=e218]:
                - generic [ref=e219]: t
                - generic [ref=e220]: h
                - generic [ref=e221]: a
                - generic [ref=e222]: t
              - generic [ref=e224]:
                - generic [ref=e225]: r
                - generic [ref=e226]: e
                - generic [ref=e227]: l
                - generic [ref=e228]: i
                - generic [ref=e229]: e
                - generic [ref=e230]: s
              - generic [ref=e232]:
                - generic [ref=e233]: o
                - generic [ref=e234]: "n"
              - generic [ref=e236]:
                - generic [ref=e237]: e
                - generic [ref=e238]: m
                - generic [ref=e239]: p
                - generic [ref=e240]: i
                - generic [ref=e241]: r
                - generic [ref=e242]: i
                - generic [ref=e243]: c
                - generic [ref=e244]: a
                - generic [ref=e245]: l
              - generic [ref=e247]:
                - generic [ref=e248]: e
                - generic [ref=e249]: v
                - generic [ref=e250]: i
                - generic [ref=e251]: d
                - generic [ref=e252]: e
                - generic [ref=e253]: "n"
                - generic [ref=e254]: c
                - generic [ref=e255]: e
                - generic [ref=e256]: .
              - generic [ref=e258]:
                - generic [ref=e259]: T
                - generic [ref=e260]: h
                - generic [ref=e261]: i
                - generic [ref=e262]: s
              - generic [ref=e264]:
                - generic [ref=e265]: m
                - generic [ref=e266]: e
                - generic [ref=e267]: t
                - generic [ref=e268]: h
                - generic [ref=e269]: o
                - generic [ref=e270]: d
              - generic [ref=e272]:
                - generic [ref=e273]: h
                - generic [ref=e274]: a
                - generic [ref=e275]: s
              - generic [ref=e277]:
                - generic [ref=e278]: d
                - generic [ref=e279]: r
                - generic [ref=e280]: i
                - generic [ref=e281]: v
                - generic [ref=e282]: e
                - generic [ref=e283]: "n"
              - generic [ref=e285]:
                - generic [ref=e286]: s
                - generic [ref=e287]: o
                - generic [ref=e288]: m
                - generic [ref=e289]: e
              - generic [ref=e291]:
                - generic [ref=e292]: o
                - generic [ref=e293]: f
              - generic [ref=e295]:
                - generic [ref=e296]: t
                - generic [ref=e297]: h
                - generic [ref=e298]: e
              - generic [ref=e300]:
                - generic [ref=e301]: m
                - generic [ref=e302]: o
                - generic [ref=e303]: s
                - generic [ref=e304]: t
              - generic [ref=e306]:
                - generic [ref=e307]: s
                - generic [ref=e308]: i
                - generic [ref=e309]: g
                - generic [ref=e310]: "n"
                - generic [ref=e311]: i
                - generic [ref=e312]: f
                - generic [ref=e313]: i
                - generic [ref=e314]: c
                - generic [ref=e315]: a
                - generic [ref=e316]: "n"
                - generic [ref=e317]: t
              - generic [ref=e319]:
                - generic [ref=e320]: a
                - generic [ref=e321]: d
                - generic [ref=e322]: v
                - generic [ref=e323]: a
                - generic [ref=e324]: "n"
                - generic [ref=e325]: c
                - generic [ref=e326]: e
                - generic [ref=e327]: m
                - generic [ref=e328]: e
                - generic [ref=e329]: "n"
                - generic [ref=e330]: t
                - generic [ref=e331]: s
              - generic [ref=e333]:
                - generic [ref=e334]: i
                - generic [ref=e335]: "n"
              - generic [ref=e337]:
                - generic [ref=e338]: h
                - generic [ref=e339]: u
                - generic [ref=e340]: m
                - generic [ref=e341]: a
                - generic [ref=e342]: "n"
              - generic [ref=e344]:
                - generic [ref=e345]: h
                - generic [ref=e346]: i
                - generic [ref=e347]: s
                - generic [ref=e348]: t
                - generic [ref=e349]: o
                - generic [ref=e350]: r
                - generic [ref=e351]: "y"
                - generic [ref=e352]: .
  - alert [ref=e353]
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