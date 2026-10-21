# The Gilda Studios

Website for The Gilda Studios, a studio in Malta for digital and events. Built with Astro 7, edited with Keystatic and hosted on Netlify (see issue #1).

## What's in this repo

- `design/`: the design reference exported from Claude Design (page designs, tokens, fonts, assets, brand rules). **Read-only.** It is reference material and isn't shipped with the site.
- `AGENTS.md`: the rules for every coding agent (Codex reads it directly, and Claude Code reads it through `CLAUDE.md`).
- `docs/agents/`: the lane split between Claude Code and Codex (`lanes.md`) and the Codex cloud setup (`codex-cloud.md`).

## How work is organised

Everything is a GitHub issue in phase order (milestones Phase 1–8). Each issue has:

- a lane label: `agent:claude` or `agent:codex`
- `status:ready` once its dependencies are closed (set automatically)
- `status:in-progress` while someone is working on it

One issue maps to one branch and one PR (`Closes #N`).

## Getting started

You need Node 24 (`.nvmrc`; with nvm, run `nvm use`).

```bash
npm ci          # install dependencies
npm run dev     # start the dev server at http://localhost:4321
```

## Scripts

| Script                 | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Local dev server with hot reload                         |
| `npm run build`        | Static build to `dist/`                                  |
| `npm run preview`      | Serve the built `dist/` locally                          |
| `npm run check`        | `astro check`: TypeScript (strict) and Astro diagnostics |
| `npm run lint`         | ESLint and Stylelint                                     |
| `npm run format`       | Format everything with Prettier                          |
| `npm run format:check` | Check formatting without writing                         |

CI (`.github/workflows/ci.yml`) runs `lint`, `format:check`, `check` and `build` on every pull request and on pushes to `main`.

## Deploys

The site is hosted on Netlify (team: Chris), building from this repo with the settings in `netlify.toml` (`npm run build` → `dist/`, Node from `.nvmrc`).

- **Production:** every merge to `main` deploys to the Netlify production URL. That's `*.netlify.app` until #33 connects `www.thegildastudios.com`. The domain is registered with Cloudflare and its DNS stays there; Netlify is connected as external DNS.
- **Deploy Previews:** every pull request gets its own preview URL, posted on the PR as a check. Review visual work there before merging.
- **Branch deploys:** every pushed branch gets a deploy too. Keystatic branch edits (#27) use these.
- **Access:** the Netlify team owner (Chris) manages the project. The site is fully static: no functions are deployed until the Keystatic admin route arrives in #27.

## Where things go

- `src/pages/`: routes. `src/layouts/`: page shells. `src/components/`: UI components. `src/styles/`: global CSS and tokens.
- `src/content/`: **all site copy.** Content collections with typed schemas, one schema file per collection in `src/content/schemas/`, registered in `src/content.config.ts`. Copy is never hard-coded in components, and Keystatic is layered over these files in #27.
