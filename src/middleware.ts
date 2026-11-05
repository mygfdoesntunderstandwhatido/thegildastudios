import { defineMiddleware } from 'astro:middleware';

// The security baseline from public/_headers (#89). Static files get it from
// that file, which Workers doesn't apply to responses from Worker code, so the
// on-demand routes (/api/contact and the Keystatic admin) get it here. Keep the
// two lists in step. The report-only CSP stays on static pages: the admin
// loads its own scripts and talks to GitHub.
const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Frame-Options': 'SAMEORIGIN',
};

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (context.isPrerendered) return response;
  // Some responses (redirects, for example) have immutable headers, so copy them.
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
