import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    /** Slug of the related case study, served at /projects/<slug>/. */
    caseStudy: z.string(),
    /** Position in the homepage rotator. Entries without one stay off the homepage. */
    homeOrder: z.number().int().positive().optional(),
    /** Colour of the quote mark and the rotator dot, using the on-dark tints. */
    markColor: z.enum(['olive', 'anchovy', 'pepper']),
  }),
});
