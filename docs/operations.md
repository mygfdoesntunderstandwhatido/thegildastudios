# Forms, analytics and routing

Implementation for #32. Contact delivery moved to Cloudflare in #52; its account
setup and live checks below are still required before launch.

## Contact form

`/contact/` posts URL-encoded fields to the on-demand Astro route `/api/contact`. `wrangler.jsonc` sends this path to the Worker before static asset handling. The server validates required fields, email, a phone when Call is selected, known service numbers and branch selections. It derives branch values from the validated needs, including for native forms. Every email labels `name`, `email`, `business`, `phone`, repeated `needs`, `preferred`, `message`, `service` and `branch`.

The hidden `bot-field` honeypot discards filled submissions without email. Turnstile is verified on the server, including hostname and the `contact` action. Missing, expired or failed tokens send no email. HTTP, network and delivery errors keep the enhanced form’s values and enable retry; the widget resets because tokens are single-use. Requests time out in the browser after 20 seconds. No submitted values or provider errors are logged by the handler.

Successful enhanced submissions show the existing confirmation; `Form submitted` is emitted only after the email binding accepts the send. A provider acceptance is not proof of inbox delivery. Native submissions with a valid Turnstile token receive a 303 to `/contact/thanks/`. **With JavaScript completely disabled, Turnstile cannot issue a token.** The page explains the email alternative, and the server rejects a missing token. This is an explicit deviation from #52’s full no-JavaScript criterion; do not bypass spam protection to make it pass.

