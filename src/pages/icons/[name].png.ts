import type { APIRoute, GetStaticPaths } from 'astro';
import { iconImage, iconSources } from '../../lib/seo-artwork';

export const prerender = true;

export const getStaticPaths = (() =>
  Object.keys(iconSources).map((name) => ({ params: { name } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const image = await iconImage(params.name as keyof typeof iconSources);
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/png' } });
};
