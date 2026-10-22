# About and Services / Plan (#20, #21)

Implemented in PR #46 alongside #32 after the repo owner explicitly handed
#20 and #21 to this Codex session. Both issues were ready and already marked
in progress. Build and Grow service content remains in #22 and #23.

## Reference and content

- About: `design/Website - About.dc.html`, 1a, at 1280 and 390.
- Services: `design/Website - Services.dc.html`, 1a, at 1280 and 390.
- Literal copy was extracted from the artboard markup, and template data from
  the design's own `renderVals()` function. `design/` was not edited.
- About uses the expanded `about` singleton and two typed `team` entries.
- Services uses a `servicesPage` singleton and three typed `services` entries.
  Each service number must match its branch prefix. Contact prefill now reads
  these entries, including the full names of 01.1 and 01.3.

## Local browser checks

Chromium checks passed for:

- All 34 checked About strings and all 30 checked Services strings, including
  every founder bio and all 15 included items, against the original design data.
- One `h1` per page, shared header and footer, and no browser script errors.
- Layout at 320, 375, 390, 768, 1280 and 1440px with no horizontal overflow.
- Both founder slots preserving a 4:5 ratio at every checked width. Placeholders
  are decorative SVGs; real photos and alt text remain part of #33.
- Grow's ingredient label on About and its jump-card label using Brine on light
  backgrounds. Branch order remains Plan, Build, Grow.
- Each disclosure opening with Enter, closing with Space, updating
  `aria-expanded`, referencing its own panel, and containing exactly five items.
- Plan, Build and Grow jump cards reaching their own uncovered targets on both
  desktop and phone. Build and Grow targets are labelled anchor slots.
- All three Ask links passing the service number, selecting Plan on Contact
  and prefilling the full service name in the message.
- All 15 included items remaining visible with JavaScript disabled.
- Reduced motion removing disclosure and jump-card transitions.
- The existing four-variant CTA preview continuing to render after the page
  singleton was renamed to `servicesPage`.

## Visual comparison

Local page screenshots and rendered reference artboards were captured at 1280
and 390. About's desktop section positions and heights match the reference;
Services' intro and Plan band match, and the desktop service card heights are
within two pixels of the reference. Phone spacing follows the phone artboards.
Tablet jump-card artwork shrinks to keep its title and image from overlapping.

The phone service cards retain the Ask links required by #21. The phone artboard
omits them, so the cards have additional height for those usable links. Desktop
uses the design's Ask placement. The 01.3 name is **Brand and naming projects**,
as specified by the design and issue; the brief's shorter "brand work" is not used.

The workspace's enforced network policy excludes Netlify preview hosts. Its
preview request was rejected with HTTP 403 at the proxy. Consequently, these
are local checks, and the PR remains a draft pending the Deploy Preview review
and the account-dependent #32 checks. Screenshots taken from the deployed pages
still need to be compared and attached at 1280 and 390.
