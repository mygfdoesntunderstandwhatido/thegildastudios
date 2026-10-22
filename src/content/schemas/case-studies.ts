import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRANCH_ORDER } from '../../lib/branches';
import { optionalText, text } from './shared';

const items = z.array(text).min(1);
const group = z.object({ title: text, items });

// Keystatic stores each block as { discriminant, value }. Each option turns
// that into { type, ...fields }, the shape the components read.
const option = <const T extends string, S extends z.ZodRawShape>(type: T, shape: S) =>
  z
    .object({ discriminant: z.literal(type), value: z.object(shape) })
    .transform(({ value }) => ({ type, ...value }));

/** The content blocks a case-study section can hold, keyed by `type`. */
const block = z.union([
  option('paragraph', { text }),
  /** A numbered list. */
  option('list', { items }),
  option('callout', { text }),
  /** A Brine panel. The label defaults to the page's highlight label ("THE RESULT"). */
  option('highlight', { label: optionalText, text }),
  /** A testimonial entry, shown as the light Testimonial. */
  option('quote', { testimonial: reference('testimonials') }),
  option('groups', { groups: z.array(group).min(1) }),
  /** Collapsible branch cards, one per branch at most. */
  option('pillars', {
    pillars: z
      .array(z.object({ branch: z.enum(BRANCH_ORDER), groups: z.array(group).min(1) }))
      .min(1)
      .max(3),
  }),
]);
export type CaseStudyBlock = z.output<typeof block>;

// One file per project in src/content/case-studies. The file name is the
// slug: it becomes the entry id and the URL, /projects/<slug>/.
export const caseStudies = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/case-studies' }),
  schema: ({ image }) => {
    const picture = z.object({ src: image(), alt: text });
    return z.object({
      name: text,
      branches: z.array(z.enum(BRANCH_ORDER)).min(1),
      sector: text,
      /** The Projects index card line. */
      short: text,
      summary: text,
      /** Colour of the section numbers and list numbers. */
      accent: z.enum(['anchovy', 'olive']),
      facts: z.array(z.object({ k: text, v: text })).length(4),
      /** The card image. It sits inside a link that already names the project. */
      cover: z.object({ src: image(), alt: z.string().default('') }),
      hero: picture,
      gallery: z.array(picture).max(3).default([]),
      /** Featured entries appear in the homepage Selected work, in `order`. */
      featured: z.boolean().default(false),
      /** The homepage card's title and sector line. They fall back to `short` and `sector`. */
      homeTitle: optionalText,
      homeSector: optionalText,
      /** Position on the Projects index and in the Next project loop. */
      order: z.number().int(),
      /** Drafts get no page and stay out of the index and the Next project loop. */
      draft: z.boolean().default(false),
      sections: z
        .array(
          z.object({
            title: text,
            /** A Pepper pale section with display-size paragraphs. */
            featured: z.boolean().default(false),
            blocks: z.array(block).min(1),
          }),
        )
        .min(1),
    });
  },
});
