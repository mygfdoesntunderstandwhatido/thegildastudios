# AGENTS.md

Instructions for every coding agent working in this repo. This project is built jointly by Codex and Claude Code. Codex reads this file directly, and Claude Code reads it through `CLAUDE.md`. Keep shared project rules here so both agents follow the same workflow.

## The project

The website for **The Gilda Studios**, a Malta studio with three branches: Plan (events and projects), Build (websites) and Grow (social media). Every piece of work is a GitHub issue: 33 of them, in 8 phases, each one with its own milestone.

- **Stack:** Astro 7 (static output) with plain CSS custom properties. Content is managed by Keystatic in GitHub mode, and the site is hosted on Netlify. The decision is recorded in issue #1.
- **Design source of truth:** `design/`, exported from Claude Design. It is **read-only**: never edit, move or reformat anything inside it.

## Work split: fixed lanes

Each issue carries exactly one lane label:

| Label          | Agent                                                          | Typical work                                                                                                  |
| -------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `agent:claude` | Claude Code (local, in a git worktree, with a browser preview) | Interactive and visual work, setup that needs accounts (Netlify, the GitHub App), design proposals, visual QA |
| `agent:codex`  | Codex cloud (runs from GitHub)                                 | Well-specified builds: tokens, assets, static components, content-heavy pages, SEO, performance               |

`docs/agents/lanes.md` lists every issue's lane and the order in which work can run in parallel.

**Only work on issues in your own lane.** If an issue in your lane blocks on something in the other lane, stop and say so. Don't do the other lane's issue yourself.

## Before you start an issue

1. The issue must have the `status:ready` label. A workflow adds it once every issue listed under **Depends on** is closed. If it's missing, don't start, with one exception: **you can keep going in the same PR.** If each open dependency is already done in the batch you're working on (same branch, same PR, in your lane), you can add the dependent issue to that batch and continue. Each issue still needs its own `Closes` line, acceptance criteria and scope in the PR. A dependency still in progress in another PR, or in the other agent's lane, doesn't count: wait for it to close.
2. The issue must not have `status:in-progress`. When you start, add it, or ask the human to add it.
3. Read the whole issue body. It's the spec: **Goal, Design reference, Scope, Out of scope, Acceptance criteria, Flag for review, Brand rules, Depends on.** Stay inside Scope. Anything listed under Out of scope belongs to another issue.
4. Pull `main` and branch from it.

## Branches, commits, PRs

- **Batch related, ready issues into one branch and one PR to reduce paid Netlify deploys.** This applies to both Codex and Claude Code. Keep each issue's lane, dependencies and scope intact. A batch can also take an issue whose open dependencies it already covers (see step 1 above). Build the issues in dependency order.
- Before opening a PR, check existing PRs for related work. Reuse the batch's PR for follow-up changes. Each batch has one owning agent; use separate worktrees and coordinate an explicit handoff before changing the other agent's branch.
- Finish the local batch and run its checks before pushing. Batch follow-up fixes into as few pushes as practical: each push to an open PR can trigger another Netlify Deploy Preview.
- Branch names: `claude/<issue>-<slug>` or `codex/<issue>-<slug>` using the first issue in the batch. Codex cloud's automatic `codex/…` names are fine.
- PR title: describe the combined changes and list all issue numbers. For a single issue, use its title plus the number.
- The PR body uses `.github/pull_request_template.md` and must contain a separate `Closes #<issue>` line for every issue in the batch.
- Copy each issue's acceptance criteria into its own section of the PR, and tick only the ones you've actually checked.
- Small, focused commits. Never push to `main` directly: it's protected.
- Before opening the PR, rebase on the latest `main` and rerun the checks.

## Commands

Node 24 (LTS, pinned in `.nvmrc`). CI runs the same four checks on every PR (`.github/workflows/ci.yml`).

```bash
npm ci               # install
npm run dev          # local dev server at http://localhost:4321
npm run lint         # ESLint (JS/TS/Astro) + Stylelint (CSS and Astro <style>)
npm run format       # Prettier, write
npm run format:check # Prettier, check only
npm run check        # astro check (TypeScript strict)
npm run build        # static build to dist/
npm run preview      # serve dist/ locally
```

