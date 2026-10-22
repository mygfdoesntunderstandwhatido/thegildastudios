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

export function isPreviewBuild(context) {
  return Boolean(context && context !== 'production');
}

/** Safe inside an HTML script element, even when an editor enters </script>. */
export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
