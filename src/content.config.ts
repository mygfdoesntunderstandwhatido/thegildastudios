// Content collections. All site copy lives in src/content (see AGENTS.md).
// Each collection's schema goes in its own file in src/content/schemas/<name>.ts
// and is registered here with one line, so parallel PRs don't conflict.
import { branchCopy } from './content/schemas/branches';
import { homepage } from './content/schemas/homepage';
import { settings } from './content/schemas/settings';
import { testimonials } from './content/schemas/testimonials';

import { about } from './content/schemas/about';

import { services } from './content/schemas/services';

import { projects } from './content/schemas/projects';

import { case_study } from './content/schemas/case-study';

import { caseStudies } from './content/schemas/case-studies';

import { contact } from './content/schemas/contact';
import { systemPages } from './content/schemas/system-pages';

export const collections = {
  systemPages,
  contact,
  caseStudies,
  case_study,
  projects,
  services,
  about,
  branches: branchCopy,
  homepage,
  settings,
  testimonials,
};
