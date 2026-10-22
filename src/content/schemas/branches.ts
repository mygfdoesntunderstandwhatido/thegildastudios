import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { text } from './shared';

// Branch copy only. Numbers, names and colours stay in src/lib/branches.ts.
// Entry ids match the branch keys: plan, build and grow.
export const branchCopy = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/branches' }),
  schema: z.object({
    /** The homepage strip line. */
    line: text,
    services: z.array(text),
  }),
});
