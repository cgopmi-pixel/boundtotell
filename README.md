# Bound to Tell

Public memoir-service website at https://boundtotell.com, with Home, Packages, Sample & Testimonials, FAQs, and Contact Us. The existing public audience, domain, and preserved older versions remain unchanged.

## Build and edit

Run `node scripts/build.cjs` to generate `dist/`, then `node tests/interactions.cjs` for the interaction and content checks. The site has no runtime dependencies. Approved text lives in `content/site-copy.json`, package information in `content/packages.json`, templates in `src/render.cjs`, and styles/interactions in `public/`.

`site-refresh.css` follows the shared and device styles. `small-screens.css` loads last for screens and consolidates the current phone/tablet layout overrides up to 1200px; it does not apply to the landscape print sheet. It restores version 35’s fade colors, stops and transition distance in an upper background region on every page, ending near 500px on tall desktop screens as in the supplied reference. Header and footer backgrounds are white. It provides a navigation ribbon inset farther from the logo. The current website uses locally bundled Nunito Sans for headings, narrative copy, quotations and interface text, with true regular, bold, italic and bold italic faces. The Home bookshelf headline alone uses Raleway regular and true italic. The existing `--serif` variable remains as a compatibility alias for Nunito Sans so all existing sizes, weights, colors and responsive rules are preserved. The original raster logo and memoir sample pages are unchanged.

The six current Latin WOFF2 faces total about 158 KB; only the main regular face is preloaded on all pages, with Raleway regular additionally preloaded on Home. Both families include their SIL Open Font Licenses. Font provenance, source hashes and output hashes are in `docs/typography-fonts.json`. Legacy fonts remain available for older saved pages. `python scripts/compress-fonts.py` still rebuilds those six legacy WOFF2 files and is not required for the current fonts. All archive assets and pages remain unchanged.

## Home

The bookshelf headline is the heading for the complete introduction in one left-hand column. The publishing promise is larger, bold and brown. All Home type is slightly smaller, with a further small reduction for the bookshelf headline, and the text block is centered vertically relative to the bookcase. The narrative text is slightly smaller and inset from the headline, with more space before the bookcase. The Home introduction starts a little lower. The mission paragraph remains unchanged. There is no About Us heading or Everyone has a story tagline. The naturally proportioned bookcase occupies the right-hand column alongside the entire introduction, with the restored thin offset frame. The image keeps its natural proportions. Tablets retain the side column. Narrow phones and short phone landscape windows show the same decorative bookcase floated beside the opening copy, then let the remaining paragraphs use the full page width. The decorative CSS image replaces the desktop figure visually without duplicating or hiding any text.

`home-fit.js` measures this unified section against the available viewport height on large screens above 1200px wide, including the actual header and footer. It enlarges or reduces the text and bookcase together, up to a bounded maximum, to select the largest readable version that fits and rechecks on font loading and resize. Fitting measures with the prior type sizes and then restores the 8% reduction, so it cannot re-enlarge the smaller text. Phones and tablets use compact rem-based type and spacing without automatic enlargement. Short windows and enlarged text scroll naturally rather than clipping, hiding copy or disabling zoom.

## Packages and contact

Overview / Compare details sits opposite the Packages heading, above Every package includes. The inclusions box is immediately above the package columns. The current package data, cards, comparison, inquiry dialog, and printout contain no prices.

Classic, Signature, Premier, and Custom Package labels are plain text. Whole cards and comparison columns still highlight when clicked. Cards and comparison headers support Enter/Space for keyboard highlighting; nested consultation buttons, footnote links, and text selection do not trigger the surrounding surface. The selected package is announced in a visually hidden live region.

Overview uses four columns above 1200px, two from 541–1200px, and horizontal browsing on phones up to 540px wide. Phone users can swipe or use Previous/Next buttons; position and end-button states update without changing the selected package or scrolling the whole page. Compare details scrolls within its own region with sticky labels and headers. Returning to Overview reveals the highlighted card.

All quantities and inclusions remain in the shared package source: page counts 35–45, 70–90, and 115–140; photos, interviewees, copies, words, interview hours, and revision rounds are unchanged. Physical-copy asterisks in Overview and print refer to notes below revision rounds. Compare details shows the same additional-copy information without asterisks. The additional-services note says additional charge.

