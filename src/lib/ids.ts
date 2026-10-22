let next = 0;

/** A page-unique id for wiring ARIA relationships when the caller gives none. */
export function uniqueId(prefix: string): string {
  next += 1;
  return `${prefix}-${next}`;
}
