// Serve the production output for lab checks. Netlify compresses text at the
// edge; use gzip here too, and read cache rules from the deployment config.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { parse } from 'smol-toml';

const root = resolve('dist');
const port = Number(process.env.PERFORMANCE_PORT || 4173);
const config = parse(await readFile('netlify.toml', 'utf8'));
const rules = config.headers.map((rule) => ({
  match: new RegExp(
    `^${rule.for
      .split('*')
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('.*')}$`,
  ),
  values: rule.values,
}));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    let status = 200;
    try {
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      await stat(file);
    } catch {
      file = resolve(root, '404.html');
      status = 404;
    }
    const headers = {};
    for (const rule of rules) {
      if (!rule.match.test(pathname)) continue;
      for (const [name, value] of Object.entries(rule.values)) {
        headers[name] ??= value;
      }
    }
    const extension = extname(file);
    headers['Content-Type'] = types[extension] || 'application/octet-stream';
    let body = await readFile(file);
    if (/\b(?:html|css|js|json|webmanifest|xml|txt|svg)$/.test(extension.slice(1))) {
      headers.Vary = 'Accept-Encoding';
      if (request.headers['accept-encoding']?.includes('gzip')) {
        body = gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
    }
    headers['Content-Length'] = body.length;
    response.writeHead(status, headers).end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Performance server ready at http://127.0.0.1:${port}`);
});
