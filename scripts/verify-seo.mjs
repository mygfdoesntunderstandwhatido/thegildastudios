// Verify the real Astro output, including generated images and draft exclusion.
// Run after npm run build. Set SITE_CONTEXT=preview for both to check a preview build.
import assert from 'node:assert/strict';
import { glob, readFile } from 'node:fs/promises';
import sharp from 'sharp';
import settings from '../src/content/settings/site.json' with { type: 'json' };
import { isIndexablePath, isPreviewBuild } from '../src/lib/seo-policy.mjs';

const text = (file) => readFile(file, 'utf8');
const origin = new URL('/', settings.seo.siteUrl).href;
const preview = isPreviewBuild();
const studies = [];
for await (const file of glob('src/content/case-studies/*.json')) {
  const data = JSON.parse(await text(file));
  const slug = file
    .split('/')
    .at(-1)
    .replace(/\.json$/, '');
  studies.push({ path: `/projects/${slug}/`, draft: data.draft });
}
const paths = ['/', '/about/', '/services/', '/projects/', '/contact/'];
paths.push(...studies.filter((entry) => !entry.draft).map((entry) => entry.path));
const titles = new Set();
const descriptions = new Set();
const canonicals = new Set();
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
function tag(html, element, name, value) {
  const matches = [...html.matchAll(new RegExp(`<${element}\\b[^>]*>`, 'g'))]
    .map((match) => match[0])
    .filter((match) => attribute(match, name) === value);
  assert.equal(matches.length, 1, `Expected one ${element} ${name}=${value}`);
  return matches[0];
}
const meta = (html, name) =>
  attribute(tag(html, 'meta', name.startsWith('og:') ? 'property' : 'name', name), 'content');
for (const path of paths) {
  const html = await text(`dist/client${path}index.html`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert.ok(title?.includes(settings.brand.name), `${path}: title`);
  titles.add(title);
  descriptions.add(meta(html, 'description'));
  const canonical = attribute(tag(html, 'link', 'rel', 'canonical'), 'href');
  assert.equal(canonical, new URL(path, origin).href);
  canonicals.add(canonical);
  assert.ok(html.includes(`<html lang="${settings.seo.language}">`));
  assert.equal(meta(html, 'og:locale'), settings.seo.locale);
  assert.equal(meta(html, 'og:title'), title);
  assert.equal(meta(html, 'og:description'), meta(html, 'description'));
  assert.equal(meta(html, 'og:url'), canonical);
  assert.equal(meta(html, 'twitter:card'), 'summary_large_image');
  assert.equal(meta(html, 'twitter:image'), meta(html, 'og:image'));
  assert.equal(meta(html, 'og:image:width'), '1200');
  assert.equal(meta(html, 'og:image:height'), '630');
  const image = new URL(meta(html, 'og:image'));
  assert.equal(image.origin, new URL(origin).origin);
  const png = await sharp(`dist/client${image.pathname}`).metadata();
  assert.equal(png.width, 1200);
  assert.equal(png.height, 630);
  assert.equal(png.format, 'png');
  // The fixed-size canvas must retain clear space on every edge. This catches
  // text and branch dots escaping the canvas even when dimensions are correct.
  for (const edge of [
    { left: 0, top: 0, width: 1200, height: 48 },
    { left: 0, top: 582, width: 1200, height: 48 },
    { left: 0, top: 0, width: 48, height: 630 },
    { left: 1152, top: 0, width: 48, height: 630 },
  ]) {
    const pixels = await sharp(`dist/client${image.pathname}`).extract(edge).png().toBuffer();
    const { channels } = await sharp(pixels).stats();
    assert.ok(
      channels.every((channel) => channel.min === channel.max),
      `${path}: card clipping`,
    );
  }
  assert.equal(html.includes('content="noindex, follow"'), preview);
  assert.ok(!html.includes('<astro-island'), `${path}: unexpected React island`);
  const json = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  const graph = JSON.parse(json)['@graph'];
  assert.equal(graph.find((item) => item['@type'] === 'Organization').email, settings.email);
  const business = graph.find((item) => item['@type'] === 'LocalBusiness');
  assert.equal(business.areaServed.name, 'Malta');
  assert.equal(business.address.addressCountry, 'MT');
  assert.equal(business.telephone, settings.seo.publishedPhone || undefined);
  assert.equal(business.address.addressLocality, settings.seo.locality || undefined);
  if (path.startsWith('/projects/') && path !== '/projects/') {
    const crumbs = graph.find((item) => item['@type'] === 'BreadcrumbList').itemListElement;
    assert.deepEqual(
      crumbs.map((item) => item.position),
      [1, 2, 3],
    );
    assert.equal(crumbs.at(-1).item, canonical);
  }
}
assert.equal(titles.size, paths.length, 'Public titles must be unique');
assert.equal(descriptions.size, paths.length, 'Public descriptions must be unique');
assert.equal(canonicals.size, paths.length, 'Public canonicals must be unique');
for (const file of [
  'dist/client/404.html',
  'dist/client/contact/thanks/index.html',
  'dist/client/dev/hero/index.html',
]) {
  assert.ok((await text(file)).includes('content="noindex, follow"'), file);
}
const sitemapIndex = await text('dist/client/sitemap-index.xml');
const sitemapPaths = [];
for (const [, url] of sitemapIndex.matchAll(/<loc>(.*?)<\/loc>/g)) {
  const sitemap = await text(`dist/client${new URL(url).pathname}`);
  for (const [, page] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const location = new URL(page);
    assert.equal(location.origin, new URL(origin).origin);
    assert.ok(isIndexablePath(location.pathname), page);
    sitemapPaths.push(location.pathname);
  }
}
assert.deepEqual(sitemapPaths.sort(), paths.toSorted());
const robots = await text('dist/client/robots.txt');
assert.ok(robots.includes(`Sitemap: ${origin}sitemap-index.xml`));
assert.equal(robots.includes('Disallow: /\n'), preview);
const manifest = JSON.parse(await text('dist/client/site.webmanifest'));
assert.equal(manifest.theme_color.toLowerCase(), '#24261a');
assert.equal(manifest.background_color.toLowerCase(), '#f3eee2');
for (const [name, source, size] of [
  ['favicon-16', 'monogram-gs-tile.png', 16],
  ['favicon-32', 'monogram-gs-tile.png', 32],
  ['apple-touch-icon', 'app-icon-mark.png', 180],
  ['app-192', 'app-icon-mark.png', 192],
  ['app-512', 'app-icon-mark.png', 512],
]) {
  const actual = await sharp(`dist/client/icons/${name}.png`).raw().toBuffer();
  const expected = await sharp(`src/assets/logos/${source}`).resize(size, size).raw().toBuffer();
  assert.deepEqual(actual, expected, `${name} must use the approved asset`);
}
for (const entry of studies.filter((entry) => entry.draft)) {
  assert.ok(!sitemapPaths.includes(entry.path));
}
console.log(
  `Verified SEO for ${paths.length} public pages, sitemap, JSON-LD, cards and icons (${preview ? 'preview' : 'production'}).`,
);
