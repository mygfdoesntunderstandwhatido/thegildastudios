/** Public directory URLs use one trailing slash and never query strings. */
export function pagePath(pathname) {
  const path = pathname === '/404.html' ? '/404' : pathname;
  return `${path.replace(/\/+$/, '')}/`;
}

/** Shared by sitemap generation, robots and page metadata. */
export function isIndexablePath(pathname) {
  const path = pagePath(pathname);
  return (
    !/^\/(dev|keystatic|api|og|icons)(\/|$)/.test(path) &&
    !['/404/', '/contact/thanks/'].includes(path) &&
    !/\.[a-z\d]+\/$/i.test(path)
  );
}

/**
 * Which deploy a build is for. Workers Builds reports the branch it builds:
 * `main` is production and every other branch is a preview. Local builds count
 * as production. Set SITE_CONTEXT to `production` or `preview` to override it,
 * for example `SITE_CONTEXT=preview npm run build` to check a preview build.
 */
export function siteContext(env = process.env) {
  if (env.SITE_CONTEXT) return env.SITE_CONTEXT;
  const branch = env.WORKERS_CI_BRANCH;
  return branch && branch !== 'main' ? 'preview' : 'production';
}

/** Previews are never indexed and load no analytics. */
export function isPreviewBuild(env = process.env) {
  return siteContext(env) !== 'production';
}

/** Safe inside an HTML script element, even when an editor enters </script>. */
export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
