/**
 * The daily rebuild for the homepage feed band (#79). Instagram posts are
 * fetched at build time, so the site only shows a new post after it rebuilds.
 * The Worker's cron trigger (wrangler.jsonc, src/worker.ts) calls this once a
 * day, and it asks Cloudflare's deploy hook for a production build.
 *
 * Kept independent of Astro and the Workers runtime so it can be tested
 * without starting a real build.
 */

export interface RebuildEnvironment {
  /**
   * The production deploy hook's URL (Workers & Pages → thegildastudios →
   * Settings → Build → Deploy hooks), saved as a Worker secret. Anyone with
   * the URL can start a build, so it is never logged.
   */
  DEPLOY_HOOK_URL?: string;
}

const TIMEOUT_MS = 30_000;

/**
 * Starts a production build. Throws when the hook is missing or the call
 * fails, so the cron run shows as failed in Cloudflare instead of passing
 * quietly.
 */
export async function startRebuild(
  env: RebuildEnvironment,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const hook = env.DEPLOY_HOOK_URL?.trim();
  if (!hook) {
    throw new Error('[rebuild] DEPLOY_HOOK_URL is not set, so no build was started.');
  }
  let url: URL;
  try {
    url = new URL(hook);
  } catch {
    throw new Error('[rebuild] DEPLOY_HOOK_URL is not a valid URL, so no build was started.');
  }
  if (url.protocol !== 'https:') {
    throw new Error('[rebuild] DEPLOY_HOOK_URL must start with https://, so no build was started.');
  }

  let response: Response;
  try {
    response = await fetcher(url.href, {
      method: 'POST',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.name : 'unknown error';
    // The original error can quote the hook URL, so only its name is kept.
    // eslint-disable-next-line preserve-caught-error
    throw new Error(`[rebuild] The deploy hook could not be reached (${reason}).`);
  }
  if (!response.ok) {
    // Cloudflare's error body names the problem, such as a deleted hook. It never contains the URL.
    const body = await response.text().catch(() => '');
    throw new Error(`[rebuild] The deploy hook answered ${response.status}. ${body.slice(0, 300)}`);
  }
  await response.body?.cancel();
  console.log('[rebuild] Started a production build for the latest Instagram posts.');
}
