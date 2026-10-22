import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { branches, BRANCH_ORDER } from '../../lib/branches';

export const services = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services' }),
  schema: z
    .object({
      branch: z.enum(BRANCH_ORDER),
      number: z.string().regex(/^\d{2}\.\d+$/),
      name: z.string(),
      description: z.string(),
      bestFor: z.string(),
      included: z.array(z.string()).min(1),
      order: z.number().int(),
    })
    .refine((service) => service.number.startsWith(`${branches[service.branch].number}.`), {
      path: ['number'],
      message: 'The service number must start with its branch number.',
    }),
});
