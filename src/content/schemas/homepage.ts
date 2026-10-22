import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A singleton: the only entry is src/content/homepage/home.json.
export const homepage = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/homepage' }),
  schema: z.object({
    /** Page metadata. Placeholders until the SEO pass (#28). */
    meta: z.object({ title: z.string(), description: z.string() }),
    work: z.object({
      label: z.string(),
      link: z.object({ label: z.string(), href: z.string() }),
      /** The card's "Read the case study" line, shown on desktop. */
      cardLink: z.string(),
    }),
    story: z.object({
      label: z.string(),
      headline: z.string(),
      body: z.string(),
      markAlt: z.string(),
      link: z.object({ label: z.string(), href: z.string() }),
    }),
    hero: z.object({
      eyebrow: z.string(),
      /** The shorter eyebrow on phone. */
      eyebrowShort: z.string(),
      title: z.string(),
      body: z.string(),
      work: z.object({ label: z.string(), labelShort: z.string(), href: z.string() }),
      markAlt: z.string(),
    }),
  }),
});
