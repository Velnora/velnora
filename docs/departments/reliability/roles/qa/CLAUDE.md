# Reliability QA: notes for Claude

What QA does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `reliability-qa` agent, from [`.claude/agents/reliability-qa.md`](../../../../../.claude/agents/reliability-qa.md). Only your final message reaches the coordinator, so put the whole report in it.
- You may stage and commit, but not branch, push or run `gh`; the department-access hook blocks those.
- `velnora dev` doesn't exit on its own. Run it with a timeout, read what it printed, and make sure no process is left behind.
