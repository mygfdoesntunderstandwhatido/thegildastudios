import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { meta, text } from './shared';
import { ctaSchema } from './cta';

const section = z.object({ number: text, label: text, headline: text });
const branchCopy = z.object({
  description: text,
  services: z.array(text).min(1),
  servicesShort: text,
});

export const about = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/about' }),
  schema: z.object({
    meta,
    opening: z.object({
      eyebrow: text,
      headline: text,
      body: text,
      markAlt: text,
    }),
    gilda: z.object({ label: text, body: text, statement: text }),
    studio: section.extend({
      pillars: z.array(z.object({ title: text, body: text })).length(3),
    }),
    branches: section.extend({
      body: text,
      copy: z.object({ plan: branchCopy, build: branchCopy, grow: branchCopy }),
    }),
    team: section.extend({ body: text }),
    cta: ctaSchema,
  }),
});
