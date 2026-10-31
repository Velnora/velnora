<!-- personal-coding-rules:start -->
# Personal Coding Rules

These Markdown frontmatters are repository conventions interpreted through these instructions.

At the start of a task, inspect the frontmatter of the files listed below:

- `alwaysApply: true`: read and follow the full file for every task, within the rule's stated scope.
- `alwaysApply: false`: read and follow the full file when its `description` applies to the task. Use `globs` as repository-relative file hints, including files about to be created. Patterns use `**` for nested directories and `*` for filename wildcards.
- Technology rules also apply when imports, dependencies, or the task establish that technology's use, even if no glob matches. Confirm the technology context for framework-specific rules rather than relying on a generic filename alone.
- Recheck conditional rules as the task expands. Load relevant rules before editing files or running technology-specific commands. Multiple matching rules apply together.

Always-loaded rules in `.codex/rules/`:

- [Core principles](.codex/rules/core-principles.md)
- [Structure and ownership](.codex/rules/structure-and-ownership.md)
- [Functions and side effects](.codex/rules/functions-and-side-effects.md)
- [Errors, logging, and comments](.codex/rules/errors-logging-and-comments.md)

Conditional technology rules:

- [TypeScript](.codex/rules/typescript.md)
- [NestJS](.codex/rules/nestjs.md)
- [React Native](.codex/rules/react-native.md)
- [Drizzle](.codex/rules/drizzle.md)
- [Zod](.codex/rules/zod.md)
- [Nx](.codex/rules/nx.md)

Resolve these paths relative to this repository-root AGENTS.md. These rules apply throughout this repository within their stated scope.
<!-- personal-coding-rules:end -->
