import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRANCH_ORDER } from '../../lib/branches';
import { text } from './shared';

export const team = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/team' }),
  schema: ({ image }) =>
    z
      .object({
        name: text,
        branches: z.array(z.enum(BRANCH_ORDER)).min(1),
        role: text,
        bio: text,
        /** No portrait reserves the design's empty portrait slot until launch (#33). */
        portrait: image().nullish(),
        alt: z.string().default(''),
        order: z.number().int(),
      })
      .refine((person) => !person.portrait || person.alt.trim().length > 0, {
        path: ['alt'],
        message: 'A real portrait needs descriptive alt text.',
      }),
});