`hello@thegildastudios.com` is a Google Workspace address, so the domain’s MX records point to Google and Cloudflare Email Routing can’t run beside them. The Worker sends each enquiry through [Resend](https://resend.com) (free tier: 3,000 emails a month, 100 a day) to the email in Site settings (`hello@`), and Google Workspace delivers it to the team. The sender is `website@thegildastudios.com` and the visitor’s address is the Reply-To. The Resend API key is the Worker secret `RESEND_API_KEY`. Addresses never come from a visitor-controlled field. This is email-only: no D1 copy, dashboard submission archive or automatic retry queue. A response lost after acceptance can lead to a duplicate if the visitor retries.

### One-time setup (Chris)

1. **Resend account.** Sign up at resend.com. Domains → **Add Domain** → `thegildastudios.com` (region EU, Ireland).
2. **DNS records.** Resend lists a DKIM record (`resend._domainkey`) and an MX and SPF TXT record on the `send` subdomain. Add them in Cloudflare → `thegildastudios.com` → DNS → Records, with **Proxy status off** (DNS only), or use Resend’s Cloudflare auto-configure. They don’t touch Google Workspace’s records on the root domain. Back in Resend, choose **Verify DNS Records** and wait for **Verified**.
3. **API key.** Resend → API Keys → **Create API Key**: name `Website contact form`, permission **Sending access**, domain `thegildastudios.com`. Copy it; Resend shows it once.
4. **Turnstile.** Cloudflare → Turnstile → **Add widget**: mode **Managed**, hostnames `thegildastudios.com`, `www.thegildastudios.com` and `chris-aa-vella.workers.dev` (previews), pre-clearance **off** (it sets a `cf_clearance` cookie). Copy the site key and secret key.
5. **Worker settings.** Workers & Pages → `thegildastudios` → Settings:
   - **Build → Build variables and secrets:** `PUBLIC_TURNSTILE_SITE_KEY` = the site key. It’s read when the site builds.
   - **Variables and Secrets**, under both **Production** and **Previews Base**, as type **Secret**: `TURNSTILE_SECRET_KEY` = the Turnstile secret key, and `RESEND_API_KEY` = the Resend key.
   - Previews Base changes reach new previews only. For an existing preview, run `npx wrangler preview secret put <NAME> --name <branch>` for each secret.
6. **Rebuild and test.** Re-run the latest build (or push), then send a clearly labelled enquiry from the preview at 390 and 1280. Check it reaches `hello@` (and spam), that Reply-To is the visitor, and that branch and service are filled in. Resend → Emails shows each send. Check DevTools shows no cookies.

### Local checks

- `node --test scripts/contact.test.ts` exercises validation, spoofed services, honeypot, token checks, email payloads and provider failures with injected stubs; it sends no real email.
- `PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build` includes Cloudflare’s public dummy widget for local browser checks only.
- `npx playwright test tests/contact` exercises the enhanced UI with an intercepted widget and POSTs.
- `npx wrangler dev --port 8787` serves the built Worker. Use an ignored `.dev.vars` for local test configuration, never real visitor data. Leave `RESEND_API_KEY` unset locally (the handler then answers 503 before sending), or use a test key and Resend’s test recipients; a real key sends real email. Dummy Turnstile tokens still need the corresponding test secret and Siteverify connectivity; local stubs do not establish real spam protection or email delivery.

## Optional Plausible integration

The provider choice remains a review decision from #32. Plausible is prepared
because it supports page views and the required custom events. No subscription
has been started or activated. Analytics is disabled until the installation
script URL is configured.

If Plausible is chosen:

1. Add the site to the Plausible account and copy the account-specific HTTPS
   script URL from its current installation snippet (`…/js/pa-….js`). The
   integration uses the current `plausible.init` API, not the legacy
   `data-domain` snippet.
2. Set the public build variable `PUBLIC_PLAUSIBLE_SCRIPT_URL` in Netlify and
   rebuild. It contains a public script URL, never an API key.
3. Add these custom event goals, matching names exactly: `Book a chat`,
   `Book a call`, `Ask about this service`, `Form submitted`.
4. In the provider's measurements, keep automatic form submissions disabled:
   this form explicitly records `Form submitted` only after an accepted POST.
5. Confirm page views and all four goals in Plausible. Check DevTools for cookies
   and storage. Test failures must not produce a `Form submitted` conversion.

Contact links rendered by `Button` are marked automatically for click tracking,
including future service links built with `contactHref({ service: '01.2' })`.
The form's submit button records `Book a call` clicks independently of whether
validation succeeds. Accepted submissions record `Form submitted` once. Event
calls contain only the event name. Form values are never passed to analytics;
the initialization transform removes query strings and hashes from page URLs.
The integration does not use cookies or browser storage.

Development, Netlify branch deploys and Deploy Previews do not load the remote
tracker by default. To verify on a Deploy Preview, set the build variable
`PLAUSIBLE_INCLUDE_PREVIEWS=true` for that context and rebuild; remove it when
verification is finished. If no Netlify `CONTEXT` is present, a local production
build with an explicit script URL also enables the integration for local testing.

## Missing pages and redirects

Astro emits the branded `dist/404.html`. Netlify uses it with status 404 for
unknown URLs. There is no catch-all rewrite to a 200 page. The header and footer
are shared with the rest of the site, and page copy is in the typed
`systemPages` content collection.

`public/_redirects` preserves the old `/work` and `/work/*` paths with 301
redirects to Projects. Query strings are preserved by Netlify. Astro uses
`trailingSlash: 'always'` and Netlify's Pretty URLs normalizes directory routes;
there is no wildcard slash redirect that could loop. Verify `/projects` and
`/contact` redirect to their slash equivalents on the Deploy Preview.

The apex-to-`www` redirect belongs to the primary-domain configuration in #33.
No hostname redirect is forced here: it would redirect away from working
preview URLs before the production domain is set up. Confirm that Netlify
redirects the apex once `www.thegildastudios.com` is its primary domain.

## Verification record

Local Chromium checks use intercepted POST responses and a mocked provider;
they do not demonstrate real Netlify delivery, spam rejection or dashboard data.

- Invalid fields prevent a request and focus the first error; choosing Call
  requires a phone number.
- HTTP and network failures retain values, show a focused error and enable retry.
  Repeated submission while a request is pending produces one POST.
- A successful POST hides the form, focuses confirmation and emits one conversion.
- Unicode, `&` and `+` values and repeated branch fields survive URL encoding.
- Service and branch prefill, branch deselection and malformed/unknown service
  values are checked.
- With JavaScript disabled, the native POST fields and the confirmation redirect
  are checked against an intercepted backend.
- The 404 and confirmation pages reflow at 320, 375, 390, 768, 1280 and 1440px;
  Contact reflows at 375, 390, 768, 1280 and 1440px. Local 390/1280 screenshots
  were taken. **Existing #26 issue for device QA #31:** the Contact intro's
  fixed 52px phone headline overflows the viewport by 12px at 320px. The form
  and the new system pages fit.
- With analytics enabled in a local production build, each CTA queues the correct
  event, invalid submissions do not emit conversions, one accepted submission
  emits one conversion, URLs lose queries/hashes, and no cookies or local storage
  are created. The provider script is mocked, so actual page views and dashboard
  receipt remain unverified.

Before launch, verify on a Cloudflare preview:

- [ ] A real submission arrives in both inboxes and includes branch/service
      (see [Contact form](#contact-form) for the one-time setup).
- [ ] A filled honeypot or a failed Turnstile check sends no email.
- [ ] The chosen analytics provider receives page views and all four event goals,
      with no cookies or submitted personal information.
- [ ] An unknown nested URL returns the branded page with status 404.
- [ ] `/work` and `/work/cs-butcher` return 301 to `/projects/` and
      `/projects/cs-butcher/`, including query-string preservation.
- [ ] Directory routes normalize trailing slashes without a loop.
- [ ] The 404 and confirmation pages are visually reviewed at 1280 and 390px.
