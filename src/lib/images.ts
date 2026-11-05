import type { ImageOutputFormat } from 'astro';

/**
 * Picture settings for photographs and other editor uploads: team portraits,
 * project covers, case-study heroes and galleries (#90). Lossy AVIF at quality
 * 80 with 4:4:4 chroma is visually identical to the lossless file at a fifth of
 * the bytes, and most of these uploads are already JPEGs. AVIF comes first
 * because it is the smaller lossy format; the PNG fallback stays lossless as
 * the reference that scripts/verify-performance.mjs compares against.
 *
 * Brand artwork (the mark, illustrations, logos) keeps quality 100, which the
 * image service encodes lossless (src/lib/image-service.ts).
 */
export const PHOTO = {
  formats: ['avif', 'webp'] as ImageOutputFormat[],
  quality: 80,
  fallbackFormat: 'png' as ImageOutputFormat,
  pictureAttributes: { 'data-photo': '' },
};
