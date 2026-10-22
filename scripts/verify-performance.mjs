// Build-level budgets include inline scripts, which Lighthouse's script
// transfer budget counts as part of the document rather than as JS resources.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { posix } from 'node:path';
import { gzipSync } from 'node:zlib';
import sharp from 'sharp';

// A CSS mask is defined by its alpha, so compression must preserve that data.
const mask = 'src/assets/logos/mask-engraved';
assert.deepEqual(
  await sharp(`${mask}.webp`).extractChannel('alpha').raw().toBuffer(),
  await sharp(`${mask}.png`).extractChannel('alpha').raw().toBuffer(),
);
assert.ok((await readFile(`${mask}.webp`)).length < 150 * 1024, 'CSS mask exceeds 150 KiB');

const text = (file) => readFile(file, 'utf8');
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const sitemap = await text('dist/sitemap-0.xml');
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);
const report = [];

for (const path of paths) {
  const html = await text(`dist${path}index.html`);
  assert.ok(!html.includes('<astro-island'), `${path}: public React island`);
  const preloads = [...html.matchAll(/<link\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => attribute(tag, 'rel') === 'preload' && attribute(tag, 'as') === 'font');
  assert.equal(preloads.length, 2, `${path}: exactly two font preloads`);
  assert.deepEqual(preloads.map((tag) => attribute(tag, 'href')).sort(), [
    '/fonts/archivo-400-600.woff2',
    '/fonts/gilda-display-400.woff2',
  ]);
  const css = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)]
    .map((match) => match[1])
    .join('\n');
  assert.ok(gzipSync(css).length <= 12 * 1024, `${path}: CSS exceeds 12 KiB gzip`);
  assert.ok(!/<link\b[^>]*rel="stylesheet"/.test(html), `${path}: blocking stylesheet request`);

  // Astro images reserve their intrinsic ratio, even while loading lazily.
  for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.ok(Number(attribute(image, 'width')) > 0, `${path}: image width`);
    assert.ok(Number(attribute(image, 'height')) > 0, `${path}: image height`);
    assert.ok(attribute(image, 'srcset'), `${path}: responsive image sources`);
    assert.ok(attribute(image, 'sizes'), `${path}: responsive image sizes`);
    assert.ok(['eager', 'lazy'].includes(attribute(image, 'loading')), `${path}: image loading`);
  }
  for (const [, picture] of html.matchAll(/<picture\b[^>]*>([\s\S]*?)<\/picture>/g)) {
    assert.ok(picture.includes('type="image/avif"'), `${path}: AVIF source`);
    assert.ok(picture.includes('type="image/webp"'), `${path}: WebP source`);
  }

  const scripts = [];
  const seen = new Set();
  async function measure(source, file) {
    assert.ok(
      !/react-dom|react\.production|jsx-runtime|\bcreateRoot\b/.test(source),
      `${path}: React runtime`,
    );
    const element = source.match(/customElements\.define\(["'`]([^"'`]+)/)?.[1];
    const name = element || (source.includes('data-gilda-analytics') ? 'analytics events' : file);
    const gzip = gzipSync(source).length;
    const limit = element === 'gilda-hero-mark' ? 5 * 1024 : 3 * 1024;
    assert.ok(gzip < limit, `${path}: ${name} exceeds ${limit} gzip bytes`);
    scripts.push({ name, bytes: Buffer.byteLength(source), gzip });
    for (const [, dependency] of source.matchAll(/(?:from\s*|import\s*)["'`]([^"'`]+\.js)["'`]/g)) {
      await external(posix.resolve(posix.dirname(file), dependency));
    }
  }
  async function external(url) {
    assert.ok(url.startsWith('/_astro/'), `${path}: unexpected script URL ${url}`);
    if (seen.has(url)) return;
    seen.add(url);
    await measure(await text(`dist${url}`), url);
  }
  for (const [, attributes, source] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (attribute(attributes, 'type') === 'application/ld+json') continue;
    const src = attribute(attributes, 'src');
    if (src) await external(src);
    else await measure(source, `${path}inline`);
  }
  const gzip = scripts.reduce((sum, script) => sum + script.gzip, 0);
  assert.ok(gzip <= 10 * 1024, `${path}: total JS exceeds 10 KiB gzip`);
  report.push({
    path,
    jsBytes: scripts.reduce((sum, script) => sum + script.bytes, 0),
    jsGzip: gzip,
    cssGzip: gzipSync(css).length,
    scripts,
  });
}

await mkdir('.lighthouseci', { recursive: true });
await writeFile('.lighthouseci/assets.json', `${JSON.stringify(report, null, 2)}\n`);
console.table(
  report.map(({ path, jsBytes, jsGzip, cssGzip }) => ({ path, jsBytes, jsGzip, cssGzip })),
);
console.log('Public-page image, font, CSS and per-component JS budgets passed.');
