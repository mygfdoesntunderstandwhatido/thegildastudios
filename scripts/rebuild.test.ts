import assert from 'node:assert/strict';
import { test } from 'node:test';
import { startRebuild } from '../src/lib/server/rebuild.ts';

const HOOK = 'https://api.cloudflare.com/client/v4/workers/builds/deploy_hooks/test-hook';

function recorder(answer: () => Promise<Response> = async () => Response.json({ success: true })) {
  const calls: { url: string; method: string | undefined }[] = [];
  const fetcher = (async (url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method });
    return answer();
  }) as typeof fetch;
  return { calls, fetcher };
}

test('posts to the deploy hook once', async (t) => {
  t.mock.method(console, 'log', () => {});
  const { calls, fetcher } = recorder();
  await startRebuild({ DEPLOY_HOOK_URL: ` ${HOOK} ` }, fetcher);
  assert.deepEqual(calls, [{ url: HOOK, method: 'POST' }]);
});

test('fails loudly without a hook, and calls nothing', async () => {
  for (const DEPLOY_HOOK_URL of [undefined, '', '   ']) {
    const { calls, fetcher } = recorder();
    await assert.rejects(startRebuild({ DEPLOY_HOOK_URL }, fetcher), /DEPLOY_HOOK_URL is not set/);
    assert.equal(calls.length, 0);
  }
});

test('refuses a hook that is not an https URL', async () => {
  const { calls, fetcher } = recorder();
  await assert.rejects(startRebuild({ DEPLOY_HOOK_URL: 'not a url' }, fetcher), /not a valid URL/);
  await assert.rejects(
    startRebuild({ DEPLOY_HOOK_URL: HOOK.replace('https:', 'http:') }, fetcher),
    /must start with https/,
  );
  assert.equal(calls.length, 0);
});

test('fails when the hook answers with an error, without revealing the URL', async () => {
  const { fetcher } = recorder(async () => new Response('Deploy hook not found', { status: 404 }));
  await assert.rejects(startRebuild({ DEPLOY_HOOK_URL: HOOK }, fetcher), (error: Error) => {
    assert.match(error.message, /answered 404\. Deploy hook not found/);
    assert.doesNotMatch(error.message, /test-hook/);
    return true;
  });
});

test('fails when the hook cannot be reached, without revealing the URL', async () => {
  const { fetcher } = recorder(async () => {
    throw new TypeError(`fetch failed for ${HOOK}`);
  });
  await assert.rejects(startRebuild({ DEPLOY_HOOK_URL: HOOK }, fetcher), (error: Error) => {
    assert.match(error.message, /could not be reached \(TypeError\)/);
    assert.doesNotMatch(error.message, /test-hook/);
    return true;
  });
});
