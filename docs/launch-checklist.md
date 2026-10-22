# Launch checklist (#33)

Work through this list to put the site live on `www.thegildastudios.com`.
It is written so a relaunch can follow it again. Tick each item, or accept it
with a reason. Most items need an account (Netlify, Cloudflare, Google,
GitHub) or a decision from the studio, so a person does them.

Items marked **(done)** are already in the repo; the rest are still to do.

## 1. Content: replace the placeholders

The build still shows these placeholders. Every one is edited in Keystatic at
`/keystatic` on the Deploy Preview or production.

- [ ] **Phone number.** Site settings → Phone shows `+356 0000 0000` in
      the footer and on Contact. Also fill Site settings → Search and social
      previews → Confirmed public phone, which adds the phone to the
      structured data (it is left out while empty).
- [ ] **Founder portraits** (About → Team): Maronia Falzon and Chris Vella,
      with alt text.
- [ ] **Case-study images** for CS Butcher, Drapp fuq Drapp and Malta
      Business Network: the card image, main image and gallery. The main and
      gallery images need alt text (Keystatic requires it).
- [ ] **Homepage Selected work.** These cards use the case-study card
      images, so they update with the item above.
- [ ] **Social profiles and address** (Site settings → Search and social
      previews): social profile URLs for `sameAs`, and the public locality or
      street address you are happy to publish. Both are left out of the structured data while empty (#28).
- [ ] Search the production build for leftover text. Both must find
      nothing: `grep -rl "0000 0000" dist/` and `grep -rl "Name Surname" dist/`.
- [ ] Look through every page for the striped "PHOTO · Drag your image onto
      this to replace" placeholders. They are images, so a text search can't
      find them.

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
- [ ] In Netlify → Forms → `contact`, add the email notification to
      `hello@` ([operations](operations.md#contact-form)).

## 4. Domain

`thegildastudios.com` is registered with Cloudflare Registrar, so it keeps
Cloudflare's nameservers. DNS stays in Cloudflare, and Netlify is set up as
external DNS. Do not move the nameservers to Netlify.

- [ ] Netlify → Domain management → Add a domain: add
      `www.thegildastudios.com` as the **primary domain**. Netlify adds the
      apex and redirects it to `www`.
- [ ] Cloudflare DNS: `CNAME www → thegildastudios.netlify.app`, **DNS only**
      (grey cloud).
- [ ] Cloudflare DNS: `CNAME @ → apex-loadbalancer.netlify.com`, **DNS
      only**. (Cloudflare flattens it. Fallback: `A @ → 75.2.60.5`.)
- [ ] If any `CAA` records exist, they allow `letsencrypt.org`.
- [ ] Netlify shows the domain verified and the certificate provisioned.
- [ ] Turn on Force HTTPS and HSTS.
- [ ] In Keystatic, set Site settings → Search and social previews → Public
      site address to
      `https://www.thegildastudios.com`. This changes the canonical URLs,
      sitemap, `robots.txt` and social-card URLs in one place.
- [ ] Point the Keystatic GitHub App's callback URLs at the production
      domain.
- [ ] Check: `http://thegildastudios.com`, `https://thegildastudios.com` and
      `http://www.thegildastudios.com` all end at
      `https://www.thegildastudios.com/` with one redirect each.

## 5. Search and monitoring

- [ ] Verify the domain in Google Search Console (a DNS TXT record in
      Cloudflare) and submit `https://www.thegildastudios.com/sitemap-index.xml`.
- [ ] Optional: link a Google Business Profile.
- [ ] Uptime monitoring: Netlify deploy notifications, or an external check
      on the homepage.
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
      and in Netlify Forms, and the thanks page shows.
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
