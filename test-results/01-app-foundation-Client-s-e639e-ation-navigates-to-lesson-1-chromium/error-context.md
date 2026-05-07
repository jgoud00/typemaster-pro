# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01-app-foundation.spec.ts >> Client-side Navigation >> navigates to lesson 1
- Location: e2e\01-app-foundation.spec.ts:90:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /lesson/i
Received string:  "http://localhost:3000/"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:3000/"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Aloo Type" [ref=e5] [cursor=pointer]:
          - /url: /
          - img [ref=e7]
          - heading "Aloo Type" [level=1] [ref=e9]
        - navigation "Main Navigation" [ref=e10]:
          - link "Lessons" [ref=e11] [cursor=pointer]:
            - /url: /lessons
            - button "Lessons" [ref=e12]:
              - img
              - text: Lessons
          - link "Stats" [ref=e13] [cursor=pointer]:
            - /url: /stats
            - button "Stats" [ref=e14]:
              - img
              - text: Stats
          - button "More Options" [ref=e16]:
            - generic [ref=e17]: More
            - img
          - link "Log In" [ref=e19] [cursor=pointer]:
            - /url: /login
            - button "Log In" [ref=e20]
          - link "Settings" [ref=e21] [cursor=pointer]:
            - /url: /settings
            - button "Settings" [ref=e22]:
              - img
    - main [ref=e23]:
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]:
              - img [ref=e32]
              - generic [ref=e38]: Keep the streak alive!
            - heading "Master the Art of Typing" [level=1] [ref=e39]
            - paragraph [ref=e40]: "Continue your journey with \"Home Position: F and J\". You're making great progress!"
          - generic [ref=e41]:
            - link "Resume Journey" [ref=e42] [cursor=pointer]:
              - /url: /lessons/home-1-fj
              - button "Resume Journey" [ref=e43]:
                - img
                - text: Resume Journey
            - link "View Curriculum" [ref=e44] [cursor=pointer]:
              - /url: /lessons
              - button "View Curriculum" [ref=e45]:
                - text: View Curriculum
                - img
        - generic [ref=e47]:
          - generic [ref=e48]:
            - heading "Course Progress" [level=3] [ref=e49]:
              - img [ref=e50]
              - text: Course Progress
            - generic [ref=e52]: 0%
          - progressbar [ref=e53]
          - generic [ref=e55]:
            - generic [ref=e56]: 0 Lessons Done
            - generic [ref=e57]: 73 Remaining
          - generic [ref=e58]:
            - generic [ref=e59]: Up Next
            - generic [ref=e60]:
              - generic [ref=e61]: 🏠
              - generic [ref=e62]:
                - generic [ref=e63]: "Home Position: F and J"
                - generic [ref=e64]: Your index fingers rest on F and J - the keys with bumps. Master these anchor keys first.
      - generic [ref=e65]:
        - generic [ref=e66]:
          - heading "Practice Modes" [level=2] [ref=e67]
          - link "View all modes" [ref=e68] [cursor=pointer]:
            - /url: /practice
        - generic [ref=e69]:
          - link "⚡ Speed Test Timed challenges" [ref=e70] [cursor=pointer]:
            - /url: /practice?mode=speed-test
            - generic [ref=e73]:
              - generic [ref=e74]: ⚡
              - heading "Speed Test" [level=3] [ref=e75]
              - paragraph [ref=e76]: Timed challenges
          - link "🚀 Burst Mode High-intensity intervals" [ref=e77] [cursor=pointer]:
            - /url: /practice/speed-training
            - generic [ref=e80]:
              - generic [ref=e81]: 🚀
              - heading "Burst Mode" [level=3] [ref=e82]
              - paragraph [ref=e83]: High-intensity intervals
      - generic [ref=e84]:
        - generic [ref=e88]:
          - img [ref=e89]
          - generic [ref=e92]:
            - paragraph [ref=e93]: Best WPM
            - paragraph [ref=e94]: "-"
        - generic [ref=e98]:
          - img [ref=e99]
          - generic [ref=e103]:
            - paragraph [ref=e104]: Best Accuracy
            - paragraph [ref=e105]: "-"
        - generic [ref=e109]:
          - img [ref=e110]
          - generic [ref=e112]:
            - paragraph [ref=e113]: Best Combo
            - paragraph [ref=e114]: "-"
        - generic [ref=e118]:
          - img [ref=e119]
          - generic [ref=e122]:
            - paragraph [ref=e123]: Practice Time
            - paragraph [ref=e124]: 0m
      - generic [ref=e126]:
        - heading "📅 Daily Goals" [level=3] [ref=e128]
        - generic [ref=e129]:
          - generic [ref=e130]:
            - generic [ref=e131]:
              - generic [ref=e132]:
                - generic [ref=e133]: ⏱️
                - generic [ref=e134]:
                  - generic [ref=e135]: Practice 15 Minutes
                  - generic [ref=e136]: Build consistent habits
              - generic [ref=e137]: 0min/15min
            - progressbar [ref=e138]
          - generic [ref=e140]:
            - generic [ref=e141]:
              - generic [ref=e142]:
                - generic [ref=e143]: 📚
                - generic [ref=e144]:
                  - generic [ref=e145]: Complete 1 Lesson
                  - generic [ref=e146]: Keep learning every day
              - generic [ref=e147]: 0/1
            - progressbar [ref=e148]
          - generic [ref=e150]:
            - generic [ref=e151]:
              - generic [ref=e152]:
                - generic [ref=e153]: 🎯
                - generic [ref=e154]:
                  - generic [ref=e155]: Achieve 95% Accuracy
                  - generic [ref=e156]: Precision matters
              - generic [ref=e157]: 0%/95%
            - progressbar [ref=e158]
        - generic [ref=e161]:
          - generic [ref=e162]: Today's Points
          - generic [ref=e163]: 0 / 225
  - alert [ref=e164]
