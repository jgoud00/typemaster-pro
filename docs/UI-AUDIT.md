# UI audit — Aloo Type

Audited September 5, 2026 against the current working tree, including the in-progress redesign. No application source was changed.

The desktop dashboard has a clear primary action, consistent rounded cards, and a recognizable amber/dark palette. The main release concerns are typing readability, clipped mobile controls, and keyboard accessibility. Several appearance settings currently promise behavior the implementation does not provide.

Validation: local Next.js development server, headless installed Chrome, source inspection, viewport measurements at 1440, 768, 390, and 320 pixels, plus short-screen mobile navigation checks. Routes: Home, Lessons, first lesson, Practice hub, Speed Test, Stats, Challenges, Achievements, Settings, About, Warmup, Smart Practice, and Speed Training. Screenshots and scripts are in [.tmp/ui-audit](../.tmp/ui-audit/). The browser checks used disposable guest profiles. Auth submission, destructive confirmation, populated charts, completed-session results, physical mobile keyboards, and screen-reader speech output were not exercised. This is not a complete accessibility certification or production performance audit.

1. **High — Upcoming typing text is too faint to read comfortably.**

   Untyped letters use `#71717a` on `#121217`, and every upcoming word is additionally rendered at 35% opacity. The resulting nominal contrast is approximately **1.49:1**, before accounting for the decorative glow. This directly affects the content users must read to complete the main task. Even undimmed muted text on these cards is approximately 3.86:1, so the same color is unsuitable for small supporting text. W3C specifies 4.5:1 for normal text and 3:1 for large text. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

   Evidence: [globals.css](../src/app/globals.css), lines 240 and 273; [typing-area.tsx](../src/components/typing/typing-area.tsx), line 231; [mobile Smart Practice screenshot](../.tmp/ui-audit/practice-smart-390.png).

   Fix: increase the untyped color and remove or substantially reduce word dimming. Measure the composited colors of upcoming, correct, incorrect, and current characters, plus small captions.

2. **High — Important controls are clipped on mobile.**

   At 390px, Stats clips the right-hand “Practice Time” chart tab. Its tab list has intrinsic width and no wrap/scroll behavior, while the card clips overflow. Smart Practice also hides part of its statistics strip at 390px. At 320px the Speed Test document expands to 337px. Settings sound buttons additionally overflow their own boxes: “mechanical” has 63px of content inside 54px.

   Evidence: [PerformanceSection.tsx](../src/components/stats/PerformanceSection.tsx), line 66; [stats/page.tsx](../src/app/stats/page.tsx), line 209; [typing-stats.tsx](../src/components/typing/typing-stats.tsx), lines 72–74; [settings/page.tsx](../src/app/settings/page.tsx), line 92; [Stats mobile screenshot](../.tmp/ui-audit/stats-390.png).

   Fix: give chart tabs an explicit horizontal scroll area or responsive arrangement; allow statistics to wrap or use a compact mobile grid; use two sound-profile columns on narrow screens. Verify individual control bounds, not just document scroll width, because clipping can hide overflow without widening the document.

3. **High — Sign-in and statistics-reset overlays lack dialog behavior.**

   Both are custom overlays with no dialog role. Escape leaves each open. After opening sign-in, focus remains on the body; tabbing from the form reaches links behind the overlay. This is particularly problematic for a destructive confirmation.

   Evidence: [AuthModal.tsx](../src/components/auth/AuthModal.tsx), lines 66–83; [stats/page.tsx](../src/app/stats/page.tsx), lines 122–143; [interaction evidence](../.tmp/ui-audit/interactions.json).

   Fix: use the existing shared Radix Dialog, including an accessible title, initial focus, focus containment, Escape dismissal, and focus restoration. Give auth inputs persistent labels, associate error messages, and retain an accessible submit-button name while loading. No credentials were submitted and no reset was confirmed during this audit.

4. **Medium — The intended body and typing fonts do not render.**

   Layout loads Inter and JetBrains Mono into `--font-sans` and `--font-mono`, but the Tailwind theme maps the font utilities to undefined Geist variables. Browser-computed fonts for the body, numeric metrics, and typing passage are all the system sans stack. The typing text therefore loses consistent character widths.

   Evidence: [globals.css](../src/app/globals.css), lines 11–12; [layout.tsx](../src/app/layout.tsx), lines 15–23; `fonts` and `typingBefore` in [interaction evidence](../.tmp/ui-audit/interactions.json).

   Fix: give loaded fonts distinct source variable names and map the theme utilities to them. Verify computed font families and monospaced character widths in the browser.

5. **Medium — Theme selection changes state without applying the advertised palette.**

   Selecting Dark, Light, Cyberpunk, Midnight, and Dracula changes the root class, but all five retain background `#09090d` and primary/brand `#f59e0b`. The stylesheet defines the default dark palette without alternate theme rules, and numerous components hardcode dark surfaces and amber controls. Light therefore still looks dark.

   Evidence: [theme-provider.tsx](../src/components/providers/theme-provider.tsx), lines 10–19; [globals.css](../src/app/globals.css), lines 77–175; [settings/page.tsx](../src/app/settings/page.tsx), line 144; `themes` in [interaction evidence](../.tmp/ui-audit/interactions.json).

   Fix: implement every offered palette through shared semantic tokens and migrate hardcoded colors, or remove unavailable choices until implemented.

