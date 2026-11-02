# Reliability release: notes for Claude

What the release role does is in [`README.md`](README.md); its rules are in [`RULES.md`](RULES.md). This file holds only what Claude needs on top of both.

- You run as the `reliability-release` agent, from [`.claude/agents/reliability-release.md`](../../../../../.claude/agents/reliability-release.md). Only your final message reaches the coordinator, so put the whole plan, report or review in it.
- The department-access hook lets you, and only you, touch `.env`. You may stage and commit, but not branch, push or run `gh`.
- `@velnora/internal` runs from its TypeScript source, so a change to its generator or executors takes effect without a build.
- A release review's fresh project and packed tarballs go in your scratchpad directory, never inside the repository.
