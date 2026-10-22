import { BRANCH_ORDER, branches, type BranchKey } from './branches';

export const CONTACT_PATH = '/contact/';

/**
 * A link to the contact page that prefills the form. `service` is a service
 * number such as "01.2" (the second Plan service); `branch` selects a chip.
 */
export function contactHref(prefill: { service?: string; branch?: BranchKey } = {}): string {
  const params = new URLSearchParams();
  if (prefill.service) params.set('service', prefill.service);
  else if (prefill.branch) params.set('branch', prefill.branch);
  const query = params.toString();
  return query ? `${CONTACT_PATH}?${query}` : CONTACT_PATH;
}

/** Numbers every branch service as "<branch number>.<position>", e.g. "01.2". */
export function serviceNumbers(
  services: Record<BranchKey, readonly string[]>,
): Record<string, { branch: BranchKey; name: string }> {
  return Object.fromEntries(
    BRANCH_ORDER.flatMap((key) =>
      services[key].map((name, index) => [
        `${branches[key].number}.${index + 1}`,
        { branch: key, name },
      ]),
    ),
  );
}
