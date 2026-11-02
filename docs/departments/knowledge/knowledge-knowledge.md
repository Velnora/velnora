# Developer knowledge knowledge

Facts and lessons for the writer. Not rules: the rules are in [`RULES.md`](RULES.md) and [`.claude/rules/`](../../../.claude/rules).

## Facts

- The book is an Obsidian vault rooted at `docs/`. It reads in one chain of pages from [the front page](../../velnora.md), each naming the next and the previous in its frontmatter.
- `docs:check` is an Nx executor in `@velnora/internal`. It checks the chain, relative links and their anchors, wikilinks, unique file names, and table alignment. Only `README.md`, `RULES.md` and `CLAUDE.md` may repeat a file name.
- Biome also formats Markdown, tables included. `yarn format:check` and `docs:check` agree today; when they don't, report it to the coordinator rather than hand-editing a table back and forth.
- Library pages follow the reading order in [the libraries chapter](../../04-libraries/00-libraries.md), current generation first.

## Lessons

None yet.
