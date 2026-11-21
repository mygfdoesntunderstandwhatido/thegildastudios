import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type CaseStudy = CollectionEntry<'caseStudies'>;

/**
 * Published case studies (or only the drafts), in their index order.
 *
 * The order is the Projects page's `order` list, which editors drag in the
 * admin, so moving one project shifts the rest along. Case studies missing
 * from the list (a new one not yet placed) come after, by name.
 */
export async function getCaseStudies({ drafts = false } = {}): Promise<CaseStudy[]> {
  const [entries, page] = await Promise.all([
    getCollection('caseStudies', ({ data }) => data.draft === drafts),
    getEntry('projects', 'page'),
  ]);
  const position = new Map<string, number>();
  (page?.data.order ?? []).forEach((slug, index) => {
    if (!position.has(slug)) position.set(slug, index);
  });
  const rank = (entry: CaseStudy) => position.get(entry.id) ?? Number.POSITIVE_INFINITY;
  return entries.sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra < rb ? -1 : 1;
    return a.data.name.localeCompare(b.data.name) || a.id.localeCompare(b.id);
  });
}

/** The entry after `index`, looping back to the first. Undefined when it would be the same entry. */
export function nextCaseStudy(entries: CaseStudy[], index: number): CaseStudy | undefined {
  if (entries.length < 2) return undefined;
  return entries[(index + 1) % entries.length];
}

export function caseStudyHref(slug: string): string {
  return `/projects/${encodeURIComponent(slug)}/`;
}
