import os
import re
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Replace waitForTimeout(N) where N < 3000
    def repl_timeout(match):
        prefix = match.group(1) # e.g. "await "
        page_ref = match.group(2) # "page" or "this.page"
        timeout_val = int(match.group(3))
        
        if timeout_val < 3000:
            return f"{prefix}expect({page_ref}.locator('body')).toBeVisible({{ timeout: 10000 }})"
        return match.group(0)

    content = re.sub(r'(await\s+)?(page|this\.page)\.waitForTimeout\((\d+)\)', repl_timeout, content)

    # Ensure beforeEach is present if not already
    if 'test.describe' in content and 'test.beforeEach' not in content and 'helpers' not in filepath:
        # Add beforeEach after the first test.describe
        before_each_block = """
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });
"""
        content = re.sub(r'(test\.describe\(.*?,.*?=>\s*\{)', r'\1' + before_each_block, content, count=1)
    
    # If the file imports seedUserProgress but doesn't have beforeEach
    if 'test.beforeEach' not in content and 'import { test' in content and 'helpers' not in filepath:
        before_each_block = """
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});
"""
        # add after imports
        content = re.sub(r'(import.*?;?\n)+', lambda m: m.group(0) + before_each_block, content, count=1)


    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for filepath in glob.glob("e2e/**/*.ts", recursive=True):
    process_file(filepath)
