// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import settings from './src/content/settings/site.json' with { type: 'json' };
import { isIndexablePath } from './src/lib/seo-policy.mjs';

// Static output: every public page is prerendered. Keystatic adds the only
// on-demand routes, /keystatic and /api/keystatic/*, which the Netlify
// adapter serves from a function. React renders the admin only.
export default defineConfig({
  output: 'static',
  site: settings.seo.siteUrl,
  // Images stay optimised at build time, as before the adapter.
  adapter: netlify({ imageCDN: false }),
  integrations: [
    react(),
    keystatic(),
    sitemap({ filter: (page) => isIndexablePath(new URL(page).pathname) }),
  ],
  // Keystatic's admin and API routes have no trailing slash and 404 under
  // 'always'. Public pages are unaffected: the build still writes
  // /about/index.html, Netlify's pretty URLs add the slash, and links use it.
  trailingSlash: 'ignore',
});
