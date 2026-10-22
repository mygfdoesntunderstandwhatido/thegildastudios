# Cross-browser and device QA (#31)

The built site checked against the design artboards before launch:
`Website - Homepage.dc.html` 2a, `About` 1a, `Services` 1a, `Projects` 1a
(index) and 1b (case study). The Contact page has no artboard: it follows the
proposal approved in #26.

**Status:** the Chromium column is done. Safari (macOS and iOS), Firefox,
Edge and Chrome on Android and Windows need a person with those browsers.
The container this pass ran in only has Chromium. Those cells are marked
_To check_, with what to look for under [Browser checklist](#browser-checklist).

## Page × width (Chromium 141, production build, 22 October 2026)

768 and 1440 have no artboard. They are checked against the agreed behaviour
from #6: the phone layout up to 767px, the desktop layout from 768px, and
content capped at 1280px and centred above that.

| Page                                 | 375 vs Phone 390 | 768  | 1280 vs Desktop 1280 | 1440 |
| ------------------------------------ | ---------------- | ---- | -------------------- | ---- |
| Home (2a)                            | Pass             | Pass | Pass                 | Pass |
| About (1a)                           | Pass             | Pass | Pass                 | Pass |
| Services (1a)                        | Pass             | Pass | Pass                 | Pass |
| Projects (1a)                        | Pass             | Pass | Pass                 | Pass |
| CS Butcher (1b)                      | Pass             | Pass | Pass                 | Pass |
| Drapp fuq Drapp (1b template)        | Pass             | Pass | Pass                 | Pass |
| Malta Business Network (1b template) | Pass             | Pass | Pass                 | Pass |
| Contact (#26 proposal)               | Pass             | Pass | Pass                 | Pass |
| Message sent                         | Pass             | Pass | Pass                 | Pass |
| 404                                  | Pass             | Pass | Pass                 | Pass |

"Pass" means: the layout and copy match the artboard, nothing overlaps or is
clipped, and the interactions below work.

### No layout breaks from 320 to 1920px

Every page was resized from 320 to 1920px in 8px steps. At each width the
check looked for horizontal scrolling, text clipped by its own box, and text
running off the screen. Nothing broke. The one thing it found is intended:
on phones narrower than 329px the Projects filter row scrolls sideways to
reach GROW, as the row does at 390 in the design.

`npm run test:a11y` repeats the 320px reflow check on every page in CI.

## Against the artboards

Each image has the artboard on the left and the build on the right. Desktop
pairs are shown at half size.

| Page                   | Desktop 1280                                  | Phone (390 artboard, 375 build)             |
| ---------------------- | --------------------------------------------- | ------------------------------------------- |
| Home                   | [1280](qa/31-home-1280.png)                   | [375](qa/31-home-375.png)                   |
| About                  | [1280](qa/31-about-1280.png)                  | [375](qa/31-about-375.png)                  |
| Services               | [1280](qa/31-services-1280.png)               | [375](qa/31-services-375.png)               |
| Projects               | [1280](qa/31-projects-1280.png)               | [375](qa/31-projects-375.png)               |
| CS Butcher             | [1280](qa/31-cs-butcher-1280.png)             | [375](qa/31-cs-butcher-375.png)             |
| Drapp fuq Drapp        | [1280](qa/31-drapp-fuq-drapp-1280.png)        | [375](qa/31-drapp-fuq-drapp-375.png)        |
| Malta Business Network | [1280](qa/31-malta-business-network-1280.png) | [375](qa/31-malta-business-network-375.png) |
| Contact (build only)   | [1280](qa/31-contact-1280.png)                | [375](qa/31-contact-375.png)                |
| Message sent (build)   | [1280](qa/31-thanks-1280.png)                 | [375](qa/31-thanks-375.png)                 |
| 404 (build)            | [1280](qa/31-404-1280.png)                    | [375](qa/31-404-375.png)                    |

The design file draws its striped photo placeholders with an effect that does
not render outside Claude Design, so the artboard side shows those slots as
blank. The build's placeholders are the striped ones on the right.

### Differences found

- [x] **Footer link rows were 30px taller than the artboard.** They inherited
      the body's 1.6 line height; the artboard uses normal leading. Fixed in
      `SiteFooter.astro`: rows now step 25px, as designed.
- [x] **Hero headline broke as "ingredient / s." at 1280.** Introduced and
      caught in this pass (a global heading wrap rule from the accessibility
      work). Reverted; the headline matches the artboard again.
- [x] **Contact headline scrolled sideways below 372px.** Fixed in #29: it
      scales with the viewport on narrow phones.
- [x] **768–1150: the home hero's lede ran over the olive.** The lede and
      the mark now share the row: below about 1150px the lede narrows and the
      mark shrinks until they clear each other. From 1280 both are the
      artboard's 440px and 708px. At 768 the end of "ingredients." still
      touches the anchovy, as the headline meets the mark at 1280.
- [x] **768–1023: case-study summaries were a 260px column of 14 lines.** The
      summary now sits under the project name below 1024px.
- [x] **768–1023: Services "Best for" text was squeezed into 150px.** Detail
      labels now sit above their values below 1024px.
- [x] **768–1100: the footer email broke as "…studios.co / m".** Footer link
      columns no longer shrink below their longest link.
- [x] Accepted: at 375 a few lines wrap one word earlier than the 390
      artboard. That is the 15px difference in width, not a layout change.
- [x] Accepted: on phone, the branch strip's `01 / OLIVE` labels on the hero
      are Cream 2, not the branch tints, for AA contrast (#15).
- [x] Accepted: hover darkens olive and anchovy buttons, and cards fade only
      their image, for AA contrast while hovered (#29).
- [ ] Founder portraits, case-study photos and Selected work images are still
      placeholders. They are replaced in #33.

## Interactions (Chromium)

Checked at 390 and 1280 with mouse, touch emulation and keyboard. All of them
are also automated in `tests/a11y` and `tests/performance`.

| Interaction                                   | Result |
| --------------------------------------------- | ------ |
| Hero mark hover, tap and focus                | Pass   |
| Strip and mark stay in sync                   | Pass   |
| Rotator dots, pause and autoplay              | Pass   |
| Services disclosures                          | Pass   |
| Case-study pillars                            | Pass   |
| Projects filters and count                    | Pass   |
| Mobile menu                                   | Pass   |
| Contact prefill from "Ask about this service" | Pass   |
| Contact validation                            | Pass   |

## CSS features that differ between browsers

Reviewed in the source. The site's baseline is browsers from 2023 onwards:
Safari 16.4+, Chrome and Edge 111+, Firefox 121+.

| Feature                                | Where                                  | Without support                                                                                          |
| -------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `font-stretch: 125%` on buttons        | Archivo Expanded, its own font file    | Supported in every browser in the baseline. The fallback metrics are matched, so there's no shift        |
| CSS `mask` for the engraved mark       | `Mark.astro`, `.band__mark`            | Unprefixed `mask` is in the baseline. The WebP `image-set()` falls back to the PNG `mask` declared first |
| `text-wrap: balance`                   | Headings and short copy                | Ignored by older Safari and Firefox: lines wrap normally. Nothing overlaps                               |
| `grid-template-rows: subgrid`          | About branch cards                     | Behind `@supports`: rows size on their own and the cards stay aligned at the top                         |
| `:has()`                               | Hero piece focus outline, form choices | Firefox 121+. In older Firefox the outline and the choice ring would be missing                          |
| Media ranges such as `(width < 768px)` | Every component                        | Safari 16.4+. Older Safari would show the desktop layout on phones. Below the baseline                   |
| `color-mix()`                          | Button hover, About portrait tint      | Safari 16.2+, inside the baseline                                                                        |
| `<dialog>` and `inert`                 | Mobile menu, rotator                   | Safari 15.4+, inside the baseline                                                                        |

## Browser checklist

| Browser               | Device           | Status     |
| --------------------- | ---------------- | ---------- |
| Chrome (Chromium 141) | Linux, headless  | Pass       |
| Safari                | macOS            | _To check_ |
| Safari                | iOS (iPhone)     | _To check_ |
| Chrome                | macOS            | _To check_ |
| Chrome                | Windows          | _To check_ |
| Chrome                | Android          | _To check_ |
| Firefox               | macOS or Windows | _To check_ |
| Edge                  | Windows          | _To check_ |

For each browser, on the Deploy Preview, at phone and desktop width:

1. Open each page and compare it with the screenshots above.
2. Buttons read in the wide Archivo (125%), not the normal width.
3. The engraved mark shows in the CTA bands and the menu (CSS mask).
4. Hover the hero mark pieces; on a phone, tap them. Tap outside to clear.
5. Hover and focus the branch strip; the mark follows.
6. Let the rotator play, then pause it and pick a dot.
7. Open and close a disclosure, a case-study pillar and the mobile menu.
8. Filter the projects.
9. From Services, follow "Ask about this service". The form should arrive
   with that service chosen. Submit it empty to see the errors.
10. Safari only: turn on "Press Tab to highlight each item on a webpage" and
    tab through a page.

Record a pass or a linked issue against each browser above.
