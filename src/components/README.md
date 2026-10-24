# Shared components

All visible copy is supplied by props or slots from typed data in `src/content`.
The components use Astro and scoped CSS. Only toggle chips, disclosures (including the
case-study pillar cards), the testimonial rotator, the project filters, the
mobile menu, the hero mark, the branch strip and the contact form ship JavaScript.

## Button (#7)

`core/Button.astro` renders an anchor when given `href`, otherwise a button.
Variants: `primary`, `anchovy`, `dark`, `light`, `outline`, `outline-light`.
Sizes: `sm` and `md`. Native anchor/button attributes and a `class` are forwarded.
Action buttons default to `type="button"` so they do not submit surrounding forms.

`disabled` uses the native button attribute. Disabled anchors keep link semantics,
remove their destination, expose `aria-disabled` and leave the tab order. Both
use 40% opacity. Hover is 86% over 150ms, or instant under reduced motion.
On devices with a coarse pointer the target is at least 44px tall.

## Label (#7)

`core/Label.astro` supports `size="sm|md"`, `tracking="label|running"`,
and tones `accent`, `ink`, `muted`, `on-dark`, `on-dark-accent`,
`on-dark-muted` and `inherit`. The `as` prop can render a span, paragraph,
div or heading. Standard tracking is 0.06em; running tracking is 0.1em.
Phone type reduces to 11px for medium and 10px for small labels.
Use on-dark tones on dark grounds, keeping Pepper off Cream and Sand.

## Chip (#7)

`core/Chip.astro` has `outline`, `filled` and `toggle` variants. Outline and
filled chips are static spans. Toggle chips are native buttons with
`aria-pressed`, wrapped in the small `ToggleChip.astro` custom element.
Enter, Space and clicks toggle the state. An island emits a bubbling
`chip-change` event with `detail: { pressed: boolean, value: string }`.
Native `value`, `name`, `disabled`, data attributes and a class can be passed.

The primitive manages one toggle. The Projects filter in #25 will manage the
exclusive selection and results, and can set other buttons' `aria-pressed`
attributes directly. CSS follows the attribute, so state can also be updated
by a parent controller. Without JavaScript the native button and its initial
pressed state remain; the later filter must retain all results as its fallback.

`onDark` changes outlines and text for a Brine ground; active on-dark toggles
use Cream with Brine text. `dot="olive|anchovy|pepper"` adds a decorative
9px CSS dot with the appropriate tint/ring for its current ground. The brand
BranchDot component and branch definitions remain in #8. Every toggle is at
least 44px tall on coarse-pointer devices.

## SectionHeader (#11)

`layout/SectionHeader.astro` takes a required `title`, optional `number`,
`headingLevel` (2–6, default 2), `onDark` and `link: { label, href }`.
An `id` is attached to the heading, so a parent section can reference it via
`aria-labelledby`. The decorative hairline is hidden from assistive technology.

`accent="anchovy"` selects the Build label colour. `accentTitle` also colours
the title, as used for the unnumbered “SIX PHASES” label. Page-artboard tracking
is 0.06em, resolving the design-system component's 0.1em difference.

## Testimonial (#13)

`content/Testimonial.astro` takes `quote`, `name`, `role` or `business`,
`caseStudy: { slug }`, `variant="dark|light"` and
`markColor="olive|anchovy|pepper"`. The light variant always uses the
artboard's Olive mark. Case-study links and blockquote citations resolve to
`/projects/<encoded-slug>/`, using the slugs defined in #25.

The figure contains one blockquote and one figcaption. Its default accessible
name comes from the `labels.testimonial` group in `src/content/settings/site.json`; callers can supply `aria-label`.
The separate figure label prevents the caption being repeated as the figure's
name. The decorative quote mark is hidden from assistive technology.

The light variant includes the project link required by #13. Its phone sizes
follow the Projects phone artboard (19px quote, 72px mark and 18px name).
Rotation, testimonials collections and the destination pages remain in #18/#25.

## Brand: Mark, Wordmark, Lockup, Monogram (#8)

