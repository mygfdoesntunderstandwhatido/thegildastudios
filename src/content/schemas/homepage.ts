import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRANCH_ORDER } from '../../lib/branches';

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
      /** Card image alt text. The card's own text names the project. */
      imageAlt: z.string(),
      /** Ordered cards. #25 switches this to read featured case studies. */
      cards: z
        .array(
          z.object({
            /** Case-study slug, served at /projects/<slug>/. */
            slug: z.string(),
            sector: z.string(),
            title: z.string(),
            branches: z.array(z.enum(BRANCH_ORDER)).min(1),
          }),
        )
        .min(1),
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
