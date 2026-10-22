import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { text } from './shared';
import { ctaSchema } from './cta';

// Page singleton: the Projects index copy. The cards come from caseStudies.
export const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    /** Page metadata. Placeholders until the SEO pass (#28). */
    meta: z.object({ title: text, description: text }),
    /** The count chip. {shown} and {total} are two-digit counts. */
    countLabel: text,
    headline: text,
    body: text,
    /** The phone drops the second sentence. */
    bodyShort: text,
    filter: z.object({
      label: text,
      all: text,
      /** Announced after each filter change. {shown} and {total} are counts. */
      status: text,
    }),
    cardLink: text,
    cta: ctaSchema,
  }),
});
