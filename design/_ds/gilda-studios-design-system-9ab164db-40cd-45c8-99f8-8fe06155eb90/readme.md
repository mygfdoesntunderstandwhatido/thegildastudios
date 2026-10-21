# The Gilda Studios · Design System

The Gilda Studios is a Malta-based studio that runs a business's online presence and its events as one team. The name comes from the gilda, a Spanish tapa: an olive, an anchovy and a pickled pepper on one skewer. Each ingredient is one branch of the business, and the skewer is the single team that holds them together.

| Branch | Ingredient | Colour | Covers |
|---|---|---|---|
| 01 Plan | Olive | `#646E2C` | Project management, event management, on-the-day coordination |
| 02 Build | Anchovy | `#8A4B3B` | Web design, development, hosting and ongoing care |
| 03 Grow | Pepper | `#B8BC32` | Social media management, content and campaigns |

Tagline: **The right ingredients.** Support lines: *We'll take it from here.* (proposals, ads) · *Online and in the room.* (events, Plan).
Clients: local small businesses, hospitality & restaurants, startups, creators, mid-size B2B, nonprofits.

## Sources

This design system was copied from the **Gilda Studios Brand Concept** project (`https://claude.ai/design/p/912cdc5a-81f5-4f86-80b3-ee0465c8e60a`). The source files below live in that project, not this one. No codebase, Figma file or live website was provided.

- `The Gilda Studios Brand Book Landscape.dc.html` — **the final brand book (v1.0, A4 landscape, 22 pages).** Primary source of truth.
- `Gilda Studios Canva Kit/` — logos, illustrations, graphics, `04 Colour/colours.txt`, fonts (OFL .ttf), PPTX templates, `README.txt`. Source of truth for colour hex values and asset files.
- `Canva Templates - Feed 4x5 / Story 9x16 / Square 1x1.dc.html` and `Carousel 01–13 *.dc.html` — social templates.
- `Gilda Studios Brand Book.dc.html` — earlier exploration rounds. **Superseded**: it uses an older branch order (Grow / Build / Run) and swapped colour names. Don't take values from it.

## Index

