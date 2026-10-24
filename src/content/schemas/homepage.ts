import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { meta, text } from './shared';

// A singleton: the only entry is src/content/homepage/home.json.
export const homepage = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/homepage' }),
  schema: z.object({
    /** Editable metadata; blank fields use Site settings. */
    meta,
    work: z.object({
      number: text,
      label: text,
      link: z.object({ label: text, href: text }),
      /** The card's "Read the case study" line, shown on desktop. */
      cardLink: text,
    }),
    /** The "In their words" rotator. In slideLabel, {index}, {total} and {name} are filled in. */
    testimonials: z.object({
      number: text,
      title: text,
      roleDescription: text,
      slideRoleDescription: text,
      slideLabel: text,
      controlsLabel: text,
    }),
    story: z.object({
      number: text,
      label: text,
      headline: text,
      body: text,
      markAlt: text,
      link: z.object({ label: text, href: text }),
    }),
    hero: z.object({
      eyebrow: text,
      /** The shorter eyebrow on phone. */
      eyebrowShort: text,
      title: text,
      body: text,
      work: z.object({ label: text, labelShort: text, href: text }),
      markAlt: text,
    }),
  }),
});
