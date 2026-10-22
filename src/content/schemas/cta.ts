import { z } from 'astro/zod';
import { link, text } from './shared';

export const ctaSchema = z.object({
  eyebrow: text,
  headline: text,
  body: text,
  booking: link,
});
export type CtaContent = z.infer<typeof ctaSchema>;
