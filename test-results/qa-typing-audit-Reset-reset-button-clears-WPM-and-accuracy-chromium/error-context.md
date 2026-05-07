# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: qa-typing-audit.spec.ts >> Reset >> reset button clears WPM and accuracy
- Location: e2e\qa-typing-audit.spec.ts:376:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button').filter({ has: locator('.lucide-rotate-ccw') }).first()
    - locator resolved to <button data-size="icon" data-slot="button" data-variant="ghost" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-de…>…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="min-h-screen bg-linear-to-b from-background to-muted/30">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="min-h-screen bg-linear-to-b from-background to-muted/30">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    41 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="min-h-screen bg-linear-to-b from-background to-muted/30">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms

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
            - generic [ref=e8]: "52"
          - img [ref=e10]
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: 0:26
            - generic [ref=e17]: time
          - generic [ref=e18]:
            - generic [ref=e19]: "5"
            - generic [ref=e20]: wpm
          - generic [ref=e21]:
            - generic [ref=e22]: 100%
            - generic [ref=e23]: acc
        - application "Typing practice area" [ref=e24]:
          - status [ref=e25]: "Speed: 108 words per minute. Accuracy: 100 percent. Combo: 10. Progress: 4 percent complete."
          - textbox "Text to type" [ref=e26]:
            - generic [ref=e27]:
              - generic [ref=e28]:
                - generic [ref=e29]: A
                - generic [ref=e30]: r
                - generic [ref=e31]: t
                - generic [ref=e32]: i
                - generic [ref=e33]: f
                - generic [ref=e34]: i
                - generic [ref=e35]: c
                - generic [ref=e36]: i
                - generic [ref=e37]: a
                - generic [ref=e38]: l
                - 'generic "Next character: space" [ref=e39]'
              - generic [ref=e41]:
                - generic [ref=e42]: i
                - generic [ref=e43]: "n"
                - generic [ref=e44]: t
                - generic [ref=e45]: e
                - generic [ref=e46]: l
                - generic [ref=e47]: l
                - generic [ref=e48]: i
                - generic [ref=e49]: g
                - generic [ref=e50]: e
                - generic [ref=e51]: "n"
                - generic [ref=e52]: c
                - generic [ref=e53]: e
              - generic [ref=e55]:
                - generic [ref=e56]: i
                - generic [ref=e57]: s
              - generic [ref=e59]:
                - generic [ref=e60]: t
                - generic [ref=e61]: r
                - generic [ref=e62]: a
                - generic [ref=e63]: "n"
                - generic [ref=e64]: s
                - generic [ref=e65]: f
                - generic [ref=e66]: o
                - generic [ref=e67]: r
                - generic [ref=e68]: m
                - generic [ref=e69]: i
                - generic [ref=e70]: "n"
                - generic [ref=e71]: g
              - generic [ref=e73]:
                - generic [ref=e74]: h
                - generic [ref=e75]: o
                - generic [ref=e76]: w
              - generic [ref=e78]:
                - generic [ref=e79]: w
                - generic [ref=e80]: e
              - generic [ref=e82]:
                - generic [ref=e83]: i
                - generic [ref=e84]: "n"
                - generic [ref=e85]: t
                - generic [ref=e86]: e
                - generic [ref=e87]: r
                - generic [ref=e88]: a
                - generic [ref=e89]: c
                - generic [ref=e90]: t
              - generic [ref=e92]:
                - generic [ref=e93]: w
                - generic [ref=e94]: i
                - generic [ref=e95]: t
                - generic [ref=e96]: h
              - generic [ref=e98]:
                - generic [ref=e99]: t
                - generic [ref=e100]: e
                - generic [ref=e101]: c
                - generic [ref=e102]: h
                - generic [ref=e103]: "n"
                - generic [ref=e104]: o
                - generic [ref=e105]: l
                - generic [ref=e106]: o
                - generic [ref=e107]: g
                - generic [ref=e108]: "y"
                - generic [ref=e109]: .
              - generic [ref=e111]:
                - generic [ref=e112]: M
                - generic [ref=e113]: a
                - generic [ref=e114]: c
                - generic [ref=e115]: h
                - generic [ref=e116]: i
                - generic [ref=e117]: "n"
                - generic [ref=e118]: e
              - generic [ref=e120]:
                - generic [ref=e121]: l
                - generic [ref=e122]: e
                - generic [ref=e123]: a
                - generic [ref=e124]: r
                - generic [ref=e125]: "n"
                - generic [ref=e126]: i
                - generic [ref=e127]: "n"
                - generic [ref=e128]: g
              - generic [ref=e130]:
                - generic [ref=e131]: a
                - generic [ref=e132]: l
                - generic [ref=e133]: g
                - generic [ref=e134]: o
                - generic [ref=e135]: r
                - generic [ref=e136]: i
                - generic [ref=e137]: t
                - generic [ref=e138]: h
                - generic [ref=e139]: m
                - generic [ref=e140]: s
              - generic [ref=e142]:
                - generic [ref=e143]: a
                - generic [ref=e144]: "n"
                - generic [ref=e145]: a
                - generic [ref=e146]: l
                - generic [ref=e147]: "y"
                - generic [ref=e148]: z
                - generic [ref=e149]: e
              - generic [ref=e151]:
                - generic [ref=e152]: v
                - generic [ref=e153]: a
                - generic [ref=e154]: s
                - generic [ref=e155]: t
              - generic [ref=e157]:
                - generic [ref=e158]: a
                - generic [ref=e159]: m
                - generic [ref=e160]: o
                - generic [ref=e161]: u
                - generic [ref=e162]: "n"
                - generic [ref=e163]: t
                - generic [ref=e164]: s
              - generic [ref=e166]:
                - generic [ref=e167]: o
                - generic [ref=e168]: f
              - generic [ref=e170]:
                - generic [ref=e171]: d
                - generic [ref=e172]: a
                - generic [ref=e173]: t
                - generic [ref=e174]: a
              - generic [ref=e176]:
                - generic [ref=e177]: t
                - generic [ref=e178]: o
              - generic [ref=e180]:
                - generic [ref=e181]: f
                - generic [ref=e182]: i
                - generic [ref=e183]: "n"
                - generic [ref=e184]: d
              - generic [ref=e186]:
                - generic [ref=e187]: p
                - generic [ref=e188]: a
                - generic [ref=e189]: t
                - generic [ref=e190]: t
                - generic [ref=e191]: e
                - generic [ref=e192]: r
                - generic [ref=e193]: "n"
                - generic [ref=e194]: s
              - generic [ref=e196]:
                - generic [ref=e197]: a
                - generic [ref=e198]: "n"
                - generic [ref=e199]: d
              - generic [ref=e201]:
                - generic [ref=e202]: m
                - generic [ref=e203]: a
                - generic [ref=e204]: k
                - generic [ref=e205]: e
              - generic [ref=e207]:
                - generic [ref=e208]: p
                - generic [ref=e209]: r
                - generic [ref=e210]: e
                - generic [ref=e211]: d
                - generic [ref=e212]: i
                - generic [ref=e213]: c
                - generic [ref=e214]: t
                - generic [ref=e215]: i
                - generic [ref=e216]: o
                - generic [ref=e217]: "n"
                - generic [ref=e218]: s
                - generic [ref=e219]: .
              - generic [ref=e221]:
                - generic [ref=e222]: T
                - generic [ref=e223]: h
                - generic [ref=e224]: i
                - generic [ref=e225]: s
              - generic [ref=e227]:
                - generic [ref=e228]: t
                - generic [ref=e229]: e
                - generic [ref=e230]: c
                - generic [ref=e231]: h
                - generic [ref=e232]: "n"
                - generic [ref=e233]: o
                - generic [ref=e234]: l
                - generic [ref=e235]: o
                - generic [ref=e236]: g
                - generic [ref=e237]: "y"
              - generic [ref=e239]:
                - generic [ref=e240]: p
                - generic [ref=e241]: o
                - generic [ref=e242]: w
                - generic [ref=e243]: e
                - generic [ref=e244]: r
                - generic [ref=e245]: s
              - generic [ref=e247]:
                - generic [ref=e248]: e
                - generic [ref=e249]: v
                - generic [ref=e250]: e
                - generic [ref=e251]: r
                - generic [ref=e252]: "y"
                - generic [ref=e253]: t
                - generic [ref=e254]: h
                - generic [ref=e255]: i
                - generic [ref=e256]: "n"
                - generic [ref=e257]: g
              - generic [ref=e259]:
                - generic [ref=e260]: f
                - generic [ref=e261]: r
                - generic [ref=e262]: o
                - generic [ref=e263]: m
              - generic [ref=e265]:
                - generic [ref=e266]: p
                - generic [ref=e267]: e
                - generic [ref=e268]: r
                - generic [ref=e269]: s
                - generic [ref=e270]: o
                - generic [ref=e271]: "n"
                - generic [ref=e272]: a
                - generic [ref=e273]: l
                - generic [ref=e274]: i
                - generic [ref=e275]: z
                - generic [ref=e276]: e
                - generic [ref=e277]: d
              - generic [ref=e279]:
                - generic [ref=e280]: r
                - generic [ref=e281]: e
                - generic [ref=e282]: c
                - generic [ref=e283]: o
                - generic [ref=e284]: m
                - generic [ref=e285]: m
                - generic [ref=e286]: e
                - generic [ref=e287]: "n"
                - generic [ref=e288]: d
                - generic [ref=e289]: a
                - generic [ref=e290]: t
                - generic [ref=e291]: i
                - generic [ref=e292]: o
                - generic [ref=e293]: "n"
                - generic [ref=e294]: s
              - generic [ref=e296]:
                - generic [ref=e297]: t
                - generic [ref=e298]: o
              - generic [ref=e300]:
                - generic [ref=e301]: a
                - generic [ref=e302]: u
                - generic [ref=e303]: t
                - generic [ref=e304]: o
                - generic [ref=e305]: "n"
                - generic [ref=e306]: o
                - generic [ref=e307]: m
                - generic [ref=e308]: o
                - generic [ref=e309]: u
                - generic [ref=e310]: s
              - generic [ref=e312]:
                - generic [ref=e313]: v
                - generic [ref=e314]: e
                - generic [ref=e315]: h
                - generic [ref=e316]: i
                - generic [ref=e317]: c
                - generic [ref=e318]: l
                - generic [ref=e319]: e
                - generic [ref=e320]: s
                - generic [ref=e321]: .
  - alert [ref=e322]
