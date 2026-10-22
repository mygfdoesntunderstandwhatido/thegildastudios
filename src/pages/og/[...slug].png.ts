import type { APIRoute, GetStaticPaths } from 'astro';
import { getSeoPages, ogPath, type SeoPage } from '../../lib/seo';
import { socialImage } from '../../lib/seo-artwork';

export const prerender = true;

export const getStaticPaths = (async () =>
  (await getSeoPages()).map((page) => ({
    params: { slug: ogPath(page.path).slice('/og/'.length, -'.png'.length) },
    props: { page },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const image = await socialImage(props.page as SeoPage);
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/png' } });
};
