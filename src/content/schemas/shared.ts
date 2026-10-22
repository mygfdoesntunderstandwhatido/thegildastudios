import { z } from 'astro/zod';

// Field types shared by the collection schemas. Each one mirrors a field in
// keystatic.config.ts, so the build fails on anything the admin would block.

/** Text the admin marks as required. */
export const text = z.string().min(1);

/**
 * Optional text. The admin saves an empty field as "", so blank text counts
 * as unset and `??` fallbacks in components still apply.
 */
export const optionalText = z
  .string()
  .optional()
  .transform((value) => (value?.trim() ? value : undefined));

/**
 * An optional list. The admin saves an empty list as [], so an empty list
 * counts as unset.
 */
export const optionalList = <T extends z.ZodType>(item: T) =>
  z
    .array(item)
    .optional()
    .transform((value) => (value?.length ? value : undefined));

export const link = z.object({ label: text, href: text });

/** Empty SEO fields use the defaults in Site settings. */
export const meta = z
  .object({ title: optionalText, description: optionalText })
  .default({ title: undefined, description: undefined });