6. **Medium — Navigation lacks visible keyboard focus and a working skip destination.**

   A focused desktop Home link computes `outline-style: none` and `box-shadow: none`. The logo, navigation links, several action cards, and menu triggers explicitly remove outlines without replacement. The global “Skip to content” points to `#main-content`, but none of the 13 inspected routes provides that target. The new AppShell provides the ID but these routes do not use it. The More dropdown also stays open after Escape and does not expose its expanded state.

   Evidence: [Navbar.tsx](../src/components/layout/Navbar.tsx), lines 86, 103, and 145; [layout.tsx](../src/app/layout.tsx), line 58; [AppShell.tsx](../src/components/layout/AppShell.tsx), line 29; [home page](../src/app/page.tsx), line 137.

   Fix: add consistent focus-visible styling; connect the skip link to a focusable main landmark on each page; implement disclosure state and Escape handling for both header dropdowns. Validate by keyboard from page entry through a complete navigation flow.

7. **Medium — Settings controls have missing names and selection semantics.**

   The accessibility tree exposes the master-volume slider and four of five switches without names. Only the Achievements switch has an associated label. Theme, cursor, font-size, and layout selections are buttons whose selected state is only communicated visually.

   Evidence: [settings/page.tsx](../src/app/settings/page.tsx), lines 80, 182, 192, 280, and 309; `settingsControls` in [interaction evidence](../.tmp/ui-audit/interactions.json).

   Fix: associate each slider/switch with its visible label and supporting description. Use radio groups for mutually exclusive settings or expose appropriate pressed/selected state.

8. **Medium — Mobile drawer actions fall below short viewports.**

   At a 390×480 viewport, the Sign In button sits at y=535–571, entirely below the screen. At 568px height it is partially cut off. The fixed drawer has visible overflow instead of its own vertical scrolling region, so the layout does not keep the account action reliably available.

   Evidence: [MobileNav.tsx](../src/components/layout/MobileNav.tsx), lines 64 and 103; [sheet.tsx](../src/components/ui/sheet.tsx), line 39; [short drawer screenshot](../.tmp/ui-audit/mobile-menu-480.png).

   Fix: make the drawer height follow the available viewport, make its navigation region scrollable with `min-height: 0`, and keep the account area accessible. Recheck landscape phones and short browser windows.

9. **Medium — Heatmap detail requires mouse hover.**

   Individual key statistics appear only through mouse-enter/mouse-leave handlers on non-focusable divs. Keyboard users cannot open those details, and there is no explicit tap interaction. The legend says “Fast / Slow” even though key colors are calculated from accuracy, contradicting “Key Accuracy Heatmap.”

   Evidence: [KeyboardHeatmap.tsx](../src/components/stats/KeyboardHeatmap.tsx), lines 65–72 and 101–119; [stats/page.tsx](../src/app/stats/page.tsx), lines 108–117.

   Fix: make key details available on focus and tap, provide an accessible textual summary, and label the legend with accuracy ranges. Hover tooltip placement with populated data still needs a browser check.

10. **Medium — Accessibility tests can pass without testing the advertised behavior.**

    The skip-link test checks only that a result is a boolean. The live-region assertion permits zero regions. Modal tests silently bypass their assertions when their trigger selector finds nothing, which is exactly how the custom auth overlay escapes coverage. The reduced-motion check only verifies a visible body. These tests cannot establish that the UI behavior described in their names works.

    Evidence: [09-accessibility.spec.ts](../e2e/09-accessibility.spec.ts), lines 113, 191, 257, 282, and 363.

    Fix: open the actual controls, require the expected state to exist, and assert the resulting focus, Escape dismissal, skip destination, labels, and motion behavior. Add narrow-screen control-visibility checks. The full existing test suite was not run; the focused browser audit directly reproduced the findings above.

Additional design improvements:

- **Page identity:** Lessons, Practice hub, Stats, Achievements, and Settings have no h1 in the inspected state. Add a consistent visible page title and a concise description where useful, using the shared page-header component.
- **Empty dashboard hierarchy:** new users see repeated empty Best WPM, practice-time, and progress information across the dashboard and activity sidebar. Reduce repetition and emphasize the next lesson or first practice action.
- **Coach copy:** “Nexus AI Coach,” “ML MODEL OUTPUT,” `ml.assess()`, and “neuro-motor pathways” introduce a second identity and implementation language. Use the Aloo Type voice and one actionable instruction, such as “Complete a practice session to get personalized suggestions.” See [AICoach.tsx](../src/components/stats/AICoach.tsx), lines 38, 75, and 133.
- **Secondary visual system:** the lesson roadmap still uses blue/purple connectors beside the new amber cards. Align these with the shared palette unless the colors communicate a defined learning state. See [lesson-journey.tsx](../src/components/lessons/lesson-journey.tsx), lines 164–203.

Suggested repair order: restore typing contrast and fonts; fix narrow-screen controls; migrate dialogs and repair navigation focus; implement labels and functional themes; then simplify headings, empty states, and coaching copy. Run focused regression checks as each area is repaired.

Evidence note: full-page screenshots can show white/gray below the original viewport because the decorative background is a fixed viewport element over a transparent page. This capture effect was not classified as a confirmed live scrolling defect. Local development badges are also excluded from UI findings.
