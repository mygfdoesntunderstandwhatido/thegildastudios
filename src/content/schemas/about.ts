import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ctaSchema } from './cta';

const section = z.object({ number: z.string(), label: z.string(), headline: z.string() });
const branchCopy = z.object({
  description: z.string(),
  services: z.array(z.string()).min(1),
  servicesShort: z.string(),
});

export const about = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/about' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    opening: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      body: z.string(),
      markAlt: z.string(),
    }),
    gilda: z.object({ label: z.string(), body: z.string(), statement: z.string() }),
    studio: section.extend({
      pillars: z.array(z.object({ title: z.string(), body: z.string() })).length(3),
    }),
    branches: section.extend({
      body: z.string(),
      copy: z.object({ plan: branchCopy, build: branchCopy, grow: branchCopy }),
    }),
    team: section.extend({ body: z.string() }),
    cta: ctaSchema,
  }),
});
