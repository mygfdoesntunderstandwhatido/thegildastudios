import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRANCH_ORDER } from '../../lib/branches';

export const team = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/team' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string(),
        branches: z.array(z.enum(BRANCH_ORDER)).min(1),
        role: z.string(),
        bio: z.string(),
        /** Null reserves the design's empty portrait slot until launch (#33). */
        portrait: image().nullable(),
        alt: z.string(),
        order: z.number().int(),
      })
      .refine((person) => person.portrait === null || person.alt.trim().length > 0, {
        path: ['alt'],
        message: 'A real portrait needs descriptive alt text.',
      }),
});
