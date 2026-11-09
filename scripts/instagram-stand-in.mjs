// A local stand-in for the Instagram API, to build and check the homepage feed
// band (#79) without a real account or token. It answers /me/media with six
// posts and serves a generated JPEG for each. Usage:
//
//   node scripts/instagram-stand-in.mjs &
//   INSTAGRAM_API_URL=http://127.0.0.1:4599 INSTAGRAM_ACCESS_TOKEN=test npm run build
//
// INSTAGRAM_STAND_IN_POSTS sets how many posts it returns (default 6), to
// check the fallback with fewer.
import { createServer } from 'node:http';
import sharp from 'sharp';

const PORT = Number(process.env.INSTAGRAM_STAND_IN_PORT || 4599);
const COUNT = Number(process.env.INSTAGRAM_STAND_IN_POSTS ?? 6);
const base = `http://127.0.0.1:${PORT}`;

// Muted photo-like fills, one per post. Test data only, never shipped.
const fills = ['#7d8450', '#a46a58', '#c9c66a', '#5f6a48', '#b48b6d', '#8d9a76'];
const captions = [
  'Launch night for a client’s new site.\n\n#malta #web',
  'Planning board for an October event',
  '',
  'Behind the scenes on a product shoot in Valletta, with a caption long enough to need shortening before it is used as alt text on the homepage',
  'The olive, the anchovy and the pepper. @thegildastudios',
  'A week of posts, planned by the 25th.',
];

const posts = Array.from({ length: COUNT }, (_, index) => ({
  id: `post-${index + 1}`,
  caption: captions[index % captions.length] || undefined,
  media_type: index === 2 ? 'VIDEO' : 'IMAGE',
  [index === 2 ? 'thumbnail_url' : 'media_url']: `${base}/media/${index + 1}.jpg`,
  permalink: `https://www.instagram.com/p/stand-in-${index + 1}/`,
  timestamp: new Date(Date.UTC(2026, 9, 30 - index * 3, 12)).toISOString(),
}));

createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', base);
  if (url.pathname === '/me/media') {
    if (!url.searchParams.get('access_token')) {
      response.writeHead(400, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: { message: 'Missing token' } }));
      return;
    }
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ data: posts }));
    return;
  }
  const media = url.pathname.match(/^\/media\/(\d+)\.jpg$/);
  if (media) {
    const fill = fills[(Number(media[1]) - 1) % fills.length];
    const image = await sharp({
      create: { width: 1080, height: 1350, channels: 3, background: fill },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="1080" height="1350"><circle cx="540" cy="620" r="260" fill="#f4efe1" opacity=".5"/></svg>`,
          ),
        },
      ])
      .jpeg({ quality: 85 })
      .toBuffer();
    response.writeHead(200, { 'content-type': 'image/jpeg' });
    response.end(image);
    return;
  }
  response.writeHead(404).end();
}).listen(PORT, '127.0.0.1', () => console.log(`Instagram stand-in on ${base}`));
