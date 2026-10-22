# Forms, analytics and routing

Implementation for #32. The code is prepared; the account configuration and live
checks below are still required before the issue can be considered complete.

## Contact form

`/contact/` contains the static `contact` form, with `data-netlify="true"`,
`form-name=contact` and the `bot-field` honeypot. Enable **form detection** in the
Netlify project and deploy this branch. Netlify must list a form named `contact`
before testing delivery. Netlify performs spam filtering; the hidden honeypot
field is submitted with both enhanced and native submissions.

The stored fields are `name`, `email`, `business`, `phone`, repeated `needs`
values, `preferred`, `message`, `service` and `branch`. The last two contain a
validated prefilled service number and the selected branch keys. Deselecting a
service's branch clears the hidden service number. Query-string prefill requires
JavaScript; without it, the visitor can select needs and submit the native form.
Service numbers and names come from the typed `services` collection, so the
homepage's shorter branch summaries cannot change a service's prefilled name.

With JavaScript, the form posts URL-encoded data to `/contact/thanks/`. It prevents
duplicate requests, waits for a successful response before displaying the approved
success message, and preserves values on HTTP, network or timeout errors. Requests
time out after 20 seconds. Without JavaScript, Netlify redirects the native POST
to the same confirmation page. The confirmation page itself is not evidence that
a particular submission was received.

In Netlify's form notifications, add email notifications for `contact` to
`hello@thegildastudios.com` **and a working backup inbox supplied by Chris**. The
backup is needed until domain email is configured in #33. No email notification
has been configured from this workspace, and a backup address has not been
selected. The #26 review approved a request form with no scheduling embed:
[recorded decision](https://github.com/mygfdoesntunderstandwhatido/thegildastudios/pull/45#issuecomment-6339440553).

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

Before marking #32 complete, verify on its Deploy Preview:

- [ ] Form detection lists `contact` and a real submission includes branch/service.
- [ ] The submission arrives in the dashboard and both email inboxes.
- [ ] A filled honeypot is rejected as spam, with no email notification.
- [ ] The chosen analytics provider receives page views and all four event goals,
      with no cookies or submitted personal information.
- [ ] An unknown nested URL returns the branded page with status 404.
- [ ] `/work` and `/work/cs-butcher` return 301 to `/projects/` and
      `/projects/cs-butcher/`, including query-string preservation.
- [ ] Directory routes normalize trailing slashes without a loop.
- [ ] The 404 and confirmation pages are visually reviewed at 1280 and 390px.
