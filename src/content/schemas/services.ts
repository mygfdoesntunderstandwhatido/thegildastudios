import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { branches, BRANCH_ORDER } from '../../lib/branches';
import { optionalList, optionalText, text } from './shared';

export const services = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services' }),
  schema: z
    .object({
      branch: z.enum(BRANCH_ORDER),
      number: z.string().regex(/^\d{2}\.\d+$/),
      name: text,
      description: text,
      bestFor: text,
      included: optionalList(text),
      howItStarts: optionalText,
      phases: optionalList(z.object({ title: text, description: text })),
      order: z.number().int(),
    })
    .refine((service) => service.included || service.howItStarts, {
      message: 'A service needs included items or an explanation of how it starts.',
    })
    .refine((service) => service.number.startsWith(`${branches[service.branch].number}.`), {
      path: ['number'],
      message: 'The service number must start with its branch number.',
    }),
});
