# Shared foundations

`Base.astro` loads the self-hosted fonts, design tokens and `base.css`. Inspect
`/dev/base-styles` for all band grounds, links and focus, rules, decoration and
responsive grids. Its specimen copy lives in `src/content/dev/base-styles.ts`.

Use a full-width band with a container inside it:

```astro
<section class="band band--sand band--roomy" aria-labelledby="section-title">
  <div class="container">
    <h2 id="section-title">{content.title}</h2>
  </div>
</section>
```

- Grounds: `band--cream`, `band--sand`, `band--brine`, `band--pepper-pale`,
  `band--olive`, `band--anchovy`, `band--pepper`. Each establishes body, link,
  focus and rule colours, including when nested inside a different ground.
- Vertical padding: default 80px, `band--compact` 72px, `band--roomy` 96px,
  `band--spacious` 112px. Below 768px these become 48px, 48px, 56px and 56px.
  Scoped styles can override `--band-padding` for asymmetric section layouts.
- `.container` has 56px gutters, reducing to 24px below 768px.
  `.container--header` uses 20px on phone.
- The proposed wide-screen layout caps **content** at 1280px, excluding its
  gutters. The full container caps at 1392px on desktop. At the 1280px artboard,
  content is 1168px wide, preserving the design's 56px gutters. Bands remain
  full-bleed. This implements #6's proposal pending design review.
- Use `.grid` with `grid--three`, `grid--5-7`, `grid--6-5` or `grid--4-8`.
  Columns stack below 768px. The default gap is 32px; `grid--wide` uses 72px.
  Both gaps become 24px on phone.
- `.rule-open` adds a 2px top rule; `.rule-row` adds a 1px top rule.
  Light row rules use Brine at 25%, or 20% with `.rule-row--soft`. Dark row
  rules use Cream at 25%; dark opening rules use Cream at 35%.
- `.label` applies the shared mono label defaults. The Label component's
  additional sizes and tones are documented in [Shared components](../components/README.md).

For the About-style dark decoration, add `band--decorated` to a Brine band and
an empty `<div class="band__mark" aria-hidden="true"></div>` inside. It clips
the engraved mask, ignores pointer input and stays behind content. Its desktop
size is 494×600px at right 40px and bottom −160px; on phone it is 247×300px at
right −30px and bottom −90px, matching the About artboard. The fill is
`--olive-on-dark`. Scoped styles can override `--band-mark-width`,
`--band-mark-height`, `--band-mark-right`, `--band-mark-bottom` and
`--band-mark-color` for other placements. Add bottom padding when a phone
layout reserves room for the mark, as the preview does. This is a single
engraved mark, with no repeating pattern.
