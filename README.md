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

Setup and development commands arrive with issue #1.
