import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRANCH_ORDER } from '../../lib/branches';

const items = z.array(z.string()).min(1);
const group = z.object({ title: z.string(), items });

/** The content blocks a case-study section can hold, keyed by `type`. */
const block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: z.string() }),
  /** A numbered list. */
  z.object({ type: z.literal('list'), items }),
  z.object({ type: z.literal('callout'), text: z.string() }),
  /** A Brine panel. The label defaults to the page's highlight label ("THE RESULT"). */
  z.object({ type: z.literal('highlight'), label: z.string().optional(), text: z.string() }),
  /** A testimonial entry, shown as the light Testimonial. */
  z.object({ type: z.literal('quote'), testimonial: reference('testimonials') }),
  z.object({ type: z.literal('groups'), groups: z.array(group).min(1) }),
  /** Collapsible branch cards, one per branch at most. */
  z.object({
    type: z.literal('pillars'),
    pillars: z
      .array(z.object({ branch: z.enum(BRANCH_ORDER), groups: z.array(group).min(1) }))
      .min(1)
      .max(3),
  }),
]);
export type CaseStudyBlock = z.infer<typeof block>;

// One file per project in src/content/case-studies. The `slug` field becomes
// the entry id and the URL: /projects/<slug>/.
export const caseStudies = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/case-studies' }),
  schema: ({ image }) => {
    const picture = z.object({ src: image(), alt: z.string() });
    return z.object({
      name: z.string(),
      slug: z.string(),
      branches: z.array(z.enum(BRANCH_ORDER)).min(1),
      sector: z.string(),
      /** The Projects index card line. */
      short: z.string(),
      summary: z.string(),
      /** Colour of the section numbers and list numbers. */
      accent: z.enum(['anchovy', 'olive']),
      facts: z.array(z.object({ k: z.string(), v: z.string() })).length(4),
      cover: picture,
      hero: picture,
      gallery: z.array(picture).max(3).default([]),
      /** Featured entries appear in the homepage Selected work, in `order`. */
      featured: z.boolean().default(false),
      /** The homepage card's title and sector line. They fall back to `short` and `sector`. */
      homeTitle: z.string().optional(),
      homeSector: z.string().optional(),
      /** Position on the Projects index and in the Next project loop. */
      order: z.number().int(),
      /** Drafts get no page and stay out of the index and the Next project loop. */
      draft: z.boolean().default(false),
      sections: z
        .array(
          z.object({
            title: z.string(),
            /** A Pepper pale section with display-size paragraphs. */
            /** Featured entries appear in the homepage Selected work, in `order`. */
            featured: z.boolean().default(false),
            /** The homepage card's title and sector line. They fall back to `short` and `sector`. */
            homeTitle: z.string().optional(),
            homeSector: z.string().optional(),
            blocks: z.array(block).min(1),
          }),
        )
        .min(1),
    });
  },
});
