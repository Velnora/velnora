# Commit Rules

- Follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <description>`
  - Common types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `build`, `ci`
  - Scope is optional, use a workspace/package name when it clarifies (e.g. `feat(kernel): ...`, `fix(integrations/react): ...`)
- Subject line: imperative mood, no trailing period, ideally under 72 characters
- Body (when needed): explain _why_, not what — the diff already shows what changed
- Never add a `Co-Authored-By: Claude` (or any AI) trailer to commit messages
- Commit without asking once a task's work on its own task branch is done and verified (see [git.md](git.md) > Safety); never bundle unrelated changes into one commit
- Whoever made a change commits it, a sub-agent included, since it knows which change belongs to which feature/fix; pushing stays with the main session (see [git.md](git.md) > Safety)
- If a single file contains changes belonging to multiple features/fixes, split it via hunk-level (line-by-line) staging — e.g. `git add -p` — and commit each feature/fix separately instead of committing the whole file at once
