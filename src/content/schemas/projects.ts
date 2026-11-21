import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { meta, text } from './shared';
import { ctaSchema } from './cta';

// Page singleton: the Projects index copy. The cards come from caseStudies.
export const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({
    /** Editable metadata; blank fields use Site settings. */
    meta,
    /**
     * Case study slugs, in the order they show on the Projects index, in the
     * Next project loop and in Selected work. Case studies not listed follow,
     * by name. Unknown slugs (a renamed or removed project) are skipped.
     */
    order: z.array(z.string()).default([]),
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
