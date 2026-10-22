# Services / Build and Grow (#22, #23)

Added to PR #46 on the repo owner's explicit instruction to build both issues
on the existing #21 implementation before it merges. Both remain in the Codex
lane and are marked in progress.

## Reference and content

- `design/Website - Services.dc.html`, option 1a, desktop 1280 and phone 390.
- Build's `web` object and Grow's service records were copied verbatim into
  typed `services` entries. No changes were made under `design/`.
- All three branches now use the same band and service template. Build supplies
  `howItStarts` and six `phases` instead of included items. Phase numbering,
  branch order and dot colours stay in code.
- Grow supplies five included items for each of its two services. Labels use
  Brine; Pepper is reserved for the band, disclosure circles and Ask underline.

## Local verification

Chromium checks cover:

- All 66 checked Services strings against the untouched design markup and data,
  including both Grow disclosures and every phase title and description.
- Six phases in an ordered list, in design order, with 44px dots and the
  Olive/Anchovy/Pepper cycle repeated twice. Text on the dots is Cream/Cream/Brine.
- Six timeline columns at 1280 and a vertical timeline at 390. Tablet widths
  also use the vertical layout to keep the text readable.
- Layout at 320, 375, 390, 768, 1024, 1199, 1280 and 1440 with no horizontal overflow.
- Build and Grow jump links reaching the real branch bands. The desktop header's
  Build link reaches the same uncovered target.
- All five service disclosures opening with Enter and closing with Space,
  updating ARIA state and each showing five exact items.
- Both Grow services' expanded content containing no Pepper-coloured text on
  Cream or Sand, at 390 and 1280.
- All six Ask links selecting the correct branch and prefilling the actual
  service number and full service name on Contact.
- All 25 included items and the six phases remaining visible without JavaScript.
- Reduced motion, no browser script errors, the existing CTA preview, and the
  previous About checks continuing to pass.

Final verification uses the generated static site, avoiding stale content in
the long-running development server after the schema change. The static output
contains the new “HOW IT STARTS” and “SIX PHASES” labels.

## Visual review and outstanding flags

Local screenshots were compared with the rendered, unchanged artboards at
1280 and 390. All branch band heights match. Desktop service heights differ
by less than two pixels due to the underline border. The phone cards retain
their required Ask links, which the phone artboard omits, adding about 52px to
Build and 58px to each standard service card.

The workspace's enforced network policy excludes Netlify preview hosts, so
deployed visual review and screenshot attachments remain outstanding. PR #46
stays a draft for that review and the existing account-dependent #32 checks.

Issue #22 asks whether Development and Hosting and care need separate service
entries because the Build jump card lists them. The implementation follows the
design's single 02.1 entry; that question is called out in the PR for review.
