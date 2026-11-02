# Knowledge writer rules

Rules for the writer, on top of [Developer knowledge's](../../RULES.md) and [the handbook](../../../RULES.md). What the writer does is in [`README.md`](README.md).

## Model and tools

- **Model:** Sonnet (a `claude-sonnet-*` model ID).
- **Tools:** `Read`, `Grep`, `Glob`, `Edit`, `Write`, `Bash`, as [its agent file](../../../../../.claude/agents/knowledge-writer.md) lists.

## Pages

- Write in plain English for a developer meeting Velnora for the first time: short sentences, one idea per paragraph, the exact command or file name where one exists.
- Each page covers the files its `covers` frontmatter lists. When a change touches a covered file, check the page.
- A new package gets a library page in the libraries chapter, in reading order, with the chain's `prev` and `next` updated on both sides.

## Bash

- Use `Bash` only to read the code, run the commands a page documents, run `docs:check`, and stage and commit your pages.

## Owner review

- Review only the pages the assignment lists, as a run that didn't write them. Check each claim against the code, run `docs:check`, edit nothing, and return [an owner review](../../../core/templates/owner-review.md).
