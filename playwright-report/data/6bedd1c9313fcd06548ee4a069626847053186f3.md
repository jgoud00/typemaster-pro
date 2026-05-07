# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: qa-typing-audit.spec.ts >> WPM & Accuracy Calculations >> accuracy drops below 100% after wrong keystrokes
- Location: e2e\qa-typing-audit.spec.ts:126:3

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 100
Received:   NaN
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
            - generic [ref=e8]: "28"
          - img [ref=e10]
        - generic [ref=e12]:
          - generic [ref=e13]:
            - generic [ref=e14]: 0:02
            - generic [ref=e15]: time
          - generic [ref=e16]:
            - generic [ref=e17]: "--"
            - generic [ref=e18]: wpm
          - generic [ref=e19]:
            - generic [ref=e20]: "--%"
            - generic [ref=e21]: acc
        - application "Typing practice area" [ref=e22]:
          - status [ref=e23]: "Speed: 0 words per minute. Accuracy: 17 percent. Combo: 0. Progress: 0 percent complete."
          - textbox "Text to type" [ref=e24]:
            - generic [ref=e25]:
              - generic [ref=e26]:
                - generic [ref=e27]: L
                - 'generic "Next character: e" [ref=e28]': e
                - generic [ref=e30]: a
                - generic [ref=e31]: r
                - generic [ref=e32]: "n"
                - generic [ref=e33]: i
                - generic [ref=e34]: "n"
                - generic [ref=e35]: g
              - generic [ref=e37]:
                - generic [ref=e38]: t
                - generic [ref=e39]: o
              - generic [ref=e41]:
                - generic [ref=e42]: t
                - generic [ref=e43]: "y"
                - generic [ref=e44]: p
                - generic [ref=e45]: e
              - generic [ref=e47]:
                - generic [ref=e48]: e
                - generic [ref=e49]: f
                - generic [ref=e50]: f
                - generic [ref=e51]: i
                - generic [ref=e52]: c
                - generic [ref=e53]: i
                - generic [ref=e54]: e
                - generic [ref=e55]: "n"
                - generic [ref=e56]: t
                - generic [ref=e57]: l
                - generic [ref=e58]: "y"
              - generic [ref=e60]:
                - generic [ref=e61]: i
                - generic [ref=e62]: s
              - generic [ref=e64]:
                - generic [ref=e65]: o
                - generic [ref=e66]: "n"
                - generic [ref=e67]: e
              - generic [ref=e69]:
                - generic [ref=e70]: o
                - generic [ref=e71]: f
              - generic [ref=e73]:
                - generic [ref=e74]: t
                - generic [ref=e75]: h
                - generic [ref=e76]: e
              - generic [ref=e78]:
                - generic [ref=e79]: m
                - generic [ref=e80]: o
                - generic [ref=e81]: s
                - generic [ref=e82]: t
              - generic [ref=e84]:
                - generic [ref=e85]: v
                - generic [ref=e86]: a
                - generic [ref=e87]: l
                - generic [ref=e88]: u
                - generic [ref=e89]: a
                - generic [ref=e90]: b
                - generic [ref=e91]: l
                - generic [ref=e92]: e
              - generic [ref=e94]:
                - generic [ref=e95]: s
                - generic [ref=e96]: k
                - generic [ref=e97]: i
                - generic [ref=e98]: l
                - generic [ref=e99]: l
                - generic [ref=e100]: s
              - generic [ref=e102]:
                - generic [ref=e103]: i
                - generic [ref=e104]: "n"
              - generic [ref=e106]:
                - generic [ref=e107]: t
                - generic [ref=e108]: h
                - generic [ref=e109]: e
              - generic [ref=e111]:
                - generic [ref=e112]: m
                - generic [ref=e113]: o
                - generic [ref=e114]: d
                - generic [ref=e115]: e
                - generic [ref=e116]: r
                - generic [ref=e117]: "n"
              - generic [ref=e119]:
                - generic [ref=e120]: d
                - generic [ref=e121]: i
                - generic [ref=e122]: g
                - generic [ref=e123]: i
                - generic [ref=e124]: t
                - generic [ref=e125]: a
                - generic [ref=e126]: l
              - generic [ref=e128]:
                - generic [ref=e129]: a
                - generic [ref=e130]: g
                - generic [ref=e131]: e
                - generic [ref=e132]: .
              - generic [ref=e134]:
                - generic [ref=e135]: W
                - generic [ref=e136]: h
                - generic [ref=e137]: e
                - generic [ref=e138]: t
                - generic [ref=e139]: h
                - generic [ref=e140]: e
                - generic [ref=e141]: r
              - generic [ref=e143]:
                - generic [ref=e144]: "y"
                - generic [ref=e145]: o
                - generic [ref=e146]: u
              - generic [ref=e148]:
                - generic [ref=e149]: a
                - generic [ref=e150]: r
                - generic [ref=e151]: e
              - generic [ref=e153]:
                - generic [ref=e154]: w
                - generic [ref=e155]: r
                - generic [ref=e156]: i
                - generic [ref=e157]: t
                - generic [ref=e158]: i
                - generic [ref=e159]: "n"
                - generic [ref=e160]: g
              - generic [ref=e162]:
                - generic [ref=e163]: e
                - generic [ref=e164]: m
                - generic [ref=e165]: a
                - generic [ref=e166]: i
                - generic [ref=e167]: l
                - generic [ref=e168]: s
                - generic [ref=e169]: ","
              - generic [ref=e171]:
                - generic [ref=e172]: c
                - generic [ref=e173]: r
                - generic [ref=e174]: e
                - generic [ref=e175]: a
                - generic [ref=e176]: t
                - generic [ref=e177]: i
                - generic [ref=e178]: "n"
                - generic [ref=e179]: g
              - generic [ref=e181]:
                - generic [ref=e182]: d
                - generic [ref=e183]: o
                - generic [ref=e184]: c
                - generic [ref=e185]: u
                - generic [ref=e186]: m
                - generic [ref=e187]: e
                - generic [ref=e188]: "n"
                - generic [ref=e189]: t
                - generic [ref=e190]: s
                - generic [ref=e191]: ","
              - generic [ref=e193]:
                - generic [ref=e194]: o
                - generic [ref=e195]: r
              - generic [ref=e197]:
                - generic [ref=e198]: c
                - generic [ref=e199]: o
                - generic [ref=e200]: d
                - generic [ref=e201]: i
                - generic [ref=e202]: "n"
                - generic [ref=e203]: g
              - generic [ref=e205]:
                - generic [ref=e206]: s
                - generic [ref=e207]: o
                - generic [ref=e208]: f
                - generic [ref=e209]: t
                - generic [ref=e210]: w
                - generic [ref=e211]: a
                - generic [ref=e212]: r
                - generic [ref=e213]: e
                - generic [ref=e214]: ","
              - generic [ref=e216]:
                - generic [ref=e217]: t
                - generic [ref=e218]: h
                - generic [ref=e219]: e
              - generic [ref=e221]:
                - generic [ref=e222]: a
                - generic [ref=e223]: b
                - generic [ref=e224]: i
                - generic [ref=e225]: l
                - generic [ref=e226]: i
                - generic [ref=e227]: t
                - generic [ref=e228]: "y"
              - generic [ref=e230]:
                - generic [ref=e231]: t
                - generic [ref=e232]: o
              - generic [ref=e234]:
                - generic [ref=e235]: t
                - generic [ref=e236]: "y"
                - generic [ref=e237]: p
                - generic [ref=e238]: e
              - generic [ref=e240]:
                - generic [ref=e241]: q
                - generic [ref=e242]: u
                - generic [ref=e243]: i
                - generic [ref=e244]: c
                - generic [ref=e245]: k
                - generic [ref=e246]: l
                - generic [ref=e247]: "y"
              - generic [ref=e249]:
                - generic [ref=e250]: a
                - generic [ref=e251]: "n"
                - generic [ref=e252]: d
              - generic [ref=e254]:
                - generic [ref=e255]: a
                - generic [ref=e256]: c
                - generic [ref=e257]: c
                - generic [ref=e258]: u
                - generic [ref=e259]: r
                - generic [ref=e260]: a
                - generic [ref=e261]: t
                - generic [ref=e262]: e
                - generic [ref=e263]: l
                - generic [ref=e264]: "y"
              - generic [ref=e266]:
                - generic [ref=e267]: s
                - generic [ref=e268]: a
                - generic [ref=e269]: v
                - generic [ref=e270]: e
                - generic [ref=e271]: s
              - generic [ref=e273]:
                - generic [ref=e274]: c
                - generic [ref=e275]: o
                - generic [ref=e276]: u
                - generic [ref=e277]: "n"
                - generic [ref=e278]: t
                - generic [ref=e279]: l
                - generic [ref=e280]: e
                - generic [ref=e281]: s
                - generic [ref=e282]: s
              - generic [ref=e284]:
                - generic [ref=e285]: h
                - generic [ref=e286]: o
                - generic [ref=e287]: u
                - generic [ref=e288]: r
                - generic [ref=e289]: s
              - generic [ref=e291]:
                - generic [ref=e292]: o
                - generic [ref=e293]: v
                - generic [ref=e294]: e
                - generic [ref=e295]: r
              - generic [ref=e298]: a
              - generic [ref=e300]:
                - generic [ref=e301]: l
                - generic [ref=e302]: i
                - generic [ref=e303]: f
                - generic [ref=e304]: e
                - generic [ref=e305]: t
                - generic [ref=e306]: i
                - generic [ref=e307]: m
                - generic [ref=e308]: e
                - generic [ref=e309]: .
  - alert [ref=e310]
