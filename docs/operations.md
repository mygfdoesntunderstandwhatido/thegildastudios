# Forms, analytics and routing

Cloudflare hosting comes from merged [PR #55](https://github.com/mygfdoesntunderstandwhatido/thegildastudios/pull/55) (#50/#51). Contact delivery is implemented in #52. Account setup and real delivery checks below remain required before launch.

## Contact form

`/contact/` posts URL-encoded fields to the on-demand Astro route `/api/contact`. `wrangler.jsonc` sends this path to the Worker before static asset handling. The server validates required fields, email, a phone when Call is selected, known service numbers and branch selections. It derives branch values from the validated needs, including for native forms. Every email labels `name`, `email`, `business`, `phone`, repeated `needs`, `preferred`, `message`, `service` and `branch`.

The hidden `bot-field` honeypot discards filled submissions without email. Turnstile is verified on the server, including hostname and the `contact` action. Missing, expired or failed tokens send no email. HTTP, network and delivery errors keep the enhanced form’s values and enable retry; the widget resets because tokens are single-use. Requests time out in the browser after 20 seconds. No submitted values or provider errors are logged by the handler.

Successful enhanced submissions show the existing confirmation; `Form submitted` is emitted only after the email binding accepts the send. A provider acceptance is not proof of inbox delivery. Native submissions with a valid Turnstile token receive a 303 to `/contact/thanks/`. **With JavaScript completely disabled, Turnstile cannot issue a token.** The page explains the email alternative, and the server rejects a missing token. This is an explicit deviation from #52’s full no-JavaScript criterion; do not bypass spam protection to make it pass.

The user chose Cloudflare Email Routing (free forwarding) and supplied a backup inbox on 22 October 2026. Set that address in `CONTACT_BACKUP_EMAIL`; keep it out of public content and client bundles. Delivery uses `CONTACT_EMAIL`, a `send_email` binding, with sender `website@thegildastudios.com`, recipients `hello@thegildastudios.com` and the backup, and the visitor’s address as Reply-To. Addresses never come from a visitor-controlled recipient field. This is email-only: no D1 copy, dashboard submission archive or automatic retry queue. A response lost after acceptance can lead to a duplicate if the visitor retries.

### One-time setup (Chris)

1. Enable Email Routing for `thegildastudios.com` in Cloudflare. Add the required DNS records from the dashboard and configure `hello@` forwarding to a working, verified destination. Verify receiving mail before testing the form.
2. Verify both `hello@thegildastudios.com` (through its forwarding inbox) and the backup as destination addresses. The unrestricted binding can send only to account-verified destinations on the free routing setup. Onboard the sender domain as required by the email dashboard. Do not enable a paid sending plan for this implementation.
3. Set the Worker variable/secret `CONTACT_BACKUP_EMAIL` to the supplied address for **Production and Previews**. `CONTACT_EMAIL` is declared in `wrangler.jsonc`. Both recipients are sent in one binding call. Check both inboxes and spam folders.
4. Create a **Managed** Turnstile widget for the production and intended preview hostnames. Keep **pre-clearance disabled**: pre-clearance issues a `cf_clearance` cookie. Set `PUBLIC_TURNSTILE_SITE_KEY` as a public Workers Builds variable and `TURNSTILE_SECRET_KEY` as a Worker secret for Production and Previews. Rebuild after changing the site key. Never use dummy test keys on a deployed site.
5. Test the PR preview at 390 and 1280, then send a clearly labelled test enquiry. Confirm both inboxes receive all fields and Reply-To works. Confirm failed verification and a filled honeypot send nothing. Inspect actual browser cookies/storage before signing off the no-cookie requirement.

Cloudflare’s current [email pricing](https://developers.cloudflare.com/email-service/platform/pricing/) says sends to verified destinations are free even with routing only. See [binding configuration](https://developers.cloudflare.com/email-service/configuration/send-bindings/) and the [Workers API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/). The structured API supplies plain text and Reply-To without constructing MIME headers by hand. Turnstile [requires server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/); [pre-clearance](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/pre-clearance/) controls its clearance cookie.

### Local checks

- `node --test scripts/contact.test.ts` exercises validation, spoofed services, honeypot, token checks, email payloads and provider failures with injected stubs; it sends no real email.
- `PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build` includes Cloudflare’s public dummy widget for local browser checks only.
- `npx playwright test tests/contact` exercises the enhanced UI with an intercepted widget and POSTs.
- `npx wrangler dev --port 8787` serves the built Worker. Use an ignored `.dev.vars` for local test configuration, never real visitor data. Email is simulated locally. Dummy Turnstile tokens still need the corresponding test secret and Siteverify connectivity; local stubs do not establish real spam protection or email delivery.

## Optional Plausible integration

Plausible remains an unactivated provider choice from #32. Configure `PUBLIC_PLAUSIBLE_SCRIPT_URL` with its account-specific HTTPS script URL in Workers Builds to enable it. Create the goals `Book a chat`, `Book a call`, `Ask about this service` and `Form submitted`; disable automatic form-submission tracking. No subscription has been created by this work.

Production is selected by `WORKERS_CI_BRANCH=main`; other branches are previews. `SITE_CONTEXT=production|preview` overrides this for testing. Development and previews do not load analytics by default. The existing `PLAUSIBLE_INCLUDE_PREVIEWS=true` override is for deliberate verification only; leave it unset in deployed previews. Local builds count as production but load nothing without a script URL.

Event payloads contain only names. URL queries and hashes are removed. Form values never go to analytics. The implementation uses no browser storage; verify the configured provider on production before launch.

## Missing pages, redirects and caching

Astro writes `dist/client/404.html`. Workers assets uses `not_found_handling: "404-page"` to return it with status 404 for unknown routes. No catch-all 200 rewrite is used.

`public/_redirects` maps `/work` and named case studies to their Projects equivalents with 301 redirects. The migration used exact case-study paths because placeholder rules behaved differently on the deployed Worker. Check query-string preservation on the preview.

Astro uses `trailingSlash: 'ignore'` for admin compatibility; public links keep their slash, and Workers `html_handling: "auto-trailing-slash"` normalizes directory routes. `public/_headers` caches `/_astro/*` for a year as immutable and `/fonts/*` for a week. Other static responses use Workers’ default revalidation. Worker contact responses explicitly use `Cache-Control: no-store`.

Production custom domains, apex-to-www redirects, HTTPS and HSTS belong to #33. Use Cloudflare Worker Custom Domains and a Cloudflare Redirect Rule; do not redirect preview hosts to production.

## Remaining live checks

- [ ] Email Routing, both destination verifications and both Worker secrets/variables are configured.
- [ ] Real preview enquiry arrives in both inboxes with correct Reply-To, branch and service.
- [ ] Honeypot and failed Turnstile checks send no email.
- [ ] Real widget is reviewed at 390 and 1280 and creates no cookies with pre-clearance disabled.
- [ ] Full no-JavaScript requirement is resolved with the human; current fallback is email.
- [ ] Production analytics receives configured goals without personal data.
- [ ] Unknown nested paths return 404; redirects preserve queries and directory slashes do not loop.
