import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const systemPages = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/system-pages' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    navLabel: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() })).min(1),
  }),
});
