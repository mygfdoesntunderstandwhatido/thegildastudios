import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { BRANCH_ORDER } from '../../lib/branches';
import { link, optionalText, text } from './shared';

const navLink = link.extend({
  /** Branch links take their branch colour when current. The admin saves "none" for other links. */
  branch: z
    .enum([...BRANCH_ORDER, 'none'])
    .optional()
    .transform((branch) => (branch === 'none' ? undefined : branch)),
});

/** A social profile, listed in the footer, the phone menu and the homepage contact band. */
const socialChannel = z.object({
  name: text,
  handle: text,
  href: z.url({ protocol: /^https$/ }),
  description: text,
  action: text,
});

// A singleton: the only entry is src/content/settings/site.json.
export const settings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/settings' }),
  schema: z.object({
    seo: z.object({
      siteUrl: z.url({ protocol: /^https$/ }).refine((value) => {
        const url = new URL(value);
        return url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password;
      }, 'Use an HTTPS site address without a path, query or fragment.'),
      defaultTitle: text,
      homeTitle: text,
      defaultDescription: text,
      language: z.enum(['en-MT', 'en']),
      locale: z.enum(['en_MT', 'en_GB']),
      socialProfiles: z.array(z.url({ protocol: /^https$/ })),
      locality: optionalText,
      streetAddress: optionalText,
      postalCode: optionalText,
      publishedPhone: optionalText,
      homeLabel: text,
      projectsLabel: text,
    }),
    /** Main navigation, shared by the header and footer. */
    nav: z.array(navLink),
    booking: link,
    email: z.email(),
    phone: link,
    /** In order. The first one's handle also closes the footer. */
    social: z.array(socialChannel).min(1),
    footer: z.object({
      navLabel: text,
      studioLabel: text,
      projectsLabel: text,
      contactLabel: text,
      followLabel: text,
      studioLinks: z.array(link),
      projectLinks: z.array(link).min(1),
      copyright: text,
    }),
    /** The written name of the studio, used by the wordmark and monogram. */
    brand: z.object({
      name: text,
      stacked: z.tuple([text, text, text]),
      monogram: text,
      markLabel: text,
    }),
    header: z.object({
      skip: text,
      nav: text,
      home: text,
      menu: text,
      close: text,
      menuTitle: text,
      /** The label above the social links in the phone menu. */
      follow: text,
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
