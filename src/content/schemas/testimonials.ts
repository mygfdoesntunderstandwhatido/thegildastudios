import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { text } from './shared';

export const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: z.object({
    quote: text,
    name: text,
    role: text,
    /** Slug of the related case study, served at /projects/<slug>/. */
    caseStudy: text,
    /** Position in the homepage rotator. Entries without one stay off the homepage. */
    homeOrder: z.number().int().positive().nullish(),
    /** Colour of the quote mark and the rotator dot, using the on-dark tints. */
    markColor: z.enum(['olive', 'anchovy', 'pepper']),
  }),
});