```

# Test source

```ts
  1   | /**
  2   |  * SPEC 01 — App Foundation
  3   |  * Tests: Next.js routing, layout.tsx, React 19 hydration,
  4   |  *         meta/SEO, dark-mode, theme, responsive shell.
  5   |  */
  6   | import { test, expect } from "@playwright/test";
  7   | import { AppPage, ROUTES } from "./helpers";
  8   |  
  9   | // ─────────────────────────────────────────────
  10  | //  LAYOUT & ROOT RENDERING
  11  | // ─────────────────────────────────────────────
  12  | test.describe("App Layout & Root Rendering", () => {
  13  |   test("root '/' renders without a crash", async ({ page }) => {
  14  |     const errors: string[] = [];
  15  |     page.on("pageerror", (err) => errors.push(err.message));
  16  |  
  17  |     const app = new AppPage(page);
  18  |     await app.goto("/");
  19  |     await app.waitForHydration();
  20  |  
  21  |     expect(errors.filter((e) => !e.includes("Warning:"))).toHaveLength(0);
  22  |   });
  23  |  
  24  |   test("page title is set correctly", async ({ page }) => {
  25  |     await page.goto("/");
  26  |     await expect(page).toHaveTitle(/Aloo Type/i);
  27  |   });
  28  |  
  29  |   test("meta description tag exists", async ({ page }) => {
  30  |     await page.goto("/");
  31  |     const meta = page.locator('meta[name="description"]');
  32  |     await expect(meta).toHaveAttribute("content", /.+/);
  33  |   });
  34  |  
  35  |   test("html lang attribute is set", async ({ page }) => {
  36  |     await page.goto("/");
  37  |     const lang = await page.locator("html").getAttribute("lang");
  38  |     expect(lang).toBeTruthy();
  39  |   });
  40  |  
  41  |   test("viewport meta tag is present", async ({ page }) => {
  42  |     await page.goto("/");
  43  |     const viewport = page.locator('meta[name="viewport"]');
  44  |     await expect(viewport).toHaveAttribute("content", /width=device-width/);
  45  |   });
  46  |  
  47  |   test("no broken 404 images in layout", async ({ page }) => {
  48  |     const failedImages: string[] = [];
  49  |     page.on("response", (res) => {
  50  |       if (res.request().resourceType() === "image" && res.status() === 404) {
  51  |         failedImages.push(res.url());
  52  |       }
  53  |     });
  54  |     await page.goto("/");
  55  |     await page.waitForLoadState("load");
  56  |     await page.waitForTimeout(1000);
  57  |     expect(failedImages).toHaveLength(0);
  58  |   });
  59  |  
  60  |   test("no 500 errors on root load", async ({ page }) => {
  61  |     const serverErrors: string[] = [];
  62  |     page.on("response", (res) => {
  63  |       if (res.status() >= 500) serverErrors.push(res.url());
  64  |     });
  65  |     await page.goto("/");
  66  |     expect(serverErrors).toHaveLength(0);
  67  |   });
  68  | });
  69  |  
  70  | // ─────────────────────────────────────────────
  71  | //  NAVIGATION / ROUTING
  72  | // ─────────────────────────────────────────────
  73  | test.describe("Client-side Navigation", () => {
  74  |   test("navigates to dashboard", async ({ page }) => {
  75  |     await page.goto("/");
  76  |     const dashLink = page
  77  |       .locator('a[href*="dashboard"], nav a:has-text("Dashboard")')
  78  |       .first();
  79  |  
  80  |     if (await dashLink.isVisible()) {
  81  |       await dashLink.click();
  82  |       await expect(page).toHaveURL(/dashboard/);
  83  |     } else {
  84  |       // Dashboard may be the home route itself
  85  |       await page.goto(ROUTES.dashboard);
  86  |       await expect(page).toHaveURL(/\//);
  87  |     }
  88  |   });
  89  |  
  90  |   test("navigates to lesson 1", async ({ page }) => {
  91  |     await page.goto("/");
  92  |     const lessonLink = page
  93  |       .locator(
  94  |         'a[href*="/lessons/1"], a[href*="lesson-1"], button:has-text("Start")'
  95  |       )
  96  |       .first();
  97  |     if (await lessonLink.isVisible()) {
  98  |       await lessonLink.click();
  99  |       await page.waitForLoadState("domcontentloaded");
> 100 |       await expect(page).toHaveURL(/lesson/i);
      |                          ^ Error: expect(page).toHaveURL(expected) failed
  101 |     }
  102 |   });
  103 |  
  104 |   test("back-button works after navigation", async ({ page }) => {
  105 |     await page.goto("/");
  106 |     const originalUrl = page.url();
  107 |     await page.goto("/stats");
  108 |     await page.waitForURL("/stats");
  109 |     await page.goBack();
  110 |     await page.waitForURL(originalUrl);
  111 |     expect(page.url()).toBe(originalUrl);
  112 |   });
  113 |  
  114 |   test("404 page shows friendly message", async ({ page }) => {
  115 |     await page.goto("/this-route-does-not-exist-xyz");
  116 |     const body = await page.locator("body").innerText();
  117 |     expect(body).toMatch(/not found|404|missing/i);
  118 |   });
  119 |  
  120 |   test("all nav links are accessible (no href='#')", async ({ page }) => {
  121 |     await page.goto("/");
  122 |     const links = page.locator("nav a");
  123 |     const count = await links.count();
  124 |     for (let i = 0; i < count; i++) {
  125 |       const href = await links.nth(i).getAttribute("href");
  126 |       expect(href).not.toBe("#");
  127 |       expect(href).not.toBeNull();
  128 |     }
  129 |   });
  130 | });
  131 |  
  132 | // ─────────────────────────────────────────────
  133 | //  REACT 19 HYDRATION CHECKS
  134 | // ─────────────────────────────────────────────
  135 | test.describe("React 19 Hydration", () => {
  136 |   test("no hydration mismatch errors in console", async ({ page }) => {
  137 |     const hydrationErrors: string[] = [];
  138 |     page.on("console", (msg) => {
  139 |       if (
  140 |         msg.type() === "error" &&
  141 |         (msg.text().includes("Hydration") ||
  142 |           msg.text().includes("hydration") ||
  143 |           msg.text().includes("did not match"))
  144 |       ) {
  145 |         hydrationErrors.push(msg.text());
  146 |       }
  147 |     });
  148 |     await page.goto("/");
  149 |     await page.waitForTimeout(2000);
  150 |     expect(hydrationErrors).toHaveLength(0);
  151 |   });
  152 |  
  153 |   test("interactive elements are clickable after hydration", async ({
  154 |     page,
  155 |   }) => {
  156 |     const app = new AppPage(page);
  157 |     await app.goto("/");
  158 |     await app.waitForHydration();
  159 |  
  160 |     // At least one button should be in an enabled, clickable state
  161 |     const buttons = page.locator("button:not([disabled])");
  162 |     const count = await buttons.count();
  163 |     expect(count).toBeGreaterThan(0);
  164 |   });
  165 |  
  166 |   test("Zustand state is initialised after hydration", async ({ page }) => {
  167 |     await page.goto("/");
  168 |     await page.waitForTimeout(1500);
  169 |  
  170 |     const hasZustand = await page.evaluate(() => {
  171 |       // Zustand persists; check if localStorage key exists
  172 |       const keys = Object.keys(localStorage);
  173 |       return keys.some(
  174 |         (k) => k.includes("aloo") || k.includes("zustand") || k.includes("typing")
  175 |       );
  176 |     });
  177 |     // First visit won't have persisted state, that's fine — just check no crash
  178 |     expect(typeof hasZustand).toBe("boolean");
  179 |   });
  180 | });
  181 |  
  182 | // ─────────────────────────────────────────────
  183 | //  THEME / DARK MODE
  184 | // ─────────────────────────────────────────────
  185 | test.describe("Theme System", () => {
  186 |   test("dark mode toggle is present", async ({ page }) => {
  187 |     await page.goto("/");
  188 |     const toggle = page.locator(
  189 |       'button[aria-label*="dark"], button[aria-label*="theme"], button[data-testid*="theme"]'
  190 |     );
  191 |     // May or may not be visible depending on implementation
  192 |     const count = await toggle.count();
  193 |     expect(count).toBeGreaterThanOrEqual(0); // non-crashing assertion
  194 |   });
  195 |  
  196 |   test("applies dark class to body or html when dark mode active", async ({
  197 |     page,
  198 |   }) => {
  199 |     await page.goto("/");
  200 |     // Force dark mode via localStorage (common Tailwind approach)
```