`brand/Mark.astro` renders `variant="full"` as a `Picture` of the colour PNG
(`onDark` selects the on-dark file) or `variant="single"` as a CSS mask of
`mask-engraved.png` filled with `tone` (a colour token, or `currentColor` by
default). `height` sets the size and the width follows 823:1000. Below 48px the
mark renders `Monogram` instead. `alt` is the alt text or accessible name;
`alt=""` makes the mark decorative (`alt=""` on the image, `aria-hidden` on a
mask). Single-colour marks otherwise get `role="img"` and a name.

`brand/Wordmark.astro` sets the name in Gilda Display 400, as `layout="line"` or
`layout="stacked"` (The / Gilda / Studios at .95 leading), at `size` px.
`brand/Lockup.astro` is the footer lockup: a decorative 96px mark with 32px
stacked type, which becomes 72px with 26px below 768px. `brand/Monogram.astro`
is the GS tile (`tile`, `dark` or `outline`) with a 22% radius.

## BranchDot and BranchDots (#8)

`branch/BranchDot.astro` takes `branch`, `onDark` and `size` (9–14px, default
10). Pepper on light grounds gets the inset ring; `onDark` uses the Brine tints.
`branch/BranchDots.astro` takes any subset of `branches` and always renders
olive, anchovy, pepper. Dots are decorative unless a `label` is given.

Branch definitions (number, name, ingredient, colour, on-dark tint, label and
foreground colours) live only in `src/lib/branches.ts`. Grow's label colour is
Brine, so pepper is never text on Cream or Sand.

## Disclosure (#12)

`content/Disclosure.astro` takes `items` and `branch`, plus optional `labels`
templates where `{n}` is the item count (defaults in
`labels.disclosure` in `src/content/settings/site.json`, with single forms for one item). The trigger is
a native button with `aria-expanded` and `aria-controls`. It is closed by
default and the panel collapses with a 200ms row transition, which is removed
under reduced motion. Without JavaScript (`scripting: none`) the list renders
open with a static label. Circles and numbers follow the branch colours.

## TestimonialRotator (#18)

`content/TestimonialRotator.astro` renders the Brine "In their words" section
(`id="in-their-words"`) from `testimonials` collection entries, sorted by the
caller by `homeOrder`. Each slide is a dark `Testimonial`. The active quote sets
the section height. Visitors choose a dot with the pointer or keyboard, or swipe
left or right on a phone. There is no autoplay or playback control. Changes are
announced politely; inactive slides are hidden and inert.
Copy lives in the `testimonials` group of `src/content/homepage/home.json`.

## SiteHeader (#9)

