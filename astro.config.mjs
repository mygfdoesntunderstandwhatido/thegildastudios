// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import settings from './src/content/settings/site.json' with { type: 'json' };
import { isIndexablePath } from './src/lib/seo-policy.mjs';

// Static output: every public page is prerendered. The contact handler and
// Keystatic admin provide on-demand routes, which run in the
// Cloudflare Worker (wrangler.jsonc). React renders the admin only.
export default defineConfig({
  output: 'static',
  site: settings.seo.siteUrl,
  // Each page has a small stylesheet. Inlining avoids a blocking CSS round trip.
  build: { inlineStylesheets: 'always' },
  image: {
    service: {
      // Sharp runs at build time only. Quality 100 keeps these lossless
      // encoders for artwork (#64); photographs ask for a lower quality and
      // are encoded lossy (#90, src/lib/images.ts).
      build: {
        entrypoint: './src/lib/image-service.ts',
        config: {
          avif: { lossless: true, chromaSubsampling: '4:4:4' },
          webp: { lossless: true },
          png: { palette: false },
        },
      },
      // The Cloudflare adapter's runtime stub: the Worker serves prebuilt files.
      runtime: { entrypoint: '@astrojs/cloudflare/image-service-workerd' },
    },
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
