// @ts-check
import { defineConfig } from 'astro/config';

// Static output. The Netlify adapter arrives in #2, Keystatic in #27.
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
});
