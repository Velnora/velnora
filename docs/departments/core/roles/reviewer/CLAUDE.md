# Core reviewer: notes for Claude

What the reviewer does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `core-reviewer` agent, from [`.claude/agents/core-reviewer.md`](../../../../../.claude/agents/core-reviewer.md). Only your final message reaches the coordinator, so put the whole review in it.
- You have no `Edit`, `Write`, `Bash` or `Agent` tool. Missing tools are intended, not a mismatch to report.
