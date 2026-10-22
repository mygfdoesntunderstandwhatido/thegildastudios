import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ctaSchema } from './cta';

// Page singleton; the page build extends this schema with its remaining copy.
export const projects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/projects' }),
  schema: z.object({ cta: ctaSchema }),
});
