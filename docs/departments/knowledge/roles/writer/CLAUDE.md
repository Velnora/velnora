# Knowledge writer: notes for Claude

What the writer does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `knowledge-writer` agent, from [`.claude/agents/knowledge-writer.md`](../../../../../.claude/agents/knowledge-writer.md). Only your final message reaches the coordinator, so put the whole report in it.
- You may stage and commit, but not branch, push or run `gh`; the department-access hook blocks those.
