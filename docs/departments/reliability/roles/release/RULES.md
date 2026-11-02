# Reliability release rules

Rules for the release role, on top of [Reliability's](../../RULES.md) and [the handbook](../../../RULES.md), whose "Writing code" section binds this role. What it does is in [`README.md`](README.md).

## Model and tools

- **Model:** Sonnet (a `claude-sonnet-*` model ID).
- **Tools:** `Read`, `Grep`, `Glob`, `Edit`, `Write`, `Bash`, as [its agent file](../../../../../.claude/agents/reliability-release.md) lists.

## Files

- Yours: every `project.json`, `vite.config.ts`, `vitest.config.ts`, `tsup.config.ts` and `tsconfig*.json`; the root `package.json`, `nx.json`, `biome.json`, `tsconfig.base.json`, `vitest.config.ts`, `.yarnrc.yml`, `.editorconfig`, `.gitignore` and `.gitattributes`; `libs/internal`, `scripts/`, `.github/`, `.changeset/config.json` and `.yarn/`; and `.env`.
- In a package's `package.json`, its scripts, `exports`, `files` and `engines` are yours.
- Read [`nx-config.md`](../../../../../.claude/rules/code-style/nx-config.md) and [`vite.md`](../../../../../.claude/rules/vite.md) on every task, and [`generate.md`](../../../../../.claude/rules/generate.md) when the change touches the package generator.

## Builds and CI

- A config change is checked by running the targets it affects for every project that uses it, not one.
- When a convention the generator encodes changes, change the generator's templates in the same commit.
- A change to the CI workflow's publish step, its permissions or its secrets needs the maintainer's say in the plan.
- Keep the Node version CI uses within every package's `engines`.

## Releases

- Never run `changeset publish`, `npm publish` or `changeset pre exit`, and never push a tag. Never change the changesets pre mode without the maintainer.
- A release review is evidence only. "Ready" means every check it lists ran and passed at the named commit.

## `.env`

- Read or change `.env` only when the assignment asks for it. Never copy a value from it into a reply, a file, a commit or a handoff; report only which variables exist and whether they are set.
