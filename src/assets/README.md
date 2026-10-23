# Web asset inventory

Originals are copied from the read-only `design/assets/` tree. `inventory.json`
lists every imported file, its intrinsic dimensions, usage, and each generated
variant's dimensions and byte size. Paths in that file are relative to this folder.

| Files                                                                           | Used by                                                                                 |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `logos/gilda-mark-on-dark.png`                                                  | Shared brand components on every ground; homepage hero and origin section; page footers |
| `logos/gilda-mark-full-colour.png`                                              | Full-colour brand mark, homepage reference                                              |
| `logos/mark-piece-0.png`, `mark-piece-1.png`, `mark-piece-2.png`                | Homepage interactive hero: olive / Plan, anchovy / Build, pepper / Grow, in that order  |
| `logos/mark-piece-map.png`                                                      | Hero hit testing; red = olive, green = anchovy, blue = pepper, transparent = none       |
| `logos/mask-engraved.png`, `mask-outline.png`                                   | Single-colour CSS masks for brand components                                            |
| `illustrations/01-olive-plan.png`, `02-anchovy-build.png`, `03-pepper-grow.png` | About, Services, homepage branch sections and case-study pillars                        |
| `graphics/photo-placeholder-feed.png`                                           | Source of the case-study placeholder images in `content/`                               |
| `content/`                                                                      | Images uploaded through the Keystatic admin, one folder per entry                       |
| `logos/app-icon-mark.png`                                                       | Reserved original for #28 app / site icons                                              |
| `logos/monogram-gs-*.png`                                                       | Reserved originals for #28 social metadata                                              |
| `logos/profile-picture-*.png`                                                   | Reserved originals for #28 social metadata                                              |

## Rendering contract for #8 and #15

Rendering components are outside #5. Use Astro's `Picture` from `astro:assets`
with `formats={['webp', 'avif']}` and `fallbackFormat="png"`. Import the original
PNG as image metadata, provide meaningful alt text (or empty alt for decorative
pieces), and set the actual layout width / height. Astro emits intrinsic dimensions.
For responsive widths, supply a matching `sizes` and widths no greater than twice
the rendered width. Generate small footer marks and height-constrained illustrations
from the originals with `astro:assets`; do not serve a hero-sized file in those slots.

Prebuilt `-<width>.avif`, `.webp` and `.png` files provide matching fallback sets:
hero widths 354, 708 and 823; illustration widths 96, 192, 280, 384 and 560,
capped at source width; photo widths 354, 708 and 1080. Width descriptors and
intrinsic height are recorded in `inventory.json`. These are alternatives, not
files to load together. These legacy prebuilt variants use AVIF quality 55 and
WebP quality 80; components import the originals instead. The build-time Sharp
service in `astro.config.mjs` generates lossless AVIF (4:4:4), lossless WebP and
full-colour PNG, preserving fine artwork and text without lossy recompression.
WebP comes first because its lossless output is smaller for the current assets.
Pictures explicitly set `quality={100}`, which also gives these outputs new
asset URLs and build-cache keys instead of reusing the previous lossy files.
Responsive case-study heroes include widths up to 2336px for their 1168px
desktop slot at 2× density, capped by Astro at the original image's width.

Hero originals and pieces share an 823 × 1000 canvas and remain registered.
A 708px hero would need 1416px for true 2× detail, but the source is only 823px.
Upscaling cannot add detail, so all output is capped at native resolution. The
250px-wide pepper similarly caps its larger derivatives at native resolution.

Import `mark-piece-map.png?url` directly for the canvas hit test. Never pass it
through an image service, resize it, or recompress it. Its original bytes and
823 × 1000 coordinate space are preserved. Masks keep their original PNG sources. In #30, `mask-engraved.webp` adds a native-size
lossless WebP for CSS image-set, with the original PNG as a format fallback. Its
alpha channel is byte-identical to the original mask.

## Validation and review

The map must compare byte-for-byte with the design original. The machine inventory
allows variant dimensions, registration and image budgets to be checked without
shipping any files: `src/assets` only emits assets that components import.
For the legacy lossy prebuilt variants at the largest native width, the base
hero plus all three pieces total 63,156
bytes in AVIF or 79,964 bytes in WebP (excluding the hit-test map). PNG
fallbacks total 1,145,936 bytes, so the 300 KB target relies on modern-format
negotiation. Avoid preloading multiple formats or both original and variant.

The current lossless delivery policy prioritises sharpness over the earlier
300 KB target. `lighthouserc.cjs` sets measured transfer, performance-score and
LCP limits for each image-heavy page; Contact retains the original limits.
Font, script, stylesheet, accessibility and zero-layout-shift requirements stay
unchanged. `scripts/verify-performance.mjs` decodes generated AVIF and WebP and
checks every visible pixel and alpha value against the matching PNG fallback.
See `docs/qa/64-image-quality.md` for measurements and the performance tradeoff.

CSS dots (`graphics/dot-*.png`, `branch-dots-*.png`) remain reference-only.
Wordmarks and lockups are typeset in #8; no raster text graphics are needed.
The unused Canva `logo-new/1–6.svg` files wrap rasters and are not imported.
The unused 2054px `new/*.png` variants remain in design pending Chris's decision
on whether they replace the current illustrations. No new runtime dependencies.
