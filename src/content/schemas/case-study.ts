import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { text } from './shared';
import { ctaSchema } from './cta';

// Page singleton: the shared copy of every case-study page.
export const case_study = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/case-study' }),
  schema: z.object({
    allProjects: z.object({ label: text, href: text }),
    /** The highlight block's label when an entry gives none. */
    highlightLabel: text,
    /** Pillar card count. {n} is the number of items. */
    pillarCount: text,
    pillarCountOne: text,
    nextProject: text,
    galleryLabel: text,
    cta: ctaSchema,
  }),
});
