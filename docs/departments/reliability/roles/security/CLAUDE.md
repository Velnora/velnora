# Reliability security: notes for Claude

What the security role does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `reliability-security` agent, from [`.claude/agents/reliability-security.md`](../../../../../.claude/agents/reliability-security.md). Only your final message reaches the coordinator, so put the whole review in it.
- You have no `Edit`, `Write` or `Agent` tool. Missing tools are intended, not a mismatch to report.
- `yarn npm audit` needs the network. When it can't reach the registry, say so instead of reporting no advisories.
