# Responsive review — 19 October 2026

## User requirements

Keep text compact, avoid excessive scrolling, retain accompanying images beside text where practical, keep the main content near the first screen, and support phone/tablet portrait and landscape. Preserve the approved desktop presentation, gradient, wording, fonts, package interactions and older published archives.

## Primary guidance reviewed

- Google/web.dev: https://web.dev/articles/responsive-web-design-basics — choose breakpoints from content, use flexible grids, constrain images, retain zoom, and avoid whole-page horizontal overflow.
- W3C Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html — support narrow 320 CSS-pixel viewports; tables and independent, appropriately sized horizontal panels can scroll within their own region.
- W3C Resize Text: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html — preserve content and functionality when text is enlarged. Small base text must not be used to prevent the user from enlarging it.
- W3C Target Size (Enhanced): https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html — 44 × 44 CSS-pixel targets; most primary controls here use 48px.
- Google/web.dev fonts: https://web.dev/articles/font-best-practices — local WOFF2 delivery and font-display; do not preload every font indiscriminately.

## Implementation decisions

- A final screen-only sheet scopes compact layouts to 1200px and below. The desktop view above that width and the print sheet retain their styling.
- Navigation collapses at 900px, before five full labels crowd the logo. Expanded links, keyboard Escape, route activation and resize keep visibility, focus and ARIA state consistent.
- Tablet Home uses fixed compact type instead of the large-screen fitting script. On narrow/short phones, a decorative floated bookcase lets the later paragraphs use the full width. No text is removed or clipped.
- Package cards use two columns from 541–1200px and the existing swipable cards below that. Previous/Next controls remain available; the comparison scrolls independently with sticky labels.
- The sample thumbnail stays beside the quotations. The modal has a viewport-height grid so its unzoomed page fits between the logo/title and controls; enlarged pages retain panning.
- Contact and inquiry buttons remain readable, with single-column contact methods on the smallest screens. All dialogs retain safe-area margins and scrolling bodies.
- The complete six-face font set is 35.8% smaller as WOFF2 (569,484 → 365,648 bytes). Every mapping, outline and horizontal advance was verified against the original OTF; original fonts and archive files stay intact.

## Checks and limits

The production interaction scripts pass controlled DOM/geometry fixtures from 320–1920px, including 540/541px package browsing and 900/901px navigation boundaries. They cover menus, Escape, route selection, package highlighting/browsing, comparison, inquiries, mailto/tel, sample page/zoom state, dialog focus and scroll restoration, printing and all archive hashes. Home fitting is disabled through 1200px and resumes above it, including after a width change.

These are not browser-rendering or accessibility-conformance tests. The supported browser skill is unavailable in this session, so no preview server or substitute browser path was used.

Visual follow-up should cover 320×568, 375×667, 390×844, 430×932, 768×1024, 820×1180, 1024×768 and 1180×820; 667×375 and 844×390 landscape; desktop 1280×720 and 1440×900; enlarged text/zoom; iOS safe areas and changing browser bars; and native landscape print output. Very small or short windows, long pages and expanded FAQs can scroll naturally. No claim is made that all text fits every screen without scrolling.

## Typography update — 20 October 2026 UTC

Nunito Sans now supplies every existing screen and print typography role, with regular, bold and true italic faces. Raleway supplies only the Home bookshelf headline and its italic phrase. The six local Latin WOFF2 faces are about 158 KB total; the original logo artwork and sample-page imagery are unchanged. The new families use the existing font sizes, line heights, spacing, colors and layout rules. All responsive styles and breakpoints, Home fitting on font readiness, touch controls, and the archived publications remain unchanged. The existing DOM/controlled-geometry suite is rerun for 320–1920px. No supported browser tester is available in this session, so this does not claim a rendered-device visual sign-off.
