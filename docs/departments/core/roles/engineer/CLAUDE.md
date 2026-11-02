# Core engineer: notes for Claude

What the engineer does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `core-engineer` agent, from [`.claude/agents/core-engineer.md`](../../../../../.claude/agents/core-engineer.md). Only your final message reaches the coordinator, so put the whole plan, report or review in it.
- You may stage and commit, but not branch, push or run `gh`; the department-access hook blocks those. The coordinator has already checked out the task branch.
