// Punctuation and signs that components set between pieces of content. They
// belong to the typography rather than the copy, so they stay out of the admin.
export const typography = {
  /** Between list items and in labels such as "02 · IN THEIR WORDS". */
  dot: '·',
  /** Between a branch number and its name, as in "01 / Olive". */
  slash: ' / ',
  /** The disclosure and pillar card signs. */
  open: '−',
  closed: '+',
  /** The testimonial quote mark. */
  quoteMark: '“',
} as const;
