# Contact delivery checks (#52)

Checked locally on 22 October 2026. This is not a live delivery sign-off.

- Server tests: 18 pass (`node --test scripts/contact.test.ts`). Covers labelled Unicode fields, both configured recipients, Reply-To, repeated needs, branch/service validation, phone requirement, native 303 with a valid token, honeypot, invalid/missing tokens, hostname/action mismatch, provider errors and bounded request bodies.
- Chromium contact tests: 5 pass (`npx playwright test tests/contact`, after building with the public dummy site key documented in operations). HTTP and network errors retain values and reset verification for retry. Accepted delivery emits one conversion; discarded honeypots do not. The form reflows at 390 and 1280. JavaScript-disabled visitors see the email fallback. The widget and POST are stubbed; this does not verify the live challenge’s appearance, cookies or spam detection.
- Built Worker: served with `npx wrangler dev --port 8787`; a filled honeypot returns `200 {"accepted":false}` without credentials, and a missing token returns 403. The route is reached through Workers assets rather than returning the static 404.
- Built route plus actual local email simulator: loaded the generated `dist/server/*.mjs` modules in Miniflare (bundled with Wrangler), with a stubbed outbound Siteverify response and dummy environment values. A synthetic enquiry returned `200 {"accepted":true}` using `CONTACT_EMAIL.send` with a structured message. No real email was sent. This confirms the generated route and binding API integrate, not real inbox delivery.
- SEO checks and the 18 performance checks pass. The performance report lists the exact Turnstile URL separately, since first-party byte budgets cannot measure remote script and challenge traffic.
- The accessibility suite passed 93 of 94 checks on its first run; the remaining test hit a shared Playwright trace-file collision with another test run, not a contrast assertion. The four hover-state tests were rerun with a separate output directory.

## Review gates

- Configure real Production and Preview keys, verify the sender domain and both email destinations, and confirm receipt/Reply-To in both inboxes.
- Check the real Managed widget at 390 and 1280 on the Cloudflare preview, compare the Contact layout against the approved page, and inspect cookies with pre-clearance disabled.
- Resolve the issue’s no-JavaScript requirement: Turnstile needs JavaScript. The implementation enforces verification, supports native POST with a token, and offers email when scripts are disabled.
- Email is the only stored copy. There is no D1 archive or automatic retry queue; a lost response after acceptance can result in a duplicate on manual retry.

## Documentation audit (#53)

Current hosting instructions use Cloudflare. `git grep -i netlify` still finds historical QA records, the launch checklist owned by #33 (explicitly outside #53), and transitive optional package entries under Astro → unstorage in `package-lock.json`. These are reported exceptions to #53’s literal zero-match criterion; the dependency graph and launch checklist were not rewritten as part of a docs-only issue. Hosting addresses and build commands match merged PR #55; delivery docs describe this batch’s #52 implementation and clearly distinguish pending account setup.

Batching is proposed to remain in place to reduce review load, replacing its old deploy-cost rationale. The human review decides whether to accept this or relax the rule.
