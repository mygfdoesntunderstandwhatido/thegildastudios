import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ctaSchema } from './cta';

const branchText = z.object({ plan: z.string(), build: z.string(), grow: z.string() });

export const servicesPage = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services-page' }),
  schema: z.object({
    meta: z.object({ title: z.string(), description: z.string() }),
    opening: z.object({
      eyebrow: z.string(),
      eyebrowShort: z.string(),
      headline: z.string(),
      body: z.string(),
    }),
    jump: z.object({ label: z.string(), lists: branchText }),
    branchIntros: branchText,
    labels: z.object({
      bestFor: z.string(),
      included: z.string(),
      ask: z.string(),
      howItStarts: z.string(),
      phases: z.string(),
    }),
    cta: ctaSchema,
  }),
});