```

# Test source

```ts
  285 |     // Click on Custom Text tab
  286 |     const customTab = page.locator('[role="tab"]:has-text("Custom Text")');
  287 |     if (await customTab.isVisible({ timeout: 3000 }).catch(() => false)) {
  288 |       await customTab.click();
  289 |       await page.waitForTimeout(500);
  290 |     }
  291 | 
  292 |     const startBtn = page.locator('button:has-text("Start Practice")');
  293 |     if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  294 |       await expect(startBtn).toBeDisabled();
  295 |     }
  296 |   });
  297 | 
  298 |   test('no unhandled errors during a full typing session', async ({ page }) => {
  299 |     const errors: string[] = [];
  300 |     page.on('pageerror', (e) => errors.push(e.message));
  301 | 
  302 |     await goToPractice(page);
  303 |     const text = await getFirstNChars(page, 20);
  304 |     await typeText(page, text, 80);
  305 |     await page.waitForTimeout(1000);
  306 | 
  307 |     expect(errors).toHaveLength(0);
  308 |   });
  309 | });
  310 | 
  311 | // ═════════════════════════════════════════════════════════
  312 | //  6. COPY-PASTE PREVENTION
  313 | // ═════════════════════════════════════════════════════════
  314 | 
  315 | test.describe('Security — Copy-Paste', () => {
  316 |   test('Ctrl+V does not inject typed characters', async ({ page }) => {
  317 |     await goToPractice(page);
  318 | 
  319 |     // Put text on clipboard
  320 |     await page.evaluate(() => navigator.clipboard.writeText('hello world').catch(() => {}));
  321 | 
  322 |     // Count green chars before paste attempt
  323 |     const greenBefore = await page.locator('[role="textbox"] span.text-green-400').count();
  324 | 
  325 |     // Attempt paste
  326 |     await page.keyboard.press('Control+v');
  327 |     await page.waitForTimeout(500);
  328 | 
  329 |     const greenAfter = await page.locator('[role="textbox"] span.text-green-400').count();
  330 |     // Paste should NOT have advanced the cursor
  331 |     expect(greenAfter).toBe(greenBefore);
  332 |   });
  333 | });
  334 | 
  335 | // ═════════════════════════════════════════════════════════
  336 | //  7. SCORE MANIPULATION VIA LOCALSTORAGE
  337 | // ═════════════════════════════════════════════════════════
  338 | 
  339 | test.describe('Security — localStorage Manipulation', () => {
  340 |   test('personal bests are protected against localStorage tampering (mitigated)', async ({ page }) => {
  341 |     // Seed fake high score
  342 |     await page.addInitScript(() => {
  343 |       const data = {
  344 |         state: {
  345 |           progress: {
  346 |             completedLessons: [], lessonScores: {}, records: [],
  347 |             totalPracticeTime: 100, totalKeystrokes: 500,
  348 |             personalBests: { wpm: 999, accuracy: 100, combo: 999 },
  349 |             unlockedAchievements: [], deviceId: 'hacker', vectorClock: {},
  350 |           },
  351 |           hasSeenWelcome: true,
  352 |         },
  353 |         version: 0,
  354 |       };
  355 |       localStorage.setItem('typing-progress', JSON.stringify(data));
  356 |     });
  357 | 
  358 |     await new AppPage(page).goto("/");
  359 |     await page.waitForLoadState('domcontentloaded');
  360 |     await page.waitForTimeout(2000);
  361 | 
  362 |     // Check if the fake 999 WPM displays on homepage
  363 |     const bodyText = await page.locator('body').innerText();
  364 |     const has999 = bodyText.includes('999');
  365 | 
  366 |     // Anti-cheat should have caught this and clamped it to 250 or reset it
  367 |     expect(has999).toBe(false);
  368 |   });
  369 | });
  370 | 
  371 | // ═════════════════════════════════════════════════════════
  372 | //  8. RESET FUNCTIONALITY
  373 | // ═════════════════════════════════════════════════════════
  374 | 
  375 | test.describe('Reset', () => {
  376 |   test('reset button clears WPM and accuracy', async ({ page }) => {
  377 |     await goToPractice(page);
  378 |     const text = await getFirstNChars(page, 10);
  379 |     await typeText(page, text, 80);
  380 |     await page.waitForTimeout(2500);
  381 | 
  382 |     // Click the reset/restart button (RotateCcw icon button)
  383 |     const resetBtn = page.locator('button').filter({ has: page.locator('.lucide-rotate-ccw') }).first();
  384 |     if (await resetBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
> 385 |       await resetBtn.click();
      |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  386 |       await page.waitForTimeout(500);
  387 | 
  388 |       const wpm = await getStatValue(page, 'wpm');
  389 |       expect(parseInt(wpm) || 0).toBe(0);
  390 |     }
  391 |   });
  392 | });
  393 | 
  394 | // ═════════════════════════════════════════════════════════
  395 | //  9. COMBO & GAMIFICATION
  396 | // ═════════════════════════════════════════════════════════
  397 | 
  398 | test.describe('Combo System', () => {
  399 |   test('combo increments on correct consecutive keys', async ({ page }) => {
  400 |     await goToPractice(page);
  401 |     const text = await getFirstNChars(page, 12);
  402 | 
  403 |     await typeText(page, text, 80);
  404 |     await page.waitForTimeout(500);
  405 | 
  406 |     // Look for combo display — should show at least 10
  407 |     const comboText = await page.locator('text=Combo').first().locator('..').innerText();
  408 |     const comboMatch = comboText.match(/(\d+)/);
  409 |     if (comboMatch) {
  410 |       expect(parseInt(comboMatch[1])).toBeGreaterThanOrEqual(10);
  411 |     }
  412 |   });
  413 | 
  414 |   test('combo resets on wrong key', async ({ page }) => {
  415 |     await goToPractice(page);
  416 |     const text = await getFirstNChars(page, 5);
  417 | 
  418 |     // Build combo
  419 |     await typeText(page, text, 80);
  420 |     await page.waitForTimeout(200);
  421 | 
  422 |     // Break combo with wrong key
  423 |     await page.keyboard.press('z');
  424 |     await page.keyboard.press('z');
  425 |     await page.waitForTimeout(500);
  426 | 
  427 |     // After break, combo counter element should show 0 or reset
  428 |     // We just verify no crash here
  429 |     await expect(page.locator('body')).toBeVisible();
  430 |   });
  431 | });
  432 | 
  433 | // ═════════════════════════════════════════════════════════
  434 | //  10. MOBILE RESPONSIVENESS
  435 | // ═════════════════════════════════════════════════════════
  436 | 
  437 | test.describe('Mobile Viewport', () => {
  438 |   test('typing area renders without horizontal overflow on mobile', async ({ page }) => {
  439 |     await page.setViewportSize({ width: 375, height: 812 });
  440 |     await goToPractice(page);
  441 | 
  442 |     const area = page.locator('[role="application"][aria-label="Typing practice area"]');
  443 |     await expect(area).toBeVisible({ timeout: 10000 });
  444 | 
  445 |     const box = await area.boundingBox();
  446 |     if (box) {
  447 |       // Area should not exceed viewport width
  448 |       expect(box.x + box.width).toBeLessThanOrEqual(375 + 5); // 5px tolerance
  449 |     }
  450 |   });
  451 | });
  452 | 
```