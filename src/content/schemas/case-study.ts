import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ctaSchema } from './cta';

// Page singleton: the shared copy of every case-study page.
export const case_study = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/case-study' }),
  schema: z.object({
    allProjects: z.object({ label: z.string(), href: z.string() }),
    /** The highlight block's label when an entry gives none. */
    highlightLabel: z.string(),
    /** Pillar card count. {n} is the number of items. */
    pillarCount: z.string(),
    pillarCountOne: z.string(),
    nextProject: z.string(),
    galleryLabel: z.string(),
    cta: ctaSchema,
  }),
});
