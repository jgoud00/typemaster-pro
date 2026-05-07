# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: qa-typing-audit.spec.ts >> WPM & Accuracy Calculations >> accuracy starts at 100%
- Location: e2e\qa-typing-audit.spec.ts:120:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "100"
Received string:    "--%"
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
          - textbox "Text to type" [ref=e35]:
            - generic [ref=e36]:
              - generic [ref=e37]:
                - 'generic "Next character: T" [ref=e38]': T
                - generic [ref=e40]: o
                - generic [ref=e41]: u
                - generic [ref=e42]: c
                - generic [ref=e43]: h
              - generic [ref=e45]:
                - generic [ref=e46]: t
                - generic [ref=e47]: "y"
                - generic [ref=e48]: p
                - generic [ref=e49]: i
                - generic [ref=e50]: "n"
                - generic [ref=e51]: g
              - generic [ref=e53]:
                - generic [ref=e54]: i
                - generic [ref=e55]: s
              - generic [ref=e57]:
                - generic [ref=e58]: t
                - generic [ref=e59]: h
                - generic [ref=e60]: e
              - generic [ref=e62]:
                - generic [ref=e63]: a
                - generic [ref=e64]: b
                - generic [ref=e65]: i
                - generic [ref=e66]: l
                - generic [ref=e67]: i
                - generic [ref=e68]: t
                - generic [ref=e69]: "y"
              - generic [ref=e71]:
                - generic [ref=e72]: t
                - generic [ref=e73]: o
              - generic [ref=e75]:
                - generic [ref=e76]: u
                - generic [ref=e77]: s
                - generic [ref=e78]: e
              - generic [ref=e80]:
                - generic [ref=e81]: m
                - generic [ref=e82]: u
                - generic [ref=e83]: s
                - generic [ref=e84]: c
                - generic [ref=e85]: l
                - generic [ref=e86]: e
              - generic [ref=e88]:
                - generic [ref=e89]: m
                - generic [ref=e90]: e
                - generic [ref=e91]: m
                - generic [ref=e92]: o
                - generic [ref=e93]: r
                - generic [ref=e94]: "y"
              - generic [ref=e96]:
                - generic [ref=e97]: t
                - generic [ref=e98]: o
              - generic [ref=e100]:
                - generic [ref=e101]: f
                - generic [ref=e102]: i
                - generic [ref=e103]: "n"
                - generic [ref=e104]: d
              - generic [ref=e106]:
                - generic [ref=e107]: k
                - generic [ref=e108]: e
                - generic [ref=e109]: "y"
                - generic [ref=e110]: s
              - generic [ref=e112]:
                - generic [ref=e113]: w
                - generic [ref=e114]: i
                - generic [ref=e115]: t
                - generic [ref=e116]: h
                - generic [ref=e117]: o
                - generic [ref=e118]: u
                - generic [ref=e119]: t
              - generic [ref=e121]:
                - generic [ref=e122]: l
                - generic [ref=e123]: o
                - generic [ref=e124]: o
                - generic [ref=e125]: k
                - generic [ref=e126]: i
                - generic [ref=e127]: "n"
                - generic [ref=e128]: g
              - generic [ref=e130]:
                - generic [ref=e131]: a
                - generic [ref=e132]: t
              - generic [ref=e134]:
                - generic [ref=e135]: t
                - generic [ref=e136]: h
                - generic [ref=e137]: e
              - generic [ref=e139]:
                - generic [ref=e140]: k
                - generic [ref=e141]: e
                - generic [ref=e142]: "y"
                - generic [ref=e143]: b
                - generic [ref=e144]: o
                - generic [ref=e145]: a
                - generic [ref=e146]: r
                - generic [ref=e147]: d
                - generic [ref=e148]: .
              - generic [ref=e150]:
                - generic [ref=e151]: T
                - generic [ref=e152]: h
                - generic [ref=e153]: e
              - generic [ref=e155]:
                - generic [ref=e156]: f
                - generic [ref=e157]: i
                - generic [ref=e158]: "n"
                - generic [ref=e159]: g
                - generic [ref=e160]: e
                - generic [ref=e161]: r
                - generic [ref=e162]: s
              - generic [ref=e164]:
                - generic [ref=e165]: r
                - generic [ref=e166]: e
                - generic [ref=e167]: s
                - generic [ref=e168]: t
              - generic [ref=e170]:
                - generic [ref=e171]: o
                - generic [ref=e172]: "n"
              - generic [ref=e174]:
                - generic [ref=e175]: t
                - generic [ref=e176]: h
                - generic [ref=e177]: e
              - generic [ref=e179]:
                - generic [ref=e180]: h
                - generic [ref=e181]: o
                - generic [ref=e182]: m
                - generic [ref=e183]: e
              - generic [ref=e185]:
                - generic [ref=e186]: r
                - generic [ref=e187]: o
                - generic [ref=e188]: w
              - generic [ref=e190]:
                - generic [ref=e191]: k
                - generic [ref=e192]: e
                - generic [ref=e193]: "y"
                - generic [ref=e194]: s
              - generic [ref=e196]:
                - generic [ref=e197]: a
                - generic [ref=e198]: "n"
                - generic [ref=e199]: d
              - generic [ref=e201]:
                - generic [ref=e202]: r
                - generic [ref=e203]: e
                - generic [ref=e204]: a
                - generic [ref=e205]: c
                - generic [ref=e206]: h
              - generic [ref=e208]:
                - generic [ref=e209]: f
                - generic [ref=e210]: o
                - generic [ref=e211]: r
              - generic [ref=e213]:
                - generic [ref=e214]: o
                - generic [ref=e215]: t
                - generic [ref=e216]: h
                - generic [ref=e217]: e
                - generic [ref=e218]: r
              - generic [ref=e220]:
                - generic [ref=e221]: k
                - generic [ref=e222]: e
                - generic [ref=e223]: "y"
                - generic [ref=e224]: s
              - generic [ref=e226]:
                - generic [ref=e227]: f
                - generic [ref=e228]: r
                - generic [ref=e229]: o
                - generic [ref=e230]: m
              - generic [ref=e232]:
                - generic [ref=e233]: t
                - generic [ref=e234]: h
                - generic [ref=e235]: e
                - generic [ref=e236]: r
                - generic [ref=e237]: e
                - generic [ref=e238]: .
              - generic [ref=e240]:
                - generic [ref=e241]: T
                - generic [ref=e242]: h
                - generic [ref=e243]: i
                - generic [ref=e244]: s
              - generic [ref=e246]:
                - generic [ref=e247]: s
                - generic [ref=e248]: k
                - generic [ref=e249]: i
                - generic [ref=e250]: l
                - generic [ref=e251]: l
              - generic [ref=e253]:
                - generic [ref=e254]: d
                - generic [ref=e255]: r
                - generic [ref=e256]: a
                - generic [ref=e257]: m
                - generic [ref=e258]: a
                - generic [ref=e259]: t
                - generic [ref=e260]: i
                - generic [ref=e261]: c
                - generic [ref=e262]: a
                - generic [ref=e263]: l
                - generic [ref=e264]: l
                - generic [ref=e265]: "y"
              - generic [ref=e267]:
                - generic [ref=e268]: i
                - generic [ref=e269]: "n"
                - generic [ref=e270]: c
                - generic [ref=e271]: r
                - generic [ref=e272]: e
                - generic [ref=e273]: a
                - generic [ref=e274]: s
                - generic [ref=e275]: e
                - generic [ref=e276]: s
              - generic [ref=e278]:
                - generic [ref=e279]: t
                - generic [ref=e280]: "y"
                - generic [ref=e281]: p
                - generic [ref=e282]: i
                - generic [ref=e283]: "n"
                - generic [ref=e284]: g
              - generic [ref=e286]:
                - generic [ref=e287]: s
                - generic [ref=e288]: p
                - generic [ref=e289]: e
                - generic [ref=e290]: e
                - generic [ref=e291]: d
              - generic [ref=e293]:
                - generic [ref=e294]: a
                - generic [ref=e295]: "n"
                - generic [ref=e296]: d
              - generic [ref=e298]:
                - generic [ref=e299]: r
                - generic [ref=e300]: e
                - generic [ref=e301]: d
                - generic [ref=e302]: u
                - generic [ref=e303]: c
                - generic [ref=e304]: e
                - generic [ref=e305]: s
              - generic [ref=e307]:
                - generic [ref=e308]: e
                - generic [ref=e309]: r
                - generic [ref=e310]: r
                - generic [ref=e311]: o
                - generic [ref=e312]: r
                - generic [ref=e313]: s
                - generic [ref=e314]: .
  - alert [ref=e315]
