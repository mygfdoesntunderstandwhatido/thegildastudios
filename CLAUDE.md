@AGENTS.md

## Claude Code specifics

- This project is shared with Codex. Follow the shared lane, ownership and handoff rules in `AGENTS.md`.
- Batch related, ready issues into one PR to reduce paid Netlify deploys. Reuse that PR for follow-up work, finish checks locally, and group fixes before pushing; every push can trigger another preview deploy.
- Your lane is `agent:claude`. List your ready work with:
  `gh issue list --label agent:claude --label status:ready --state open`
- Work in a git worktree per batch, so Codex PRs and other sessions never collide with yours. Coordinate an explicit handoff before changing a Codex-owned branch.
- Mark the issue when you start (`gh issue edit <n> --add-label status:in-progress`). The workflow removes the label when the issue closes.
- Check visual work in the browser preview against the matching `design/` artboard at 1280 and 390 before opening the PR.
- When asked to review a Codex PR, check it against the issue's acceptance criteria and the design on its Netlify Deploy Preview.
