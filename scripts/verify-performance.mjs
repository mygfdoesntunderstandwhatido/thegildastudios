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
const candidates = (tag) =>
  (attribute(tag, 'srcset') ?? '').split(',').map((item) => item.trim().split(/\s+/));
const verifiedImages = new Set();

async function verifyLosslessImage(url, reference) {
  if (verifiedImages.has(url)) return;
  const decode = (file) => sharp(`dist/client${file}`).ensureAlpha().raw().toBuffer();
  const actual = await decode(url);
  const expected = await decode(reference);
  assert.equal(actual.length, expected.length, `${url}: decoded image size`);
  // Lossless WebP may discard RGB under fully transparent pixels. Those values
  // are invisible; every visible colour and every alpha value must stay exact.
  for (let offset = 0; offset < expected.length; offset += 4) {
    if (expected[offset + 3] === 0) {
      actual.fill(0, offset, offset + 3);
      expected.fill(0, offset, offset + 3);
    }
  }
  assert.ok(actual.equals(expected), `${url}: image encoding must preserve pixels and alpha`);
  verifiedImages.add(url);
}

// Photographs (`<picture data-photo>`, src/lib/images.ts) are lossy on purpose
// (#90). Each must stay this close to its lossless PNG. The floors sit just
// under the lowest measured values (AVIF 33.7 dB, WebP 28.5 dB: dense foliage at
// 354px, which looks the same as the PNG at 2x). A broken encoder or a much
// lower quality falls well below them.
const PHOTO_MIN_PSNR = { 'image/avif': 32, 'image/webp': 27 };
const photoPsnr = { 'image/avif': Infinity, 'image/webp': Infinity };

async function verifyPhotoImage(url, reference, type) {
  if (verifiedImages.has(url)) return;
  const decode = (file) => sharp(`dist/client${file}`).removeAlpha().raw().toBuffer();
  const actual = await decode(url);
  const expected = await decode(reference);
  assert.equal(actual.length, expected.length, `${url}: decoded image size`);
  let squares = 0;
  for (let offset = 0; offset < expected.length; offset += 1) {
    squares += (actual[offset] - expected[offset]) ** 2;
  }
  const psnr = 10 * Math.log10((255 * 255) / Math.max(squares / expected.length, 1e-9));
  assert.ok(
    psnr >= PHOTO_MIN_PSNR[type],
    `${url}: ${psnr.toFixed(1)} dB against its PNG, below ${PHOTO_MIN_PSNR[type]} dB`,
  );
  photoPsnr[type] = Math.min(photoPsnr[type], psnr);
  verifiedImages.add(url);
}

const sitemap = await text('dist/client/sitemap-0.xml');
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => new URL(match[1]).pathname,
);
const report = [];

for (const path of paths) {
  const html = await text(`dist/client${path}index.html`);
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
  for (const [, pictureAttributes, picture] of html.matchAll(
    /<picture\b([^>]*)>([\s\S]*?)<\/picture>/g,
  )) {
    assert.ok(picture.includes('type="image/avif"'), `${path}: AVIF source`);
    assert.ok(picture.includes('type="image/webp"'), `${path}: WebP source`);
    const photo = /\sdata-photo\b/.test(pictureAttributes);
    const sources = [...picture.matchAll(/<source\b[^>]*>/g)].map(([tag]) => tag);
    // The lossless PNG to compare against, by media query: the <img> for the
    // default image, and a PNG <source> for an art-directed one (#91).
    const image = picture.match(/<img\b[^>]*>/)?.[0] ?? '';
    const referencesByMedia = new Map([[undefined, image]]);
    for (const source of sources) {
      if (attribute(source, 'type') === 'image/png') {
        referencesByMedia.set(attribute(source, 'media'), source);
      }
    }
    for (const [media, reference] of referencesByMedia) {
      const group = sources.filter((source) => attribute(source, 'media') === media);
      // Photographs lead with AVIF, the smaller lossy format.
      if (photo) assert.equal(attribute(group[0], 'type'), 'image/avif', `${path}: AVIF first`);
      const references = new Map(candidates(reference).map(([url, width]) => [width, url]));
      for (const source of group) {
        const type = attribute(source, 'type');
        if (type === 'image/png') continue;
        for (const [url, width] of candidates(source)) {
          const match = references.get(width);
          assert.ok(match, `${path}: matching lossless PNG for ${url}`);
          if (photo) await verifyPhotoImage(url, match, type);
          else await verifyLosslessImage(url, match);
        }
      }
    }
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
  const remoteScripts = [];
  async function external(url) {
    if (path === '/contact/' && url === 'https://challenges.cloudflare.com/turnstile/v0/api.js') {
      remoteScripts.push(url);
      return;
    }
    assert.ok(url.startsWith('/_astro/'), `${path}: unexpected script URL ${url}`);
    if (seen.has(url)) return;
    seen.add(url);
    await measure(await text(`dist/client${url}`), url);
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
    remoteScripts,
  });
}

await mkdir('.lighthouseci', { recursive: true });
await writeFile('.lighthouseci/assets.json', `${JSON.stringify(report, null, 2)}\n`);
console.table(
  report.map(({ path, jsBytes, jsGzip, cssGzip }) => ({ path, jsBytes, jsGzip, cssGzip })),
);
console.log(
  'Remote scripts are listed separately; their transferred bytes require a live browser audit.',
);
console.log('Public-page image, font, CSS and per-component JS budgets passed.');
console.log(
  `${verifiedImages.size} generated images checked: artwork is lossless; the lowest photograph ` +
    `PSNR is ${photoPsnr['image/avif'].toFixed(1)} dB for AVIF and ` +
    `${photoPsnr['image/webp'].toFixed(1)} dB for WebP.`,
);
