import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const field = z.object({ label: z.string(), hint: z.string().optional() });

// A singleton: the only entry is src/content/contact/page.json. The email and
// phone number come from the settings singleton; branch names from branches.ts.
export const contact = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/contact' }),
  schema: z.object({
    /** Page metadata. Placeholders until the SEO pass (#28). */
    meta: z.object({ title: z.string(), description: z.string() }),
    eyebrow: z.string(),
    headline: z.string(),
    body: z.string(),
    direct: z.object({
      label: z.string(),
      email: z.string(),
      phone: z.string(),
      based: z.string(),
      basedValue: z.string(),
    }),
    form: z.object({
      title: z.string(),
      intro: z.string(),
      optional: z.string(),
      fields: z.object({
        name: field,
        email: field,
        business: field,
        phone: field,
        message: field,
      }),
      needs: z.object({ legend: z.string(), unsure: z.string() }),
      preferred: z.object({
        legend: z.string(),
        email: z.string(),
        call: z.string(),
        meeting: z.string(),
      }),
      submit: z.string(),
      sending: z.string(),
      submissionError: z.string(),
      honeypot: z.string(),
      /** Message prefill for ?service=01.2. {service} is the service name. */
      servicePrefill: z.string(),
      errors: z.object({
        name: z.string(),
        email: z.string(),
        emailFormat: z.string(),
        phone: z.string(),
        message: z.string(),
      }),
      /** Announced when a submit finds errors. {n} is the number of fields. */
      summary: z.object({ one: z.string(), many: z.string() }),
      success: z.object({ title: z.string(), body: z.string() }),
    }),
  }),
});