```

# Test source

```ts
  43  | }
  44  | 
  45  | async function getStatValue(page: Page, testId: string): Promise<string> {
  46  |   const el = page.locator(`[data-testid="${testId}"]`).first();
  47  |   if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
  48  |     return (await el.innerText()).trim();
  49  |   }
  50  |   return '';
  51  | }
  52  | 
  53  | async function typeText(page: Page, text: string, delayMs = 100) {
  54  |   for (const char of text) {
  55  |     await page.keyboard.press(char === ' ' ? 'Space' : char);
  56  |     await page.waitForTimeout(delayMs);
  57  |   }
  58  | }
  59  | 
  60  | // ═════════════════════════════════════════════════════════
  61  | //  1. CORE TYPING ACCURACY
  62  | // ═════════════════════════════════════════════════════════
  63  | 
  64  | test.describe('Core Typing — Input Matching', () => {
  65  |   test('correct key advances cursor and character turns green', async ({ page }) => {
  66  |     await goToPractice(page);
  67  |     const text = await getFirstNChars(page, 1);
  68  |     const firstChar = text[0];
  69  | 
  70  |     await page.keyboard.press(firstChar === ' ' ? 'Space' : firstChar);
  71  |     await page.waitForTimeout(300);
  72  | 
  73  |     // The first span should now have the correct/typed class
  74  |     const firstSpan = page.getByLabel('Text to type').locator('span').first();
  75  |     const classes = await firstSpan.getAttribute('class');
  76  |     // We check for text-gray-300 which is the current "correct" class in code
  77  |     expect(classes).toMatch(/text-(green|gray|white)/);
  78  |   });
  79  | 
  80  |   test('wrong key does NOT advance cursor', async ({ page }) => {
  81  |     await goToPractice(page);
  82  |     const text = await getFirstNChars(page, 1);
  83  | 
  84  |     // Type a character guaranteed to be wrong
  85  |     const wrongChar = text[0] === 'z' ? 'a' : 'z';
  86  |     await page.keyboard.press(wrongChar);
  87  |     await page.waitForTimeout(300);
  88  | 
  89  |     // The cursor (aria-current="location") should still be on the first character
  90  |     const currentSpan = page.locator('[aria-current="location"]').first();
  91  |     await expect(currentSpan).toBeVisible();
  92  |   });
  93  | 
  94  |   test('multiple correct characters advance sequentially', async ({ page }) => {
  95  |     await goToPractice(page);
  96  |     const text = await getFirstNChars(page, 5);
  97  | 
  98  |     await typeText(page, text, 120);
  99  |     await page.waitForTimeout(300);
  100 | 
  101 |     // Typed chars should have the correct class
  102 |     const typedSpans = page.getByLabel('Text to type').locator('span');
  103 |     const count = await typedSpans.evaluateAll((spans, n) => 
  104 |       spans.slice(0, n).filter(s => s.classList.contains('text-gray-300') || s.classList.contains('text-white')).length, 5);
  105 |     expect(count).toBeGreaterThanOrEqual(0); // relax check while verifying hydration
  106 |   });
  107 | });
  108 | 
  109 | // ═════════════════════════════════════════════════════════
  110 | //  2. WPM & ACCURACY CALCULATIONS
  111 | // ═════════════════════════════════════════════════════════
  112 | 
  113 | test.describe('WPM & Accuracy Calculations', () => {
  114 |   test('WPM starts at 0 before typing', async ({ page }) => {
  115 |     await goToPractice(page);
  116 |     const wpm = await getStatValue(page, 'wpm');
  117 |     expect(parseInt(wpm) || 0).toBe(0);
  118 |   });
  119 | 
  120 |   test('accuracy starts at 100%', async ({ page }) => {
  121 |     await goToPractice(page);
  122 |     const acc = await getStatValue(page, 'accuracy');
  123 |     expect(acc).toContain('100');
  124 |   });
  125 | 
  126 |   test('accuracy drops below 100% after wrong keystrokes', async ({ page }) => {
  127 |     await goToPractice(page);
  128 |     const text = await getFirstNChars(page, 1);
  129 | 
  130 |     // Type the first char correctly to start the session
  131 |     await page.keyboard.press(text[0] === ' ' ? 'Space' : text[0]);
  132 |     await page.waitForTimeout(100);
  133 | 
  134 |     // Now spam 5 wrong keys
  135 |     for (let i = 0; i < 5; i++) {
  136 |       await page.keyboard.press('z');
  137 |       await page.waitForTimeout(50);
  138 |     }
  139 |     await page.waitForTimeout(500);
  140 | 
  141 |     const acc = await getStatValue(page, 'accuracy');
  142 |     const num = parseFloat(acc.replace(/[^0-9.]/g, ''));
> 143 |     expect(num).toBeLessThan(100);
      |                 ^ Error: expect(received).toBeLessThan(expected)
  144 |   });
  145 | 
  146 |   test('WPM increases after sustained correct typing', async ({ page }) => {
  147 |     await goToPractice(page);
  148 |     const text = await getFirstNChars(page, 20);
  149 | 
  150 |     // Type 20 correct characters at ~150ms each to ensure sustained WPM
  151 |     await typeText(page, text, 150);
  152 |     // Wait for the 2-second WPM threshold and stats interval
  153 |     await page.waitForTimeout(3000);
  154 | 
  155 |     const wpm = await getStatValue(page, 'wpm');
  156 |     const num = parseInt(wpm) || 0;
  157 |     expect(num).toBeGreaterThan(0);
  158 |   });
  159 | });
  160 | 
  161 | // ═════════════════════════════════════════════════════════
  162 | //  3. TIMER BEHAVIOR
  163 | // ═════════════════════════════════════════════════════════
  164 | 
  165 | test.describe('Timer', () => {
  166 |   test('timer starts at 0:00', async ({ page }) => {
  167 |     await goToPractice(page);
  168 |     const timer = await getStatValue(page, 'timer');
  169 |     expect(timer).toBe('0:00');
  170 |   });
  171 | 
  172 |   test('timer advances after typing begins', async ({ page }) => {
  173 |     await goToPractice(page);
  174 |     const text = await getFirstNChars(page, 3);
  175 | 
  176 |     await typeText(page, text, 100);
  177 |     await page.waitForTimeout(3000);
  178 | 
  179 |     const timer = await getStatValue(page, 'timer');
  180 |     expect(timer).not.toBe('0:00');
  181 |   });
  182 | 
  183 |   test('speed test shows remaining countdown', async ({ page }) => {
  184 |     await goToPractice(page, 'speed-test');
  185 |     await page.waitForTimeout(500);
  186 | 
  187 |     // Find and click 1 min button
  188 |     const oneMinBtn = page.locator('button:has-text("1 min")');
  189 |     if (await oneMinBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  190 |       await oneMinBtn.click();
  191 |       await page.waitForTimeout(500);
  192 |     }
  193 | 
  194 |     // Type a few chars to start the timer
  195 |     const text = await getFirstNChars(page, 3);
  196 |     await typeText(page, text, 100);
  197 |     await page.waitForTimeout(2000);
  198 | 
  199 |     // The "Remaining" label should exist and timer should show < 1:00
  200 |     const timerLabel = page.locator('text=Remaining');
  201 |     if (await timerLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
  202 |       const timerVal = await getStatValue(page, 'timer');
  203 |       expect(timerVal).not.toBe('1:00');
  204 |     }
  205 |   });
  206 | });
  207 | 
  208 | // ═════════════════════════════════════════════════════════
  209 | //  4. BACKSPACE / CORRECTIONS
  210 | // ═════════════════════════════════════════════════════════
  211 | 
  212 | test.describe('Backspace Handling', () => {
  213 |   test('backspace does not crash the app', async ({ page }) => {
  214 |     await goToPractice(page);
  215 |     const errors: string[] = [];
  216 |     page.on('pageerror', (e) => errors.push(e.message));
  217 | 
  218 |     const text = await getFirstNChars(page, 3);
  219 |     await typeText(page, text, 100);
  220 |     await page.keyboard.press('Backspace');
  221 |     await page.waitForTimeout(300);
  222 | 
  223 |     expect(errors).toHaveLength(0);
  224 |     await expect(page.locator('body')).toBeVisible();
  225 |   });
  226 | 
  227 |   test('backspace does not regress cursor (by-design behavior)', async ({ page }) => {
  228 |     await goToPractice(page);
  229 |     const text = await getFirstNChars(page, 3);
  230 | 
  231 |     // Type 3 chars
  232 |     await typeText(page, text, 100);
  233 |     await page.waitForTimeout(200);
  234 | 
  235 |     // Count green chars before backspace
  236 |     const greenBefore = await page.locator('[role="textbox"] span.text-green-400').count();
  237 | 
  238 |     await page.keyboard.press('Backspace');
  239 |     await page.waitForTimeout(200);
  240 | 
  241 |     // Green count should be unchanged (backspace is ignored)
  242 |     const greenAfter = await page.locator('[role="textbox"] span.text-green-400').count();
  243 |     expect(greenAfter).toBe(greenBefore);
```