# Running Codex cloud on this repo

Codex cloud runs each task in a container cloned from GitHub. It reads `AGENTS.md` automatically. Its lane is `agent:codex`.

## One-time environment setup (in the Codex settings)

1. Connect the GitHub repo `mygfdoesntunderstandwhatido/thegildastudios`, with default branch `main`.
2. Set Node to the version in `.nvmrc`, which issue #1 adds.
3. **Setup script.** It runs with internet access before the agent starts:
   ```bash
   npm ci
   ```
   Until #1 merges there's no `package.json`, so leave the script empty and don't run Codex tasks yet. Its first issue (#3) depends on #1 anyway.
4. **Maintenance script** (when a cached container resumes): `npm ci`.
5. **Agent internet access:** off by default. If a task needs a new npm package, either add it in a small PR first so the setup script installs it, or turn on access limited to the npm registry for that environment.
6. No secrets are needed for the `agent:codex` issues.

OpenAI's docs on cloud environments: https://developers.openai.com/codex/cloud/environments

## Starting a task

Codex cloud doesn't read GitHub issues itself, so paste the issue into the task. Only start issues labelled `agent:codex` and `status:ready`, and add `status:in-progress` on GitHub when you launch one.

Prompt template:

```text
Implement GitHub issue #<N>: <issue title>.
Follow AGENTS.md. Stay inside the issue's Scope.
When done, open a PR titled "<issue title> (#<N>)" whose body follows
.github/pull_request_template.md and contains "Closes #<N>".

--- Issue #<N> ---
<paste the full issue body here>
```

## Before merging a Codex PR

- CI is green, and the Netlify Deploy Preview builds.
- For visual issues, Claude Code (or you) checks the preview against the design artboards at 1280 and 390.
- Every acceptance criterion is ticked, and every **Flag for review** item is resolved or raised in the PR.
