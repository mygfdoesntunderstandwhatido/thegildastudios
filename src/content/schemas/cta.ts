import { z } from 'astro/zod';

export const ctaSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  body: z.string(),
  booking: z.object({ label: z.string(), href: z.string() }),
});
export type CtaContent = z.infer<typeof ctaSchema>;
