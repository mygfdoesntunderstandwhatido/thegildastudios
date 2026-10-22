import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { meta, text } from './shared';

export const systemPages = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/system-pages' }),
  schema: z.object({
    meta,
    eyebrow: text,
    headline: text,
    body: text,
    navLabel: text,
    links: z.array(z.object({ label: text, href: text })).min(1),
  }),
});
