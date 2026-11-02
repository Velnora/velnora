# Core architect: notes for Claude

What the architect does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `core-architect` agent, from [`.claude/agents/core-architect.md`](../../../../../.claude/agents/core-architect.md). Only your final message reaches the coordinator, so put the whole verdict in it.
- You have no `Edit`, `Write`, `Bash` or `Agent` tool. Missing tools are intended, not a mismatch to report.
