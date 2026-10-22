# Search and social previews

Implemented in #28. Public pages have canonical URLs, English (Malta) language
metadata, Open Graph and Twitter cards, and Organization/LocalBusiness JSON-LD.
Case studies also have Home → Projects → project breadcrumbs.

## Editing

Every page and case study has **Page title and description** in Keystatic.
The studio name is appended once to page titles. The homepage keeps its complete
title, initially “The Gilda Studios · Digital and events, Malta”. Blank fields
use the defaults under **Site settings → Search and social previews**. Case
studies first fall back to their name and Projects card line. CI checks that
the resulting public titles and descriptions are unique.

The same settings contain the public site address, language/locale, social
profiles, approved address details and a confirmed phone number. Leave
unconfirmed information empty. The visible contact phone remains the existing
placeholder until #33; structured data deliberately does not publish it.
Social profiles populate `sameAs` only when supplied.

## Production domain and previews

The public site address starts as `https://thegildastudios.netlify.app`, the
current production origin recorded in README.md. When #33 connects the custom
domain, change it to `https://www.thegildastudios.com` and rebuild. This single
setting updates Astro's site URL, canonicals, cards, JSON-LD, sitemap and robots.
Never enter a Deploy Preview or content branch URL there.

Netlify Deploy Previews and branch deploys emit `noindex, follow` and
`Disallow: /`. Their canonical and image URLs still point to production.
Development pages, the 404 page and the contact confirmation are always
noindex. The sitemap contains only the eight current public pages, with new
published case studies added automatically. Admin/API routes, development
pages, image endpoints, system pages and drafts are excluded.

## Generated assets

- `/og/home.png`, `/og/about.png`, `/og/services.png`, `/og/projects.png`,
  `/og/contact.png` and `/og/projects/<slug>.png` are rendered at build time as
  1200×630 PNGs. They use the page headline (case study name and sector),
  Gilda Display, the approved cream lockup and ordered branch dots on Brine.
  The system pages also get cards. Draft studies get neither a page nor a card.
- `/icons/favicon-16.png` and `/icons/favicon-32.png` resize the approved GS
  monogram tile. The small favicon never uses the ingredient mark.
- `/icons/apple-touch-icon.png` is 180px from `app-icon-mark.png`. The same
  asset supplies the 192px and 512px manifest icons. The manifest colours
  come from the CSS tokens. `/icons/logo.png` is used in structured data.
- `/sitemap-index.xml` points to the generated public-page sitemap;
  `/robots.txt` points to the index.

New dependencies are `@astrojs/sitemap` for the sitemap, `satori` for typography
and layout, and a direct `sharp` dependency for PNG output. These endpoints
are all prerendered. Public pages receive no additional client JavaScript.
Artwork reads the versioned design fonts and lockup without changing `design/`.

## Verification and remaining review

Run `npm run build` then `npm run test:seo`. CI runs both. The tests inspect the
actual built HTML, sitemap, robots, JSON-LD, card dimensions and clear space,
icon pixels and manifest. Separate policy tests cover exclusions, preview
contexts, canonical path normalization and safe JSON-LD serialization.

Local results and artwork samples are in [the QA record](qa/28-seo.md).
Before closing the issue:

- Chris must confirm `en-MT` / `en_MT`, social profile URLs, publishable address
  and telephone. Country-only business address data is currently emitted;
  this is **not a claim of LocalBusiness rich-result eligibility**. Supply the
  approved address before the external validation below.
- On the deployed site, run the Facebook Sharing Debugger and LinkedIn Post
  Inspector for home, about, services, projects and a case study. Until this
  change is merged, production image URLs refer to assets not yet deployed;
  inspect `/og/…` directly on the Deploy Preview to review new artwork.
- Run Google's Rich Results Test for Organization and LocalBusiness after
  approved business details are entered. No external validation has been
  claimed from local JSON parsing.

Search Console verification and production-domain connection remain in #33.
