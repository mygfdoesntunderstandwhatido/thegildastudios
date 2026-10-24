# Image sharpness and performance

Issue #64 prioritises image sharpness. Build-time Sharp produces lossless WebP,
lossless AVIF with 4:4:4 chroma, and full-colour PNG. Explicit quality parameters
change asset URLs and build-cache keys. Project heroes offer larger candidates,
capped at source resolution, including the existing 2100px originals.

The initial CI run passed lint, type checking, build, SEO, layout and accessibility
checks. Lighthouse failed because the earlier 200 KiB image / 400 KiB total and
2.5-second LCP budgets assumed lossy images. Initial image transfers ranged from
318 to 655 KiB on image-heavy pages; Home and About scored 87 and 86 respectively.

WebP-first delivery preserves identical visible pixels and transparency while
reducing transfers compared with AVIF-first delivery. A local mobile Lighthouse
audit using the same simulated Slow 4G configuration measured:

| Page       | Initial CI image KiB (AVIF) | Local image KiB (WebP) | Local score | Local LCP ms |
| ---------- | --------------------------: | ---------------------: | ----------: | -----------: |
| Home       |                         655 |                    442 |          92 |         3311 |
| About      |                         644 |                    543 |          89 |         3758 |
| Services   |                         319 |                    265 |          97 |         2635 |
| Projects   |                         462 |                    284 |          95 |         3006 |
| CS Butcher |                         318 |                    241 |          96 |         2706 |

Local results are medians from three runs per page, compared with initial CI
medians on a different machine. All 18 local Lighthouse runs passed the configured
assertions. The full summary is in `64-lighthouse.json`.

The limits below account for lossless delivery with room for measurement variance.
This explicitly accepts slower image loading in exchange for source fidelity.
They remain enforced as errors; accessibility, layout-shift, non-image resource
budgets and request counts retain their earlier requirements.

| Page                | Minimum performance | Maximum LCP ms | Maximum image KiB | Maximum total KiB |
| ------------------- | ------------------: | -------------: | ----------------: | ----------------: |
| Home                |                  86 |           4300 |               800 |               960 |
| About               |                  82 |           4800 |              1440 |              1600 |
| Services            |                  95 |           3000 |               320 |               480 |
| Projects            |                  88 |           4000 |               620 |               760 |
| CS Butcher          |                  94 |           3200 |               320 |               480 |
| Contact (unchanged) |                  95 |           2500 |               200 |               400 |

Home, About and Projects were re-measured on 24 October 2026 after new photos
were uploaded through the admin (#66, #67 and #63): new case-study covers and
heroes, and the two founder portraits in place of the placeholders. A lossless
640px portrait is about 700 KiB, and it competes with the hero mark (the LCP
element) on Slow 4G. Six local runs per page measured:

| Page     | Image KiB | Total KiB |    Score | LCP ms      |
| -------- | --------: | --------: | -------: | ----------- |
| Home     |       678 |       811 |  89 – 97 | 2558 – 3762 |
| About    |      1242 |      1368 |  85 – 92 | 3308 – 4429 |
| Projects |       520 |       644 | 91 – 100 | 1879 – 3533 |

The limits above add 15 to 20 % headroom to these byte counts. New or larger
photos can push a page past them again: re-measure and update both tables.

`lighthouserc.cjs` applies these limits only to the matching page. The baseline
resource budgets remain in `lighthouse-budgets.json`. The collection URLs and
assertion matrix use the same page list, so every collected page is checked.

The performance verification script also decodes generated AVIF and WebP images
and compares their visible RGBA pixels with matching PNG fallbacks. It ignores
only RGB values under fully transparent pixels, which lossless WebP may discard;
alpha must match exactly. This guards against reintroducing lossy encoding to
meet a transfer limit.

Cloudflare preview visual review remains pending. Layout checks cover 390px and
1280px locally; the read-only design source is untouched.
