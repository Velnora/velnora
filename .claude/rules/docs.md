# Docs Rules

## The book

- Human-readable, developer-facing documentation lives under `docs/`, written as a book read from start to end. [`docs/velnora.md`](../../docs/velnora.md) is the front page, then six numbered chapters:
  - `01-products/`: what Velnora is for and what it can do today. `01-velnora/` is the framework as a developer meets it, with the project foundation after it; `02-example-workspace/` is the checked-in workspace that exercises it.
  - `02-platform/`: the runtime systems, one folder each: `01-workspace-discovery/`, `02-kernel-and-host/`, `03-units/`, and `04-server-runtime/` for the older Vite server stack that `velnora dev` does not use yet.
  - `03-devops/`: the ground everything is built on: `01-build/` and `02-ci-and-release/`.
  - `04-libraries/`: one page per package under `libs/` and `packages/`, in reading order: the packages `velnora dev` runs on first, then the build tooling, then the older generation.
  - `05-development/`: setup, testing, the generator, and code quality.
  - `06-how-we-work/`: the maintainer, the departments and how the work is recorded.
- A system is one piece that does a job end to end, such as workspace discovery or the unit system. It lives under the chapter that owns it, as a `NN-<system>/` folder that opens with its own `00-<system>.md`, even when it has only that one page. The `00-` page says what the system does and what it can't do yet; the pages after it say how it works. A library page keeps only what is the package's own (its exports, its targets, its state) and links to the system pages for the mechanisms.
- Order is in the names: chapters and system folders are `NN-<name>/`, pages are `NN-<name>.md`, and `00-` opens its chapter or system. Names are lowercase kebab-case with no spaces.
- Read `docs/` before explaining a package, command or system to the user, or before writing a page yourself. Don't re-derive the explanation from source when a page already covers it.
- Write what the code does today. Anything not built yet is named as design intent and says where the intent comes from (the maintainer's articles, an issue); never describe it as working.

## A page

- Frontmatter holds `title`, `prev` and `next` (quoted wikilinks to the neighbouring pages, such as `"[[00-workspace-discovery]]"`, empty at either end of the book) and `covers`, a list of the workspace paths the page describes (`libs/kernel`), so a path can be grepped to find its page.
- The body opens with a paragraph that says what the page covers and why it comes here, and ends with a paragraph that leads into the next page with a link to it.
- Write prose, not bullet lists, and never a bare list of links: links sit inside sentences. Tables are for reference (options, exports, targets), code blocks for commands and snippets, and numbered steps only for a procedure.
- Body links are relative markdown links. Keep pages plain-English and complete, and link to an exact contract (`.claude/rules/vite.md`, a `schema.json`) instead of repeating it.
- Do not duplicate a package's own `README.md` into `docs/`; link to it when it already documents the same thing well.

## Keeping it in shape

- A new package, system or generator gets its page in the same PR that adds it: a package in `04-libraries/`, a system as a folder under the chapter that owns it, a generator as a section of `05-development/02-generating-code.md`. Mention it in the `00-` page of its chapter.
- Inserting or removing a page or a folder renumbers the ones after it at that level. Then update every neighbour's `prev`/`next`, grep the repository for links to the renamed files (rules, `STATUS.md`, package READMEs, other pages), and fix them in the same change.
- Every file name in the vault is unique, since Obsidian finds notes by name. The one exception is `docs/departments/`, whose agent files point at its `README.md`/`RULES.md`/`CLAUDE.md` triplets.
- Every folder under `docs/departments/` (the root, each department, each role) splits its content across three files, each holding only what the others don't:
  - `README.md`: the folder's description: what the department or role is, does and how it works. As long as it needs to be.
  - `RULES.md`: only the rules that apply there. They bind only the agent whose `.claude/agents/` file points at them.
  - `CLAUDE.md`: Claude-specific notes: how to load and treat the folder's files, tool, model and permission mechanics. Claude Code auto-loads it into any session that reads or edits a file in that folder, so it never holds rules that bind only one role.
- `docs/` is also an Obsidian vault, with its shared settings in `docs/.obsidian/`. The work record lives outside the numbered chapters: per job a folder under `docs/handoffs/<area>/` with the job note and its handoffs, all started from `docs/templates/`. Tasks stay in GitHub issues and are linked by URL. Those follow [handoffs.md](handoffs.md), not the page shape above.
- Run `yarn nx run docs:check` after changing any Markdown. It checks relative links and wikilinks, the book's `prev`/`next` chain from the front page, unique names, and table alignment across the whole workspace; `yarn nx run docs:check:fix` aligns tables in place.