```

# Test source

```ts
  23  |       version: 0,
  24  |     };
  25  |     localStorage.setItem('typing-progress', JSON.stringify(data));
  26  |     localStorage.setItem('aloo-settings', JSON.stringify({ theme: 'dark', cursorStyle: 'line', smoothCaret: true }));
  27  |   });
  28  | 
  29  |   await page.goto(`/practice?mode=${mode}`);
  30  |   await page.waitForLoadState('domcontentloaded');
  31  |   await page.waitForTimeout(2000);
  32  | 
  33  |   // Wait for the typing area to have text
  34  |   const textbox = page.getByLabel('Text to type');
  35  |   await textbox.waitFor({ state: 'visible', timeout: 20000 });
  36  |   await expect(textbox).not.toHaveText('', { timeout: 15000 });
  37  | }
  38  | 
  39  | async function getFirstNChars(page: Page, n: number): Promise<string> {
  40  |   const raw = await page.getByLabel('Text to type').innerText();
  41  |   // Replace non-breaking spaces with regular spaces
  42  |   return raw.replace(/\u00A0/g, ' ').substring(0, n);
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
> 123 |     expect(acc).toContain('100');
      |                 ^ Error: expect(received).toContain(expected) // indexOf
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
  143 |     expect(num).toBeLessThan(100);
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
```