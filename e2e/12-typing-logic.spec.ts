import {test,expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.route('**/api/session', route => route.fulfill({status:503,json:{ok:false}}));
  await page.route('**/api/submit-score', route => route.fulfill({status:503,json:{ok:false}}));
  await page.route('**/api/session/progress', route => route.fulfill({status:200,json:{ok:true}}));
});

test('benchmark typing advances on errors and supports correction without erasing accuracy', async ({page}) => {
  await page.goto('/settings');
  await page.getByRole('switch',{name:'Stop on errors'}).click();
  await page.goto('/practice?mode=free');
  await page.locator('[data-typing-shim]').focus();
  const first=await page.locator('[aria-current="location"]').innerText();
  await page.keyboard.type(first === 'x' ? 'z' : 'x');
  await expect(page.locator('.char-error')).toHaveCount(1);
  await page.keyboard.press('Backspace');
  await page.keyboard.type(first.replace(/\u00a0/g,' '));
  await expect(page.locator('.char-error')).toHaveCount(0);
  await expect(page.locator('.char-correct')).toHaveCount(1);
  await expect(page.getByTestId('accuracy')).toHaveText('50%');
});

test('adaptive practice uses only unlocked letters and requires error correction', async ({page}) => {
  await page.goto('/practice/smart');
  await expect(page.getByLabel('Adaptive letter progression')).toBeVisible();
  await expect(page.getByText(/6 of 26 letters unlocked/)).toBeVisible();
  const text=await page.getByLabel('Text to type').textContent();
  expect(text).toMatch(/^[enitrl\s]+$/);
  await page.locator('[data-typing-shim]').focus();
  const first=await page.locator('[aria-current="location"]').innerText();
  await page.keyboard.type('x');
  await expect(page.locator('[aria-current="location"]')).toHaveText(first);
  await page.keyboard.type(first.replace(/\u00a0/g,' '));
  await expect(page.locator('.char-error')).toHaveCount(0);
  await expect(page.locator('.char-correct')).toHaveCount(1);
});

test('Escape closes search without restarting an active test, then restarts with clean metrics', async ({page}) => {
  await page.goto('/practice?mode=free');
  await page.locator('[data-typing-shim]').focus();
  const first=await page.locator('[aria-current="location"]').innerText();
  await page.keyboard.type(first.replace(/\u00a0/g,' '));
  await page.getByRole('button',{name:'Search lessons and pages'}).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.char-correct')).toHaveCount(1);
  await page.locator('[data-typing-shim]').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('.char-correct')).toHaveCount(0);
  await expect(page.getByTestId('wpm')).toHaveText('0');
  await expect(page.getByTestId('accuracy')).toHaveText('100%');
});



test('sudden death stops after three mistakes and saves exactly one session', async ({page}) => {
  await page.goto('/practice?mode=sudden-death');
  await page.locator('[data-typing-shim]').focus();
  for(let i=0;i<3;i++) {
    const char=await page.locator('[aria-current="location"]').innerText();
    await page.keyboard.type(char === 'x' ? 'z' : 'x');
  }
  await expect(page.getByRole('button',{name:'Try Again'})).toBeVisible();
  const progress=await page.evaluate(() => JSON.parse(localStorage.getItem('typing-progress')!).state.progress);
  expect(progress.records).toHaveLength(1);
  expect(progress.records[0].errors).toBe(3);
  expect(progress.records[0].accuracy).toBe(0);
  expect(progress.totalKeystrokes).toBe(3);
  await page.keyboard.type('hello');
  const after=await page.evaluate(() => JSON.parse(localStorage.getItem('typing-progress')!).state.progress);
  expect(after.records).toHaveLength(1);
  expect(after.totalKeystrokes).toBe(3);
});

test('a timed benchmark waits for the deadline and stores its exact duration', async ({page}) => {
  await page.clock.install();
  await page.goto('/practice?mode=speed-test');
  await page.locator('[data-typing-shim]').focus();
  for(let i=0;i<5;i++) {
    const char=await page.locator('[aria-current="location"]').innerText();
    await page.keyboard.type(char.replace(/\u00a0/g,' '));
  }
  await page.clock.fastForward(61_000);
  await expect(page.getByRole('button',{name:'Try Again'})).toBeVisible();
  const progress=await page.evaluate(() => JSON.parse(localStorage.getItem('typing-progress')!).state.progress);
  expect(progress.records).toHaveLength(1);
  expect(progress.records[0].duration).toBe(60);
  expect(progress.totalPracticeTime).toBe(60);
});


test('a lesson below its accuracy target requires retry and saves the attempt', async ({page}) => {
  await page.goto('/lessons/home-1-fj');
  await page.locator('[data-typing-shim]').focus();
  const text=(await page.getByLabel('Text to type').textContent())!;
  await page.keyboard.type('xxxxxxxxxxxxxxxxxxxx');
  for(let i=0;i<text.length;i++) await page.keyboard.type(text[i].replace(/\u00a0/g,' '), {delay:[70,100,150,90][i%4]});
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByRole('heading',{name:'Keep practicing'})).toBeVisible();
  await expect(dialog.getByRole('button',{name:'Next exercise'})).toBeDisabled();
  const progress=await page.evaluate(() => JSON.parse(localStorage.getItem('typing-progress')!).state.progress);
  expect(progress.records).toHaveLength(1);
  expect(progress.completedLessons).not.toContain('home-1-fj');
  await dialog.getByRole('button',{name:/Retry|Try Again|Restart/}).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.char-correct')).toHaveCount(0);
});


test('mistakes are visible and block progress by default in both themes', async ({page}) => {
  await page.goto('/practice?mode=free');
  for (const dark of [false,true]) {
    if (dark) await page.getByRole('button',{name:'Switch to dark mode'}).click();
    await page.locator('[data-typing-shim]').focus();
    const first=await page.locator('[aria-current="location"]').innerText();
    const wrong=first === 'x' ? 'z' : 'x';
    await page.keyboard.type(wrong+wrong);
    await expect(page.locator('[aria-current="location"]')).toHaveText(first);
    await expect(page.locator('.char-error.char-active')).toHaveCount(1);
    await expect(page.locator('.typing-error-message')).toContainText('Wrong key. Press');
    await expect(page.locator('.char-error.char-active')).toHaveCSS('text-decoration-line','underline');
    await page.keyboard.type(first.replace(/\u00a0/g,' '));
    await expect(page.locator('.char-error')).toHaveCount(0);
    await expect(page.locator('.typing-error-message')).toHaveCount(0);
  }
});



test('in-session control enables blocking even when a saved preference is off', async ({page}) => {
  await page.goto('/settings');
  await page.getByRole('switch',{name:'Stop on errors'}).click();
  await page.goto('/practice?mode=free');
  await page.getByRole('button',{name:'Enable stop on errors'}).click();
  await expect(page.getByText('Mistakes block typing until corrected')).toBeVisible();
  await page.locator('[data-typing-shim]').focus();
  const first=await page.locator('[aria-current="location"]').innerText();
  await page.keyboard.type(first === 'x' ? 'zz' : 'xx');
  await expect(page.locator('[aria-current="location"]')).toHaveText(first);
  await expect(page.locator('.typing-error-message')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Mistakes block typing until corrected')).toBeVisible();
});