`layout/SiteHeader.astro` reads the nav, the booking link and the email from
the `settings` singleton (`src/content/settings/site.json`). `ground` is
`cream` (the homepage) or `sand` (About, Services and Projects). `currentPath`
defaults to the page URL. An exact match gets `aria-current="page"`, and a
section ancestor (a case study under `/projects/`) gets `aria-current="true"`.
Both use olive, or the branch colours for Plan, Build and Grow. `Base.astro`
renders the header; pass `header={false}` to place it yourself, as the homepage
hero will (#15).

From 960px up the header shows the full nav. Below that a MENU toggle opens a
native modal `<dialog>`: the rest of the page becomes inert, focus is kept
inside, Esc closes it, focus returns to the toggle, and the page doesn't
scroll. MENU and CLOSE share one grid cell, so nothing shifts. Without
JavaScript the links wrap under the name.

## Hero, HeroMark and BranchStrip (#15, #17)

`home/Hero.astro` is the dark homepage hero. It places `SiteHeader` on top, so
the page uses `Base` with `header={false}`. Its copy comes from the `homepage`
singleton, and the booking button from `settings`.

`home/HeroMark.astro` stacks the base mark and the three piece images, and
hit-tests the pointer against `mark-piece-map.png`. The map loads on first
pointer contact. Three keyboard buttons, clipped to the design polygons, give
each piece focus, `aria-pressed` and a polygon focus outline drawn in SVG.

`home/BranchStrip.astro` is the three-column strip, with copy from the
`branches` collection and colours from `branches.ts`. Below 768px it becomes
the static stacked list.

The mark and the strip share state through `src/lib/branch-focus.ts`, which
also dispatches a `gilda:branch-focus` event on `document`.

## SelectedWork and the homepage (#19)

`home/SelectedWork.astro` is the cream "01 Selected work" band. Its cards are
the `featured` case studies in `order`, using each entry's `homeTitle` and
`homeSector` (falling back to `short` and `sector`). The component is retained for
reference but is no longer shown on the homepage (#72). `src/pages/index.astro`
assembles the hero, origin story and rotator (#76); the footer comes from `Base`.

## Case study template (#24)

`case-study/CaseStudy.astro` renders one `caseStudies` entry (schema in
`src/content/schemas/case-studies.ts`): the cream intro, numbered sections
(sand, cream, sand…, or Pepper pale when `featured`), the gallery, the Next
project band and the CTA band. Shared labels live in the `case_study` singleton.
`case-study/Blocks.astro` renders the block types: `paragraph`, `list`,
`callout`, `highlight`, `quote` (a `testimonials` reference, shown as the light
Testimonial without its project link), `groups` and `pillars`.

`case-study/Pillars.astro` is the branch-card island. It follows the disclosure
pattern (#12): native buttons with `aria-expanded` and `aria-controls`, and a
row-track collapse. Only one card is open; the open card spans the row and
moves first. Without JavaScript every card is open.

`src/lib/case-studies.ts` lists published entries in `order`, drafts aside, and
works out the Next project loop. `src/pages/projects/[slug].astro` builds one
page per published entry, and fails the build if a quote's testimonial links to
another case study. Entries with `draft: true` get no page.

## ProjectIndex (#25)

`projects/ProjectIndex.astro` is the `/projects/` opening and card grid, with
copy from the `projects` singleton. The ALL / PLAN / BUILD / GROW toggle chips
(#7) filter the cards in place: one is pressed at a time, the count chip
updates, and a polite live region announces the result. Without JavaScript the
filters are hidden and every project shows.

## Contact form (#26)

`contact/ContactForm.astro` is the rule-led form on `/contact/`. Copy comes from
the `contact` singleton. The choices are native checkboxes and radios dressed
as toggle chips, so they submit with the form and work without JavaScript. With
JavaScript, the island shows inline errors (`aria-invalid`, `aria-describedby`),
focuses the first invalid field and announces a count. It also reads
`?service=01.2` or `?branch=grow` to prefill the form. Build links with
`contactHref()` from `src/lib/contact.ts`. Service numbers and prefill names
come from the typed `services` collection. #32 wires Netlify delivery, the
honeypot, retry behavior and `/contact/thanks/`; see `docs/operations.md`.

## About page (#20)

`about/AboutPage.astro` assembles the 1a story-first layout from the `about`
singleton and the `team` collection, sorted by `order`. Branch metadata and
colours come from `branches.ts`; copy and service rows come from the singleton.
The branch cards share rows through subgrid, with an ordinary grid fallback.
Each founder's `portrait` may be `null` until launch: a decorative SVG reserves
the 4:5 slot. A real portrait requires alt text and is cropped into the same slot.

## Services page (#21, #22, #23)

`services/ServicesPage.astro` reads the `servicesPage` singleton and renders
the branch jump cards and all three branches, each with its ordered `services`
entries. Branch order comes from code. `BranchBand`
takes a `branch` and `intro`; `ServiceCard` takes a service entry, shared labels
and an alternating `ground`. Each card reuses the disclosure and links to Contact
with its stable service number. The page singleton previously called `services`
is now `servicesPage`; `services` holds individual service records.

Standard services provide `included` items. Build provides `howItStarts` and
`phases` instead; `ServicePhases` renders a labelled ordered list, with a
six-column timeline at desktop widths and a vertical timeline below 1200px.
Phase numbers and cycling dot colours come from code and `branches.ts`.
Grow reuses the standard card with Brine labels and Pepper decoration.
Branch illustrations are shared through `src/lib/branch-illustrations.ts`.

## Previews

- `/dev/button/`
- `/dev/label/`
- `/dev/chip/`
- `/dev/section-header/`
- `/dev/testimonial/`
- `/dev/brand/`
- `/dev/disclosure/`
- `/dev/testimonial-rotator/`
- `/dev/header/`
- `/dev/hero/`

Each preview has its own page and reads typed specimen copy from
`src/content/dev`. The primitive previews put light-only/dark-only variants on
appropriate flat swatches within the Cream and Brine bands.