A PR is ready only when `lint`, `format:check`, `check` and `build` all pass. Prettier never touches `design/`: it's in `.prettierignore`.

## Reading the design files

- The page files are `design/Website - Homepage.dc.html`, `Website - About.dc.html`, `Website - Services.dc.html` and `Website - Projects.dc.html`.
- On the homepage, **option `2a` (Dark) is the approved version.** For the other pages, use the option named in the issue.
- Each option has a `Desktop · 1280` and a `Phone · 390` artboard (the `<p class="dv-cap">` captions).
- Most copy is **template data**, not markup. Look in the inline `<script>` at the end of each file (`class Component`, the `renderVals()` / `data()` methods). The `{{ … }}` placeholders in the markup map onto those values.
- Copy text **verbatim**, including punctuation and curly apostrophes (’). Don't rewrite or summarise it.
- Tokens are in `design/tokens/*.css`. Brand rules are in `design/readme.md`. Component reference code is in `design/_ds/*/_ds_bundle.js`.
- Ignore the `dv-*` classes and `support.js`: they're the design canvas, not the site.

## Brand rules (non-negotiable)

- Square corners everywhere. Pills (99px) only on buttons and chips.
- Flat fills, no gradients, no shadows, except mockups and the agreed hero-mark hover exception (#15).
- Gilda Display for headlines, Archivo for body, IBM Plex Mono uppercase for labels. Buttons: Archivo 600 at 125% width, .12em caps.
- Headlines in sentence case, usually ending with a full stop. No emoji. No exclamation marks.
- Branch colours always in the order olive, anchovy, pepper: Plan `#646E2C`, Build `#8A4B3B`, Grow `#B8BC32`. On Brine use `#8E9A3C`, `#B86A55`, `#B8BC32`.
- **Pepper is never text on cream or sand.** Grow labels on light grounds are brine.
- Copy voice: plain and literal. No food puns or "cooking up" metaphors.

## Code conventions

- **All copy lives in `src/content`** (content collections and singleton data files with typed schemas), never hard-coded in a component. The Keystatic admin edits these files.
- **Keep `keystatic.config.ts` in step with the schemas.** Any field added to, renamed in or removed from `src/content/schemas/` needs the same change in `keystatic.config.ts`, with a plain-language description, or editors can't reach it. Required Astro fields use `text` from `schemas/shared.ts` and `isRequired` in the admin. Keystatic writes the content JSON in its own layout, so `src/content/**/*.json` is excluded from Prettier; don't hand-format it.
- Use tokens (`var(--…)`) for every colour, size and space. No raw hex outside `src/styles/tokens/`.
- Branch definitions (colours, order, numbering) stay in code, in one `branches.ts`, never in the CMS.
- Only the interactive islands ship JavaScript: the hero mark, branch strip, rotator, filters, disclosures and the mobile menu. No React on public pages.
- Accessibility is part of done: real buttons, `aria-expanded` and `aria-pressed`, visible focus, `prefers-reduced-motion`, alt text.

## Avoiding conflicts between the two agents

The two lanes run at the same time, so keep shared files conflict-free:

- **Component previews:** one file per component in `src/pages/dev/<component>.astro`, never a single shared preview page.
- **Content schemas:** one file per collection in `src/content/schemas/<name>.ts`. `src/content.config.ts` only imports and registers them, one line per collection.
- **Styles:** use scoped `<style>` in each component. Global CSS (`src/styles/`) belongs to issues #3, #4 and #6. Other issues change it only if their scope says so.
- **Dependencies:** add packages only when the issue needs them, and mention each new package in the PR. Codex cloud has no internet during a task by default, so new packages have to be installed by its setup script (`docs/agents/codex-cloud.md`).
- **Shared config files** (`package.json`, `astro.config.mjs`, `netlify.toml`): keep edits small and rebase right before opening the PR.

## Done means

- Every acceptance criterion in the issue is met and ticked in the PR.
- For visual issues: screenshots at 1280 and 390 are attached next to the matching artboard, checked on the Netlify Deploy Preview.
- Every **Flag for review** item is either resolved, or called out in the PR for the human to decide.
- CI is green. The PR is reviewed by the other agent or the human before merging.