“Yes! I'd like a free consultation.” opens contact details and an email draft with subject Interested in the [tier] — [memoir name]. Contact Us uses Memoir inquiry. Brown phone/email buttons show 732.344.0886 and info@boundtotell.com; the phone opens the device call handler. No call or email is sent automatically. Dialog closing restores page position and focus.

## Sample and FAQs

Sample & Testimonials has a larger vertical sample preview on the left, labeled Sample Memoir below the thumbnail. The sample viewer shows the full Bound to Tell logo above Sample Memoir and uses the same name and only the approved pages 38–40, with paging, keyboard arrows, and enlargement. The two equal-width page columns align as a single unit; the larger sample is centered vertically at left. At right, From our Satisfied Clients introduces two stacked, narrower quotation cards with equal heights and a more square shape. The preview is slightly larger, the columns are farther apart, and the centered client heading matches the enlarged Sample Memoir caption size. Quotation marks use lighter sage; client names use deep sage. Small screens keep the sample beside the quotations and let the text set card height. On phones and short landscape windows the thumbnail stays near the top while the quotations scroll. The modal fits a complete sample page into its remaining viewport area; enlargement still supports scrolling in both directions. Each card has opening and closing quotation marks and a styled attribution.

Packages and FAQ page titles share one responsive size. Contact keeps the approved lower placement on desktop, with less padding on phones/tablets. Contacts sit beside the introductory text when there is space; narrow phones use two contact buttons beneath it, and screens up to 380px use full-width buttons so the email address remains readable. FAQs retain all eight approved questions and answers under the restored title-case Frequently Asked Questions heading. Contact Us keeps its navigation label and an accessible hidden heading, with the redundant visible page title removed. Small screens use compact closed rows and natural scrolling for expanded answers.

## Printing

Print package details invokes the browser print dialog without changing the highlighted package or display mode. `print.css` prints one continuous landscape comparison with the logo centered at the top, a smaller left-aligned Packages title, a vertical divider after Package details, gray fine-print words and rules on a white background, and website/email/phone along the bottom. Prices are absent. Data is rendered from the same source as the screen version. Color-preserving styles include the brown-and-sage logo; color/monochrome output and printer margins remain controlled by the print dialog.

## Preserved website

The original website remains byte-for-byte accessible at https://boundtotell.com/previous/index.html. `public/previous/` contains saved version 21, source commit 95e24039bb9b5e62ef9424a92ab4e23ab29ff18d. `docs/previous-version.json` records its hashes.

The three-page website immediately before the five-page redesign remains at https://boundtotell.com/versions/23/index.html. It is reconstructed from saved version 23, source commit 90662e7de96b090925bfea071af67cb497fe9fea, and checked against its deployed package. `docs/version-23.json` records its hashes. The archive fonts/assets and prices stay unchanged even when the current site changes. Keep both archives in future releases.

Version 35, three versions before the then-current version 38, is preserved at https://boundtotell.com/versions/35/index.html. It is rebuilt from source commit 2fa41a9fd6ecb7fdc0896ecb0a2bfaf3d8f646e2 and matches the retained deployment package byte-for-byte. `docs/version-35.json` records its hashes. Keep this archive alongside the other preserved versions.

## Verification

The compact navigation threshold is 900px. The menu closes after following a route or pressing Escape from its links or toggle, with focus restored when appropriate. Primary tap controls are at least 44px, with primary actions and viewer controls at 48px.

The production scripts run in a DOM harness covering five-page navigation and phone menus, 320–1920px width fixtures, package browsing and comparison scrolling, card/header keyboard highlighting, nested controls and selection, all eight inquiry buttons, email/dial links, dialog focus/scroll restoration, sample paging/enlargement, print invocation and content, removal of current prices, new copy and page structure, local assets, and archive integrity. Home fitting also has controlled-height checks for font loading, resizing, short-window fallbacks, and returning from compact to desktop widths.

These checks exercise interactions and controlled geometry, not rendered CSS. Browser, real-device, and native print visual QA remain unavailable in this session because the supported browser skill is unavailable. Visual sign-off should cover phone/tablet portrait and landscape, desktop, enlarged text, and landscape print output on Letter/A4 paper.

Research, implementation decisions and the remaining visual test matrix are recorded in `docs/responsive-review.md`.
