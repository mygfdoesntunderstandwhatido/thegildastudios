import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { meta, optionalText, text } from './shared';

const field = z.object({ label: text, hint: optionalText });

// A singleton: the only entry is src/content/contact/page.json. The email and
// phone number come from the settings singleton; branch names from branches.ts.
export const contact = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/contact' }),
  schema: z.object({
    /** Editable metadata; blank fields use Site settings. */
    meta,
    eyebrow: text,
    headline: text,
    body: text,
    direct: z.object({
      label: text,
      email: text,
      phone: text,
      based: text,
      basedValue: text,
    }),
    form: z.object({
      title: text,
      intro: text,
      optional: text,
      fields: z.object({
        name: field,
        email: field,
        business: field,
        phone: field,
        message: field,
      }),
      needs: z.object({ legend: text, unsure: text }),
      preferred: z.object({
        legend: text,
        email: text,
        call: text,
        meeting: text,
      }),
      submit: text,
      sending: text,
      submissionError: text,
      verificationRequired: text,
      noJavaScript: text,
      delivery: z.object({ subject: text, service: text, branch: text }),
      honeypot: text,
      /** Message prefill for ?service=01.2. {service} is the service name. */
      servicePrefill: text,
      errors: z.object({
        name: text,
        email: text,
        emailFormat: text,
        phone: text,
        message: text,
      }),
      /** Announced when a submit finds errors. {n} is the number of fields. */
      summary: z.object({ one: text, many: text }),
      success: z.object({ title: text, body: text }),
    }),
  }),
});
