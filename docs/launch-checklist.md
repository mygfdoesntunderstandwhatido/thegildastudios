# Launch checklist (#33)

Work through this list to put the site live on `www.thegildastudios.com`.
It is written so a relaunch can follow it again. Tick each item, or accept it
with a reason. Most items need an account (Cloudflare, Google, GitHub) or a
decision from the studio, so a person does them.

Items marked **(done)** are already in the repo; the rest are still to do.

## 1. Content: replace the placeholders

Every one is edited in Keystatic at `/keystatic` on a preview or production.

- [x] **Phone number** (done). Site settings → Phone is `+356 9969 0850`
      (link `tel:+35699690850`, no spaces), in the footer and on Contact.
      Site settings → Search and social previews → Confirmed public phone
      has the same number, so it is in the structured data.
- [ ] **Founder portraits** (About → Team): Maronia Falzon and Chris Vella,
      with alt text. Still the empty portrait slots.
- [ ] **Case-study images**: the card image, main image and gallery, each
      with alt text. Upload them at the sizes in
      [Image sizes](#image-sizes) so nothing important is cropped off.
  - [x] CS Butcher (done). The card and main images come from a
        405 × 305 mockup. They are sharp enough on a standard screen but
        soft on retina; replace them with the full-size mockup (at least
        2336 × 890) when there is one.
  - [ ] Drapp fuq Drapp: still the striped placeholders.
  - [x] Malta Business Network (done).
- [ ] **Homepage Selected work.** These cards use the case-study card
      images, so they update with the item above. Waiting on Drapp fuq
      Drapp.
- [ ] **Social profiles and address** (Site settings → Search and social
      previews): social profile URLs for `sameAs`, and the public locality or
      street address you are happy to publish. Both are left out of the structured data while empty (#28).
- [ ] Search the production build for leftover text. Both must find
      nothing: `grep -rl "0000 0000" dist/` and `grep -rl "Name Surname" dist/`.
- [ ] Look through every page for the striped "PHOTO · Drag your image onto
      this to replace" placeholders. They are images, so a text search can't
      find them.

### Image sizes

The site crops every image to fill its slot, from the centre. An image
uploaded at the slot's own shape shows in full, so crop before uploading.

| Image                 | Shape        | Upload at (at least) | Also shown at                                                         |
| --------------------- | ------------ | -------------------- | --------------------------------------------------------------------- |
| Case-study main image | 21:8, wide   | 2336 × 890           | 16:9 on phones: keep the subject in the middle two thirds             |
| Case-study card image | 4:3          | 1080 × 810           | 4:5 on the homepage, 16:9 on phone Projects: keep the subject central |
| Case-study gallery    | 3:2          | 1080 × 720           | Same shape everywhere                                                 |
| Founder portrait      | 4:5, upright | 800 × 1000           | Same shape everywhere                                                 |

Square social posts with a flat background can be widened to 3:2 by
extending the background colour at the sides, instead of cropping off the
heading or the signature. That is how the Malta Business Network and CS
Butcher galleries were fitted.

## 2. Close the open flags from earlier issues

Each item records what the site does now. Tick it to accept, or change the
site and note the change.

- [ ] #3: `#F0DCD3` (anchovy label) and `#C9A77A` are used from the pages
      but are not design-system tokens. They are web tokens in
      `src/styles/tokens/`. Accept, or add them to the design system.
- [ ] #3: the web display scale goes up to 124px, past the design system's
      68px. Accept.
- [ ] #5: the unused `design/assets/logo-new/*.svg` and `design/assets/new/*.png`
      were not imported. Accept.
- [ ] #6: content is capped at 1280px with 56px gutters; bands run full
      width. Accept (checked at 1440 in [QA](qa.md)).
- [ ] #9: the open mobile menu is a proposal (not in the design). Sign off.
- [ ] #9: the header is not sticky. Accept.
- [ ] #9: the wording is "Book a chat" in the header and hero but "Book a
      call" in the CTA bands, as designed. Confirm.
- [ ] #10: the phone footer reads "About · Plan · Build · Grow" on every
      page. The Projects artboard shows "About · Services · Projects".
      Confirm.
- [ ] #11: section labels use the pages' .06em tracking, not the component's
      .1em. Accept.
- [x] #15: the shadow on the lit hero piece is the agreed exception to the
      flat brand. (done, agreed in planning)
- [ ] #15: on phones the mark lights on tap (the brief), though 2a says
      "without interaction". Accept.
- [ ] #15: under reduced motion the highlight still switches, without scale
      or fade. Confirm, or switch the highlight off too.
- [ ] #15: clicking a lit piece does not navigate; the strip links do.
      Accept.
- [ ] #18: the rotator autoplays every 8 seconds, with PAUSE, and never
      under reduced motion. Confirm the interval.
- [ ] #18: quote 3 keeps the client's hyphen ("events - be it"). Accept.
- [ ] #19: Selected work is on the homepage. Accept.
- [ ] #21: 01.3 is "Brand and naming projects", as in the design. Accept.
- [ ] #22: the Build jump card lists "Web design · Development · Hosting and
      care" but there is one Build service (02.1). Confirm.
- [ ] #24: the design's "Read more" toggles are not built (they are off in the
      design source). Accept.
- [ ] #25: Drapp fuq Drapp is written in the first person. Confirm.
- [ ] #26: the Contact page is a proposal (no design). Sign off.
- [ ] #26 / #32: "booking" is a request form, not a scheduling embed. Confirm.
- [ ] #28: `en-MT` / `en_MT` for the page language and `og:locale`. Confirm
      (Site settings → Search and social previews).
- [ ] #29: olive text on Sand is 6% darker than brand olive for AA contrast,
      and hovers darken or underline instead of fading. Accept (see
      [accessibility](a11y.md)).
- [ ] #32: analytics provider: Netlify Analytics or Plausible. See
      [operations](operations.md#optional-plausible-integration).
- [ ] #33: `hello@` email: Cloudflare Email Routing (free forwarding) or a
      hosted mailbox.

## 3. Email

The domain has no MX records yet, so `hello@thegildastudios.com` receives
nothing, and contact-form notifications depend on it.

- [ ] Choose forwarding (Cloudflare Email Routing) or a hosted mailbox
      (Google Workspace, Microsoft 365, Fastmail) and set it up.
- [ ] Add SPF, DKIM and DMARC records in Cloudflare.
- [ ] Send a test email to `hello@` and reply from it.
- [ ] The contact form delivers to `hello@` (#52). Check its sending setup
      matches the choice above ([operations](operations.md)).

## 4. Domain

`thegildastudios.com` is registered with Cloudflare Registrar, and the site
runs as the `thegildastudios` Worker in the same Cloudflare account (#51). DNS
stays in Cloudflare and needs no external records.

- [ ] Cloudflare → Workers & Pages → `thegildastudios` → Settings → Domains
      & Routes: add `www.thegildastudios.com` and `thegildastudios.com` as
      **Custom Domains**. Cloudflare creates the DNS records and the
      certificates.
- [ ] Make `www` canonical: a **Redirect Rule** sends
      `thegildastudios.com/*` to `https://www.thegildastudios.com/` with the
      same path, as a 301 that keeps the query string.
- [ ] SSL/TLS → Edge Certificates: turn on **Always Use HTTPS** and HSTS.
- [ ] In Keystatic, set Site settings → Search and social previews → Public
      site address to
      `https://www.thegildastudios.com`. This changes the canonical URLs,
      sitemap, `robots.txt` and social-card URLs in one place.
- [ ] Point the Keystatic GitHub App's callback URLs at the production
      domain.
- [ ] Check: `http://thegildastudios.com`, `https://thegildastudios.com` and
      `http://www.thegildastudios.com` all end at
      `https://www.thegildastudios.com/` with one redirect each.
- [ ] Leave the old Netlify project untouched for two weeks after launch as a
      fallback, then delete it.

## 5. Search and monitoring

- [ ] Verify the domain in Google Search Console (a DNS TXT record in
      Cloudflare) and submit `https://www.thegildastudios.com/sitemap-index.xml`.
- [ ] Optional: link a Google Business Profile.
- [ ] Uptime monitoring: Cloudflare notifications, or an external check on
      the homepage.
- [ ] Facebook Sharing Debugger and LinkedIn Post Inspector show the right
      previews for home, About, Services, Projects and one case study (#28).
- [ ] Google's Rich Results Test validates Organization and LocalBusiness
      with no errors (#28).

## 6. Final checks on production

- [ ] Lighthouse mobile on production: 95+ Performance, Best Practices and
      SEO, 100 Accessibility, for the six pages in `lighthouserc.cjs`.
- [ ] axe on production: no violations (the same checks as
      `npm run test:a11y`).
- [ ] Send the contact form on production. The message arrives at `hello@`
      and the thanks page shows.
- [ ] Analytics shows the visit and the form submission.
- [ ] Sign in to Keystatic on production, change some copy, save, and see the
      change deploy.
- [ ] Finish the browser checklist in [QA](qa.md#browser-checklist)
      (Safari, Firefox, Edge, Android) and the VoiceOver and NVDA runs in
      [accessibility](a11y.md#still-to-do).
- [ ] `/work` and `/work/*` redirect to `/projects/`, and an unknown URL
      shows the 404 page.

## 7. Hand over

- [ ] Brief the editors and walk Maronia through [editing](editing.md).
- [ ] Record the launch date and anything accepted with a reason in this
      file.
