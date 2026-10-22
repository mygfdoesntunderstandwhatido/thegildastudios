# The Gilda Studios

Website for The Gilda Studios, a studio in Malta for digital and events. Built with Astro 7, edited with Keystatic and hosted on Cloudflare Workers (see issues #1, #50 and #51).

## What's in this repo

- `design/`: the design reference exported from Claude Design (page designs, tokens, fonts, assets, brand rules). **Read-only.** It is reference material and isn't shipped with the site.
- `AGENTS.md`: the rules for every coding agent (Codex reads it directly, and Claude Code reads it through `CLAUDE.md`).
- `docs/agents/`: the lane split between Claude Code and Codex (`lanes.md`) and the Codex cloud setup (`codex-cloud.md`).

## How work is organised

Everything is a GitHub issue in phase order (milestones Phase 1–8). Each issue has:

- a lane label: `agent:claude` or `agent:codex`
- `status:ready` once its dependencies are closed (set automatically). An issue whose open dependencies are all done in the same batch PR can join that PR without waiting.
- `status:in-progress` while someone is working on it

Codex and Claude Code batch related, ready issues into one branch and one PR to reduce review load. Each PR includes a separate `Closes #N` line and acceptance criteria for every issue. Both agents follow the lane and ownership rules in `AGENTS.md` and group local changes before pushing, since each push can trigger another preview deploy.

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

The site runs as the `thegildastudios` Cloudflare Worker in Chris’s account. Node is pinned in `.nvmrc`. Workers Builds runs `npm run build`, which writes static files to `dist/client/` and the Worker and generated configuration to `dist/server/`. Wrangler finds that configuration automatically.

- **Production:** branch `main`, deploy command `npx wrangler deploy`, at <https://thegildastudios.chris-aa-vella.workers.dev> until #33 connects the production domain. DNS stays in Cloudflare.
- **PR previews:** every other branch uses `npx wrangler preview`. Cloudflare posts the actual preview URL on the PR. Check `Workers Builds: thegildastudios` alongside GitHub CI before merging.
- **Content previews:** `content-spring-update` is available at `https://content-spring-update-thegildastudios.chris-aa-vella.workers.dev`. Use short lowercase branch names with letters, numbers and hyphens; long names are shortened with a hash. `PUBLIC_WORKERS_SUBDOMAIN=chris-aa-vella` supplies the admin’s preview links.
- **Build context:** `WORKERS_CI_BRANCH=main` enables production indexing and configured analytics. Other branches are noindex and disable analytics by default. `SITE_CONTEXT=production|preview` is an explicit override for local checks. See [operations](docs/operations.md).
- **Access:** Chris owns the Cloudflare account and manages Worker settings, Builds, domains and secrets. GitHub repository write access does not grant Cloudflare access. The admin lives on the production address; its secrets are configured for Production. Contact delivery also needs configuration for Previews when testing it.

Every public page is prerendered. `/keystatic`, `/api/keystatic/*` and `/api/contact` run in the Worker. The form uses Turnstile and the email binding described in [operations](docs/operations.md).

The migration record is [PR #55](https://github.com/mygfdoesntunderstandwhatido/thegildastudios/pull/55). Its account follow-ups (production branch, required build check and content preview verification) must be checked in the dashboards; merging code alone does not prove those settings.

## Where things go

- `src/pages/`: routes. `src/layouts/`: page shells. `src/components/`: UI components. `src/styles/`: global CSS and tokens.
- `src/content/`: **all site copy.** Content collections with typed schemas, one schema file per collection in `src/content/schemas/`, registered in `src/content.config.ts`. Copy is never hard-coded in components. The Keystatic admin at `/keystatic` edits these files (`keystatic.config.ts`); see [`docs/editing.md`](docs/editing.md).
