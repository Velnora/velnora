---
title: Code quality
prev: "[[02-generating-code]]"
next: "[[00-how-we-work]]"
covers:
  - biome.json
  - .editorconfig
  - .claude/rules
  - .claude/settings.json
  - docs/project.json
---

# Code quality

Biome lints and formats the whole repository, TypeScript and Markdown alike. TypeScript's compiler checks types, and the book has its own check. There are no Git hooks, so nothing runs these for you: run them before you hand work on.

## Biome

[`biome.json`](../../biome.json) pins Biome 2.6.4 with a 120-character line width. Its linter starts from no preset and turns on a chosen list of rules.

| Command             | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `yarn lint`         | Runs every package's `lint` target through Nx        |
| `yarn lint:all`     | Lints the whole repository at once                   |
| `yarn format:check` | Reports files whose formatting is off                |
| `yarn format`       | Formats every file in place                          |
| `yarn check`        | Lints, checks formatting and sorts imports, together |
| `yarn check:fix`    | Applies the safe fixes from `yarn check`             |

`yarn lint:all` reports 57 errors in existing code today. Fix the ones in files you touch, and don't add new ones.

## Types

`yarn typecheck` runs each package's `typecheck` target, and every one of them fails today, for reasons [`STATUS.md`](../../STATUS.md) lists. The current generation's targets also write `.js` files next to the sources, because their `tsconfig.json` doesn't set `noEmit`. Delete those files after a run rather than committing them.

## The book

`yarn nx run docs:check` checks the book: the reading order from [the front page](../velnora.md), every relative link, anchor and wikilink, unique file names, and aligned tables. `yarn nx run docs:check:fix` aligns the tables for you. Run it after any change under `docs/`.

## Rules and the access hook

Agents follow the rules under [`.claude/rules/`](../../.claude/rules/), with coding conventions under `code-style/`. A rule with `paths` in its frontmatter loads only for matching files; one without loads for every task. A hook in [`.claude/settings.json`](../../.claude/settings.json) runs before every tool call. It stops everyone except the release role, the main session included, from reading or changing `.env` files. It also keeps sub-agents to Git commands that stage, commit and read history, leaving branches, pushes and `gh` to the main session. Its tests run with `node --test .claude/hooks/department-access/`.

How the work itself is organised is next, in [how we work](../06-how-we-work/00-how-we-work.md).
