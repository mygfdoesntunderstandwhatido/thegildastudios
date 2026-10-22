# Shared components

All visible copy is supplied by props or slots from typed data in `src/content`.
The components use Astro and scoped CSS. Only toggle chips, disclosures and the
testimonial rotator ship JavaScript.

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
name comes from `src/content/ui/testimonial.ts`; callers can supply `aria-label`.
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
`src/content/ui/disclosure.ts`, with single forms for one item). The trigger is
a native button with `aria-expanded` and `aria-controls`. It is closed by
default and the panel collapses with a 200ms row transition, which is removed
under reduced motion. Without JavaScript (`scripting: none`) the list renders
open with a static label. Circles and numbers follow the branch colours.

## TestimonialRotator (#18)

`content/TestimonialRotator.astro` renders the Brine "In their words" section
(`id="in-their-words"`) from `testimonials` collection entries, sorted by the
caller by `homeOrder`. Each slide is a dark `Testimonial`. All slides share one
grid cell to reserve the longest quote's height. Autoplay runs every 8 seconds.
It pauses on hover, focus within, the pause control and hidden tabs, and never
runs under reduced motion. Dot changes made by a visitor are announced politely.
Copy lives in `src/content/ui/testimonial-rotator.ts`.

## Previews

- `/dev/button/`
- `/dev/label/`
- `/dev/chip/`
- `/dev/section-header/`
- `/dev/testimonial/`
- `/dev/brand/`
- `/dev/disclosure/`
- `/dev/testimonial-rotator/`

Each preview has its own page and reads typed specimen copy from
`src/content/dev`. The primitive previews put light-only/dark-only variants on
appropriate flat swatches within the Cream and Brine bands.
