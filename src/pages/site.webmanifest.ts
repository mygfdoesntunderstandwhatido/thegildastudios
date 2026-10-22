import type { APIRoute } from 'astro';
import { getSettings } from '../lib/settings';
import { themeColors } from '../lib/seo-artwork';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [{ brand }, colors] = await Promise.all([getSettings(), themeColors()]);
  return new Response(
    JSON.stringify({
      name: brand.name,
      short_name: brand.name,
      start_url: '/',
      display: 'minimal-ui',
      theme_color: colors.theme,
      background_color: colors.background,
      icons: [192, 512].map((size) => ({
        src: `/icons/app-${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any',
      })),
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
};
