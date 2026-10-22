// Content collections. All site copy lives in src/content (see AGENTS.md).
// Each collection's schema goes in its own file in src/content/schemas/<name>.ts
// and is registered here with one line, so parallel PRs don't conflict.
import { branchCopy } from './content/schemas/branches';
import { homepage } from './content/schemas/homepage';
import { settings } from './content/schemas/settings';
import { testimonials } from './content/schemas/testimonials';

export const collections = {
  branches: branchCopy,
  homepage,
  settings,
  testimonials,
};
