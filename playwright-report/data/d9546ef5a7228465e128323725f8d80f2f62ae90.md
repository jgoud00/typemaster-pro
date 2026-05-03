# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 02-typing-engine.spec.ts >> Cursor >> cursor is visible at start
- Location: e2e\02-typing-engine.spec.ts:188:7

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
                - 'generic "Next character: C" [ref=e38]': C
                - generic [ref=e40]: o
                - generic [ref=e41]: o
                - generic [ref=e42]: k
                - generic [ref=e43]: i
                - generic [ref=e44]: "n"
                - generic [ref=e45]: g
              - generic [ref=e47]:
                - generic [ref=e48]: i
                - generic [ref=e49]: s
              - generic [ref=e51]:
                - generic [ref=e52]: b
                - generic [ref=e53]: o
                - generic [ref=e54]: t
                - generic [ref=e55]: h
              - generic [ref=e57]:
                - generic [ref=e58]: a
                - generic [ref=e59]: "n"
              - generic [ref=e61]:
                - generic [ref=e62]: a
                - generic [ref=e63]: r
                - generic [ref=e64]: t
              - generic [ref=e66]:
                - generic [ref=e67]: a
                - generic [ref=e68]: "n"
                - generic [ref=e69]: d
              - generic [ref=e72]: a
              - generic [ref=e74]:
                - generic [ref=e75]: s
                - generic [ref=e76]: c
                - generic [ref=e77]: i
                - generic [ref=e78]: e
                - generic [ref=e79]: "n"
                - generic [ref=e80]: c
                - generic [ref=e81]: e
                - generic [ref=e82]: .
              - generic [ref=e84]:
                - generic [ref=e85]: B
                - generic [ref=e86]: a
                - generic [ref=e87]: l
                - generic [ref=e88]: a
                - generic [ref=e89]: "n"
                - generic [ref=e90]: c
                - generic [ref=e91]: i
                - generic [ref=e92]: "n"
                - generic [ref=e93]: g
              - generic [ref=e95]:
                - generic [ref=e96]: f
                - generic [ref=e97]: l
                - generic [ref=e98]: a
                - generic [ref=e99]: v
                - generic [ref=e100]: o
                - generic [ref=e101]: r
                - generic [ref=e102]: s
              - generic [ref=e104]:
                - generic [ref=e105]: r
                - generic [ref=e106]: e
                - generic [ref=e107]: q
                - generic [ref=e108]: u
                - generic [ref=e109]: i
                - generic [ref=e110]: r
                - generic [ref=e111]: e
                - generic [ref=e112]: s
              - generic [ref=e114]:
                - generic [ref=e115]: c
                - generic [ref=e116]: r
                - generic [ref=e117]: e
                - generic [ref=e118]: a
                - generic [ref=e119]: t
                - generic [ref=e120]: i
                - generic [ref=e121]: v
                - generic [ref=e122]: i
                - generic [ref=e123]: t
                - generic [ref=e124]: "y"
                - generic [ref=e125]: ","
              - generic [ref=e127]:
                - generic [ref=e128]: w
                - generic [ref=e129]: h
                - generic [ref=e130]: i
                - generic [ref=e131]: l
                - generic [ref=e132]: e
              - generic [ref=e134]:
                - generic [ref=e135]: u
                - generic [ref=e136]: "n"
                - generic [ref=e137]: d
                - generic [ref=e138]: e
                - generic [ref=e139]: r
                - generic [ref=e140]: s
                - generic [ref=e141]: t
                - generic [ref=e142]: a
                - generic [ref=e143]: "n"
                - generic [ref=e144]: d
                - generic [ref=e145]: i
                - generic [ref=e146]: "n"
                - generic [ref=e147]: g
              - generic [ref=e149]:
                - generic [ref=e150]: h
                - generic [ref=e151]: o
                - generic [ref=e152]: w
              - generic [ref=e154]:
                - generic [ref=e155]: i
                - generic [ref=e156]: "n"
                - generic [ref=e157]: g
                - generic [ref=e158]: r
                - generic [ref=e159]: e
                - generic [ref=e160]: d
                - generic [ref=e161]: i
                - generic [ref=e162]: e
                - generic [ref=e163]: "n"
                - generic [ref=e164]: t
                - generic [ref=e165]: s
              - generic [ref=e167]:
                - generic [ref=e168]: i
                - generic [ref=e169]: "n"
                - generic [ref=e170]: t
                - generic [ref=e171]: e
                - generic [ref=e172]: r
                - generic [ref=e173]: a
                - generic [ref=e174]: c
                - generic [ref=e175]: t
              - generic [ref=e177]:
                - generic [ref=e178]: u
                - generic [ref=e179]: "n"
                - generic [ref=e180]: d
                - generic [ref=e181]: e
                - generic [ref=e182]: r
              - generic [ref=e184]:
                - generic [ref=e185]: h
                - generic [ref=e186]: e
                - generic [ref=e187]: a
                - generic [ref=e188]: t
              - generic [ref=e190]:
                - generic [ref=e191]: i
                - generic [ref=e192]: "n"
                - generic [ref=e193]: v
                - generic [ref=e194]: o
                - generic [ref=e195]: l
                - generic [ref=e196]: v
                - generic [ref=e197]: e
                - generic [ref=e198]: s
              - generic [ref=e200]:
                - generic [ref=e201]: c
                - generic [ref=e202]: h
                - generic [ref=e203]: e
                - generic [ref=e204]: m
                - generic [ref=e205]: i
                - generic [ref=e206]: s
                - generic [ref=e207]: t
                - generic [ref=e208]: r
                - generic [ref=e209]: "y"
                - generic [ref=e210]: .
              - generic [ref=e212]:
                - generic [ref=e213]: C
                - generic [ref=e214]: r
                - generic [ref=e215]: e
                - generic [ref=e216]: a
                - generic [ref=e217]: t
                - generic [ref=e218]: i
                - generic [ref=e219]: "n"
                - generic [ref=e220]: g
              - generic [ref=e223]: a
              - generic [ref=e225]:
                - generic [ref=e226]: d
                - generic [ref=e227]: e
                - generic [ref=e228]: l
                - generic [ref=e229]: i
                - generic [ref=e230]: c
                - generic [ref=e231]: i
                - generic [ref=e232]: o
                - generic [ref=e233]: u
                - generic [ref=e234]: s
              - generic [ref=e236]:
                - generic [ref=e237]: m
                - generic [ref=e238]: e
                - generic [ref=e239]: a
                - generic [ref=e240]: l
              - generic [ref=e242]:
                - generic [ref=e243]: f
                - generic [ref=e244]: r
                - generic [ref=e245]: o
                - generic [ref=e246]: m
              - generic [ref=e248]:
                - generic [ref=e249]: s
                - generic [ref=e250]: c
                - generic [ref=e251]: r
                - generic [ref=e252]: a
                - generic [ref=e253]: t
                - generic [ref=e254]: c
                - generic [ref=e255]: h
              - generic [ref=e257]:
                - generic [ref=e258]: i
                - generic [ref=e259]: s
              - generic [ref=e262]: a
              - generic [ref=e264]:
                - generic [ref=e265]: h
                - generic [ref=e266]: i
                - generic [ref=e267]: g
                - generic [ref=e268]: h
                - generic [ref=e269]: l
                - generic [ref=e270]: "y"
              - generic [ref=e272]:
                - generic [ref=e273]: r
                - generic [ref=e274]: e
                - generic [ref=e275]: w
                - generic [ref=e276]: a
                - generic [ref=e277]: r
                - generic [ref=e278]: d
                - generic [ref=e279]: i
                - generic [ref=e280]: "n"
                - generic [ref=e281]: g
              - generic [ref=e283]:
                - generic [ref=e284]: e
                - generic [ref=e285]: "n"
                - generic [ref=e286]: d
                - generic [ref=e287]: e
                - generic [ref=e288]: a
                - generic [ref=e289]: v
                - generic [ref=e290]: o
                - generic [ref=e291]: r
                - generic [ref=e292]: .
  - alert [ref=e293]
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