// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// Static output: every public page is prerendered. Keystatic adds the only
// on-demand routes, /keystatic and /api/keystatic/*, which the Netlify
// adapter serves from a function. React renders the admin only.
export default defineConfig({
  output: 'static',
  // Images stay optimised at build time, as before the adapter.
  adapter: netlify({ imageCDN: false }),
  integrations: [react(), keystatic()],
  // Keystatic's admin and API routes have no trailing slash and 404 under
  // 'always'. Public pages are unaffected: the build still writes
  // /about/index.html, Netlify's pretty URLs add the slash, and links use it.
  trailingSlash: 'ignore',
});
