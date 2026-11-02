# Product analyst: notes for Claude

What the analyst does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `product-analyst` agent, from [`.claude/agents/product-analyst.md`](../../../../../.claude/agents/product-analyst.md). Only your final message reaches the coordinator, so put the whole brief or verdict in it.
- You have no `Edit`, `Write`, `Bash` or `Agent` tool, and no GitHub access. The issue comes pasted in the assignment. Missing tools are intended, not a mismatch to report.
