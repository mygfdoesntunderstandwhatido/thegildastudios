/**
 * The homepage feed band's posts (#79), fetched once per build from the
 * Instagram API. Nothing here runs in the browser: the
 * page is prerendered and the images are optimised into the build like any
 * other photograph.
 *
 * Two kinds of token work (docs/operations.md), both as the build secret
 * INSTAGRAM_ACCESS_TOKEN:
 * - Facebook Login: a Page token for the Facebook Page linked to the account,
 *   with INSTAGRAM_ACCOUNT_ID set to the Instagram account's ID. Read from
 *   graph.facebook.com.
 * - Instagram Login: an Instagram user token, without an account ID. Read
 *   from graph.instagram.com.
 *
 * Without a token, or when the API or an image fails, this
 * returns no posts and the homepage keeps the contact band instead. A build
 * never fails because of Instagram.
 */

export const FEED_SIZE = 6;

const TIMEOUT_MS = 10_000;
const FACEBOOK_API_URL = 'https://graph.facebook.com/v27.0';
const INSTAGRAM_API_URL = 'https://graph.instagram.com';
const ALT_MAX_LENGTH = 120;

export interface InstagramPost {
  id: string;
  /** The post on Instagram. */
  href: string;
  /** The image URL on Instagram's CDN, for the build to download. */
  image: string;
  /** The caption's first line, shortened; empty when the post has no caption. */
  caption: string;
  /** ISO 8601. */
  timestamp: string;
}

export interface MediaItem {
  id?: string;
  caption?: string;
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

const warn = (message: string) => console.warn(`[instagram] ${message} Showing the contact band.`);

/**
 * A short alt text from a caption: its first line, without hashtags or
 * mentions at the end, cut at a word boundary.
 */
export function shortCaption(caption: string | undefined): string {
  const firstLine =
    (caption ?? '')
      .split('\n')
      .map((line) => line.trim())
      .find(Boolean) ?? '';
  const words = firstLine.replace(/(?:\s*[#@][\p{L}\p{N}_.]+)+\s*$/u, '').trim();
  if (words.length <= ALT_MAX_LENGTH) return words;
  const cut = words.slice(0, ALT_MAX_LENGTH);
  const space = cut.lastIndexOf(' ');
  return `${(space > 40 ? cut.slice(0, space) : cut).replace(/[\s,;:.–—-]+$/u, '')}…`;
}

/** Turns API items into posts, newest first, skipping any without an image or link. */
export function toPosts(items: MediaItem[]): InstagramPost[] {
  return items
    .flatMap((item) => {
      // A video's media_url is the video; its cover is thumbnail_url.
      const image = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
      if (!item.id || !image || !item.permalink || !item.timestamp) return [];
      if (Number.isNaN(Date.parse(item.timestamp))) return [];
      return [
        {
          id: item.id,
          href: item.permalink,
          image,
          caption: shortCaption(item.caption),
          timestamp: item.timestamp,
        },
      ];
    })
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

export interface FetchOptions {
  token: string | undefined;
  /** The Instagram account's ID, for a Facebook Login token. Instagram Login reads /me. */
  accountId?: string | undefined;
  /** The API's base URL, or a stand-in for tests. Defaults to the host that matches the token. */
  apiUrl?: string | undefined;
  fetch?: typeof fetch;
}

/** True when the URL answers with an image, so the build can optimise it. */
async function isImage(get: (url: string) => Promise<Response>, url: string) {
  try {
    const response = await get(url);
    const type = response.headers.get('content-type') ?? '';
    const ok = response.ok && type.startsWith('image/');
    await response.body?.cancel();
    return ok;
  } catch {
    return false;
  }
}

/** The latest six posts with a working image, or an empty list. Never throws. */
export async function fetchPosts({
  token,
  accountId,
  apiUrl,
  fetch: fetcher = fetch,
}: FetchOptions): Promise<InstagramPost[]> {
  if (!token) {
    warn('INSTAGRAM_ACCESS_TOKEN is not set for this build.');
    return [];
  }
  const get = (url: string) => fetcher(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });

  const base = (apiUrl || (accountId ? FACEBOOK_API_URL : INSTAGRAM_API_URL)).replace(/\/+$/, '');
  const url = new URL(`${base}/${accountId ? encodeURIComponent(accountId) : 'me'}/media`);
  url.searchParams.set(
    'fields',
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
  );
  // A few spare, in case a post has no usable image.
  url.searchParams.set('limit', String(FEED_SIZE + 4));
  url.searchParams.set('access_token', token);

  let items: MediaItem[];
  try {
    const response = await get(url.href);
    if (!response.ok) {
      // The body names the problem, such as an expired token. It never contains the token.
      const body = await response.text().catch(() => '');
      warn(`The API answered ${response.status}. ${body.slice(0, 300)}`);
      return [];
    }
    const json = (await response.json()) as { data?: unknown };
    items = Array.isArray(json.data) ? (json.data as MediaItem[]) : [];
  } catch (error) {
    warn(`The API could not be reached (${error instanceof Error ? error.message : error}).`);
    return [];
  }

  const posts: InstagramPost[] = [];
  for (const post of toPosts(items)) {
    if (await isImage(get, post.image)) posts.push(post);
    if (posts.length === FEED_SIZE) break;
  }
  if (posts.length < FEED_SIZE) {
    warn(`Only ${posts.length} of ${FEED_SIZE} posts have an image.`);
    return [];
  }
  console.log(
    `[instagram] Showing the latest ${posts.length} posts from ${accountId ? `account ${accountId}` : 'the token’s account'}.`,
  );
  return posts;
}

let cached: Promise<InstagramPost[]> | undefined;

/**
 * The latest six posts, newest first, or an empty list when six aren't
 * available. Fetched once per build.
 */
export function getInstagramPosts(): Promise<InstagramPost[]> {
  cached ??= fetchPosts({
    token: process.env.INSTAGRAM_ACCESS_TOKEN,
    accountId: process.env.INSTAGRAM_ACCOUNT_ID,
    // INSTAGRAM_API_URL points the build at a local stand-in (scripts/instagram-stand-in.mjs).
    apiUrl: process.env.INSTAGRAM_API_URL,
  });
  return cached;
}
