// The three branches of the studio. Branch definitions (order, numbering and
// colours) live here in code and never in the CMS. Colours reference tokens.
export const BRANCH_ORDER = ['plan', 'build', 'grow'] as const;

export type BranchKey = (typeof BRANCH_ORDER)[number];

export interface Branch {
  key: BranchKey;
  number: string;
  name: string;
  ingredient: string;
  /** The branch colour on light grounds. */
  color: string;
  /** The lighter tint used on Brine and other dark grounds. */
  onDark: string;
  /** Text colour for branch labels on Cream and Sand. Pepper is never text there. */
  label: string;
  /** Text colour on a fill of the branch colour. */
  foreground: string;
  /** Light dots get a faint inset ring so pepper holds its edge on Cream and Sand. */
  ring: boolean;
}

export const branches: Record<BranchKey, Branch> = {
  plan: {
    key: 'plan',
    number: '01',
    name: 'Plan',
    ingredient: 'Olive',
    color: 'var(--olive)',
    onDark: 'var(--olive-on-dark)',
    label: 'var(--olive)',
    foreground: 'var(--cream)',
    ring: false,
  },
  build: {
    key: 'build',
    number: '02',
    name: 'Build',
    ingredient: 'Anchovy',
    color: 'var(--anchovy)',
    onDark: 'var(--anchovy-on-dark)',
    label: 'var(--anchovy)',
    foreground: 'var(--cream)',
    ring: false,
  },
  grow: {
    key: 'grow',
    number: '03',
    name: 'Grow',
    ingredient: 'Pepper',
    color: 'var(--pepper)',
    onDark: 'var(--pepper-on-dark)',
    label: 'var(--brine)',
    foreground: 'var(--brine)',
    ring: true,
  },
};

/** Returns the given branches once each, always in the order olive, anchovy, pepper. */
export function orderBranches(keys: readonly BranchKey[] = BRANCH_ORDER): Branch[] {
  return BRANCH_ORDER.filter((key) => keys.includes(key)).map((key) => branches[key]);
}

/** Maps the ingredient colours used in content (such as a quote mark) to their branch. */
export const BRANCH_BY_COLOR = {
  olive: 'plan',
  anchovy: 'build',
  pepper: 'grow',
} as const satisfies Record<string, BranchKey>;
