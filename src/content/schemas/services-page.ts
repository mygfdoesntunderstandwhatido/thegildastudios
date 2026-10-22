import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { text } from './shared';
import { ctaSchema } from './cta';

const branchText = z.object({ plan: text, build: text, grow: text });

export const servicesPage = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/services-page' }),
  schema: z.object({
    meta: z.object({ title: text, description: text }),
    opening: z.object({
      eyebrow: text,
      eyebrowShort: text,
      headline: text,
      body: text,
    }),
    jump: z.object({ label: text, lists: branchText }),
    branchIntros: branchText,
    labels: z.object({
      bestFor: text,
      included: text,
      ask: text,
      howItStarts: text,
      phases: text,
    }),
    cta: ctaSchema,
  }),
});
