import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchPosts, shortCaption, toPosts, type MediaItem } from '../src/lib/instagram.ts';

const apiUrl = 'https://api.test';

function item(index: number, overrides: Partial<MediaItem> = {}): MediaItem {
  return {
    id: String(index),
    caption: `Post ${index}`,
    media_type: 'IMAGE' as const,
    media_url: `https://cdn.test/${index}.jpg`,
    permalink: `https://www.instagram.com/p/${index}/`,
    timestamp: new Date(Date.UTC(2026, 9, index)).toISOString(),
    ...overrides,
  };
}

function stub(items: unknown[], { status = 200, broken = new Set<string>() } = {}) {
  const calls: string[] = [];
  const fetcher = (async (input: string | URL | Request) => {
    const url = String(input);
    calls.push(url);
    if (url.startsWith(apiUrl)) return Response.json({ data: items }, { status });
    if (broken.has(url)) return new Response('gone', { status: 404 });
    return new Response('jpeg', { headers: { 'content-type': 'image/jpeg' } });
  }) as typeof fetch;
  return { fetcher, calls };
}

test('shortCaption keeps the first line and drops trailing hashtags and mentions', () => {
  assert.equal(shortCaption('Launch night.\n\n#malta #web'), 'Launch night.');
  assert.equal(shortCaption('Ours. @thegildastudios #grow'), 'Ours.');
  assert.equal(shortCaption('\n  Second line first\nmore'), 'Second line first');
  assert.equal(shortCaption(undefined), '');
  const long = shortCaption('word '.repeat(60));
  assert.ok(long.length <= 121 && long.endsWith('…'), long);
});

test('toPosts sorts newest first, uses video covers and skips incomplete items', () => {
  const posts = toPosts([
    item(1),
    item(3, { media_type: 'VIDEO', media_url: 'video.mp4', thumbnail_url: 'cover.jpg' }),
    item(2, { permalink: undefined }),
    item(4, { media_url: undefined }),
  ]);
  assert.deepEqual(
    posts.map((post) => [post.id, post.image]),
    [
      ['3', 'cover.jpg'],
      ['1', 'https://cdn.test/1.jpg'],
    ],
  );
});

test('returns the latest six posts', async () => {
  const { fetcher, calls } = stub(Array.from({ length: 8 }, (_, index) => item(index + 1)));
  const posts = await fetchPosts({ token: 'token', apiUrl, fetch: fetcher });
  assert.deepEqual(
    posts.map((post) => post.id),
    ['8', '7', '6', '5', '4', '3'],
  );
  assert.match(calls[0], /\/me\/media\?.*access_token=token/);
});

test('skips posts whose image fails and still fills six from the spares', async () => {
  const items = Array.from({ length: 8 }, (_, index) => item(index + 1));
  const { fetcher } = stub(items, { broken: new Set(['https://cdn.test/8.jpg']) });
  const posts = await fetchPosts({ token: 'token', apiUrl, fetch: fetcher });
  assert.deepEqual(
    posts.map((post) => post.id),
    ['7', '6', '5', '4', '3', '2'],
  );
});

test('returns nothing without a token, on an API error, or with fewer than six posts', async () => {
  const six = Array.from({ length: 6 }, (_, index) => item(index + 1));
  const quiet = console.warn;
  console.warn = () => {};
  try {
    assert.deepEqual(await fetchPosts({ token: '', apiUrl, fetch: stub(six).fetcher }), []);
    assert.deepEqual(
      await fetchPosts({ token: 't', apiUrl, fetch: stub(six, { status: 400 }).fetcher }),
      [],
    );
    assert.deepEqual(
      await fetchPosts({ token: 't', apiUrl, fetch: stub(six.slice(0, 5)).fetcher }),
      [],
    );
    const offline = (async () => {
      throw new TypeError('fetch failed');
    }) as typeof fetch;
    assert.deepEqual(await fetchPosts({ token: 't', apiUrl, fetch: offline }), []);
  } finally {
    console.warn = quiet;
  }
});
