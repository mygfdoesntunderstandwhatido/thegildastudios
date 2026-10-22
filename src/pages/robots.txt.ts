import type { APIRoute } from 'astro';
import { getSettings } from '../lib/settings';
import { isPreviewBuild } from '../lib/seo-policy.mjs';

export const prerender = true;

export const GET: APIRoute = async () => {
  const { seo } = await getSettings();
  const rules =
    import.meta.env.DEV || isPreviewBuild()
      ? ['Disallow: /']
      : [
          'Allow: /',
          'Disallow: /keystatic',
          'Disallow: /api/',
          'Disallow: /dev/',
          'Disallow: /contact/thanks/',
          'Disallow: /404',
        ];
  return new Response(
    ['User-agent: *', ...rules, `Sitemap: ${new URL('/sitemap-index.xml', seo.siteUrl)}`, ''].join(
      '\n',
    ),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
