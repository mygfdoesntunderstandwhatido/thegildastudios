import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isIndexablePath,
  isPreviewBuild,
  pagePath,
  serializeJsonLd,
} from '../src/lib/seo-policy.mjs';

test('only public pages enter the sitemap', () => {
  for (const path of ['/', '/about', '/services/', '/projects/cs-butcher/', '/contact/']) {
    assert.equal(isIndexablePath(path), true, path);
  }
  for (const path of [
    '/keystatic',
    '/keystatic/branch/main',
    '/api/keystatic/github/oauth/callback',
    '/dev/hero/',
    '/404',
    '/404.html',
    '/contact/thanks',
    '/og/home.png',
    '/icons/favicon-32.png',
    '/robots.txt',
    '/site.webmanifest',
  ]) {
    assert.equal(isIndexablePath(path), false, path);
  }
});

test('directory canonicals have exactly one trailing slash', () => {
  assert.equal(pagePath('/'), '/');
  assert.equal(pagePath('/projects/cs-butcher'), '/projects/cs-butcher/');
  assert.equal(pagePath('/projects/cs-butcher///'), '/projects/cs-butcher/');
  assert.equal(pagePath('/404.html'), '/404/');
});

test('only main and local builds can be indexed', () => {
  assert.equal(isPreviewBuild({}), false);
  assert.equal(isPreviewBuild({ WORKERS_CI_BRANCH: 'main' }), false);
  assert.equal(isPreviewBuild({ WORKERS_CI_BRANCH: 'claude/50-cloudflare-workers' }), true);
  assert.equal(isPreviewBuild({ WORKERS_CI_BRANCH: 'content-new-case-study' }), true);
  assert.equal(isPreviewBuild({ SITE_CONTEXT: 'preview' }), true);
  assert.equal(isPreviewBuild({ SITE_CONTEXT: 'preview', WORKERS_CI_BRANCH: 'main' }), true);
  assert.equal(isPreviewBuild({ SITE_CONTEXT: 'production', WORKERS_CI_BRANCH: 'x' }), false);
  assert.equal(isPreviewBuild({ SITE_CONTEXT: 'unknown' }), true);
});

test('editor content cannot close the JSON-LD script', () => {
  const value = { name: '</script><script>alert("name")</script>', description: 'ħ & ġ' };
  const json = serializeJsonLd(value);
  assert.ok(!json.includes('<'));
  assert.deepEqual(JSON.parse(json), value);
});
