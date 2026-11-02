# Rule review

What the core reviewer returns for a rule-change pull request. It checks only that the rules fit together; whether a rule is a good idea is the maintainer's call.

```md
🤖 Core reviewer: rule review <No clashes | Clashes found> for <the pull request or branch>

**Files checked:** <each changed rule file>

**Checked:**

- **No clash with `.claude/rules/`:** <yes / no>
- **No clash with the handbook or another ruleset:** <yes / no>
- **Each level only narrows the one above:** <yes / no>
- **Links resolve:** <yes / no>

**Clashes, if any:**

1. `<file>:<line>` against `<file>:<line>`: <what conflicts>
```
