import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.string() });

// A singleton: the only entry is src/content/settings/site.json.
export const settings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/settings' }),
  schema: z.object({
    /** Main navigation, shared by the header and footer. */
    nav: z.array(
      link.extend({
        /** Branch links take their branch colour when current. */
        branch: z.enum(['plan', 'build', 'grow']).optional(),
      }),
    ),
    booking: link,
    email: z.email(),
  }),
});
