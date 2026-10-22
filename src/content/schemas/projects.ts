import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ctaSchema } from './cta';

// Page singleton: the Projects index copy. The cards come from caseStudies.
export const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    /** Page metadata. Placeholders until the SEO pass (#28). */
    meta: z.object({ title: z.string(), description: z.string() }),
    /** The count chip. {shown} and {total} are two-digit counts. */
    countLabel: z.string(),
    headline: z.string(),
    body: z.string(),
    /** The phone drops the second sentence. */
    bodyShort: z.string(),
    filter: z.object({
      label: z.string(),
      all: z.string(),
      /** Announced after each filter change. {shown} and {total} are counts. */
      status: z.string(),
    }),
    cardLink: z.string(),
    cta: ctaSchema,
  }),
});
