// @ts-check
import { defineConfig, sharpImageService } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import settings from './src/content/settings/site.json' with { type: 'json' };
import { isIndexablePath } from './src/lib/seo-policy.mjs';

// Static output: every public page is prerendered. Keystatic adds the only
// on-demand routes, /keystatic and /api/keystatic/*, which run in the
// Cloudflare Worker (wrangler.jsonc). React renders the admin only.
export default defineConfig({
  output: 'static',
  site: settings.seo.siteUrl,
  // Each page has a small stylesheet. Inlining avoids a blocking CSS round trip.
  build: { inlineStylesheets: 'always' },
  image: {
    service: sharpImageService({
      // Preserve fine artwork and text in every negotiated image format.
      avif: { lossless: true, chromaSubsampling: '4:4:4' },
      webp: { lossless: true },
      png: { palette: false },
    }),
  },
  adapter: cloudflare({
    // Images stay optimised with Sharp at build time, so no Images binding.
    imageService: 'compile',
    // Prerender in Node, as before the adapter: Sharp and Satori (the social
    // cards) need it, and pages read the build's environment variables.
    prerenderEnvironment: 'node',
  }),
  // The site has no sessions, so the adapter adds no KV binding.
  session: false,
  integrations: [
    react(),
    keystatic(),
    sitemap({ filter: (page) => isIndexablePath(new URL(page).pathname) }),
  ],
  // Keystatic's admin and API routes have no trailing slash and 404 under
  // 'always'. Public pages are unaffected: the build still writes
  // /about/index.html, Workers' auto-trailing-slash handling redirects /about
  // to /about/, and links use the slash.
  trailingSlash: 'ignore',
});
