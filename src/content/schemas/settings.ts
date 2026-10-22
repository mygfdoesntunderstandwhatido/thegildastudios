import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRANCH_ORDER } from '../../lib/branches';
import { link, text } from './shared';

const navLink = link.extend({
  /** Branch links take their branch colour when current. The admin saves "none" for other links. */
  branch: z
    .enum([...BRANCH_ORDER, 'none'])
    .optional()
    .transform((branch) => (branch === 'none' ? undefined : branch)),
});

// A singleton: the only entry is src/content/settings/site.json.
export const settings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/settings' }),
  schema: z.object({
    /** Main navigation, shared by the header and footer. */
    nav: z.array(navLink),
    booking: link,
    email: z.email(),
    phone: link,
    footer: z.object({
      navLabel: text,
      studioLabel: text,
      projectsLabel: text,
      contactLabel: text,
      studioLinks: z.array(link),
      projectLinks: z.array(link).min(1),
      copyright: text,
      copyrightShort: text,
    }),
    /** The written name of the studio, used by the wordmark and monogram. */
    brand: z.object({
      name: text,
      stacked: z.tuple([text, text, text]),
      monogram: text,
      markLabel: text,
    }),
    header: z.object({
      nav: text,
      home: text,
      menu: text,
      close: text,
      menuTitle: text,
    }),
    /** Labels shared by components on several pages. */
    labels: z.object({
      /** The "What is included" disclosure. {n} is the item count; the One forms apply to a single item. */
      disclosure: z.object({
        show: text,
        hide: text,
        compact: text,
        showOne: text,
        hideOne: text,
        compactOne: text,
      }),
      testimonial: z.object({ figureLabel: text, projectLink: text }),
      /** The homepage mark's keyboard controls and the branch strip. */
      hero: z.object({ pieces: text, explore: text }),
    }),
  }),
});