- `styles.css` — entry point (imports only). Link this one file.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `fonts/` — Gilda Display, Archivo (400/500/600), IBM Plex Mono (400/500), OFL.
- `assets/logos/` — full-colour mark, lockups (stacked, horizontal) and wordmarks in `-brine` (for light grounds) and `-cream` (for dark), engraved mark, GS monogram, app icon, profile pictures, `mask-engraved.png` / `mask-outline.png` for single-colour CSS masks.
- `assets/illustrations/` — full gilda + one file per ingredient.
- `assets/graphics/` — branch dots, tagline/support line graphics, photo placeholders, `Highlight covers/`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/` — React primitives (see below). `dev/load-components.js` lets preview pages run them without the compiled bundle.
- `ui_kits/social/` — the 12 feed templates, browsable. `ui_kits/website/` — homepage. `ui_kits/print/` — business card, event pass, email signature.
- `SKILL.md` — agent skill entry.

### Components

- `core/` — **Button** (pill, expanded caps), **Label** (Plex Mono caps), **Chip** (outlined pill)
- `brand/` — **Mark**, **Wordmark**, **Lockup**, **Monogram**, **AppIcon**, **CreditLine**
- `branch/` — **BranchDot**, **BranchDots**, **BranchTag**, **BranchCard**
- `layout/` — **SectionHeader**, **RunningHeader**, **RuleColumn**, **SpecRow**
- `content/` — **Quote**, **DoDont**, **Swatch**
- `social/` — **Post** (1080px canvas, ground → ink pairing), **PostMeta**, **PhotoPlaceholder**

No component library existed in the source; this set was drawn from patterns that repeat across the brand book and templates. Image-based components resolve assets from `window.GILDA_ASSET_BASE + "assets/…"` (default `""`); set it if your page isn't at the project root.

---

## Content fundamentals

**Voice: plainspoken, sure of itself, never in a rush.** Personality is *Confident* (not loud), *Calm* (not vague), *Reliable* (not corporate).

Three rules from the brand book:
1. **Talk about their business, not ours.** Start with the client's week: bookings, the launch, the opening night. Services come second.
2. **Promise specifics.** Dates, names and numbers instead of adjectives. "Twelve posts a month. Planned by the 25th." If we can't commit to it, we don't say it.
3. **Leave the metaphors to the logo.** The illustration tells the gilda story; copy stays literal. No food puns, no "cooking up" campaigns.

| Instead of | We say |
|---|---|
| ~~Cooking up fresh digital flavours for your brand!~~ | We'll rebuild your site, plan the opening and run your Instagram. You'll have one number to call. |
| ~~Pull up a chair and let's chat about your vision.~~ | Your launch plan is ready. Three things need your sign-off by Friday. |

- **Person:** "we" for the studio, "you/your" for the client.
- **Casing:** sentence case for every headline ("Start with a conversation."). Headlines usually end with a full stop. Mono labels are UPPER CASE. Buttons are upper case with wide tracking.
- **Sentences:** short. Often two short sentences instead of one long one. Lists separated by `·` ("Web · Projects · Events · Social").
- **Naming:** "The Gilda Studios" in full the first time, then "the studio" or "we". Capital T at the start of a sentence, lower case mid-sentence ("work with the Gilda Studios").
- **Language:** English by default. Maltese for greetings and sign-offs on local channels (*Merħba*, *Grazzi*, *Saħħa*). Prices, dates and service details always in English. No Spanish beyond the word "gilda".
- **Credits:** "Built by" (websites), "Made by" (print, decks), "Produced by" (events).
- **Data formats:** dates `14.11` in labels, `Fri 14 Nov` in headlines; times `19:00`; status lines like `01 / Plan · Owner: Maria · Due 14.11`.
- **No emoji.** No exclamation marks in brand copy.

## Visual foundations

- **Colour.** Cream `#F3EEE2` leads (~50%), Brine `#24261A` gives rhythm (~30%) as text and dark bands, Sand `#E9E2D0` alternates light bands. Branch colours are accents: dots, labels and at most one coloured band per page. Social posts may use any palette colour as a full ground, one per post, rotated across the feed. Light grounds (Cream, Sand, Pepper pale, Pepper, Salt) take Brine text; dark grounds (Olive, Olive deep, Anchovy, Cure, Brine) take Cream. Pepper is never text on Cream. No pink, ever.
- **Branch dots** always appear olive, anchovy, pepper, left to right. On Brine use the lighter tints `#8E9A3C · #B86A55 · #B8BC32`. Pepper on light gets a faint inset ring.
- **Type.** Gilda Display for headlines, quotes and the wordmark (regular only, sentence case, tight leading .92–1.1). Archivo for body (400–600, 1.4–1.6 leading). IBM Plex Mono Medium for labels, numbers, dates, owners and status (upper case, .06em; running headers .1em). Buttons only: Archivo 600 at 125% width, .12em caps.
- **Layout.** Generous, calm space. Pages are 40/56px padded; bands 80/64px; social canvases 80px all round. A mono running header sits at the top of every page/post (section left, document/page count right). Content stacks with `justify-content: space-between`: meta on top, image in the middle, headline + body at the bottom. Grids of 3 or 4 equal columns.
- **Structure through rules, not boxes.** A 2px Brine rule opens a group; 1px Brine 20–25% divides rows; numbered section labels trail a hairline to the edge. On social, a 4px Olive or Pepper-pale rule opens an inner slide.
- **Cards & panels.** Square corners, flat fills (Paper `#FBF9F4` on Cream/Sand, Sand on Cream), no borders except a 1px inset ring on Cream swatches. No left-border accent cards.
- **Corner radii.** 0 on almost everything. Pills (99px) for buttons and chips; 22–25% on app icon and monogram tiles; 6px on product/browser frames; 12px on the event pass.
- **Shadows.** The brand is flat. Shadows appear only on physical or framed mockups: `0 1px 3px` on post tiles, `0 10px 30px` on print cards, a ring + `0 16px 40px` on browser frames.
- **Imagery.** The hand-painted gilda illustration (warm, naturalistic, slightly glossy) is the only illustration. It sits on Cream or Sand; it may bleed off the bottom-right corner of covers. Single ingredients mark a branch, one at a time. Photography (client work) goes into full-bleed slots; the kit ships striped placeholders. No gradients, textures, patterns or blur.
- **Transparency.** Only for hairlines (Brine or Cream at 12–40%). Never for text colour.
- **Motion & states.** None specified in the source. The components use a calm 150ms opacity fade on hover (to 86%) and a darker ground on hover for dark list items; no bounces, no scale on press. Treat this as a placeholder until real motion guidance exists.
- **Logo rules.** Never stretch, rotate, recolour the ingredients or add effects. Minimum 48px; below that use the GS monogram. Clear space = height of "G". Client work only ever carries the single-colour mark or type-only credit.

## Iconography

There is no icon set. The brand communicates with type, rules and three colour dots instead of icons.

- **Branch dots** are the only recurring symbol (`BranchDot`, `BranchDots`, or `assets/graphics/dot-*.png` / `branch-dots-*.png`).
- **The gilda mark** and single ingredients stand in for branch icons.
- **Unicode** is used sparingly as typography: `·` as a separator, `/` in counters (`01 / 06`), `“` as the oversized quote mark, `✕` on logo-misuse examples. No arrows or emoji.
- If a product UI later needs functional icons (menu, close, external link), pick a thin-stroke line set and flag it; none has been chosen.

## Intentional additions

- `dev/load-components.js` — lets cards and kits render from the `.jsx` sources when the compiled bundle isn't present.
- Hover/disabled states on `Button` — the source shows only static states.

## Caveats

- Fonts are the kit's OFL files. Archivo is only shipped as static normal-width weights, so the 125% expanded button style loads Archivo's variable font from Google Fonts.
- Single-colour marks use CSS masks; some screenshot tools render them as solid rectangles.
