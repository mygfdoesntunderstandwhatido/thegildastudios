// The Worker's entry (wrangler.jsonc `main`). Astro's Cloudflare handler
// serves every request exactly as before. The daily cron trigger in
// wrangler.jsonc runs `scheduled`, which starts a production build so the
// homepage feed band shows the latest Instagram posts (src/lib/server/rebuild.ts).
import astro from '@astrojs/cloudflare/entrypoints/server';
import { startRebuild, type RebuildEnvironment } from './lib/server/rebuild';

export default {
  fetch: astro.fetch,
  // A rejected promise marks the cron run as failed in Cloudflare.
  async scheduled(_controller: unknown, env: RebuildEnvironment): Promise<void> {
    await startRebuild(env);
  },
};
