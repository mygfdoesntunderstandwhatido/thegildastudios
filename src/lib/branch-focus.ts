// Shared state for the homepage hero: which branch (0 olive, 1 anchovy,
// 2 pepper) is lit. The mark (#15) and the branch strip (#17) both read and
// write it, so lighting one lights the other. A `gilda:branch-focus` event on
// document lets any other script follow along.
export type BranchIndex = 0 | 1 | 2;
export type ActiveBranch = BranchIndex | null;

let active: ActiveBranch = null;
const listeners = new Set<(branch: ActiveBranch) => void>();

export function getActiveBranch(): ActiveBranch {
  return active;
}

export function setActiveBranch(branch: ActiveBranch): void {
  if (branch === active) return;
  active = branch;
  listeners.forEach((listener) => listener(branch));
  document.dispatchEvent(new CustomEvent('gilda:branch-focus', { detail: { branch } }));
}

export function onActiveBranch(listener: (branch: ActiveBranch) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
