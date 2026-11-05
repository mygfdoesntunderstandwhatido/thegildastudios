# Performance checks (#30)

This work is batched with SEO #28 in PR #48 under the user's instruction to
proceed before #28 closes. Accessibility fixes remain in #29.

## Loading and caching

- The two font preloads are Gilda Display and the normal-width Archivo body
  font. The expanded button face and mono labels load through CSS when used.
  The five published WOFF2 files total 102,896 bytes, are Latin/Latin Extended
  subsets (including Maltese), and retain their OFL licences. Font sources and
  binary files are unchanged. The expanded fallback was calibrated to the
  shared “Book a chat” label so the next hero button and header do not move
  when it swaps; vertical metrics remain matched.
- Page CSS is inlined to avoid a blocking request. Every public page stays
  below the 12 KiB gzip CSS budget. Tokens remain available for the existing
  components; no design tokens or global brand values were removed.
- Images retain responsive `srcset` / `sizes`, AVIF/WebP sources, intrinsic
  dimensions, and lazy loading below the fold. The base hero mark is eager
  with high fetch priority. Invisible hero overlays stay in templates until
  their first use. Each selected overlay loads eagerly with low priority,
  preserving the mark's reserved aspect ratio; without JavaScript the base
  mark is still present.
- Images come in two kinds (#90). **Artwork** (the mark, illustrations,
  logos) is encoded lossless at quality 100 (#64). **Photographs and other
  editor uploads** (team portraits, project cards, case-study heroes and
  galleries) use `PHOTO` from `src/lib/images.ts`: lossy AVIF first, at
  quality 80 with 4:4:4 chroma, then WebP. `src/lib/image-service.ts` switches
  the encoders from lossless to lossy below quality 100. Most uploads are
  JPEGs already, and lossless re-encoding only preserved their artefacts at
  four to five times the size. At 1280, image bytes fell by 54% on About and
  75–78% on each case study.
- `test:performance` keeps both kinds honest. Artwork must decode to exactly
  the pixels of its lossless PNG. A photograph (`<picture data-photo>`) must
  stay within a PSNR floor of its PNG: 32 dB for AVIF and 27 dB for WebP,
  just under the lowest measured values (33.7 and 28.5 dB, on dense foliage
  at 354px, which looks the same as the PNG at 2×). The Lighthouse image and
  transfer limits per page are in `lighthouserc.cjs`.
- A case study can set a separate hero image for phones (#91).
  `HeroPicture.astro` adds it as `<source media>` entries with their own
  PNG reference, so the verification and ratio tests apply to it too.
- The decorative engraved mask uses a lossless WebP at its original 823×1000
  resolution, reducing it from 259 KB to 110 KB. Its alpha channel is
  byte-identical to the PNG; CSS `image-set` retains that PNG as a fallback,
  in every place the mask is used (the case-study highlight panel since #90).
- Cloudflare caches hashed `/_astro/*` resources for one year with `immutable`.
  Stable-name `/fonts/*` resources cache for one week without `immutable`.
  HTML and other stable-name resources keep Workers' default and revalidate on
  every request. The rules are in `public/_headers`. Workers joins the values of
  every matching rule, so it has no catch-all `Cache-Control` rule.

## Checks to run

Use Node 24 and a local Chrome/Chromium executable. On this workspace:

```bash
npm ci
npm run lint
npm run format:check
npm run check
npm run build
npm run test:seo
CHROME_PATH=/usr/bin/chromium npm run test:performance
CHROME_PATH=/usr/bin/chromium npm run lighthouse
```

Run Astro's check and build sequentially: the adapter uses shared generated
files. Let Lighthouse run without competing browser tests. GitHub's Ubuntu
runner uses its installed `/usr/bin/google-chrome`; there is no extra browser
download or external Lighthouse service.

`test:performance` verifies the actual build's image contracts, exactly two
font preloads, inline CSS budget and all public JavaScript, including inline
scripts and shared imports. It then runs 18 Chromium checks at 390 and 1280px:
page-load layout shift for the six required page types, first-use hero overlay
requests, stable rotator height, filter/disclosure control anchors, mobile-menu
document height, and deployed cache configuration on the local lab server.
Hero image geometry is measured with focus-driven scrolling suppressed;
keyboard navigation itself belongs to #29.

The test server serves the unmodified `dist/client/` output, uses gzip for text
as Cloudflare does at the edge, and reads cache rules from `public/_headers`.
This is a local production-like lab measurement, **not a measurement of
Cloudflare's edge,
real mobile hardware, or field Core Web Vitals**. The optional remote analytics
provider is disabled in these measurements; remeasure if it is enabled.

## Lighthouse CI gates

`lighthouserc.cjs` collects three cold runs each for home, About, Services,
Projects, CS Butcher and Contact. Lighthouse's standard mobile simulated Slow
4G profile is used (150ms RTT, 1,638.4 Kbps throughput and 4x CPU slowdown).
The assertions use the median of the three runs per page:

- Performance, Best Practices and SEO each at least 95, and Accessibility at
  100 (#29).
- LCP at most 2,500ms, Google's threshold for a good LCP, and CLS exactly
  zero. Results are reported with the numeric CLS value, without rounding
  away small shifts. The LCP limit was 2,000ms until #33: with real photos
  the simulated LCP sat at 1,880–2,040ms, and passed or failed depending on
  the CI runner.
- Transfer and request-count limits from `lighthouse-budgets.json`, applied
  to every audited page. Build checks separately enforce less than 5 KiB gzip
  for the hero script, less than 3 KiB for every other component/module,
  10 KiB for total page JS, and 12 KiB for page CSS.

CI runs the checks after the static build and saves reports and browser traces
as `performance-reports`, including on failure. Reports stay local/artifacts;
there is no upload to a public Lighthouse server. `npm run lighthouse` exits
nonzero when an assertion fails. A separate negative check changed a copied
report’s Performance score to 94; the 95-point gate rejected it with exit code 1. The JSON summary is at
`.lighthouseci/summary.json`; per-page JS/CSS accounting is at
`.lighthouseci/assets.json`.

## Results and limits

| Page                    | Performance | Accessibility | Best Practices | SEO | Median LCP | CLS  |
| ----------------------- | ----------- | ------------- | -------------- | --- | ---------- | ---- |
| `/`                     | 99          | 100           | 100            | 100 | 1.887s     | 0.00 |
| `/about/`               | 100         | 100           | 100            | 100 | 1.730s     | 0.00 |
| `/services/`            | 99          | 100           | 100            | 100 | 1.878s     | 0.00 |
| `/projects/`            | 100         | 100           | 100            | 100 | 1.803s     | 0.00 |
| `/projects/cs-butcher/` | 100         | 100           | 100            | 100 | 1.654s     | 0.00 |
| `/contact/`             | 100         | 100           | 100            | 100 | 1.504s     | 0.00 |

The committed [Lighthouse results](qa/30-lighthouse.json) record the tool/browser,
throttling profile, three-run medians and individual LCP/CLS values. The
[asset report](qa/30-assets.json) lists every public page and component's raw and
gzip JavaScript sizes. Gzip sizes are the conservative sum of independently
compressed scripts, counting shared modules once per page; inline scripts are
actually transferred inside the compressed HTML document. JSON-LD is data and
is excluded from JS accounting. No public page loads React.

The issue's reference to “four islands” predates the complete site. The build
has the hero, branch strip, rotator, menu, filters/toggle chips, disclosures,
case-study pillars and contact form, plus the existing conditional analytics
event shim. Those required behaviors are preserved and measured individually;
React remains confined to the Keystatic admin.

The rotator's grid reserves the tallest slide. The menu is a modal overlay.
Filters and disclosures intentionally change content height after input; their
control anchors remain stable. These checks do not claim that intentional
content expansion leaves the entire page at a fixed height.

The accessibility pass (#29) fixed the olive-on-sand contrast that held
home, About and Services at 95–96. Every audited page now scores 100, and the
gate requires it. See [the accessibility record](a11y.md).

## Contact verification (#52)

On Cloudflare’s builds (or when `PUBLIC_TURNSTILE_SITE_KEY` is set), Contact loads Cloudflare’s Turnstile script. The asset budget report lists this exact URL separately as `remoteScripts`; first-party JavaScript budgets remain unchanged. Those byte totals exclude the remote script and challenge iframe. Run a live Lighthouse check with the real widget before launch; a build without the site key does not measure verification overhead.
