// Build-only artwork: endpoints are prerendered. Read the versioned design
// sources without modifying them; no font renderer or React reaches a browser.
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import sharp from 'sharp';
import { orderBranches } from './branches';
import type { SeoPage } from './seo';

const palette = readFile('src/styles/tokens/colors.css', 'utf8').then((css) => {
  const tokens = new Map(
    [...css.matchAll(/--([\w-]+):\s*(#[\da-f]+);/gi)].map((m) => [m[1], m[2]]),
  );
  return (name: string) => {
    const token = name.replace(/^var\(--|\)$/g, '');
    const value = tokens.get(token);
    if (!value) throw new Error(`Missing artwork colour token: ${token}`);
    return value;
  };
});

export async function themeColors() {
  const color = await palette;
  return { theme: color('brine'), background: color('cream') };
}

let artwork: ReturnType<typeof loadArtwork> | undefined;
async function loadArtwork() {
  const [display, mono, logo] = await Promise.all([
    readFile('design/fonts/GildaDisplay-Regular.ttf'),
    readFile('design/fonts/IBMPlexMono-Medium.ttf'),
    sharp('design/assets/logos/lockup-horizontal-cream.png')
      .resize({ width: 520 })
      .png()
      .toBuffer(),
  ]);
  return { display, mono, logo: `data:image/png;base64,${logo.toString('base64')}` };
}

export async function socialImage(page: SeoPage) {
  artwork ??= loadArtwork();
  const [{ display, mono, logo }, color] = await Promise.all([artwork, palette]);
  const fontSize = page.headline.length > 90 ? 52 : page.headline.length > 55 ? 68 : 84;
  const svg = await satori(
    {
      type: 'div',
      key: null,
      props: {
        style: {
          width: 1200,
          height: 630,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          backgroundColor: color('brine'),
          color: color('cream'),
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
              children: [
                { type: 'img', props: { src: logo, width: 520, height: 147 } },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: 16 },
                    children: orderBranches().map((branch) => ({
                      type: 'div',
                      props: {
                        style: {
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: color(branch.onDark),
                        },
                      },
                    })),
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: 24 },
              children: [
                ...(page.sector
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: { fontFamily: 'IBM Plex Mono', fontSize: 22, letterSpacing: 2 },
                          children: page.sector,
                        },
                      },
                    ]
                  : []),
                {
                  type: 'div',
                  props: {
                    style: { fontFamily: 'Gilda Display', fontSize, lineHeight: 1.05 },
                    children: page.headline,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Gilda Display', data: display, weight: 400, style: 'normal' },
        { name: 'IBM Plex Mono', data: mono, weight: 500, style: 'normal' },
      ],
    },
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export const iconSources = {
  // The tab icons keep the mark's transparent ground, so they sit cleanly on light and dark tabs.
  'favicon-16': { file: 'gilda-mark-full-colour.png', size: 16, transparent: true },
  'favicon-32': { file: 'gilda-mark-full-colour.png', size: 32, transparent: true },
  'apple-touch-icon': { file: 'app-icon-mark.png', size: 180 },
  'app-192': { file: 'app-icon-mark.png', size: 192 },
  'app-512': { file: 'app-icon-mark.png', size: 512 },
  logo: { file: 'gilda-mark-full-colour.png', size: 512 },
} as const;

export async function iconImage(name: keyof typeof iconSources) {
  const source = iconSources[name];
  const color = await palette;
  const background = 'transparent' in source ? '#00000000' : color('cream');
  return sharp(`src/assets/logos/${source.file}`)
    .resize(source.size, source.size, { fit: 'contain', background })
    .png()
    .toBuffer();
}
