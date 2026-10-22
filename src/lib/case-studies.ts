import { getCollection, type CollectionEntry } from 'astro:content';

export type CaseStudy = CollectionEntry<'caseStudies'>;

/** Published case studies (or only the drafts), in their index order. */
export async function getCaseStudies({ drafts = false } = {}): Promise<CaseStudy[]> {
  const entries = await getCollection('caseStudies', ({ data }) => data.draft === drafts);
  return entries.sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

/** The entry after `index`, looping back to the first. Undefined when it would be the same entry. */
export function nextCaseStudy(entries: CaseStudy[], index: number): CaseStudy | undefined {
  if (entries.length < 2) return undefined;
  return entries[(index + 1) % entries.length];
}

export function caseStudyHref(slug: string): string {
  return `/projects/${encodeURIComponent(slug)}/`;
}
