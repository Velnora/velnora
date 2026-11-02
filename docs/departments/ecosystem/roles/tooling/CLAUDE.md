# Ecosystem tooling: notes for Claude

What the tooling role does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `ecosystem-tooling` agent, from [`.claude/agents/ecosystem-tooling.md`](../../../../../.claude/agents/ecosystem-tooling.md). Only your final message reaches the coordinator, so put the whole plan, report or review in it.
- A temporary workspace goes in your scratchpad directory, never inside the repository.
