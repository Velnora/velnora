---
type: handoff
job: "[[agent-documentation-setup]]"
tasks: []
role: session
model: claude-opus-5-5
date: "2026-11-02"
status: done
branch: chore/agent-setup/codex-workflow
pr:
---

# Replace the Codex setup with a Claude one and rewrite the book

The maintainer asked, straight in chat, for the Codex-made setup on this branch to be cleaned up and replaced by a documentation and agent architecture modelled on the reference project, adapted to Velnora rather than copied. This continues [the job note](agent-documentation-setup.md) and supersedes the Codex-era handoffs before it, which stay as they were apart from link fixes.

## What I did and how

The runtime moved from Codex to Claude Code. `.codex/` and the repository `AGENTS.md` are gone. In their place are [`CLAUDE.md`](../../../../CLAUDE.md), [`.claude/settings.json`](../../../../.claude/settings.json) with the Nx plugin and one PreToolUse hook, and the rules under [`.claude/rules/`](../../../../.claude/rules). The hook, `department-access`, came from the reference project and was adapted. `.env` belongs to the `reliability-release` role. Sub-agents may stage, commit and read history, but never push, branch, rebase or call `gh`. The coordinator, the main session, does all of that. A new helper strips PowerShell here-string bodies, so text inside a commit message is not mistaken for a command.

The workflow rules were rewritten for Velnora: git on `master` only, GitHub Projects and issues, handoffs keyed by issue URL, delegation, language, commits and Markdown. Velnora-specific rules were added for its Vite build helpers (`vite.md`) and its package generator (`generate.md`). The code-style rules kept only what applies here, dropping the NestJS, Drizzle, React Native, Docker and environment rules.

The maintainer approved a roster of five departments with ten agent roles, plus the coordinator. Product has the coordinator and the analyst. Core platform has the architect, the reviewer and the engineer. Ecosystem has integrations and tooling. Reliability has qa, security and release. Developer knowledge has the writer.

The reference project's docs-check Nx executor was ported into `@velnora/internal` as `@velnora/internal:docs-check`, with `string-width` as its one new dependency. It is wired through `docs/project.json` as `docs:check`, with caching off since it reads Markdown across the whole workspace. Templates now have a compacted-handoff form, and all three link GitHub issues. Two fixes went into the port. The table aligner counted the delimiter row when sizing a column, so a column could never shrink, and Biome rightly disagreed. And the executor did not typecheck under Velnora's `noUncheckedIndexedAccess`.

The book was rewritten chapter by chapter from the code, not from the old pages: the product and the example workspace, the platform's four systems, the build and CI, one page for each of the 24 packages in reading order, development (setup, testing, generating code, code quality), and how we work. Facts the old pages got wrong were corrected against the source as I went.

The departments are written out under [`docs/departments/`](../../../departments/README.md): the handbook, five departments each with rules, Claude notes, a knowledge file and templates, the eleven roles, and ten agent files under `.claude/agents/`. The overview says which role owns which files. The handbook's "Writing code" section holds the rules every engineering role shares, so each one is written once.

## Why this way

Velnora is public, so no file names the reference project, its people, its tracker or its services. The roster follows Velnora's own shape rather than the reference project's. Velnora is a framework with no database or user-facing apps, so it has no database, frontend or browser roles. The business analyst and product owner merge into one analyst while a single maintainer is the whole company. There is no separate rules department until rule work earns one.

Legacy pages (`00-overview.md`, `10-runtime.md`, the iteration log, `spec/`, `adr/`, `checklists/`, `docs/README.md`) are folded into the book and deleted rather than kept beside it. Two sources of truth had already drifted.

## Checks

- **Hook tests:** `node --test .claude/hooks/department-access/` passed, 162 of 162.
- **Workspace typecheck:** `yarn nx run-many -t typecheck` failed for all 23 projects. These failures were already there and are recorded in [`STATUS.md`](../../../../STATUS.md), not fixed:
  - Thirteen packages point `typecheck` at a missing `tsconfig.build.json`.
  - The rest fail on `vite/client` types that need DOM and WebAssembly libs, the unknown `rollupTypes` option in `define-base-config.ts`, and five dangling imports in `@velnora/types`.
- **Side effect of that run:** packages that typecheck with `tsc -p tsconfig.json` have no `noEmit`, so the run wrote 224 `.js` files beside their sources. I removed exactly those files, checked by timestamp and matching source; no tracked file changed.
- **First docs-check run:** `yarn nx run docs:check` found 36 problems, nearly all links to the deleted `.codex/` files.
- **Final docs-check run:** `yarn nx run docs:check` checked 155 Markdown files and found 0 problems.
- **Hook tests, final:** 162 of 162 passed again after Biome reformatted the hook files.
- **Biome:** `yarn biome format .` checked 785 files with no changes needed, after the ported files were converted from CRLF to LF. `yarn biome lint .` reports 57 errors, all in code this work did not touch; it fixed one `useAwait` in the ported executor.
- **Executor types:** `tsc --noEmit -p libs/internal/tsconfig.json` reports no errors in `docs-check`. The package still fails elsewhere, in `node_modules` types and its own config helpers, as before.
- **Tests quoted in the book:** `yarn nx run @velnora/types:test` passed 816 tests. `yarn nx run @velnora/utils:test` failed: ten spec files could not resolve an unbuilt `@velnora/types`, and the `isAbsoluteRoot("/")` spec fails on Windows. `yarn vitest run --root libs/kernel` failed to load both suites for the same unbuilt-dependency reason. All three are recorded in `STATUS.md`.

## Where it stands

The book, the departments, the agent files, `STATUS.md` and the docs check are done and checked, all uncommitted on `chore/agent-setup/codex-workflow`. No department role has run on real work yet.

## Next

Ask the maintainer how to split the commits, and whether to rename the branch, since it no longer holds a Codex workflow. Then try the department flow on one small real issue, to learn what each role is worth.
